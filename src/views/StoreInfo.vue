<template>
  <div class="header">
    <p>商家名称：{{formData.name}} </p>
    <p>地址：{{formData.address}} </p>
    <p>电话：{{formData.phone}} </p>
    <p>
      <el-button type="primary" @click="dialogFormVisible = true">编辑</el-button>
    </p>
    <el-dialog title="设置商家信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="商家名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址：" :label-width="formLabelWidth">
          <el-input v-model="form.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话：" :label-width="formLabelWidth">
          <el-input v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "StoreInfo",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        formData: {},
        dialogFormVisible: false,
        form: {
          name: '',
          address: '',
          phone: ''
        },
        formLabelWidth: '120px'
      }
    },
    mounted() {
      this.queryData();
    },
    methods: {
      queryData() {
        let url = '/yijian/opStore/getStoreDetail.do';
        let storeId = this.storeInfo.storeId;
        let data = {
          storeId
        };
        this.$axios.dopost(url, data).then(res => {
          this.formData = res;
          this.form = res;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      handleClick() {
        let url = '/yijian/opStore/updateStoreDetail.do';
        let storeId = this.storeInfo.storeId,
          name = this.form.name,
          address = this.form.address,
          phone = this.form.phone;
        let data = {
          storeId,
          name,
          address,
          phone
        };
        this.$axios.dopost(url, data).then(res => {
          this.queryData();
          this.$message.success('修改成功!');
          this.dialogFormVisible = false;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    margin: 20px;
    p {
      margin: 10px 0px;
    }
  }
</style>
