import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let store = new Vuex.Store({
    state: {
      storeInfo: window.localStorage.getItem('storeInfo'),
      imgUrl: 'http://212.64.16.120/yijian/download?ossId=',
      mobile:window.localStorage.getItem('mobile')
    },

    getters: {
      getStoreInfo(state) {
        return state.storeInfo;
      },
      getImgUrl(state) {
        return state.imgUrl;
      },
      getMobile(state){
        return state.mobile;
      }
    }
    ,
    actions: {
      setStoreInfo({commit, state}, info) {
        commit("setStoreInfo", info);
        window.localStorage.setItem("storeInfo", info);
      },
      setMobile({commit, state}, info){
        commit("setMobile",info);
        window.localStorage.setItem("mobile",info)
      }
    }
    ,
    mutations: {
      setStoreInfo(state, info) {
        state.storeInfo = info;
      },
      setMobile(state, info) {
        state.mobile = info;
      }
    }
  })
;

export default store;
