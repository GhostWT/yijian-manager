<template>
  <div>
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
        <el-table-column prop="equipmentId" label="序号"></el-table-column>
        <el-table-column prop="message" label="简介"></el-table-column>
        <el-table-column label="图片" width="500">
          <template slot-scope="scope">
            <img :src="imgUrl+scope.row.image" class="imageWidth">
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑" :visible.sync="centerDialogVisible" width="40%" center>
      <div class="inner_body">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="添加图片：">
            <el-upload
              class="avatar-uploader"
              :action="serverUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input v-model="message" placeholder="最多不超过15字"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEquipment">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Equipment",
    data() {
      return {
        tableData: [],
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        imgUrl: this.$store.getters.getImgUrl,
        serverUrl: '/yijian/upload',
        centerDialogVisible: false,
        imageUrl: '',
        realImageUrl: '',
        message: ''
      }
    },
    mounted() {
      this.queryData();
    },
    methods: {
      queryData() {
        let url = "/yijian/opStore/getStoreEquipMent.do";
        let storeId = this.storeInfo.storeId;
        let data = {
          storeId
        };
        this.$axios.dopost(url, data).then(res => {
          this.tableData = res;
          this.total = res.length > 0 ? res.length : 1;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      addEquipment() {
        let url = '/yijian/opStore/addStoreEquipment.do';
        let storeId = this.storeInfo.storeId;
        let message = this.message;
        let image = this.realImageUrl;
        if (message.length > 15) {
          this.$message.error('字数不能大于15字');
          return;
        }
        if (image.length < 1) {
          this.$message.error('请上传设备图片');
          return;
        }
        let data = {
          storeId,
          message,
          image
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
        let equipmentId = d.equipmentId;
        this.$confirm('确认删除该设备吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          let url = '/yijian/opStore/deleteStoreEquipment.do';
          let data = {
            equipmentId
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
  @import "../style/header";
  @import "../style/content";

  .imageWidth {
    max-width: 400px;
  }

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
      padding: 15px;
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
</style>
