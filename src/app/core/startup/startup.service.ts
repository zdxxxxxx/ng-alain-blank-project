import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private menuService: MenuService,
        private settingService: SettingsService,
        private aclService: ACLService,
        private titleService: TitleService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private httpClient: HttpClient,
        private injector: Injector,
    ) {}

    private viaHttp(resolve: any, reject: any) {
        zip(this.httpClient.get('assets/tmp/app-data.json'))
            .pipe(
                // 接收其他拦截器后产生的异常消息
                catchError(([appData]) => {
                    resolve(null);
                    return [appData];
                }),
            )
            .subscribe(
                ([appData]) => {
                    // application data
                    const res: any = appData;
                    // 应用信息：包括站点名、描述、年份
                    this.settingService.setApp(res.app);
                    // 用户信息：包括姓名、头像、邮箱地址
                    this.settingService.setUser(res.user);
                    // ACL：设置权限为全量
                    this.aclService.setFull(true);
                    // 初始化菜单
                    this.menuService.add(res.menu);
                    // 设置页面标题的后缀
                    this.titleService.suffix = res.app.name;
                },
                () => {},
                () => {
                    resolve(null);
                },
            );
    }

    private viaMock(resolve: any, reject: any) {
        // const tokenData = this.tokenService.get();
        // if (!tokenData.token) {
        //   this.injector.get(Router).navigateByUrl('/passport/login');
        //   resolve({});
        //   return;
        // }
        // mock
        const app: any = {
            name: `马蜂窝推送后台`,
            description: `马蜂窝推送后台`,
        };
        const user: any = {
            name: '郑东祥',
            avatar: './assets/8012a56580effd6151377bea37c59d11.jpg',
            email: 'zhengdongxiang@mafengwo.com',
            token: '348114hhfaf123fasads',
        };
        // 应用信息：包括站点名、描述、年份
        this.settingService.setApp(app);
        // 用户信息：包括姓名、头像、邮箱地址
        this.settingService.setUser(user);
        // ACL：设置权限为全量
        this.aclService.setFull(true);
        // 初始化菜单
        this.menuService.add([
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
                text: '推送任务',
                group: true,
                children: [
                    {
                        text: '运营推送',
                        icon: 'iconfont icon-yunying',
                        link: '/rule/task-spec',
                        children: [
                            {
                                text: '推送列表',
                                link: '/rule/task-list',
                            },
                            {
                                text: '新建推送',
                                link: '/rule/create-task',
                            },
                            {
                                text: '推送测试',
                                link: '/rule/task-spec',
                            },
                        ],
                    },
                    {
                        text: '课程',
                        icon: 'iconfont icon-kechengdingzhi',
                        link: '/rule/syllabus',
                        children: [
                            {
                                text: '目的地课程',
                                link: '/rule/syllabus',
                            },
                            {
                                text: '用户课程',
                                link: '/rule/course-info',
                            },
                        ],
                    },
                    {
                        text: '位置触发',
                        icon: 'iconfont icon-weizhi',
                        link: '/rule/location-mdd',
                        children: [
                            {
                                text: '目的地',
                                link: '/rule/location-mdd',
                            },
                            {
                                text: 'Poi',
                                link: '/rule/poi',
                            },
                        ],
                    },
                    {
                        text: '沉默用户',
                        icon: 'anticon anticon-user-delete',
                        link: '/rule/recall',
                    },
                    {
                        text: '意向目的地',
                        icon: 'iconfont icon-78',
                        link: '/rule/intent',
                    },
                    {
                        text: '常驻目的地',
                        icon: 'iconfont icon-yidiandiantubiao04',
                        link: '/rule/habitat',
                    },
                    {
                        text: '实验室',
                        icon: 'iconfont icon-laboratorylab',
                        link: '/rule/lab',
                        children: [
                            {
                                text: '文案优选',
                                link: '/task/lab/abtest',
                            },
                        ],
                    },
                ],
            },
            {
                text: '统计',
                group: true,
                children: [
                    {
                        text: '推送统计',
                        translate: '推送统计',
                        icon: 'anticon anticon-dot-chart',
                        link: '/statistics',
                        children: [
                            {
                                text: '业务线',
                                translate: '业务线',
                                link: '/statistics/business',
                            },
                            {
                                text: '订单',
                                translate: '订单',
                                link: '/statistics/order',
                            },
                            {
                                text: '风铃数据',
                                translate: '风铃数据',
                                link: '/statistics/data-view',
                            },
                            {
                                text: '通道质量',
                                translate: '通道质量',
                                link: '/statistics/channel',
                            },
                        ],
                    },
                ],
            },
            {
                text: '内容管理',
                group: true,
                children: [
                    {
                        text: '弹药库',
                        link: '/content/warehouse',
                        icon: 'anticon anticon-shop',
                    },
                    {
                        text: '优质内容库',
                        icon: 'anticon anticon-like-o',
                        link: '/message/high-quality',
                    },
                ],
            },
        ]);
        // 设置页面标题的后缀
        this.titleService.suffix = app.name;

        resolve({});
    }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            // http
            // this.viaHttp(resolve, reject);
            // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
            this.viaMock(resolve, reject);
        });
    }
}
