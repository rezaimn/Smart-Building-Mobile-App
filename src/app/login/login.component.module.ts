import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';


import {LoginComponent} from "./login.component";

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    IonicPageModule.forChild(LoginComponent),
    TranslateModule.forChild()
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginComponentModule { }
