import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {AppSettingsComponent} from "./app-settings.component";

@NgModule({
  declarations: [
    AppSettingsComponent,
  ],
  imports: [
    IonicPageModule.forChild(AppSettingsComponent),
    TranslateModule.forChild()
  ],
  exports: [
    AppSettingsComponent
  ]
})
export class AppSettingsComponentModule { }
