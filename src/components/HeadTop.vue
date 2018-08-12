<template>
  <div class="header_container">
    <span></span>
    <span @click="handleClick">退出登录</span>
  </div>
</template>

<script>
  export default {
    name: "HeadTop",
    methods:{
      handleClick() {
        this.$message({
          type: 'success',
          message: '退出成功'
        });
        this.$router.push('/');
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/mixin';

  .header_container {
    background-color: #EFF2F7;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    span {
      cursor: pointer;
    }
  }

</style>
