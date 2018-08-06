<template>
  <div class="header">
    <div v-if="!inEdit">
      <p>可预约时间段：{{formData | appointFilter}}</p>
      <p>暂停营业时间：{{formData | stopTimeFilter}}</p>
      <p>
        <el-button type="primary" @click="handleClick">编辑</el-button>
      </p>
    </div>
    <div v-if="inEdit">
      <h3>可预约时间段</h3>
      <p>
        <el-select v-model="value1" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        至
        <el-select v-model="value2" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-time-select placeholder="起始时间" v-model="startTime" :picker-options="{start: '00:00',step: '01:00',end: '23:00'}">
        </el-time-select>
        <el-time-select placeholder="结束时间" v-model="endTime" :picker-options="{start: '00:00',step: '01:00',end: '23:00',minTime: startTime}">
        </el-time-select>
      </p>
      <h3>暂停营业</h3>
      <p>
        <el-time-select placeholder="起始时间" v-model="stopStartTime" :picker-options="{start: '00:00',step: '01:00',end: '23:00'}">
        </el-time-select>
        <el-time-select placeholder="结束时间" v-model="stopEndTime" :picker-options="{start: '00:00',step: '01:00',end: '23:00',minTime: startTime}">
        </el-time-select>
      </p>
      <p>
        <el-button type="primary" @click="inEdit = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TimeManage",
    data() {
      return {
        storeInfo: JSON.parse(this.$store.getters.getStoreInfo),
        inEdit: false,
        formData: {},
        startTime: '',
        endTime: '',
        stopStartTime: '00:00',
        stopEndTime: '00:00',
        options: [{
          value: 1,
          label: '周一'
        }, {
          value: 2,
          label: '周二'
        }, {
          value: 3,
          label: '周三'
        }, {
          value: 4,
          label: '周四'
        }, {
          value: 5,
          label: '周五'
        }, {
          value: 6,
          label: '周六'
        }, {
          value: 7,
          label: '周日'
        }],
        value1: 1,
        value2: 7
      }
    },
    mounted() {
      this.queryData();
    },
    methods: {
      queryData() {
        let url = '/yijian/opStore/getStoreSet.do';
        let storeId = this.storeInfo.storeId;
        let data = {
          storeId
        };
        this.$axios.dopost(url, data).then(res => {
          this.formData = res;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      },
      handleClick() {
        this.inEdit = true;
      },
      submit() {
        let url = '/yijian/opStore/setStoreSetByStoreId.do';
        let storeId = this.storeInfo.storeId,
          appointStartTime = this.startTime,
          appointEndTime = this.endTime,
          weekStart = this.value1,
          weekEnd = this.value2,
          stopTimeStart = this.stopStartTime,
          stopTimeEnd = this.stopEndTime;
        let data = {
          storeId,
          appointStartTime,
          appointEndTime,
          weekStart,
          weekEnd,
          stopTimeStart,
          stopTimeEnd
        };
        this.$axios.dopost(url, data).then(res => {
          this.$message.success('修改成功');
          this.queryData();
          this.inEdit = false;
        }).catch(e => {
          this.$showErrorMessage(this, e);
        })
      }
    },
    filters: {
      appointFilter(d) {
        if (!d.weekStart || !d.weekEnd || !d.appointStartTime || !d.appointEndTime) {
          return '暂无'
        }
        let weekStart, weekEnd, timeStart, timeEnd;
        let week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日',]
        weekStart = week[d.weekStart - 1];
        weekEnd = week[d.weekEnd - 1];
        timeStart = d.appointStartTime.substring(11, d.appointStartTime.length);
        timeEnd = d.appointEndTime.substring(11, d.appointEndTime.length);
        return weekStart + '至' + weekEnd + ' ' + timeStart + '~' + timeEnd;
      },
      stopTimeFilter(d) {
        if (!d.stopTimeStart || !d.stopTimeEnd) {
          return '暂无'
        }
        let timeStart, timeEnd;
        timeStart = d.stopTimeStart;
        timeEnd = d.stopTimeEnd;
        return timeStart + '~' + timeEnd;
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    margin: 20px;
    p {
      margin: 10px 0px;
    }
  }

  .el-input {
    width: 300px;
  }
</style>
