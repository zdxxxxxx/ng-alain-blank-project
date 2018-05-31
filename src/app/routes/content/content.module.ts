import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ApiService } from './api.service';

@NgModule({
    imports: [CommonModule, ContentRoutingModule],
    providers: [ApiService],
    declarations: [WarehouseComponent],
})
export class ContentModule {}
