/**
 * 通用服务
 */
import { Injectable } from '@angular/core';

@Injectable()
export class FixHeightService {
    private _windowHeight = window.innerHeight;
    private contentPaddingTop = 24;
    private contentPaddingBottom = 24;

    get height() {
        return this._windowHeight;
    }

    getCalculateHeight(h: number) {
        return (
            this._windowHeight -
            this.contentPaddingTop -
            this.contentPaddingBottom -
            h
        );
    }
}
