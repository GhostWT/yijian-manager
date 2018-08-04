import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$axios.dopost = (url, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: data
    }).then(res => {
      if (res.status === 200) {
        if (res.data && res.data.code == 1) {
          resolve(res.data.body);
        } else {
          reject(res.data);
        }
      } else {
        reject(res.data);
      }
    }).catch(error => {
      reject(error);
    })
  })
}

Vue.prototype.$showErrorMessage = (obj, e) => {
  if (e.code == 0 && e.msg == '未登录') {
    obj.$alert('请登录', '提示', {
      confirmButtonText: '确定',
      callback: action => {
        obj.$router.push({
          name: 'login'
        });
      }
    });
    return;
  }
  if (e.code == 0) {
    obj.$message({
      showClose: true,
      message: e.msg,
      type: 'error'
    });
  }
  if (e.code == 500) {
    obj.$message({
      showClose: true,
      message: e.msg,
      type: 'error'
    });
  }
}

Vue.prototype.$getBeforeDays = (n) => {
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  var res;
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    } else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  res = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
  return new Date(res);
}

Vue.prototype.$transferDate = (date) => {
  if (!date) {
    return;
  }
  let d = new Date(date);
  let res = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
  return res;
}

Vue.filter('timeFilter', function ([a, b, c]) {
  if (a && b) {
    if (!c) {
      return a + " ~ " + b;
    } else {
      let stime = Date.parse(new Date(a));
      let etime = Date.parse(new Date(b));
      let usedTime = etime - stime;
      let days = Math.floor(usedTime / (24 * 3600 * 1000));
      let leave1 = usedTime % (24 * 3600 * 1000);
      let hours = Math.floor(leave1 / (3600 * 1000));
      let leave2 = leave1 % (3600 * 1000);
      let minutes = Math.floor(leave2 / (60 * 1000));
      let time = days + "天" + hours + "时" + minutes + "分";
      return time;
    }
  } else {
    return '暂无'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
