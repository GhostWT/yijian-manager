<template>
  <div class="header-top">
    <el-form :label-position="labelPosition" label-width="120px" :model="formData">
      <el-row>
        <el-form-item label="原始密码">
          <el-input type="password" v-model="formData.oldPsd" @blur="checkPsw" placeholder="请输入原始密码"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="新密码">
          <el-input type="password" v-model="formData.newPsd" placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="重复新密码">
          <el-input type="password" v-model="formData.newPsdAgain" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row>
      <el-button type="primary" @click="handleClick">确 认</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "ChangePassword",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        mobile: JSON.parse(this.$store.getters.getMobile),
        formData: {
          oldPsd: '',
          newPsd: '',
          newPsdAgain: ''
        },
        canChange: false,
        labelPosition: 'right'
      }
    },
    methods: {
      checkPsw() {
        let mobile = this.mobile.mobile;
        let password = this.formData.oldPsd;
        let url = '/yijian/opStore/storeLogin.do';
        let data = {
          mobile,
          password
        };
        this.$axios.dopost(url, data).then(res => {
          this.canChange = true;
        }).catch(e => {
          this.canChange = false;
          this.$message.error("输入的密码有误，请重新输入！")
        })
      },
      handleClick() {
        if (!this.canChange) {
          this.$message.error("请正确输入原始密码!");
          return;
        }
        if (this.formData.newPsd != this.formData.newPsdAgain) {
          this.$message.error("新密码请保持一致！");
          return;
        } else {
          let url = "/yijian/opStore/retPassword.do";
          let storeId = this.storeInfo.storeId;
          let newPassword = this.formData.newPsd;
          let data = {
            storeId,
            newPassword
          };
          this.$axios.dopost(url, data).then(res => {
            this.$message.success("密码修改成功！")
            this.reset();
          }).catch(e => {
            this.$showErrorMessage(this, e);
          })
        }
      },
      reset() {
        this.formData = {
          oldPsd: '',
          newPsd: '',
          newPsdAgain: ''
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .header-top {
    margin: 20px;
    .el-form {
      width: 400px;
    }
    .el-button {
      margin-left: 120px;
    }
  }
</style>
