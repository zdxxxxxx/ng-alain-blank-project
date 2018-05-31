import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpService } from '@core/net/http.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styles: [],
})
export class WarehouseComponent implements OnInit {
    constructor(private api: ApiService) {}

    ngOnInit() {
        this.api.getTags().subscribe(data => {
            console.log(data);
        });
    }
}
