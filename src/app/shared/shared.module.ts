import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';

// region: third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { SuggestComponent } from '@shared/suggest/suggest.component';
import { DevicePreviewComponent } from '@shared/device-preview/device-preview.component';
import { EmojiPickerComponent } from '@shared/emoji-picker/emoji-picker.component';
import { PIPES } from './pipes/index';
import { CustomFileUploadComponent } from '@shared/custom-file-upload/custom-file-upload.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SelectTagComponent } from '@shared/select-tag/select-tag.component';
import { FixHeightDirective } from '@shared/fix-height/fix-height.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CanvasFireworkDirective } from '@shared/canvas-firework/canvas-firework.directive';

const THIRDMODULES = [
    NgZorroAntdModule,
    CountdownModule,
    FileUploadModule,
    InfiniteScrollModule,
];
// endregion

// region: your componets & directives
const COMPONENTS = [
    SuggestComponent,
    DevicePreviewComponent,
    EmojiPickerComponent,
    CustomFileUploadComponent,
    SelectTagComponent,
];
const DIRECTIVES = [FixHeightDirective, CanvasFireworkDirective];

// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AlainThemeModule.forChild(),
        DelonABCModule,
        DelonACLModule,
        DelonFormModule,

        // third libs
        ...THIRDMODULES,
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AlainThemeModule,
        DelonABCModule,
        DelonACLModule,
        DelonFormModule,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
    ],
})
export class SharedModule {}
