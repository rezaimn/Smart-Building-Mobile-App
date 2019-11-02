import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {OrganizationStatsComponent} from "./organization-stats.component";

@NgModule({
  declarations: [
    OrganizationStatsComponent,
  ],
  imports: [
    IonicPageModule.forChild(OrganizationStatsComponent),
    TranslateModule.forChild()
  ],
  exports: [
    OrganizationStatsComponent
  ]
})
export class OrganizationStatsComponentModule { }
