<template>
  <div>
    <div class="header-top">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-row>
          <el-form-item label="交易时间">
            <el-date-picker class="date-picker-width" v-model="searchData.searchDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryData">查&nbsp;&nbsp;询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="content">
      <el-table
        :data="tableData"
        border
        :header-cell-style="headerStyle"
        style="width: 100%;text-align:center">
        <el-table-column prop="outTradeNo" label="订单编号"></el-table-column>
        <el-table-column prop="name" label="用户昵称"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="price" label="结算金额"></el-table-column>
        <el-table-column label="实收金额">
          <template slot-scope="scope">{{scope.row.price-scope.row.profit}}</template>
        </el-table-column>
        <el-table-column prop="payDate" label="结算时间"></el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
  import {getBeforeDays} from "../utils/mUtils";

  export default {
    name: "FinancialFlow",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        searchData: {
          searchDate: ''
        },
        tableData: [],
        total: 5,
        currentPage: 1
      }
    },
    mounted() {
      this.searchData.searchDate = [getBeforeDays(7), new Date()];
      this.queryData();
    },
    methods: {
      queryData() {
        let url = '/yijian/opRoot/findServiceFlow.do';
        let storeId = this.storeInfo.storeId,
          startIndex = this.currentPage == 1 ? 0 : this.currentPage * 10 - 1,
          pageSize = 10,
          createTimeStart = this.$transferDate(this.searchData.searchDate[0]),
          createTimeEnd = this.$transferDate(this.searchData.searchDate[1]);
        let data = {
          storeId,
          startIndex,
          pageSize,
          createTimeStart,
          createTimeEnd
        };
        this.$axios.dopost(url, data).then(res => {
          this.tableData = res;
          this.total = res.length > 0 ? res.length : 1;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      headerStyle: function () {
        return {
          "color": "#000",
          "font-weight": "normal",
          "text-align": "center"
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      }
    },
    watch: {
      currentPage() {
        this.queryData();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/header";
  @import "../style/content";
</style>
