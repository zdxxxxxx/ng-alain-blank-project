import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
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
}
