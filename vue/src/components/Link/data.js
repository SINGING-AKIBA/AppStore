const data = [
    {
        key: 'base',
        title: '基础页面',
        links: [
            {
                key: 'home',
                title: '首页',
                page: 'pages/index/index',
            },
            {
                key: 'theater',
                title: '推荐',
                page: 'pages/theater/index',
            },
            {
                key: 'activity',
                title: '活动',
                page: 'pages/activity/index',
            },
            {
                key: 'user',
                title: '用户中心',
                page: 'pages/user/index',
            },
            {
                key: 'login',
                title: '用户登录',
                page: 'pages/login/index',
            }
        ]
    },
    {
        key: 'videoList',
        title: '短剧',
        links:[
            {
                key: 'videoList',
                title: '短剧列表',
                page: 'pages/film/index',
            },
            {
                key: 'Detail',
                title: '播放页',
                page: 'pages/film/playing',
                form:[
                    {
                        label: '短剧ID',
                        key: 'id',
                        tips: '请输入要显示的短剧ID,可在短剧列表获取',
                        required: true,
                        value:''
                    },
                ]
            }
        ]
    }
];

export default data