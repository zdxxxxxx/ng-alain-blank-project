import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '@core/net/http.service';
import { Router } from '@angular/router';
import * as fns from 'date-fns';
import { ApiService } from '../api.service';
import { NzMessageService } from 'ng-zorro-antd';
import { CommonUtilsService } from '@core/utils/common-utils.service';
import { DataService } from '@core/utils/data.service';

@Component({
    selector: 'app-recall',
    templateUrl: './recall.component.html',
    styles: [],
})
export class RecallComponent implements OnInit {
    validateForm: FormGroup;
    submitLoading = false;
    actionModalVisible = false;
    loading = false;
    modalType = 'A'; // A:添加 M:修改
    searchOptions: any = [];
    contentTypeOptions: any = [];
    data: any = [];
    q: any = {};
    orderModalVisible = false;

    disabledStartDate = startValue => {
        if (!startValue || !this.validateForm.value.end) {
            return false;
        }
        return (
            fns.startOfDay(startValue).getTime() >=
            fns.endOfDay(this.validateForm.value.end).getTime()
        );
    };

    disabledEndDate = endValue => {
        if (!endValue || !this.validateForm.value.start) {
            return false;
        }
        return (
            fns.endOfDay(endValue).getTime() <=
            fns.startOfDay(this.validateForm.value.start).getTime()
        );
    };

    constructor(
        private api: ApiService,
        private fb: FormBuilder,
        private cm: NzMessageService,
        private http: HttpService,
        private router: Router,
        private staticData: DataService,
    ) {}

    ngOnInit() {
        this.initForm();
        this.contentTypeOptions = this.staticData.getStaticData(
            'CONTENT_TYPES',
        );
        this.getData();
    }

    popToFirst(id, isTop) {
        let postIds = [];
        if (!isTop) {
            postIds = this.data
                .filter(item => item.top === 1 && item.id !== id)
                .map(item => item.id);
        } else {
            postIds = [id].concat(
                this.data
                    .filter(item => item.top === 1 && item.id !== id)
                    .map(item => item.id),
            );
        }
        this.api.changeOrder(postIds.join(',')).subscribe(
            data => {
                this.cm.success('置顶成功！');
                this.getData();
            },
            () => {},
        );
    }

    initForm(data?: any) {
        if (!data) {
            this.validateForm = this.fb.group({
                id: [],
                msg_title: ['', []], // 消息标题
                msg_content: ['', []], // 消息内容
                url: ['', []], // 消息url
                att_file: ['', []], //消息图片
                content_type: [null, []],
                usage_type: [['recall'], []],
                has_time_range: [false, []],
                start: [fns.startOfDay(new Date()), []],
                end: [fns.endOfDay(fns.addMonths(new Date(), 6)), []],
            });
        } else {
            const formData = this.buildFormData(data);
            const {
                msg_title,
                msg_content,
                url,
                att_file,
                content_type,
                id,
                usage_type = ['recall'],
                valid_start_time = 0,
                valid_end_time = 0,
            } = formData;
            this.validateForm = this.fb.group({
                id: [id],
                msg_title: [msg_title, []], // 消息标题
                msg_content: [msg_content, []], // 消息内容
                url: [url, []], // 消息url
                att_file: [att_file, []], //消息图片
                content_type: [content_type, []],
                usage_type: [usage_type, []],
                has_time_range: [+valid_start_time !== 0, []],
                start: [
                    +valid_start_time === 0
                        ? fns.startOfDay(new Date())
                        : new Date(+valid_start_time * 1000),
                    [],
                ],
                end: [
                    +valid_end_time === 0
                        ? fns.endOfDay(fns.addMonths(new Date(), 6))
                        : new Date(+valid_end_time * 1000),
                    [],
                ],
            });
        }
    }

    showActionModal(type, action) {
        this.modalType = type;
        this.initForm(action);
        this.actionModalVisible = true;
    }

    handleCancel() {
        this.actionModalVisible = false;
    }

    buildPostData() {
        const value = this.validateForm.value;
        const {
            id,
            msg_title,
            msg_content,
            url,
            att_file,
            content_type,
            usage_type,
            has_time_range,
            start,
            end,
        } = value;
        const time_range = {
            valid_start_time: has_time_range
                ? fns.format(fns.startOfDay(start), 'X')
                : 0,
            valid_end_time: has_time_range
                ? fns.format(fns.endOfDay(end), 'X')
                : 0,
        };
        const postData: any = {
            id,
            msg_title,
            msg_content,
            url,
            att_file,
            content_type,
            usage_type,
            ...time_range,
        };
        return postData;
    }

    buildFormData(data) {
        const formData = {
            ...data,
        };
        return { ...formData };
    }

    handleActionOk() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
        }
        if (this.validateForm.invalid) return;
        const postData = this.buildPostData();
        this.submitLoading = true;

        if (this.modalType === 'A') {
            this.api.addMessage(postData).subscribe(
                data => {
                    this.handleCancel();
                    this.cm.success('新增成功！');
                    this.getData();
                },
                err => {},
                () => {
                    this.submitLoading = false;
                },
            );
        } else {
            this.api.updateMessage(postData).subscribe(
                data => {
                    this.handleCancel();
                    this.cm.success('修改成功！');
                    this.getData();
                },
                err => {},
                () => {
                    this.submitLoading = false;
                },
            );
        }
    }

    deleteMessage(item) {
        this.initForm(item);
        const postData = this.buildPostData();
        postData.usage_type = postData.usage_type.filter(u => u !== 'recall');
        this.api.updateMessage(postData).subscribe(data => {
            this.cm.success('移除成功！');
            this.getData();
        });
    }

    getData() {
        const params = this.getSearchParams();
        this.loading = true;
        this.api.getRecallList(params).subscribe(
            data => {
                this.data = this.convertData(data);
            },
            err => {},
            () => {
                this.loading = false;
            },
        );
    }

    convertData(data) {
        return data.map(item => {
            item.stat_url = this.buildStatUrl(item);
            item.content_type_name = this.formatTag(
                item.content_type,
            ).description;
            return item;
        });
    }

    getSearchParams() {
        const {} = this.q;
        return {};
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    formatTag(content_type) {
        return this.contentTypeOptions.filter(
            item => item.key === content_type,
        )[0];
    }

    getKeys(obj: {}) {
        obj = obj ? obj : {};
        return Object.keys(obj);
    }

    // 文件上传
    uploadComplete(e, key) {
        if (e.status === 'success') {
            this.validateForm.patchValue({
                [key]: e.data.file.file,
            });
        }
    }

    selectEmoji(e) {
        this.validateForm.patchValue({
            msg_content:
                this.getFormControl('msg_content').value + e.emoji.emoji,
        });
    }

    buildStatUrl(item) {
        const params = {
            course_id: item.id,
            lesson_type: 'mdd_course_selected',
            group_by: 'date',
            start: fns.format(fns.startOfDay(fns.subDays(new Date(), 6)), 'X'),
            end: fns.format(fns.endOfDay(new Date()), 'X'),
        };
        const url = `/push-web/statistics/data-view`;
        return CommonUtilsService.createUrl(url, params);
    }
}
