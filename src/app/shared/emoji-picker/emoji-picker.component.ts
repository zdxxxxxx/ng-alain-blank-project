import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { emoji } from './emoji';

const KEY = '_COMMON_EMOJI';

@Component({
    selector: 'app-emoji-picker',
    templateUrl: './emoji-picker.component.html',
    styleUrls: ['./emoji-picker.component.less'],
})
export class EmojiPickerComponent implements OnInit {
    Emoji = emoji;
    _common_emoji = [];
    visible: boolean;
    @Input() openCommon = true;
    @Output() selected = new EventEmitter<any>();
    @Input() disabled = false;
    constructor() {}

    getCommonEmoji() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch (err) {
            console.warn('invalid key: ' + KEY, err);
            return null;
        }
    }

    setCommonEmoji(val) {
        localStorage.setItem(KEY, JSON.stringify(val));
    }

    prevent(e) {
        e.preventDefault();
    }

    ngOnInit() {
        if (this.openCommon) {
            this._common_emoji = this.getCommonEmoji();
        }
    }

    clear() {
        this.setCommonEmoji([]);
    }

    chooseEmoji(e) {
        this.selected.emit({ emoji: e });
        if (this.openCommon) {
            if (!this._common_emoji.includes(e)) {
                this._common_emoji.push(e);
                this.setCommonEmoji(this._common_emoji);
            }
        }
        this.visible = false;
    }
}
