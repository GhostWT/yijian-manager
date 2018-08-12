<template>
  <div>
    <headTop></headTop>
    <div class="header-top">
      <el-row>
        <el-button type="primary" @click="centerDialogVisible = true">新&nbsp;&nbsp;增</el-button>
      </el-row>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        border
        :header-cell-style="headerStyle"
        style="width: 100%;text-align:center">
        <el-table-column prop="targetId" label="序号"></el-table-column>
        <el-table-column prop="targetName" label="活动目标"></el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="block">-->
        <!--<el-pagination-->
          <!--@current-change="handleCurrentChange"-->
          <!--:page-size="10"-->
          <!--layout="prev, pager, next, jumper"-->
          <!--:total="total">-->
        <!--</el-pagination>-->
      <!--</div>-->
    </div>
    <el-dialog title="编辑" :visible.sync="centerDialogVisible" width="30%" center>
      <div class="inner_body">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="新增活动目标：">
            <el-input v-model="target"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTarget">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import headTop from '@/components/HeadTop';

  export default {
    name: "TargetSetting",
    data() {
      return {
        tableData: [],
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        centerDialogVisible: false,
        target: '',
        total: 5,
        currentPage: 1
      }
    },
    components: {
      headTop
    },
    mounted() {
      this.queryData();
    },
    methods: {
      queryData() {
        let url = "/yijian/opStore/findTargetByStoreId.do";
        let storeId = this.storeInfo.storeId;
        let data = {
          storeId
        };
        this.$axios.dopost(url, data).then(res => {
          this.tableData = res.data;
          // this.total = res.total;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      addTarget() {
        let url = '/yijian/opStore/addTarget.do';
        let storeId = this.storeInfo.storeId;
        let targetName = this.target;
        let data = {
          storeId,
          targetName
        };
        this.$axios.dopost(url, data).then(res => {
          this.centerDialogVisible = false;
          this.$message.success('新增成功');
          this.queryData();
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
        let targetId = d.targetId;
        this.$confirm('确认删除该活动目标吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let url = '/yijian/opStore/deleteTarget.do';
          let data = {
            targetId
          };
          this.$axios.dopost(url, data).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
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
    watch: {
      currentPage(val) {
        this.queryData();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/header";
  @import "../style/content";
</style>
