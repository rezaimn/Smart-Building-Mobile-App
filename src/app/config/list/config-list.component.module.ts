import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {ConfigListComponent} from "./config-list.component";

@NgModule({
  declarations: [
    ConfigListComponent,
  ],
  imports: [
    IonicPageModule.forChild(ConfigListComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ConfigListComponent
  ]
})
export class ConfigListComponentModule { }
