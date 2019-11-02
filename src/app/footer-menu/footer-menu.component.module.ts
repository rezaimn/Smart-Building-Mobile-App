import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {FooterMenuComponent} from "./footer-menu.component";

@NgModule({
  declarations: [
    FooterMenuComponent,
  ],
  imports: [
    IonicPageModule.forChild(FooterMenuComponent),
    TranslateModule.forChild()
  ],
  exports: [
    FooterMenuComponent
  ]
})
export class FooterMenuComponentModule { }
