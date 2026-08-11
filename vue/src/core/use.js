import Antd from 'ant-design-vue';
import Ueditor from '@/components/Ueditor';
import selectImage from '@/components/selectImage';
import selectVideo from '@/components/selectVideo';
import aVideo from '@/components/Video';
import FilesModal from '@/components/FileModal';
import VueUeditorWrap from 'vue-ueditor-wrap';
import GetLatLog from '@/components/GetLatLog';
import STable from '@/components/Table';
import TableActions from '@/components/TableActions';
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";

import permission from './directive'
//加载图标
import { 
    SearchOutlined,
    UploadOutlined,
    CheckOutlined,
    PlusOutlined,
    DeleteOutlined,
    GlobalOutlined,
    UserOutlined,
    UserAddOutlined,
    SettingOutlined,
    LogoutOutlined,
    LockOutlined,
    ReloadOutlined,
    EditOutlined,
    TableOutlined,
    ReadOutlined,
    DownloadOutlined,
    CloseOutlined
} from '@ant-design/icons-vue';

export default {
    install:(app,options)=>{
        app.use(aVideo);
        app.use(selectImage);
        app.use(selectVideo);
        app.use(Ueditor);
        app.use(Antd);
        app.use(VueUeditorWrap);
        app.use(FilesModal);
        app.use(ProLayout);
        app.use(PageContainer);
        app.use(GetLatLog);
        app.use(STable);
        app.use(TableActions);
        //图标
        app.component('SearchOutlined', SearchOutlined);
        app.component('UploadOutlined', UploadOutlined);
        app.component('CheckOutlined', CheckOutlined);
        app.component('PlusOutlined', PlusOutlined);
        app.component('DeleteOutlined', DeleteOutlined);
        app.component('GlobalOutlined', GlobalOutlined);
        app.component('UserOutlined', UserOutlined);
        app.component('UserAddOutlined', UserAddOutlined);
        app.component('SettingOutlined', SettingOutlined);
        app.component('LogoutOutlined', LogoutOutlined);
        app.component('LockOutlined', LockOutlined);
        app.component('ReloadOutlined', ReloadOutlined);
        app.component('EditOutlined', EditOutlined);
        app.component('TableOutlined', TableOutlined);
        app.component('ReadOutlined', ReadOutlined);
        app.component('DownloadOutlined', DownloadOutlined);
        app.component('CloseOutlined', CloseOutlined);
        app.directive('permission', permission);
    }
}   

