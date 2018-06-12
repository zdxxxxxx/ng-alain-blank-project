import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ApiService } from './api.service';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [CommonModule, ContentRoutingModule, SharedModule],
    providers: [ApiService],
    declarations: [WarehouseComponent],
})
export class ContentModule {}
