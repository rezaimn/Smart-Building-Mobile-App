import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {NotifyComponent} from "./notify.component";

@NgModule({
  declarations: [
    NotifyComponent,
  ],
  imports: [
    IonicPageModule.forChild(NotifyComponent),
    TranslateModule.forChild()
  ],
  exports: [
    NotifyComponent
  ]
})
export class NotifyComponentModule { }
