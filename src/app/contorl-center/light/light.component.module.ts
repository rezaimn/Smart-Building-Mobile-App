import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {LightComponent} from "./light.component";

@NgModule({
  declarations: [
    LightComponent,
  ],
  imports: [
    IonicPageModule.forChild(LightComponent),
    TranslateModule.forChild()
  ],
  exports: [
    LightComponent
  ]
})
export class LightComponentModule { }
