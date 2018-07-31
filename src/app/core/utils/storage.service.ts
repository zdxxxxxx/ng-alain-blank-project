/**
 * Created by zhengdongxiang on 2017/12/11.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    constructor() {}

    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || null;
        } catch (err) {
            console.warn('invalid key: ' + key, err);
            return null;
        }
    }

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }
}
