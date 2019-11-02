import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {SafetyStatusComponent} from "./safety-status.component";

@NgModule({
  declarations: [
    SafetyStatusComponent,
  ],
  imports: [
    IonicPageModule.forChild(SafetyStatusComponent),
    TranslateModule.forChild()
  ],
  exports: [
    SafetyStatusComponent
  ]
})
export class SafetyStatusComponentModule { }
