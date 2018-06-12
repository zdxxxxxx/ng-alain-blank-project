import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
    selector: 'app-custom-file-upload',
    templateUrl: './custom-file-upload.component.html',
    styleUrls: ['./custom-file-upload.less'],
})
export class CustomFileUploadComponent implements OnInit, AfterViewInit {
    _url = '';
    loading = false;
    @Input() mTitle = '上传';
    @ViewChild('fileInput') fileInput: ElementRef;
    @Input() disabled = false;

    @Input()
    set url(value: string) {
        this._url = value;
        this.uploader.setOptions({ url: value });
    }

    get url() {
        return this._url;
    }

    @Input() accept: any = '*';
    @Output() uploaded = new EventEmitter<any>();
    uploader: FileUploader = new FileUploader({
        isHTML5: true,
    });
    file = null;

    constructor() {}

    ngOnInit() {}

    ngAfterViewInit(): void {
        if (this._url === '') {
            console.warn('You do not define a path for upload!');
        } else {
            this.uploader.onAfterAddingFile = f => {
                this.loading = true;
                this.file = f;
                this.file.onSuccess = (response, status) => {
                    if (status === 200) {
                        this.loading = false;
                        this.uploaded.emit({
                            status: 'success',
                            data: JSON.parse(response),
                        });
                    } else {
                        this.loading = false;
                        let body = {};
                        try {
                            body = JSON.parse(response);
                        } catch (err) {
                            body = {};
                        }
                        this.uploaded.emit({
                            status: 'error',
                            data: Object.assign(body, { msg: '上传失败！' }),
                        });
                    }
                };
                this.file.onError = (response, status) => {
                    this.loading = false;
                    this.uploaded.emit({
                        status: 'error',
                        data: { msg: '上传失败！' },
                    });
                };
                this.file.upload();
                this.fileInput.nativeElement.value = '';
            };
        }
    }
}
