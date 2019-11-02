import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {ConfigComponent} from "./config.component";

@NgModule({
  declarations: [
    ConfigComponent,
  ],
  imports: [
    IonicPageModule.forChild(ConfigComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ConfigComponent
  ]
})
export class ConfigComponentModule { }
