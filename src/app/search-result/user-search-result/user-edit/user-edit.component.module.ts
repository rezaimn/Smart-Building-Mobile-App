import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {UserEditComponent} from "./user-edit.component";

@NgModule({
  declarations: [
    UserEditComponent,
  ],
  imports: [
    IonicPageModule.forChild(UserEditComponent),
    TranslateModule.forChild()
  ],
  exports: [
    UserEditComponent
  ]
})
export class UserEditComponentModule { }
