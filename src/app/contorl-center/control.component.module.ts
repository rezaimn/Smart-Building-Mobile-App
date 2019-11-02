import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {ControlComponent} from "./control.component";

@NgModule({
  declarations: [
    ControlComponent,
  ],
  imports: [
    IonicPageModule.forChild(ControlComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ControlComponent
  ]
})
export class ControlComponentModule { }
