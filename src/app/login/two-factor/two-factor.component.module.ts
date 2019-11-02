import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {TwoFactorComponent} from "./two-factor.component";

@NgModule({
  declarations: [
    TwoFactorComponent,
  ],
  imports: [
    IonicPageModule.forChild(TwoFactorComponent),
    TranslateModule.forChild()
  ],
  exports: [
    TwoFactorComponent
  ]
})
export class TwoFactorComponentModule { }
