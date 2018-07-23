import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login'
import Nav from '@/views/nav'
import BannerManage from '@/views/BannerManage'
import StoreDetail from '@/views/StoreDetail'
import Equipment from '@/views/Equipment'
import StoreInfo from '@/views/StoreInfo'
import QRCode from '@/views/QRCode'
import PriceManage from '@/views/PriceManage'
import TimeManage from '@/views/TimeManage'
import QuotaSetting from '@/views/QuotaSetting'
import Comment from '@/views/Comment'
import OrderManage from '@/views/OrderManage'
import FinancialFlow from '@/views/FinancialFlow'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    }, {
      path: '/nav',
      component: Nav,
      name: 'nav',
      children: [{
        path: 'bannermanage',
        component: BannerManage,
        name: 'bannermanage'
      }, {
        path: 'storedetail',
        component: StoreDetail,
        name: 'storedetail'
      }, {
        path: 'equipment',
        component: Equipment,
        name: 'equipment'
      }, {
        path: 'storeinfo',
        component: StoreInfo,
        name: 'storeinfo'
      }, {
        path: 'qrCode',
        component: QRCode,
        name: 'qrCode'
      }, {
        path: 'pricemanage',
        component: PriceManage,
        name: 'pricemanage'
      }, {
        path: 'timemanage',
        component: TimeManage,
        name: 'timemanage'
      }, {
        path: 'quotasetting',
        component: QuotaSetting,
        name: 'quotasetting'
      }, {
        path: 'comment',
        component: Comment,
        name: 'comment'
      }, {
        path: 'ordermanage',
        component: OrderManage,
        name: 'ordermanage'
      }, {
        path: 'financialflow',
        component: FinancialFlow,
        name: 'financialflow'
      }]
    }
  ]
})
