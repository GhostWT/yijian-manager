<template>
  <div>
    <headTop></headTop>
    <div class="header-top">
      <el-row>
        <el-button type="primary" @click="dialogVisible = true">新&nbsp;&nbsp;增</el-button>
      </el-row>
    </div>
    <div class="content">
      <el-table
        :data="tableData"
        border
        :header-cell-style="headerStyle"
        style="width: 100%;text-align:center">
        <el-table-column prop="equipmentId" label="序号"></el-table-column>
        <el-table-column label="图片" width="500">
          <template slot-scope="scope">
            <img :src="imgUrl+scope.row.image" class="imageWidth">
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClickChange(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="70%" center>
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
        </el-form>
        <div class="editor">
          <quill-editor v-model="content"
                        ref="myQuillEditor"
                        class="editer"
                        :options="editorOption"
                        @change="onEditorChange($event)"
                        @ready="onEditorReady($event)">
          </quill-editor>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEquipment">确 定</el-button>
      </div>
    </el-dialog>
    <el-upload
      class="avatar-uploader2"
      :action="serverUrl"
      :headers="token"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload">
    </el-upload>
  </div>
</template>

<script>
  import headTop from '@/components/HeadTop';
  import {quillEditor} from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'


  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{'header': 1}, {'header': 2}],               // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'direction': 'rtl'}],                         // text direction

    [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['link', 'image', 'video'],
    ['clean']                                         // remove formatting button
  ]

  export default {
    name: "Equipment",
    data() {
      return {
        tableData: [],
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        imgUrl: this.$store.getters.getImgUrl,
        serverUrl: '/yijian/upload',
        dialogVisible: false,
        imageUrl: '',
        realImageUrl: '',
        textImgUrl: '',
        realTextImgUrl: '',
        message: '',
        total: 5,
        currentPage: 1,
        quillUpdateImg: false,
        header: '',
        token: {token: sessionStorage.token},
        content: '<h3>文本编辑</h3>',
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.avatar-uploader2 input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        },
      }
    },
    components: {
      headTop,
      quillEditor
    },
    mounted() {
      this.queryData();
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      queryData() {
        let url = "/yijian/opStore/getStoreEquipMent.do";
        let storeId = this.storeInfo.storeId;
        let data = {
          storeId
        };
        this.$axios.dopost(url, data).then(res => {
          this.tableData = res.data;
          this.total = res.total;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      beforeUpload() {
        this.quillUpdateImg = true;
      },
      uploadSuccess(res, file) {
        let quill = this.$refs.myQuillEditor.quill
        if (res.code == '1') {
          let length = quill.getSelection().index;
          quill.insertEmbed(length, 'image', this.imgUrl + res.body)
          quill.setSelection(length + 1)
        } else {
          this.$message.error('图片插入失败')
        }
        this.quillUpdateImg = false
      },
      uploadError() {
        this.quillUpdateImg = false
        this.$message.error('图片插入失败')
      },
      onEditorReady(editor) {
      },
      onEditorChange(d) {
      },
      addEquipment() {
        let url = '/yijian/opStore/addStoreEquipment.do';
        let storeId = this.storeInfo.storeId;
        let message = this.content;
        let image = this.realImageUrl;
        let data = {
          storeId,
          message,
          image
        };
        this.$axios.dopost(url, data).then(res => {
          this.dialogVisible = false;
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
      handleClickChange(d) {
        this.dialogVisible = true;
        this.imageUrl = this.imgUrl + d.image;
        this.realImageUrl = d.image;
        this.content = d.message;
      },
      handleAvatarSuccess(res, file) {
        this.realImageUrl = res.body;
        this.imageUrl = this.imgUrl + this.realImageUrl;
      },
      beforeAvatarUpload(file) {

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

  .imageWidth {
    max-width: 400px;
  }

  .el-dialog {
    .inner_body {
      text-align: left;
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
    .editor {
      height: 300px;
      .editer {
        height: 250px;
      }
    }
  }
</style>
