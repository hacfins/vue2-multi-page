import Vue from 'vue'
import Router from 'vue-router'
import {routerMode} from '@/config/env'
Vue.use(Router)

const index_user       = r => require.ensure([], () => r(require('phone/pages/index/children/user')), 'phone/index-user');
const index_setprofile = r => require.ensure([], () => r(require('phone/pages/index/children/setprofile')), 'phone/index-setprofile');
const video_player     = r => require.ensure([], () => r(require('phone/pages/video/children/video')), 'phone/video-videoplay');

const routes = [
    {
        path     : '/m/index',
        component: index_user,
        name     : '',
        children : [{
            path     : '',
            component: index_setprofile
        }]

    },
    {
        path     : '/m/video',
        component: video_player,
        name     : ''
    },
]

export default new Router({
    mode  : routerMode,
    routes,
    strict: process.env.NODE_ENV !== 'production',
})
