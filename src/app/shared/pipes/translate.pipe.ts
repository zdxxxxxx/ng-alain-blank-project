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
        course_type_1: '旅行中',
        course_type_2: '出发前',
        course_type_3: '机票预订',
        course_type_4: '新用户课程',
        course_type_5: '沉默用户课程',
        course_type_6: '搜索目的地触发',
        course_type_7: 'poi浏览触发',
    };

    constructor() {}

    transform(value: string, args?: any): string {
        return this.map[value];
    }
}
