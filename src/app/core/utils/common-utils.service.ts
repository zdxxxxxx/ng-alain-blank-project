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
}
