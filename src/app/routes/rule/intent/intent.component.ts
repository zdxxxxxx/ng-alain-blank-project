import { Component, OnInit } from '@angular/core';
import { FixHeightService } from '@core/utils/fix-height.service';
import { ApiService } from '../api.service';
import { isObject } from 'util';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from '@core/net/http.service';
import * as fns from 'date-fns';
import { CommonUtilsService } from '@core/utils/common-utils.service';
import { DataService } from '@core/utils/data.service';

@Component({
    selector: 'app-intent',
    templateUrl: './intent.component.html',
    styleUrls: ['./intent.component.less'],
})
export class IntentComponent implements OnInit {
    validateForm: FormGroup;
    q: any = {
        mdd_id: '',
    };
    submitLoading = false;
    actionModalVisible = false;
    loading = false;
    modalType = 'A'; // A:添加 M:修改
    searchOptions: any = [];
    contentTypeOptions: any = [];
    data: any = [];
    cache: any = [];
    options: any = [];
    options_cache: any = [];
    current_option: any = {};
    current_mdd = '';
    bodyHeight = 0;
    contentTypes = [
        {
            name: '攻略',
            value: 'gonglve',
        },
        {
            name: '问答',
            value: 'wenda',
        },
        {
            name: '游记',
            value: 'note',
        },
    ];
    selected = [];
    loadingMdd = false;

    constructor(
        private api: ApiService,
        private fb: FormBuilder,
        private cm: NzMessageService,
        private http: HttpService,
        private router: Router,
        private height: FixHeightService,
        private staticData: DataService,
    ) {}

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

    ngOnInit() {
        this.initForm();
        this.bodyHeight = this.height.getCalculateHeight(100);
        this.contentTypeOptions = this.staticData.getStaticData(
            'CONTENT_TYPES',
        );
        this.loadingMdd = true;
        this.api.getIntentMddList().subscribe(
            data => {
                const mdd_list = this.convertOption(data);
                this.options = mdd_list;
                this.options_cache = mdd_list;
                if (mdd_list.length) {
                    this.selectOption(this.options[0], this.options);
                }
            },
            () => {},
            () => {
                this.loadingMdd = false;
            },
        );
    }

    selectedChange() {
        this.filterData();
    }

    filterData() {
        if (this.selected.length === 0) {
            this.data = this.cache;
        } else {
            this.data = this.cache.filter(item => {
                return this.selected.includes(item.content_type);
            });
        }
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
        this.api
            .indentOrder(postIds.join(','), this.current_option.id)
            .subscribe(data => {
                this.cm.success(`${isTop ? '置顶' : '取消置顶'}成功！`);
                this.getData();
            });
    }

    filterMdd(val) {
        if (!val) {
            this.options = this.options_cache;
        } else {
            this.options = this.options_cache.filter(item => {
                return item.name && item.name.includes(val);
            });
        }
    }

    setItemActive(item, data) {
        this.options_cache.map(i => {
            i.active = false;
        });
        data.map(i => {
            i.active = false;
        });
        item.active = true;
    }

    setItemLoading(item, data) {
        data.map(i => {
            i.loading = false;
        });
        item.loading = true;
    }

    selectOption(op, list) {
        if (this.loading) return;
        this.loading = true;
        this.setItemActive(op, list);
        this.setItemLoading(op, list);
        this.q.mdd_id = op.id;
        this.q.value = '';
        this.current_option = op;
        const params = this.getSearchParams();
        this.api.getIntentMessageList(params).subscribe(
            data => {
                this.loading = false;
                const convertData = this.convertData(data);
                this.cache = convertData;
                this.data = convertData;
                this.filterData();
            },
            () => {},
            () => {
                op.loading = false;
                this.loading = false;
            },
        );
    }

    handleActionOk() {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
        }
        if (this.validateForm.invalid) return;
        const postData = this.buildPostData();
        this.submitLoading = true;

        if (this.modalType === 'A') {
            this.api.addIntentMessage(postData).subscribe(
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

    showActionModal(type, action) {
        this.modalType = type;
        this.initForm(action);
        this.actionModalVisible = true;
    }

    initForm(data?: any) {
        if (!data) {
            let mdd_select = null;
            this.searchOptions = [];
            if (this.current_option.id && this.current_option.id !== 0) {
                mdd_select = {
                    id: this.current_option.id,
                    name: this.current_option.name,
                };
                this.searchOptions.push(mdd_select);
            }
            this.validateForm = this.fb.group({
                id: [],
                msg_title: ['', []], // 消息标题
                msg_content: ['', []], // 消息内容
                url: ['', []], // 消息url
                att_file: ['', []], //消息图片
                mdd_select: [mdd_select, []],
                content_type: [null, []],
                usage_type: [['intent']],
                has_time_range: [false, []],
                start: [fns.startOfDay(new Date()), []],
                end: [fns.endOfDay(fns.addMonths(new Date(), 6)), []],
            });
        } else {
            const formData = this.buildFormData(data);
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
            mdd: mdd_select.id,
            usage_type: usage_type.length ? usage_type : ['intent'],
            ...time_range,
        };
        return postData;
    }

    buildFormData(data) {
        const formData = {
            ...data,
        };
        const mdd = {
            id: this.current_option.id,
            name: this.current_option.name,
        };
        this.searchOptions = [];
        if (this.current_option.id) {
            this.searchOptions.push(mdd);
        }
        formData.mdd_select = data.mdd_id ? mdd : null;
        return { ...formData };
    }

    getData() {
        const params = this.getSearchParams();
        this.loading = true;
        this.api.getIntentMessageList(params).subscribe(
            data => {
                this.loading = false;
                const convertData = this.convertData(data);
                this.cache = convertData;
                this.data = convertData;
                this.filterData();
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

    convertOption(data) {
        return data.map(item => {
            item.loading = false;
            item.active = false;
            if (item.id === 0) {
                item.icon = 'anticon-api';
            } else {
                item.icon = 'anticon-environment';
            }
            return item;
        });
    }

    deleteMessage(id, mdd_id) {
        const params = { id, mdd_id: mdd_id ? this.current_option.id : mdd_id };
        this.api.deleteIntentMessage(params).subscribe(data => {
            this.cm.success('移除成功！');
            this.getData();
        });
    }

    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    getSearchParams() {
        const { mdd_id } = this.q;
        return {
            mdd_id,
        };
    }

    formatTag(content_type) {
        return this.contentTypeOptions.filter(
            item => item.key === content_type,
        )[0];
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

    // suggest
    fetchMdd(val) {
        if (!val) return;
        this.http
            .get(`/mdd-api/search/suggest?limit=3&name=${val}`)
            .subscribe((data: any) => {
                const code = data.code;
                const list = data.data;
                if (code === 0) {
                    this.searchOptions = list;
                }
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
