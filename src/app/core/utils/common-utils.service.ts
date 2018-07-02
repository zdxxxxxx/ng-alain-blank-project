import { Injectable } from '@angular/core';

@Injectable()
export class CommonUtilsService {
    constructor() {}

    static buildUrl(str): string {
        const strRegex = '^((https|http)?://)';
        const re = new RegExp(strRegex);
        if (re.test(str)) {
            return str;
        } else {
            return 'http://' + str;
        }
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

    static createUrl(url, params) {
        Object.keys(params).forEach(key => {
            url = CommonUtilsService.appendParam(url, key, params[key]);
        });
        return url;
    }
}
