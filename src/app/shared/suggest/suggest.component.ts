import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { filter } from 'rxjs/internal/operators';

interface ResStruct {
    name: string;
    value: string;
}

@Component({
    selector: 'app-suggest',
    templateUrl: './suggest.component.html',
    styleUrls: ['./suggest.component.less'],
})
export class SuggestComponent implements OnInit {
    @Input('width') width: number;
    @Input('searchOptions') searchOptions: any[];
    @Input('url') url: string;
    @Input('mode') mode: string;
    @Input('placeholder') placeholder: string;
    @Input('key') key: any;
    @Input('allowClear') allowClear = false;
    @Input('size') size = 'middle';
    @Input('resStruct')
    resStruct: ResStruct = {
        value: 'id',
        name: 'name',
    };

    @Input('value')
    set value(val) {
        this._value = val;
    }

    get value() {
        return this._value;
    }

    @Output() onChange = new EventEmitter<any>();
    @Output() valueChange = new EventEmitter();

    _value: any;
    input: any = '';
    loading = false;
    sub = new BehaviorSubject('');

    constructor(private http: HttpClient) {}

    change(val) {
        this._value = val;
        this.valueChange.emit(this._value);
    }

    ngOnInit() {
        this.sub.subscribe(res => {
            this.input = res;
        });
        const getMddList = (res: string) => {
            this.loading = true;
            return this.http
                .get(`${this.url}&${this.key}=${res}`)
                .pipe(map((data: any) => data.data));
        };

        const options = this.sub
            .asObservable()
            .pipe(filter(res => res !== ''))
            .pipe(debounceTime(300))
            .pipe(switchMap(getMddList));
        options.subscribe(data => {
            this.searchOptions = data.map(item => {
                return {
                    name: item[this.resStruct['name']],
                    value: item[this.resStruct['value']],
                };
            });
            this.loading = false;
        });
    }

    searchChange(searchText) {
        const query = encodeURI(searchText);
        this.sub.next(query);
    }
}
