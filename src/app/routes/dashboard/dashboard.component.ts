import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    ws: any = null;

    constructor(private http: _HttpClient) {}

    ngOnInit() {
        this.initWebSocket();
    }

    initWebSocket() {
        this.ws = new WebSocket('ws://127.0.0.1:8080/echo');
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
