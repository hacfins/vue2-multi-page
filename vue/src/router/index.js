import Vue from 'vue'
import {routerMode} from '@/config/env'
import Router from 'vue-router'
Vue.use(Router)

const index_user          = r => require.ensure([], () => r(require('index/pages/index/children/user')), 'index/index-user');
const index_echart        = r => require.ensure([], () => r(require('index/pages/index/children/echart')), 'index/index-echart');
const index_setbindsns    = r => require.ensure([], () => r(require('index/pages/index/children/setbindsns')), 'index/index-setbindsns');
const video_play          = r => require.ensure([], () => r(require('index/pages/video/children/video')), 'index/video-play');
const video_normal        = r => require.ensure([], () => r(require('index/pages/video/children/video-normal')), 'index/video-normal');
const video_hls           = r => require.ensure([], () => r(require('index/pages/video/children/video-hls')), 'index/video-hls');
const video_rtmp          = r => require.ensure([], () => r(require('index/pages/video/children/video-rtmp')), 'index/video-rtmp');
const audio_play          = r => require.ensure([], () => r(require('index/pages/audio/children/audio')), 'index/audio-play');
const audio_normal        = r => require.ensure([], () => r(require('index/pages/audio/children/audio-normal')), 'index/audio-normal');
const audio_jplayer       = r => require.ensure([], () => r(require('index/pages/audio/children/audio-jplayer')), 'index/audio-jplayer');
const upload_upload       = r => require.ensure([], () => r(require('index/pages/upload/children/upload')), 'index/upload-upload');
const upload_con          = r => require.ensure([], () => r(require('index/pages/upload/children/upload-con')), 'index/upload-con');
const editor_editor       = r => require.ensure([], () => r(require('index/pages/editor/children/editor')), 'index/editor-editor');
const editor_con          = r => require.ensure([], () => r(require('index/pages/editor/children/editor-con')), 'index/editor-con');
const valaditor_valaditor = r => require.ensure([], () => r(require('index/pages/valaditor/children/valaditor')), 'index/valaditor-valaditor');
const valaditor_con       = r => require.ensure([], () => r(require('index/pages/valaditor/children/valaditor-con')), 'index/valaditor-con');


const routes = [
    {
        path     : '/',
        component: index_user,
        name     : '',
        children : [{
            path     : '',
            component: index_echart,
            meta     : [],
        }]

    },
    {
        path     : '/index',
        component: index_user,
        name     : '',
        children : [{
            path     : '',
            component: index_echart,
            meta     : [],
        }, {
            path     : '/index/setbindsns',
            component: index_setbindsns,
            meta     : [],
        }]
    },
    {
        path     : '/video',
        component: video_play,
        name     : '',
        children : [{
            path     : '',
            component: video_normal,
            meta     : [],
        }, {
            path     : '/video/hls',
            component: video_hls,
            meta     : [],
        }, {
            path     : '/video/rtmp',
            component: video_rtmp,
            meta     : [],
        }]
    },
    {
        path     : '/audio',
        component: audio_play,
        name     : '',
        children : [{
            path     : '',
            component: audio_normal,
            meta     : [],
        }, {
            path     : '/audio/jplayer',
            component: audio_jplayer,
            meta     : [],
        }]
    },
    {
        path     : '/upload',
        component: upload_upload,
        name     : '',
        children : [{
            path     : '',
            component: upload_con,
            meta     : [],
        }]
    },
    {
        path     : '/editor',
        component: editor_editor,
        name     : '',
        children : [{
            path     : '',
            component: editor_con,
            meta     : [],
        }]
    },
    {
        path     : '/valaditor',
        component: valaditor_valaditor,
        name     : '',
        children : [{
            path     : '',
            component: valaditor_con,
            meta     : [],
        }]
    },
]

export default new Router({
    mode  : routerMode,
    routes,
    strict: process.env.NODE_ENV !== 'production',
})
