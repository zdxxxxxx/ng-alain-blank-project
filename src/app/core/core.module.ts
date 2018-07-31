import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { HttpService } from '@core/net/http.service';
import { CommonUtilsService } from '@core/utils/common-utils.service';
import { StorageService } from '@core/utils/storage.service';

@NgModule({
    providers: [HttpService, CommonUtilsService, StorageService],
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
