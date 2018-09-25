// var myPlayer = videojs('roomVideo', {
//     bigPlayButton: false,
//     textTrackDisplay: false,
//     posterImage: true,
//     errorDisplay: false,
//     controlBar: false
//   })
videojs('roomVideo', {
    // bigPlayButton: false,  // 播放按钮
    // textTrackDisplay: false,
    // posterImage: true,   // 封面图片
    // errorDisplay: false,
    // controlBar: true,    // 控制条
    techOrder: ["html5", "flash"],
    width: 1000,//宽string|number
    height: 450,//高：string|number
    controls: true,//控制条：boolean
    preload: "none",//预加载：string；'auto'|'true'|'metadata'|'none'
    poster: 'source/suoluetu.jpg',//预览图：string
    autoplay: false,//自动播放：boolean
    loop: true,//循环：boolean
    muted: true,//静音：boolean
    flash: {
        hls: { withCredentials: false },
        swf: '/static/js/video-js.swf'
    },
    // sources: [
        // sources:
        // {
        //     src: detailInfo.src,
        //     type: 'video/mp4'
        // },
        // {
        //     src: 'http://video.jiagew762.com:8091/20180509/uXB7bNFF/index.m3u8',
        //     type: 'application/x-mpegURL'
        // }
    // ]
});