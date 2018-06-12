import { Injectable } from '@angular/core';
import { HttpService } from '@core/net/http.service';

@Injectable()
export class ApiService {
    prefixUrl = '/push-api/material';

    constructor(private http: HttpService) {}

    //获取标签
    getTags() {
        const url = `${this.prefixUrl}/attr/get_attr_list.php`;
        return this.http.get(url);
    }

    //获取弹药列表
    getMessages(params) {
        const url = `${this.prefixUrl}/warehouse/query_message_list.php`;
        return this.http.get(url, params);
    }
    // 新增弹药
    addMessage(data) {
        const url = `${this.prefixUrl}/warehouse/create_message.php`;
        return this.http.postForm(url, data);
    }
    // 更新弹药
    updateMessage(data) {
        const url = `${this.prefixUrl}/warehouse/create_message.php`;
        return this.http.postForm(url, data);
    }
}
