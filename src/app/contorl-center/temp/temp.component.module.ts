import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {TempComponent} from "./temp.component";

@NgModule({
  declarations: [
    TempComponent,
  ],
  imports: [
    IonicPageModule.forChild(TempComponent),
    TranslateModule.forChild()
  ],
  exports: [
    TempComponent
  ]
})
export class TempComponentModule { }
