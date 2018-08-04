<template>
  <div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="headerStyle"
      style="width: 100%;text-align:center">
      <el-table-column prop="bannerId" label="排序值"></el-table-column>
      <el-table-column prop="image" label="图片">
        <template slot-scope="scope">
          <img v-bind:src="imgUrl+scope.row.image"/>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "BannerManage",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        tableData: [],
        imgUrl: this.$store.getters.getImgUrl
      }
    },
    mounted() {
      this.queryData();
    },
    methods: {
      queryData() {
        let url = '/yijian/opStore/getStoreBanner.do';
        let data = {
          storeId: this.storeInfo.storeId
        };
        this.$axios.dopost(url, data).then(res => {
          this.tableData = res;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      headerStyle() {
        return {
          "color": "#000",
          "font-weight": "normal",
          "text-align": "center"
        }
      },
      handleClick(d) {

      }
    }
  }
</script>

<style scoped>

</style>
