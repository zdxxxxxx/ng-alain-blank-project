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

    // 沉默用户内容置顶
    changeOrder(ids) {
        const url = `${this.prefixUrl}/recall/reorder_message_list.php`;
        return this.http.get(url, { list: ids });
    }

    // 沉默用户内容列表
    getRecallList(params) {
        const url = `${this.prefixUrl}/recall/get_message_list.php`;
        return this.http.get(url, params);
    }

    // 新增内容
    addMessage(data) {
        const url = `${this.prefixUrl}/warehouse/create_message.php`;
        return this.http.postForm(url, data);
    }

    // 修改内容
    updateMessage(data) {
        const url = `${this.prefixUrl}/warehouse/update_message.php`;
        return this.http.postForm(url, data);
    }

    // 删除内容
    delMessage(id) {
        const url = `${this.prefixUrl}/warehouse/delete_message.php`;
        return this.http.postForm(url, { id: id });
    }

    //常驻地目的地列表
    getHabMddList() {
        const url = `${this.prefixUrl}/habitat/get_mdd_list.php`;
        return this.http.get(url);
    }

    // 常驻地内容
    getHabMessageList(params) {
        const url = `${this.prefixUrl}/habitat/get_message_list.php`;
        return this.http.get(url, params);
    }

    // 删除常驻地内容
    deleteHabMessage(params) {
        const url = `${this.prefixUrl}/habitat/remove_message.php`;
        return this.http.postForm(url, { ...params });
    }

    // 常驻目的地内容置顶
    habOrder(ids, mdd_id) {
        const url = `${this.prefixUrl}/habitat/reorder_message.php`;
        return this.http.get(url, { list: ids, mdd_id });
    }

    getIntentMddList() {
        const url = `${this.prefixUrl}/intent/get_mdd_list.php`;
        return this.http.get(url);
    }

    getIntentMessageList(params) {
        const url = `${this.prefixUrl}/intent/get_message_list.php`;
        return this.http.get(url, params);
    }

    addIntentMessage(data) {
        const url = `${this.prefixUrl}/intent/add_message.php`;
        return this.http.postForm(url, data);
    }

    deleteIntentMessage(params) {
        const url = `${this.prefixUrl}/intent/remove_message.php`;
        return this.http.postForm(url, { ...params });
    }

    // 意向目的地内容置顶
    indentOrder(ids, mdd_id) {
        const url = `${this.prefixUrl}/intent/reorder_message.php`;
        return this.http.get(url, { list: ids, mdd_id });
    }
}
