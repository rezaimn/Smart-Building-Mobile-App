import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {HvacModeComponent} from "./mode.component";


@NgModule({
  declarations: [
    HvacModeComponent,
  ],
  imports: [
    IonicPageModule.forChild(HvacModeComponent),
    TranslateModule.forChild()
  ],
  exports: [
    HvacModeComponent
  ]
})
export class ModeComponentModule { }
