import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {DeviceEditComponent} from "./device-edit.component";

@NgModule({
  declarations: [
    DeviceEditComponent,
  ],
  imports: [
    IonicPageModule.forChild(DeviceEditComponent),
    TranslateModule.forChild()
  ],
  exports: [
    DeviceEditComponent
  ]
})
export class DeviceEditComponentModule { }
