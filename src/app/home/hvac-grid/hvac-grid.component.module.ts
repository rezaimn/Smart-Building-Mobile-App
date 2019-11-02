import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {HvacGridComponent} from "./hvac-grid.component";

@NgModule({
  declarations: [
    HvacGridComponent,
  ],
  imports: [
    IonicPageModule.forChild(HvacGridComponent),
    TranslateModule.forChild()
  ],
  exports: [
    HvacGridComponent
  ]
})
export class HvacGridComponentModule { }
