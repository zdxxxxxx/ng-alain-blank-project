import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'select-tag',
    templateUrl: './select-tag.component.html',
    styleUrls: ['./select-tag.component.less'],
})
export class SelectTagComponent implements OnInit {
    @Input('options') options = [];
    @Input('title') title = '未知';
    @Input('mode') mode = 'single';

    @Input('selected')
    set selected(val) {
        this._value = val;
    }

    get selected() {
        return this._value;
    }

    @Output() selectedChange = new EventEmitter();
    _value: any;

    constructor() {}

    ngOnInit() {
        this.initSelected();
    }

    initSelected() {
        const mode = this.mode;
        this.options.forEach(item => {
            item.checked = false;
        });
        if (mode === 'single') {
            this.options.forEach(item => {
                item.checked = item.value === this.selected;
            });
        } else {
            this.options.forEach(item => {
                item.checked = this.selected.includes(item.value);
            });
        }
    }

    handleCheck(option, bool) {
        const { value } = option;
        if (this.mode === 'single') {
            this.options.forEach(item => {
                item.checked = false;
                if (item.value === value) {
                    item.checked = bool;
                }
            });
        }
        this.options.forEach(item => {
            if (item.value === value) {
                item.checked = bool;
            }
        });
        const selected = this.options
            .filter(item => item.checked)
            .map(item => item.value);
        if (this.mode === 'single') {
            this._value = selected[0];
            this.selectedChange.emit(this._value);
        } else {
            this._value = selected;
            this.selectedChange.emit(this._value);
        }
    }
}
