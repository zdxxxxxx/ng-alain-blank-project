import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'device-preview',
    templateUrl: './device-preview.component.html',
    styleUrls: ['./device-preview.component.less'],
})
export class DevicePreviewComponent implements OnInit, AfterViewInit {
    @Input() data: any = {};
    @Input() showToolBar = true;
    @Input() part = false;
    @Input() app = '马蜂窝旅游';
    @Input() icon = './assets/logo_gonglve_v6.png';
    @ViewChild('imgContent') img: ElementRef;
    device = 'iphone7'; // part 只显示局部
    deviceOptions = [
        { value: 'iphone7', label: 'iphone7' },
        { value: 'iphone7-plus', label: 'iphone7-plus' },
    ];

    constructor() {}

    ngOnInit() {
        if (this.part) {
            this.showToolBar = false;
            this.device = 'part';
        }
    }

    ngAfterViewInit(): void {
        this.img.nativeElement.onload = () => {};
    }
}
