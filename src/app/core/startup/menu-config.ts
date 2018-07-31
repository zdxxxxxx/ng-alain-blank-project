export const Conf = [
    {
        text: '主导航',
        group: true,
        link: '/dashboard',
        children: [
            {
                text: '仪表盘',
                icon: 'iconfont icon-yunying',
                link: '/dashboard',
            },
        ],
    },
    {
        text: '运营推送',
        group: true,
        children: [
            {
                text: '推送工具',
                translate: '推送工具',
                icon: 'anticon anticon-tool',
                children: [
                    {
                        text: '推送列表',
                        translate: '推送列表',
                        link: '/operation/task-list',
                    },
                    {
                        text: '新建推送',
                        translate: '新建推送',
                        link: '/operation/create-task',
                    },
                    {
                        text: '推送测试',
                        translate: '推送测试',
                        link: '/operation/spec-task',
                    },
                    {
                        text: '文案优选',
                        translate: '文案优选',
                        link: '/push-web/task/lab/abtest',
                    },
                ],
            },
            {
                text: '数据统计',
                translate: '数据统计',
                icon: 'anticon anticon-line-chart',
                children: [
                    {
                        text: '业务线',
                        translate: '业务线',
                        link: '/data/business',
                    },
                ],
            },
        ],
    },
];
