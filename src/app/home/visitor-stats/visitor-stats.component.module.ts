import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {VisitorStatsComponent} from "./visitor-stats.component";

@NgModule({
  declarations: [
    VisitorStatsComponent,
  ],
  imports: [
    IonicPageModule.forChild(VisitorStatsComponent),
    TranslateModule.forChild()
  ],
  exports: [
    VisitorStatsComponent
  ]
})
export class VisitorStatsComponentModule { }
