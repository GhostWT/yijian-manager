<template>
  <div class="header">
    <h3>当前商家详情介绍</h3>
    <div v-if="!inEdit">
      <div v-html="storeDetail"></div>
    </div>
    <div v-if="inEdit" class="edit_container">
      <quill-editor v-model="content"
                    ref="myQuillEditor"
                    class="editer"
                    :options="editorOption"
                    @change="onEditorChange($event)"
                    @ready="onEditorReady($event)">
      </quill-editor>
    </div>
    <div class="submit_btn">
      <el-button type="primary" @click="submit" v-if="inEdit">保存</el-button>
      <el-button type="primary" @click="inEdit = true" v-if="!inEdit">编辑</el-button>
    </div>
  </div>
</template>

<script>
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
    name: "StoreDetail",
    data() {
      return {
        inEdit: false,
        storeDetail: '',
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        token: {token: sessionStorage.token},
        content: '<h3>文本编辑</h3>',
        serverUrl: '/yijian/upload',
        imgUrl: this.$store.getters.getImgUrl,
        editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.avatar-uploader input').click()
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
    mounted() {
      this.queryData();
    },
    components: {
      quillEditor,
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
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
      queryData() {
        let url = '/yijian/opStore/getStoreDescripe.do';
        let storeId = this.storeInfo.storeId;
        let data = {storeId};
        this.$axios.dopost(url, data).then(res => {
          this.storeDetail = res.description;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      submit() {
        let url = '/yijian/opStore/updateStoreDescripe.do';
        let storeId = this.storeInfo.storeId,
          description = this.content;
        let data = {
          storeId,
          description
        };
        this.$axios.dopost(url, data).then(res => {
          this.inEdit = false;
          this.$message.success('提交成功!');
          this.queryData();
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/mixin';

  .header {
    margin: 20px;
  }

  .edit_container {
    margin-top: 20px;
    height: 400px;
  }

  .editer {
    height: 350px;
  }

  .submit_btn {
    margin-top: 20px;
    text-align: center;
  }
</style>
