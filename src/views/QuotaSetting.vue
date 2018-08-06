<template>
  <div class="header">
    <p>每日可预约名额：{{num}}个</p>
    <p>
      <el-button type="primary" @click="handleClick">编辑</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    name: "QuotaSetting",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        num: 0
      }
    },
    mounted() {
      this.queryData();
    },
    methods: {
      queryData() {
        let url = '/yijian/opStore/getlastAppointNum.do';
        let data = {
          storeId: this.storeInfo.storeId
        };
        this.$axios.dopost(url, data).then(res => {
          this.num = res;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      handleClick() {
        this.$prompt('请输入预约个数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          let url = '/yijian/opStore/updateAppointNum.do';
          let data = {
            storeId: this.storeInfo.storeId,
            appointNum: +value
          };
          this.$axios.dopost(url, data).then(res => {
            this.queryData();
            this.$message.success('修改成功');
          }).catch(e => {
            this.$showErrorMessage(this, e);
          })
        }).catch(() => {
        });
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
