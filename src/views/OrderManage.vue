<template>
  <div>
    <div class="header-top">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-row>
          <el-form-item label="用户ID">
            <el-input v-model="searchData.userID" placeholder="请输入用户ID"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchData.telphone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="searchData.userName" placeholder="请输入昵称"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单状态">
            <el-select v-model="searchData.orderStatus">
              <el-option v-for="item in searchData.statusList" :label="item.value" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单生成时间">
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
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="appointId" label="订单编号"></el-table-column>
        <el-table-column prop="appointStatus" label="状态">
          <template slot-scope="scope">{{scope.row.appointStatus | statusFilter}}</template>
        </el-table-column>
        <el-table-column prop="requestTime" label="订单生成时间"></el-table-column>
        <el-table-column prop="appointStatus" label="操作">
          <template slot-scope="scope">
            <el-button @click="submitLeave(scope.row)" type="text" size="small" v-if="scope.row.appointStatus == 2">已离店</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="订单详情" :visible.sync="centerDialogVisible" width="30%" center>
      <p><span>订单编号:</span><span>{{alertData.appoint.appointId}}</span></p>
      <p><span>订单生成时间:</span><span>{{alertData.appoint.requestTime}}</span></p>
      <p><span>商家:</span><span>{{alertData.store.name}}</span></p>
      <p><span>商家地址:</span><span>{{alertData.store.address}}</span></p>
      <p><span>预约时间:</span><span>{{alertData.appoint.appointStartTime}}</span></p>
      <p><span>商家电话:</span><span>{{alertData.store.phone}}</span></p>
      <p><span>单价:</span><span>{{alertData.store.price}}</span></p>
      <p><span>最低消费:</span><span>{{alertData.store.minConsumption}}</span></p>
      <p><span>用户昵称:</span><span>{{alertData.user.name}}</span></p>
      <p><span>手机号:</span><span>{{alertData.user.mobile}}</span></p>
      <p><span>订单状态:</span><span>{{alertData.appoint.appointStatus | statusFilter}}</span></p>
      <p><span>实际健身时间:</span><span>{{[alertData.appoint.actualStartTime,alertData.appoint.actualEndTime,false] | timeFilter}}</span></p>
      <p><span>计费时间:</span><span>{{[alertData.appoint.appointStartTime,alertData.appoint.actualEndTime,true] | timeFilter}}</span></p>
      <p><span>预付款:</span><span>{{alertData.appoint.appointCost | coastFilter}}</span></p>
      <p><span>取消预约退还费用:</span><span>{{alertData | backMoneyFilter}}</span></p>
      <p><span>超出预付款支付费用:</span><span>{{[alertData.appoint.actualCost,alertData.appoint.appointCost] | overPayPrice}}</span></p>
      <p><span>实际交易金额:</span><span>{{alertData.appoint.actualCost | coastFilter}}</span></p>
    </el-dialog>
  </div>
</template>

<script>
  import {getBeforeDays} from "../utils/mUtils";

  export default {
    name: "OrderManage",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        searchData: {
          userID: '',
          telphone: '',
          userName: '',
          statusList: [{
            key: 9,
            value: '全部'
          }, {
            key: 1,
            value: '待参加'
          }, {
            key: 2,
            value: '进行中'
          }, {
            key: 3,
            value: '已完成'
          }, {
            key: 4,
            value: '已取消'
          }, {
            key: 7,
            value: '待支付'
          }],
          orderStatus: 9,
          searchDate: ''
        },
        tableData: [],
        total: 5,
        currentPage: 1,
        centerDialogVisible:false,
        alertData:{appoint:{},user:{},store:{}}
      }
    },
    mounted() {
      this.searchData.searchDate = [getBeforeDays(7), new Date()];
      this.queryData();
    },
    methods: {
      queryData() {
        let url = '/yijian/opStore/getAppointList.do';
        let data = {
          storeId: this.storeInfo.storeId,
          userId: this.searchData.userID ? +this.searchData.userID : 0,
          mobile: this.searchData.telphone,
          userName: this.searchData.userName,
          status: this.searchData.orderStatus,
          startIndex: this.currentPage == 1 ? 0 : (this.currentPage-1) * 10 - 1,
          pageSize: 10,
          requestTimeStart: this.$transferDate(this.searchData.searchDate[0]),
          requestTimeEnd: this.$transferDateAddsuffix(this.searchData.searchDate[1])
        };
        this.$axios.dopost(url, data).then(res => {
          this.tableData = res.data;
          this.total = res.total;
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
      handleClick(d) {
        let appointId = d.appointId;
        let url = '/yijian/opStore/getAppointDetail.do';
        let data = {appointId};
        this.$axios.dopost(url, data).then(res => {
          this.alertData = res;
          this.centerDialogVisible = true;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      submitLeave(d) {
        this.$confirm('确认该用户已离店吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          let url = '/yijian/opStore/finishAppointByStore.do';
          let appointId = d.appointId;
          let data = {
            appointId
          };
          this.$axios.dopost(url, data).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.queryData();
          }).catch(e => {
            this.$showErrorMessage(this, e);
          })
        }).catch(() => {

        });
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      }
    },
    watch:{
      currentPage(val) {
        this.queryData();
      }
    },
    filters: {
      statusFilter(n) {
        if (n == 1) {
          return '待参加';
        }
        if (n == 2) {
          return '进行中';
        }
        if (n == 3) {
          return '已完成';
        }
        if (n == 4) {
          return '已取消';
        }
        if (n == 7) {
          return '待支付';
        }
      },
      backMoneyFilter(d) {
        if (d && d.appoint && d.appoint.appointStatus == 4) {
          // 如果取消时间小于预约时间一小时及以上，则为price，否则为零
          let nTime = Date.parse(new Date());
          let appointTime = d.appoint.appointStartTime ? Date.parse(new Date(d.appoint.appointStartTime)) : '';
          if (appointTime) {
            let minsTime = appointTime - nTime;
            let temp = 1000 * 60 * 60;
            if (minsTime > temp) {
              return "¥ " + d.appoint.price;
            } else {
              return "¥ 0.0";
            }
          } else {
            return "¥ 0.0";
          }
        } else {
          return "¥ 0.0";
        }
      },
      overPayPrice([a, b]) {
        if (a && b) {
          return "¥ " + (a - b);
        } else {
          return "¥ 0.0"
        }
      },
      coastFilter(a) {
        if (a) {
          return "¥ " + a;
        } else {
          return "¥ 0.0"
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/header";
  @import "../style/content";
</style>
