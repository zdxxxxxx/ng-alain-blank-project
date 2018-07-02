import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: '_translate',
})
export class TranslatePipe implements PipeTransform {
    map = {
        send: '发送量',
        app_received: '送达量',
        modal_cancel: '关闭量',
        open: '打开量',
        rate_open: '打开率',
        course_type: {
            1: '旅行中',
            2: '出发前',
            3: '机票预订',
            4: '新用户课程',
            5: '沉默用户课程',
            6: '搜索目的地触发',
            7: 'poi浏览触发',
            recall: '沉默用户',
            intent: '意向目的地',
            habitat: '常驻目的地',
        },
    };

    constructor() {}

    transform(value: string, args?: any): string {
        if (args && this.map[args]) {
            return this.map[args][value] || '';
        } else {
            return this.map[value] || '';
        }
    }
}
