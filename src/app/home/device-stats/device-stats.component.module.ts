import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {DeviceStatsComponent} from "./device-stats.component";

@NgModule({
  declarations: [
    DeviceStatsComponent  ],
  imports: [
    IonicPageModule.forChild(DeviceStatsComponent),
    TranslateModule.forChild()
  ],
  exports: [
    DeviceStatsComponent
  ]
})
export class DeviceStatsComponentModule { }
