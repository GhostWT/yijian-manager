import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  adminInfo: {
    avatar: 'default.jpg'
  },
}

const mutations = {
  saveAdminInfo(state, adminInfo){
    state.adminInfo = adminInfo;
  }
}

const actions = {
  async getAdminData({commit}){
    try{
      commit('saveAdminInfo', 'ts');
    }catch(err){
      console.log('您尚未登陆或者session失效')
    }
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
})
