import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {VisitorEditComponent} from "./visitor-edit.component";

@NgModule({
  declarations: [
    VisitorEditComponent,
  ],
  imports: [
    IonicPageModule.forChild(VisitorEditComponent),
    TranslateModule.forChild()
  ],
  exports: [
    VisitorEditComponent
  ]
})
export class VisitorEditComponentModule { }
