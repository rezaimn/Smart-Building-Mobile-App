import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {SetCameraComponent} from "./set-camera.component";

@NgModule({
  declarations: [
    SetCameraComponent,
  ],
  imports: [
    IonicPageModule.forChild(SetCameraComponent),
    TranslateModule.forChild()
  ],
  exports: [
    SetCameraComponent
  ]
})
export class SetCameraComponentModule { }
