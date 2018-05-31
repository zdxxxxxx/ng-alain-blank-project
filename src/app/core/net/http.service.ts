import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/catch';

import { Injectable, Injector } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpHeaders } from '@angular/common/http';
import { isObject } from 'util';

interface Res extends Object {
    code: number | string;
    message: string;
    data?: any;
}

@Injectable()
export class HttpService {
    constructor(private http: _HttpClient, private nzMsg: NzMessageService) {}

    static parseBody(param) {
        let paramStr = '';
        for (const key in param) {
            if (isObject(param[key])) {
                param[key] = JSON.stringify(param[key]);
                paramStr +=
                    '&' +
                    key +
                    '=' +
                    encodeURIComponent(param[key] == null ? '' : param[key]);
            } else {
                paramStr +=
                    '&' +
                    key +
                    '=' +
                    encodeURIComponent(param[key] == null ? '' : param[key]);
            }
        }
        return paramStr.substr(1);
    }

    static appendParam(url: string, name: string, value: string) {
        if (url && name) {
            name += '=';
            if (url.indexOf(name) === -1) {
                if (url.indexOf('?') !== -1) {
                    url += '&';
                } else {
                    url += '?';
                }
                url += name + encodeURIComponent(value);
            }
        }
        return url;
    }

    static appendParams(url: string, paramObj: { [key: string]: any }) {
        for (const key in paramObj) {
            if (paramObj.hasOwnProperty(key)) {
                url = HttpService.appendParam(url, key, paramObj[key]);
            }
        }
        return url;
    }

    private handleSuccess(data: Res | any) {
        if (data instanceof Object) {
            if (!data.code) {
                return data;
            }
            if (data.code === 0) {
                return data.data;
            }
            if (data.code !== 0) {
                this.nzMsg.create('error', data.message);
            }
        } else {
            return { code: 10001, message: 'body is not Object', data: data };
        }
    }

    get(url: string, params?: any): Observable<any> {
        return this.http.get(url, params).map(this.handleSuccess);
    }

    postForm(url: string, body: any, params?: any): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.append(
            'Content-Type',
            'application/x-www-form-urlencoded; charset=UTF-8',
        );
        const options = {
            headers,
        };
        body = HttpService.parseBody(body);
        return this.http
            .post(url, body, params, options)
            .map(this.handleSuccess);
    }
}
