import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {AboutComponent} from "./about.component";

@NgModule({
  declarations: [
    AboutComponent,
  ],
  imports: [
    IonicPageModule.forChild(AboutComponent),
    TranslateModule.forChild()
  ],
  exports: [
    AboutComponent
  ]
})
export class AboutComponentModule { }
