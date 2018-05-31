import { Component, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';

@Component({
    selector: 'header-fullscreen',
    template: `
        <div class="item">
            <i class="anticon anticon-{{status ? 'shrink' : 'arrows-alt'}}"></i>
        </div>
    `,
})
export class HeaderFullScreenComponent {
    status = false;

    @HostListener('window:resize')
    _resize() {
        this.status = screenfull.isFullscreen;
    }

    @HostListener('click')
    _click() {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }
}
