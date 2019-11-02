import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {LogsComponent} from "./logs.component";


@NgModule({
  declarations: [
    LogsComponent,
  ],
  imports: [
    IonicPageModule.forChild(LogsComponent),
    TranslateModule.forChild()
  ],
  exports: [
    LogsComponent
  ]
})
export class LogsComponentModule { }
