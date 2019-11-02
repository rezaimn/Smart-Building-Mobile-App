import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {ApplianceGridComponent} from "./appliance-grid.component";

@NgModule({
  declarations: [
    ApplianceGridComponent,
  ],
  imports: [
    IonicPageModule.forChild(ApplianceGridComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ApplianceGridComponent
  ]
})
export class ApplianceGridComponentModule { }
