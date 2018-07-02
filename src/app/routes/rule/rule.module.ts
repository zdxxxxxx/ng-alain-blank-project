import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RuleRoutingModule } from './rule-routing.module';
import { RecallComponent } from './recall/recall.component';
import { SharedModule } from '@shared/shared.module';
import { ApiService } from './api.service';
import { IntentComponent } from './intent/intent.component';
import { HabitatComponent } from './habitat/habitat.component';

@NgModule({
    imports: [CommonModule, RuleRoutingModule, SharedModule],
    providers: [ApiService],
    declarations: [RecallComponent, IntentComponent, HabitatComponent],
})
export class RuleModule {}
