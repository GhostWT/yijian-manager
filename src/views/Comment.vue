<template>
  <div>
    <div class="header-top">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-row>
          <el-form-item label="手机号">
            <el-input v-model="searchData.telphone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="searchData.userName" placeholder="请输入昵称"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="状态">
            <el-select v-model="searchData.status">
              <el-option v-for="item in searchData.statusList" :label="item.value" :value="item.key" :key="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
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
        <el-table-column prop="evaluationId" label="序号"></el-table-column>
        <el-table-column prop="star" label="评分"></el-table-column>
        <el-table-column prop="message" label="评论" width="200"></el-table-column>
        <el-table-column label="图片" width="300">
          <template slot-scope="scope">
            <div v-html="getImgHtml([scope.row.image,imgUrl])"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="100"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status | statusFilter}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="评论时间" width="120"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row,true)" type="text" size="small" v-if="scope.row.status==1">屏蔽</el-button>
            <el-button @click="handleClick(scope.row,false)" type="text" size="small" v-if="scope.row.status==2">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {getBeforeDays} from "../utils/mUtils";

  export default {
    name: "Comment",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        searchData: {
          telphone: '',
          userName: '',
          status: 9,
          statusList: [{
            key: 9,
            value: '全部'
          }, {
            key: 1,
            value: '显示'
          }, {
            key: 2,
            value: '屏蔽'
          }],
          searchDate: ''
        },
        imgUrl: this.$store.getters.getImgUrl,
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
        let url = '/yijian/opStore/getEvaluationByStoreId.do';
        let data = {
          storeId: this.storeInfo.storeId,
          mobile: this.searchData.telphone,
          userName: this.searchData.userName,
          status: this.searchData.status,
          startIndex: this.currentPage == 1 ? 0 : this.currentPage * 10 - 1,
          pageSize: 10,
          startTime: this.$transferDate(this.searchData.searchDate[0]),
          endTime: this.$transferDateAddsuffix(this.searchData.searchDate[1])
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
      handleClick(d, flag) {
        let evaluationId = d.evaluationId;
        let status = flag ? 2 : 1;
        let text = flag ? '确认屏蔽该评论吗？' : '确认解除该条评论的屏蔽吗？';
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          let url = '/yijian/opStore/updateStatusByEvaluationId.do';
          let data = {evaluationId, status};
          this.$axios.dopost(url, data).then(res => {
            this.queryData();
            this.$message.success('操作成功');
          }).catch(e => {
            this.$showErrorMessage(this, e);
          })
        }).catch(() => {

        });
      }
    },
    filters: {
      statusFilter(n) {
        if (n == 1) {
          return '正常';
        }
        if (n == 2) {
          return '已屏蔽';
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/header";
  @import "../style/content";
</style>
