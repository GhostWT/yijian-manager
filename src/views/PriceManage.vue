<template>
  <div class="header">
    <div v-if="!inEdit">
      <h3>当前价格</h3>
      <p>最低消费：{{formData.minConsumption}}元</p>
      <p>单价：{{formData.price}}元/30分钟</p>
      <p>
        <el-button type="primary" @click="handleClick">编辑</el-button>
      </p>
    </div>
    <div v-if="inEdit">
      <p>
        <el-radio v-model="radio" label="1">使用平台计价</el-radio>
      </p>
      <p>
        <el-radio v-model="radio" label="2">使用自定义价格</el-radio>
      </p>
      <div v-if="radio == 1">
        <p>最低消费：{{form.minConsumption}}元</p>
        <p>单价：{{form.price}}元/30分钟</p>
      </div>
      <div v-if="radio == 2">
        <el-form :model="form">
          <el-form-item label="最低消费：" :label-width="formLabelWidth">
            <el-input v-model="form.minConsumption" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="单价：" :label-width="formLabelWidth">
            <el-input v-model="form.price" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <p>
        <el-button type="primary" @click="inEdit = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PriceManage",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        radio: '1',
        inEdit: false,
        formData: {},
        formLabelWidth: '120px',
        form: {
          minConsumption: '',
          price: ''
        }
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
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      handleClick() {
        this.inEdit = true;
        let url = '/yijian/opStore/getServiceMinConsumptionAndPrice.do';
        let data = {};
        this.$axios.dopost(url, data).then(res => {
          this.form = res;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      submit() {
        let url = '/yijian/opStore/setMinConsumptionAndPrice.do';
        let storeId = this.storeInfo.storeId,
          price = +this.form.price,
          minConsumption = +this.form.minConsumption;
        let data = {
          storeId,
          price,
          minConsumption
        };
        this.$axios.dopost(url, data).then(res => {
          this.$message.success('修改成功');
          this.queryData();
          this.inEdit = false;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      }
    },
    watch: {
      radio(val) {
        if (val == 2) {
          this.inEdit = true;
        }
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

  .el-input {
    width: 300px;
  }
</style>
