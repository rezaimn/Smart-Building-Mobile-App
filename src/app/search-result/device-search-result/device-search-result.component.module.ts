import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {DeviceSearchResultComponent} from "./device-search-result.component";

@NgModule({
  declarations: [
    DeviceSearchResultComponent,
  ],
  imports: [
    IonicPageModule.forChild(DeviceSearchResultComponent),
    TranslateModule.forChild()
  ],
  exports: [
    DeviceSearchResultComponent
  ]
})
export class DeviceSearchResultComponentModule { }
