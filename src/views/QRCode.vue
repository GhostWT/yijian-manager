<template>
  <div>
    <headTop></headTop>
    <div class="header">
      <h3>商家二维码</h3>
      <div id='code'></div>
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcode';
  import headTop from '@/components/HeadTop';

  export default {
    name: "QRCode",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        codes: ''
      }
    },
    components: {
      QRCode: QRCode,
      headTop
    },
    methods: {
      useqrcode() {
        let canvas = document.getElementById('canvas');
        QRCode.toCanvas(canvas, 'yijian://' + this.storeInfo.storeId, function (error) {
          if (error) console.error(error)
          console.log('success!');
        })
      }
    },
    mounted() {
      this.useqrcode();
    }
  }
</script>

<style lang="less" scoped>
  .header {
    margin: 20px;
    p {
      margin: 10px 0px;
    }
    #canvas {
      margin-top: 20px;
      width: 400px !important;
      height: 400px !important;
      border: 1px solid #cccccc;
    }
  }
</style>
