import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {AlertManagementComponent} from "./alert-management.component";

@NgModule({
  declarations: [
    AlertManagementComponent,
  ],
  imports: [
    IonicPageModule.forChild(AlertManagementComponent),
    TranslateModule.forChild()
  ],
  exports: [
    AlertManagementComponent
  ]
})
export class AlertManagementComponentModule { }
