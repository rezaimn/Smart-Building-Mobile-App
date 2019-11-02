import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {SubsidiaryComponent} from "./subsidiary.component";

@NgModule({
  declarations: [
    SubsidiaryComponent,
  ],
  imports: [
    IonicPageModule.forChild(SubsidiaryComponent),
    TranslateModule.forChild()
  ],
  exports: [
    SubsidiaryComponent
  ]
})
export class SubsidiaryComponentModule { }
