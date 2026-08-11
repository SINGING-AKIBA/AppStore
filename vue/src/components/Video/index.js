import AVideo from './video.vue'
AVideo.install = (app, options) => {
    app.component('a-video', AVideo)
}
export default AVideo