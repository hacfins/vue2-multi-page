<template>
    <div>
        <jp-audio :songs="songs" :volume="40"></jp-audio>
    </div>
</template>


<script>
    import Audio2 from '@/modules/index/components/common/jplayer.vue'
    export default {
        components: {
            'jp-audio':Audio2
        },
        data(){
            return {
                songs: [{
                    "url": "/static/medias/12_MPEG-Audio_8000_1.mp3",
                    "songname": "01_MPEG-Audio_44100_2"
                }, {
                    "url": "/static/medias/12_MPEG-Audio_8000_1.mp3",
                    "songname": "02_MPEG-Audio_44100_2"
                }]
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
