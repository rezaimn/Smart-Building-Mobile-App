import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {ParkingStatusComponent} from "./parking-status.component";

@NgModule({
  declarations: [
    ParkingStatusComponent,
  ],
  imports: [
    IonicPageModule.forChild(ParkingStatusComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ParkingStatusComponent
  ]
})
export class ParkingStatusComponentModule { }
