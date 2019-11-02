import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {LightingGridComponent} from "./lighting-grid.component";

@NgModule({
  declarations: [
    LightingGridComponent,
  ],
  imports: [
    IonicPageModule.forChild(LightingGridComponent),
    TranslateModule.forChild()
  ],
  exports: [
    LightingGridComponent
  ]
})
export class LightingGridComponentModule { }
