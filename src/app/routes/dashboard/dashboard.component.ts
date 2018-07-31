import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    ws: any = null;

    constructor(private http: _HttpClient) {}

    ngOnInit() {
        const stream$ = Observable.create(observer => {
            observer.next(1);
            observer.next(2);
            observer.error('err');
            observer.complete();
        });
        stream$.subscribe(
            data => {
                console.log('Data', data);
            },
            err => {
                console.log('Err', err);
            },
            data => {
                console.log('complete', data);
            },
        );
    }

    initWebSocket() {
        this.ws = new WebSocket('ws://localhost:8080/ws');
        this.ws.onopen = function(evt) {
            console.log(evt);
        };
        this.ws.onmessage = function(evt) {
            console.log(evt);
        };
        this.ws.onerror = function(evt) {
            console.log(evt);
        };
    }

    send() {
        if (!this.ws) {
            return false;
        }
        this.ws.send('123');
        return;
    }

    getTime() {
        let a = 0;
        for (let i = 0; i < 10000; i++) {
            a++;
        }
        return a;
    }
}
