import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {VisitorSearchResultComponent} from "./visitor-search-result.component";

@NgModule({
  declarations: [
    VisitorSearchResultComponent,
  ],
  imports: [
    IonicPageModule.forChild(VisitorSearchResultComponent),
    TranslateModule.forChild()
  ],
  exports: [
    VisitorSearchResultComponent
  ]
})
export class VisitorSearchResultComponentModule { }
