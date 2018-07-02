import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecallComponent } from './recall/recall.component';
import { HabitatComponent } from './habitat/habitat.component';
import { IntentComponent } from './intent/intent.component';

const routes: Routes = [
    {
        path: 'recall',
        component: RecallComponent,
    },
    {
        path: 'habitat',
        component: HabitatComponent,
    },
    {
        path: 'intent',
        component: IntentComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RuleRoutingModule {}
