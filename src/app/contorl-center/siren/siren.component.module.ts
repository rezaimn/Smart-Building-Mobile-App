import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {SirenComponent} from "./siren.component";

@NgModule({
  declarations: [
    SirenComponent,
  ],
  imports: [
    IonicPageModule.forChild(SirenComponent),
    TranslateModule.forChild()
  ],
  exports: [
    SirenComponent
  ]
})
export class SirenComponentModule { }
