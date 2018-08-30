<template>
    <div style="height:100%">
        <div class="hk-align-center create_File hk-pointer">
            <i class=" fa fa-plus"></i>
        </div>

        <span>更换头像：</span>
        <el-upload
            class="avatar-uploader"
            action="http://192.168.123.2:8002/api/home/course/uploadpic?ACCESS-TOKEN=aba5e5f096a0c257305b4ad1ee30cedd"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>

</template>

<script>
    import webUpload from '@/script/common/upload';
    import {baseUrl} from '@/config/env';
    export default {
        data(){
            return {
                info: '上传',
                imageUrl: ''

            }
        },
        mounted(){
            var  uploader;
            uploader = webUpload.WebUploader({
                server             : baseUrl + "/api/home/network_disk/upload?ACCESS-TOKEN=aba5e5f096a0c257305b4ad1ee30cedd",
                pick               : {
                    label: '<i class="fa fa-plus" style="font-size:35px;color:gray" aria-hidden="true"></i>',
                    id   : '.create_File',
                },
                innerOptions       : {
                    chunked  : true, //开启分片
                    timeout  : 1000 * 3600 * 1, //上传请求超时时间
                    chunkSize: 1024 * 1024 * 2, //每片大小（受linux系统限制，单个上传的文件的体积得满足：filesize÷chunkSize<31998M）
                    duplicate: true,	//去重
                    threads  : 1,	//并发数(Todo：受api限制，暂时只能是1，不能超过10!!!!)
                },
                auto               : false, //开始上传 在 filesQueued事件 中触发上传
                //			fileNumLimit       : 20, //一次做多上传的文件个数
                fileSizeLimit      : 1024 * 1024 * 1024 * 100, //总大小不能超过
                fileSingleSizeLimit:  1024 * 1024 * 1024 * 50, //单个文件不能超过
                //当一批文件添加进队列以后触发
                filesQueued        : function (files) {

                },

                //当每个文件开始上传时触发。
                uploadStart        : function (file) {


                },

                //当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
                uploadBeforeSend   : function (object, data, headers) {
                    if( uploader.tempdata.length>0){
                        $.each( uploader.tempdata,function(i,v){
                            if(v.file == object.file){
                                uploader.tempdata[i] = object;
                                return;
                            }else{
                                if(i == (uploader.tempdata.length - 1)){
                                    uploader.tempdata.push(object)
                                }
                            }
                        })
                    }else{
                        uploader.tempdata.push(object)
                    }
                    object.file.chunks = object.chunks;

                    data.md5 = object.file.md5; //尝试秒传

                    data.bcreate = object.file.bcreate;//尝试手动合成
                },

                //上传过程中触发，携带上传进度。每10ms左右触发一次
                uploadProgress     : function (file, percentage) {


                },

                //当文件上传成功时触发。
                uploadSuccess      : function (file, ret) {


                },

                //检验是否有效
                uploadAccept       : function (obj, ret) {

                },

                //当文件上传失败时触发。
                uploadError        : function (file, reason) {


                },

                //当所有文件上传结束时触发
                uploadFinished     : function () {

                }
            });



        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = res.result.picture
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" >

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

</style>
