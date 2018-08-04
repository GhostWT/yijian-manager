import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let store = new Vuex.Store({
    state: {
      storeInfo: window.localStorage.getItem('storeInfo'),
      imgUrl: 'http://212.64.16.120/yijian/download?ossId='
    },

    getters: {
      getStoreInfo(state) {
        return state.storeInfo;
      },
      getImgUrl(state) {
        return state.imgUrl;
      }
    }
    ,
    actions: {
      setStoreInfo({commit, state}, info) {
        commit("setStoreInfo", info);
        window.localStorage.setItem("storeInfo", info);
      }
    }
    ,
    mutations: {
      setStoreInfo(state, info) {
        state.storeInfo = info;
      }
    }
  })
;

export default store;
