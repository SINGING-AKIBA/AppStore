import TableAction from "./TableActions.vue";
TableAction.install = (app, options) => {
    app.component('table-actions', TableAction);
};
export default TableAction;