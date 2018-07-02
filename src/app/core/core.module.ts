import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { HttpService } from '@core/net/http.service';
import { CommonUtilsService } from '@core/utils/common-utils.service';
import { FixHeightService } from '@core/utils/fix-height.service';

@NgModule({
    providers: [HttpService, CommonUtilsService, FixHeightService],
})
export class CoreModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: CoreModule,
    ) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
