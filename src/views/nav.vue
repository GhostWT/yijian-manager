<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu :default-active="$route.name" style="min-height: 100%;" background-color="#324057" text-color="#fff" active-text-color="#ffd04b" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>基础信息管理</template>
            <el-menu-item index="bannermanage">banner</el-menu-item>
            <el-menu-item index="storedetail">商家详情</el-menu-item>
            <el-menu-item index="equipment">设备展示</el-menu-item>
            <el-menu-item index="storeinfo">商家信息</el-menu-item>
            <el-menu-item index="qrCode">商家二维码</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-document"></i>运营管理</template>
            <el-menu-item index="pricemanage">价格管理</el-menu-item>
            <el-menu-item index="timemanage">时间段管理</el-menu-item>
            <el-menu-item index="quotasetting">当日名额设置</el-menu-item>
            <el-menu-item index="comment">评论</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-plus"></i>订单管理</template>
            <el-menu-item index="ordermanage">订单管理</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-star-on"></i>财务管理</template>
            <el-menu-item index="financialflow">财务流水</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "slider",
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/mixin';

  .manage_page {

  }
</style>
