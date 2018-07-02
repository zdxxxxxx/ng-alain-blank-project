import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpService } from '@core/net/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import * as fns from 'date-fns';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc';
import { CommonUtilsService } from '@core/utils/common-utils.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.less'],
})
export class WarehouseComponent implements OnInit {
    @ViewChild('main') dataBodyEl: ElementRef;
    validateForm: FormGroup;
    submitLoading = false;
    actionModalVisible = false;
    data: any = [];
    loading = false;
    total = 0;
    pageOption: any = {
        offset: 0,
        count: 20,
        curPage: 1,
    };
    usageTypes = [
        {
            value: 'intent',
            name: '意向目的地课程',
        },
        {
            value: 'habitat',
            name: '常住地课程',
        },
        {
            value: 'recall',
            name: '沉默用户',
        },
    ];
    q: any = {
        key: 'content',
        value: '',
        mdd: null,
        contentType: null,
        status: null,
        courseType: null,
    };
    searchType = [
        {
            name: '标题',
            value: 'title',
        },
        {
            name: '内容',
            value: 'content',
        },
        {
            name: 'ID',
            value: 'id',
        },
        {
            name: '落地页',
            value: 'url',
        },
    ];
    keyMap = {
        contentType: '内容类型',
        status: '状态',
        mdd: '目的地',
        courseType: '课程类型',
    };
    contentTypeOptions: any = [];
    statusOptions: any = [
        {
            name: '新弹药',
            value: 1,
            checked: false,
        },
        {
            name: '审核通过',
            value: 0,
            checked: false,
        },
        {
            name: '审核未通过',
            value: 2,
            checked: false,
        },
    ];
    mddOptions: any = [];
    expend: any = true;
    filterView = {
        mdd: [],
        contentType: [],
        courseType: [
            {
                name: '旅行中',
                value: 1,
                checked: false,
            },
            {
                name: '出发前',
                value: 2,
                checked: false,
            },
            {
                name: 'poi浏览触发',
                value: 7,
                checked: false,
            },
            {
                name: '酒店浏览触发',
                value: 8,
                checked: false,
            },
            {
                name: '机票预订',
                value: 3,
                checked: false,
            },
            {
                name: '新用户课程',
                value: 4,
                checked: false,
            },
            {
                name: '沉默用户',
                value: 'recall',
                checked: false,
            },
            {
                name: '意向目的地',
                value: 'intent',
                checked: false,
            },
        ],
        status: [
            {
                name: '全部',
                value: -1,
                checked: false,
            },
            {
                name: '新弹药',
                value: 1,
                checked: false,
            },
            {
                name: '审核通过',
                value: 0,
                checked: false,
            },
            {
                name: '审核未通过',
                value: 2,
                checked: false,
            },
        ],
    };
    pageHeaderHeight = 0;
    contentHeight;
    modalType = 'A'; // A:添加 M:修改
    searchOptions: any = [];
    type: any = {
        1: '行前',
        2: '行中',
    };
    initSuggestOptions = [];
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
        private location: Location,
        private router: Router,
        private http: HttpService,
    ) {}

    ngOnInit() {
        this.initForm();
        this.api.getTags().subscribe(
            data => {
                this.contentTypeOptions = data[0].options;
                this.filterView.contentType = data[0].options.map(item => {
                    return {
                        name: item.description,
                        value: item.key,
                        checked: false,
                    };
                });
                this.getData();
            },
            err => {
                console.log('error', err);
            },
        );
    }

    getData() {
        const params = this.getSearchParams();
        this.loading = true;
        this.api.getMessages(params).subscribe(
            data => {
                this.data = data.list;
                this.total = data.total;
            },
            () => {},
            () => {
                this.loading = false;
            },
        );
    }

    getSearchParams() {
        const { key, value, mdd, status, contentType, courseType } = this.q;
        return {
            [key]: value,
            mdds: mdd ? mdd.map(item => item.value).join(',') : '',
            status: status ? status[0].value : -1,
            contentType: contentType
                ? contentType.map(item => item.value).join(',')
                : '',
            courseType: courseType
                ? courseType.map(item => item.value).join(',')
                : '',
            ...this.pageOption,
        };
    }

    changeStatus(item, status) {
        const params = { id: item.id, status };
        this.api.changeStatus(params).subscribe(
            data => {
                this.cm.success('审核成功！');
            },
            () => {},
        );
    }

    getKeys() {
        const arr = [];
        if (this.filterView.mdd.length) {
            arr.push('mdd');
        }
        if (this.filterView.contentType.filter(item => item.checked).length) {
            arr.push('contentType');
        }
        if (this.filterView.status.filter(item => item.checked).length) {
            arr.push('status');
        }
        if (this.filterView.courseType.filter(item => item.checked).length) {
            arr.push('courseType');
        }
        return arr;
    }

    initForm(msg?: any, page?: any) {
        if (!msg) {
            this.validateForm = this.fb.group({
                id: [],
                msg_title: [null, []], // 消息标题
                msg_content: [null, []], // 消息内容
                url: [null, [Validators.required]], // 消息url
                att_file: ['', []], //消息图片
                mdd_select: [null, []],
                content_type: [null, []],
                usage_type: [null, []],
                has_time_range: [false, []],
                start: [fns.startOfDay(new Date())],
                end: [fns.endOfDay(fns.addMonths(new Date(), 6))],
            });
        } else {
            const formData = this.buildFormData(msg, page);
            const {
                mdd_select,
                msg_title,
                msg_content,
                url,
                att_file,
                content_type,
                id,
                usage_type = [],
                valid_start_time = 0,
                valid_end_time = 0,
            } = formData;
            this.validateForm = this.fb.group({
                id: [id],
                msg_title: [msg_title, []], // 消息标题
                msg_content: [msg_content, []], // 消息内容
                url: [url, []], // 消息url
                att_file: [att_file, []], //消息图片
                mdd_select: [mdd_select, []],
                content_type: [content_type, []],
                usage_type: [usage_type, []],
                has_time_range: [+valid_start_time !== 0, []],
                start: [
                    +valid_start_time === 0
                        ? fns.startOfDay(new Date())
                        : new Date(+valid_start_time * 1000),
                ],
                end: [
                    +valid_end_time === 0
                        ? fns.endOfDay(fns.addMonths(new Date(), 6))
                        : new Date(+valid_end_time * 1000),
                ],
            });
        }
    }

    buildFormData(data, page) {
        const obj = {
            content_type: page.content_type,
            url: page.url,
            mdd_id: page.mdd_id,
            mdd_name: page.mdd_name,
        };
        const formData = {
            ...data,
            ...obj,
        };
        const mdd = {
            id: obj.mdd_id,
            name: obj.mdd_name,
        };
        this.searchOptions = [];
        if (obj.mdd_id) {
            this.searchOptions.push(mdd);
        }
        formData.mdd_select = obj.mdd_id ? mdd : null;
        return { ...formData };
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    formatTag(content_type) {
        return this.contentTypeOptions.filter(
            item => item.key === content_type,
        )[0];
    }

    buildUrl(str) {
        return CommonUtilsService.buildUrl(str);
    }

    selectEmoji(e) {
        this.validateForm.patchValue({
            msg_content:
                this.getFormControl('msg_content').value + e.emoji.emoji,
        });
    }

    selectChange(item, key) {
        this.filterView[key] = item.map(i => {
            return {
                name: i.name,
                value: i.value,
                checked: true,
            };
        });
    }

    handleCheck(item, key, val) {
        if (key === 'status') {
            this.filterView.status.forEach(i => {
                i.checked = false;
            });
        }
        item.checked = val;
        const query_arr = this.filterView[key].filter(i => i.checked);
        this.q[key] = query_arr.length ? query_arr : null;
    }

    search() {
        this.pageOption.curPage = 1;
        this.pageOption.offset = 0;
        this.getData();
    }

    clearQuery() {
        this.q = Object.assign({}, this.q, {
            mdd: null,
            contentType: null,
            status: null,
        });
        this.filterView.mdd = [];
        this.filterView.contentType.forEach(i => {
            i.checked = false;
        });
        this.filterView.status.forEach(i => {
            i.checked = false;
        });
        this.filterView.courseType.forEach(i => {
            i.checked = false;
        });
    }

    expendFilter() {
        this.expend = !this.expend;
    }

    onClose(val, key) {
        switch (key) {
            case 'mdd':
                this.q.mdd = null;
                this.filterView.mdd = [];
                break;
            case 'contentType':
                this.q.contentType = null;
                this.filterView.contentType.forEach(
                    item => (item.checked = false),
                );
                break;
            case 'status':
                this.q.status = null;
                this.filterView.status.forEach(item => (item.checked = false));
                break;
            case 'courseType':
                this.q.courseType = null;
                this.filterView.courseType.forEach(
                    item => (item.checked = false),
                );
                break;
        }
    }

    showActionModal(type, msg?, page?) {
        this.modalType = type;
        this.initForm(msg, page);
        this.actionModalVisible = true;
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
                    this.cm.create('success', '新增成功！');
                    this.getData();
                },
                err => {
                    console.log(err);
                },
                () => {
                    this.submitLoading = false;
                },
            );
        } else {
            this.api.updateMessage(postData).subscribe(
                data => {
                    this.handleCancel();
                    this.cm.create('success', '修改成功！');
                    this.getData();
                },
                err => {
                    console.log(err);
                },
                () => {
                    this.submitLoading = false;
                },
            );
        }
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
            mdd_select,
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
            mdd: mdd_select ? mdd_select.id : '',
            usage_type,
            ...time_range,
        };
        return postData;
    }

    getClass(item) {
        const { status } = item;
        if (status === 0) {
            return 'data-item-success';
        }
        if (status === 2) {
            return 'data-item-fail';
        }
    }

    // suggest
    fetchMdd(val) {
        if (!val) return;
        this.http
            .get(`/mdd-api/search/suggest?limit=3&name=${val}`)
            .subscribe((data: any) => {
                this.searchOptions = data;
            });
    }

    pageChange() {
        this.dataBodyEl.nativeElement.scrollTop = 0;
        this.pageOption.offset =
            (this.pageOption.curPage - 1) * this.pageOption.count;
        this.getData();
    }
}
