<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer">
        <div class="manage_tip">
          <p>商家后台管理系统</p>
        </div>
        <el-form ref="loginForm">
          <el-form-item>
            <el-input placeholder="用户名" v-model="username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" placeholder="密码" v-model="password" @keyup.enter.native="submitForm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitForm">登陆</el-button>
          </el-form-item>
        </el-form>
      </section>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      submitForm() {
        let mobile = this.username;
        let password = this.password;
        let url = '/yijian/opStore/storeLogin.do';
        let data = {
          mobile,
          password
        };
        this.$axios.dopost(url, data).then(res => {
          this.$store.dispatch('setStoreInfo', JSON.stringify(res));
          this.$router.push({
            name: 'bannermanage'
          });
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      }
    },
    watch: {}
  }
</script>

<style lang="less" scoped>
  @import '../style/mixin';

  .login_page {
    background-color: #324057;
  }

  .manage_tip {
    position: absolute;
    width: 100%;
    top: -100px;
    left: 0;
    p {
      font-size: 34px;
      color: #fff;
    }
  }

  .form_contianer {
    .wh(320px, 210px);
    .ctp(320px, 210px);
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
    .submit_btn {
      width: 100%;
      font-size: 16px;
    }
  }

  .tip {
    font-size: 12px;
    color: red;
  }

  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }

  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
