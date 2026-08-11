export default {
    request:{
        baseUrl: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:7010/admin' : '/admin',
        timeout: 5000000,// 请求超时时间
    },
    //pro-layout
    layout:{
        navTheme: 'dark', // theme for nav menu
        primaryColor: '#F5222D', // primary color of ant design
        layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
        contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
        fixedHeader: false, // sticky header
        fixSiderbar: true, // sticky siderbar
        colorWeak: true,
        menu: {
            locale: true
        },
        title: 'Digital AI Center',
        iconfontUrl: '',
        production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
        logo: '',// logo url or false
    },
    login:{
        links:[
            {title:'帮助',href:'#'},
            {title:'隐私',href:'#'},
            {title:'条款',href:'#'}
        ],
        description:'每一天的生活都应该以微笑微笑开始以微笑结束哦(～￣▽￣～)',
        copyright:'Copyright &copy; 2023 SMILE ADMIN',
        tokenOutTime: 86400 * 30000 * 1000,//token过期时间
        tokenStorageKey: 'smile_admin_token',
        userStorageKey: 'smile_admin_user',
    }
}