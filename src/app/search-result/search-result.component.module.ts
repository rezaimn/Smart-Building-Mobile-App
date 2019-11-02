import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {SearchResultComponent} from "./search-result.component";

@NgModule({
  declarations: [
    SearchResultComponent,
  ],
  imports: [
    IonicPageModule.forChild(SearchResultComponent),
    TranslateModule.forChild()
  ],
  exports: [
    SearchResultComponent
  ]
})
export class SearchResultComponentModule { }
