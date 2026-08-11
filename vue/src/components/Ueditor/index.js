import Ueditor from "./Ueditor.vue";
Ueditor.install = (app,options)=>{
    app.component('ueditor',Ueditor)
}
export default Ueditor