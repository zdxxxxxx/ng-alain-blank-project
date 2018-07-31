import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appFixHeight]',
})
export class FixHeightDirective {
    @Input('top') top = 0;
    resize = () => {
        this.renderer2.setStyle(
            this.er.nativeElement,
            'height',
            this.getCalculateHeight(this.top),
        );
    };

    constructor(private er: ElementRef, private renderer2: Renderer2) {}

    ngOnInit() {
        this.bindEvent();
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.resize);
    }

    ngAfterViewInit() {
        this.renderer2.setStyle(
            this.er.nativeElement,
            'height',
            this.getCalculateHeight(this.top),
        );
    }

    getCalculateHeight(h: number) {
        return window.innerHeight - h + 'px';
    }

    bindEvent() {
        window.addEventListener('resize', this.resize);
    }
}
