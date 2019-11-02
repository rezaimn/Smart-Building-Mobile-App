import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {UserProfileComponent} from "./user-profile.component";

@NgModule({
  declarations: [
    UserProfileComponent,
  ],
  imports: [
    IonicPageModule.forChild(UserProfileComponent),
    TranslateModule.forChild()
  ],
  exports: [
    UserProfileComponent
  ]
})
export class UserProfileComponentModule { }
