import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {UserSearchResultComponent} from "./user-search-result.component";

@NgModule({
  declarations: [
    UserSearchResultComponent,
  ],
  imports: [
    IonicPageModule.forChild(UserSearchResultComponent),
    TranslateModule.forChild()
  ],
  exports: [
    UserSearchResultComponent
  ]
})
export class UserSearchResultComponentModule { }
