# vue2-multi-page

## 安装

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8004
npm run dev

# build for production with minification
npm run build
```
## 技术够成
``` bash
- Web框架：Vue 
- UI框架：Element UI(pc)/Mint UI(mobile)
- 构建工具：webpack+gulp
```
> 本产品采用 Vue 框架，主要使用了里面的 vue-route、vue-cookies、axios、pug页面继承、vuex等技术。

## 目录结构

```
.
├── build                                       // webpack 配置文件
├── config                                      // webpack 生产及开发环境变量
├── dist                                        // 线上文件夹
├── src                                         // 开发目录
│   ├── api                                     // api文件夹
│   │   ├── getdata.js                          // api接口js文件
│   ├── config                                  // 基本配置文件夹
│   │   ├── ajax.js                             // Ajax请求js文件
│   │   ├── config.js                           // 引入公共的配置文件
│   │   ├── env.js                              // 环境配置文件
│   │   ├── utils.js                            // 公共的js文件
│   ├── directive                               // 指令文件夹
│   │   ├── el-drag-dialog                      // 某个指令文件夹
│   │   │       └── drag.js                     // 指令功能文件
│   │   │       └── index.js                    // 指令功能文件入口
│   ├── modules                                 // 开发目录
│   │   ├── index                               // PC目录
│   │   │   ├── common                          // 基础模板
│   │   │       └── base.pug                    // 基础模板文件
│   │   │   └── commponents                     // 组件目录
│   │   │       └── common                      // 共用组件目录
│   │   │              └── audio.vue            // 例如：音频组件
│   │   │       └── footer                      // 页面底部
│   │   │       └── header                      // 页面头部
│   │   │   └── pages                           // 页面目录
│   │   │       └── audio                       // 音频页面目录
│   │   │              └── children             // 音频页面子组件目录
│   │   │              └── app.vue              // 音频页面入口Vue
│   │   │              └── audio.js             // 音频页面入口js
│   │   │              └── audio.pug            // 音频页面入口pug文件
│   │   ├── phone                               // phone目录
│   ├── router                                  // 路由文件夹
│   │   └── index.js                            // PC端路由配置文件
│   │   └── phone.js                            // Mobile端路由配置文件
│   └── script                                  // 放置PC/Mobile分别共用及共同共用的JS文件
│   └── store                                   // vuex目录文件
│   └── style                                   // 放置PC/Mobile共用的Css文件
├── static                                      // 静态目录
│   ├── assets                                  // 第三方静态文件，主要放置不变的东西例如（Vue、Axios）
│   │   ├── axios-0.18.0                        // 每一个第三方文件名增加版本号
│   ├── iconfont                                // 放置字体文件
│   ├── images                                  // 放置图片
│   ├── lib                                     // 放置自己封装的lib文件
│   ├── medias                                  // 放置音频视频文件

.
```
## 编码命名规范
```
1. 英文命名，不可使用汉语拼音

2. 所有的文件夹名，采用 **小写**

3. 所有的文件名，采用 **小写**

4. URL请求地址 一律 **小写**

5. 所有的文件位置按照上面目录结构进行进行放置，不可乱放

6. 禁止使用Jquery及Jquery依赖的插件
```
> **如果文件名及文件夹名称由多个字母构成使用中划线的方式，例如：header-top！**
> **如果有修改，需要在该文件中详细说明！**

## 源码修改说明
```
1. element-ui

（1）为了实现 el-tree 组件 是不是叶子节点 原UI 只有在lazy 模式下 data中的isLeaf 属性值设置才生效，

但是lazy 模式下 无法动态添加的节点 及节点的排序，所以将不是lazy模式也可以通过isLeaf 设置是否是叶子节点

由：e.prototype.updateLeafState=function(){if(!0!==this.store.lazy||!0===this.loaded||void 0===this.isLeafByUser)

改为：e.prototype.updateLeafState=function(){if(!0===this.loaded||void 0===this.isLeafByUser)

(2)为了解决fireFox nodeClick event 拿不到,导致无法区分点击的元素，无法对点击添加编辑等按钮时禁止展开操作,及禁用的节点还可以选中的问题及el-tree禁用的节点还可以点击的问题

由：handleClick(){... this.tree.$emit("node-click",this.node.data,this.node,this)} 

改为：handleClick(event){if(this.node.disabled) return;... this.tree.$emit("node-click",this.node.data,this.node,this,event)

2. mint-ui

（1）为了支持datetimepicker type=time 类型 可以控制开始分钟与结束分钟

由：startHour:{type:Number,default:0},endHour:{type:Number,default:23}}和

computed:{rims:function(){if(!this.currentValue)return{year:[],month:[],date:[],hour:[],min:[]};var t;return"time"===this.type?t={hour:[this.startHour,this.endHour],min:[0,59]}

改为：startHour:{type:Number,default:0},endHour:{type:Number,default:23},startMinute:{type:Number,default:0},endMinute:{type:Number,default:59}

computed:{rims:function(){if(!this.currentValue)return{year:[],month:[],date:[],hour:[],min:[]};var t;return"time"===this.type?t={hour:[this.startHour,this.endHour],min:[this.startMinute,this.endMinute]}

3. videojs

（1）为了解决IE10 视频播放时不在当前页再回来IE10 卡死的问题

由：e.updateInterval=e.setInterval(function(){e.requestAnimationFrame(function(){e.update()})},30)})

改为：e.updateInterval=e.setInterval(function(){e.rafId_&&e.cancelAnimationFrame(e.rafId_),e.rafId_=e.requestAnimationFrame(function(){e.update()})},30)})

4. webupload

（1）为了添加button可以选择接受类型及增加文件夹上传

由：addBtn:function(b){var e=this,f=e.options,g=f.accept

改为：addBtn:function(b,acceptopt){var e=this,f=e.options,g=acceptopt||f.accept

由：acceptFile:function(a){var b=!a||!a.size||this.accept&&h.exec(a.name)&&!this.accept.test(a.name);return!b}

改为：acceptFile:function(a){this.accept = this.owner.accept||this.accept;var b=!a||!a.size||this.accept&&h.exec(a.name)&&!this.accept.test(a.name);return!b}

由：j.multiple&&l.attr("multiple","multiple"),j.accept&&j.accept.length>0){for(a=[],b=0,d=j.accept.length;d>b;b++)a.push(j.accept[b].mimeTypes);l.attr("accept",a.join(","))

改为：j.multiple&&l.attr("multiple","multiple"),j.is_fold&&l.attr("webkitdirectory",""),j.accept&&j.accept.length>0){for(a=[],b=0,d=j.accept.length;d>b;b++)a.push(j.accept[b].mimeTypes);l.attr("accept",a.join(","))

5.vee-validate

(1) disabled 不进行验证的问题

由：Ot.isDisabled.get=function(){return!(!this.component||!this.component.disabled)||!(!this.el||!this.el.disabled)}

改为：Ot.isDisabled.get=function(){return false}

```
## webpack打包说明
```
1. js打包：

（1）将配置文件打包到js/common/config.js

（2）api、config、script中的文件打包到js/common/env.js

（3）将PC端及Mobile端入口产生的runtime单独打包到js/common/runtime.js(为了更改某个文件缓存失效的问题)

（4）将入口文件中router、store的配置打包到entry-com.js（PC、Mobile 已区分）

（5）将所有chunks只要共用大于等于3就将其打包到async-com.js（PC、Mobile 已区分）

（6）分别将入口文件及异步chunks打包到对应模块中

（7）将nodemodule中的第三方插件打包到vendor.js
2. css打包：

（1）将引用nodeModule中的css按照PC/Mobile 打包到css/(index|phone)/vendor.css

（2）将reset CSS按照PC/Mobile打包到css/(index|phone)/entry-com.css及css/phone/entry-com.css

（3）将chunks中的css按照PC/Mobile打包到css/（index|phone）async-com.css

```
> **由于升级到webpack4在开发模式下热更新比较慢，是由于html-webpack-plugin3.2.0版本的问题，改为使用4.0.0-beta.8**

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
