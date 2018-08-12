<template>
  <div>
    <headTop></headTop>
    <div class="header">
      <el-table
        :data="tableData"
        border
        :header-cell-style="headerStyle"
        style="width: 100%;text-align:center">
        <el-table-column prop="bannerId" label="排序值"></el-table-column>
        <el-table-column prop="image" label="图片" width="600">
          <template slot-scope="scope">
            <img v-bind:src="imgUrl+scope.row.image" class="imageWidth"/>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑" :visible.sync="centerDialogVisible" width="40%" center>
        <div class="inner_body">
          <span>添加或更换图片：</span>
          <el-upload
            class="avatar-uploader"
            :action="serverUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import headTop from '@/components/HeadTop';

  export default {
    name: "BannerManage",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        tableData: [],
        imageUrl: '',
        realImageUrl: '',
        bannerId: '',
        imgUrl: this.$store.getters.getImgUrl,
        centerDialogVisible: false,
        serverUrl: '/yijian/upload'
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
      modify(d) {
        this.centerDialogVisible = true;
        this.imageUrl = this.imgUrl + d.image;
        this.bannerId = d.bannerId;
      },
      handleClick() {
        let url = '/yijian/opStore/updateStoreBanner.do';
        let bannerId = this.bannerId;
        let image = this.realImageUrl;
        let data = {
          bannerId,
          image
        };
        this.$axios.dopost(url, data).then(res => {
          this.centerDialogVisible = false;
          this.$message.success('修改成功');
          this.queryData();
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      handleAvatarSuccess(res, file) {
        this.realImageUrl = res.body;
        this.imageUrl = this.imgUrl + this.realImageUrl;
      },
      beforeAvatarUpload(file) {

      }
    }
  }
</script>

<style lang="less" scoped>

  .header {
    margin: 20px;
    .el-dialog {
      .inner_body {
        text-align: center;
        .avatar {
          width: 178px;
        }
      }
      .avatar-uploader {
        width: 178px;
        height: 178px;
        display: inline-block;
        vertical-align: top;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
    }
    .imageWidth {
      max-width: 500px;
    }
  }


</style>
