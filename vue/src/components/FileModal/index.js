import FileModal from "./FileModal.vue";
FileModal.install = (app)=>{
    app.component('FilesModal',FileModal);
}
export default FileModal;