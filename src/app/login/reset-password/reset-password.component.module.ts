import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {ResetPasswordComponent} from "./reset-password.component";

@NgModule({
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    IonicPageModule.forChild(ResetPasswordComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ResetPasswordComponent
  ]
})
export class ResetPasswordComponentModule { }
