import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {CameraComponent} from "./camera.component";

@NgModule({
  declarations: [
    CameraComponent,
  ],
  imports: [
    IonicPageModule.forChild(CameraComponent),
    TranslateModule.forChild()
  ],
  exports: [
    CameraComponent
  ]
})
export class CameraComponentModule { }
