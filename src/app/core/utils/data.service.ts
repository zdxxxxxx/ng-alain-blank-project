import { Injectable, Injector } from '@angular/core';
import { zip } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpService } from '@core/net/http.service';

interface ConfigModel {
    url: string;
    key: string;
    format?: Function;
}

@Injectable()
export class DataService {
    data = {
        COURSE_TYPE: [
            {
                text: '出发前',
                value: 2,
                des:
                    '把用户订单的日期（机票的日期，酒店的入住日期，门票的使用日期等）作为出发日期，在出发前n天发送。',
            },
            {
                text: '旅行中',
                value: 1,
                des:
                    '用户到达某个非常驻目的地（包括这个目的地的所有层级的子目的地）的当天作为到达的第一天，在第n天发送。',
            },
            {
                text: 'poi浏览触发',
                value: 7,
                des:
                    '给浏览了某个目的地下的某个类型的poi列表页的用户，在第n天发送。我们把’浏览了xx目的地的xx类型的列表的课程’叫做一种课程，每个用户最多同时进行两种此类课程。',
            },
            {
                text: '酒店浏览触发',
                value: 8,
                des:
                    '打开app后，逛过别的页面，然后逛到酒店相关页面的用户，在逛过后的第n天发送内容。',
            },
            {
                text: '机票预订',
                value: 3,
                des: '定了机票的用户，在下单日后的第n天发送。',
            },
            {
                text: '新用户课程（ios）',
                value: 4,
                des: '新下载的用户，在下载后的第n天发送。',
            },
            {
                text: '沉默用户',
                value: 'recall',
                des: '',
            },
            {
                text: '意向目的地',
                value: 'intent',
                des: '',
            },
            {
                text: '常驻目的地',
                value: 'habitat',
                des: '',
            },
        ],
    };

    static checkConfig(configs: ConfigModel[]): ConfigModel[] {
        const hash = {};
        configs.map(conf => {
            if (hash.hasOwnProperty(conf.key)) {
                console.warn("Have the same keys in class 'DataService'.");
            } else {
                hash[conf.key] = true;
            }
        });
        return configs;
    }

    constructor(private injector: Injector) {}

    get http() {
        return this.injector.get(HttpService);
    }

    getStaticData(key) {
        return this.data[key] || [];
    }

    private createOb(conf: ConfigModel) {
        const { url, key, format } = conf;
        return this.http.get(url).pipe(
            map(data => {
                if (format) {
                    data = format(data);
                }
                return { [key]: data };
            }),
        );
    }

    private getSyncData(resolve, reject) {
        const config: ConfigModel[] = DataService.checkConfig([
            {
                url: '/push-api/material/attr/get_attr_list.php',
                key: 'CONTENT_TYPES',
                format: data => {
                    return data[0].options;
                },
            },
        ]);
        const ob_arr = config.map(conf => {
            return this.createOb({ ...conf });
        });

        zip(...ob_arr)
            .pipe(
                catchError(([data]) => {
                    resolve(null);
                    return [data];
                }),
            )
            .subscribe({
                next: data => {
                    data.forEach(d => {
                        this.data = Object.assign(this.data, d);
                    });
                },
                complete: () => {
                    resolve(null);
                },
            });
    }

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getSyncData(resolve, reject);
        });
    }
}
