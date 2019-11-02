import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {PlugComponent} from "./plug.component";

@NgModule({
  declarations: [
    PlugComponent,
  ],
  imports: [
    IonicPageModule.forChild(PlugComponent),
    TranslateModule.forChild()
  ],
  exports: [
    PlugComponent
  ]
})
export class PlugComponentModule { }
