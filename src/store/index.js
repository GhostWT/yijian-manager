import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let store = new Vuex.Store({
    state: {
      storeInfo: window.localStorage.getItem('storeInfo')
    },

    getters: {
      getStoreInfo(state) {
        return state.storeInfo;
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
