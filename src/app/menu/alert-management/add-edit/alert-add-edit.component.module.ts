import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {AlertAddEditComponent} from "./alert-add-edit.component";

@NgModule({
  declarations: [
    AlertAddEditComponent,
  ],
  imports: [
    IonicPageModule.forChild(AlertAddEditComponent),
    TranslateModule.forChild()
  ],
  exports: [
    AlertAddEditComponent
  ]
})
export class AlertAddEditComponentModule { }
