<template>
  <div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="headerStyle"
      style="width: 100%;text-align:center">
      <el-table-column prop="monitorDynamicRegisterCount" label="拍序值"></el-table-column>
      <el-table-column prop="monitorDynamicAuthInfoCount" label="图片">
        <template slot-scope="scope">
          <img src="" >
        </template>
      </el-table-column>
      <el-table-column prop="monitorDynamicApplyPCT" label="操作">
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
        tableData: []
      }
    },
    methods: {
      headerStyle(){
        return {
          "color": "#000",
          "font-weight": "normal",
          "text-align": "center"
        }
      }
    }

  }
</script>

<style scoped>

</style>
