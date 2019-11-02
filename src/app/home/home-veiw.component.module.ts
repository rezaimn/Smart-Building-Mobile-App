import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {HomeViewComponent} from "./home-view.component";

@NgModule({
  declarations: [
    HomeViewComponent,
  ],
  imports: [
    IonicPageModule.forChild(HomeViewComponent),
    TranslateModule.forChild()
  ],
  exports: [
    HomeViewComponent
  ]
})
export class HomeVeiwComponentModule { }
