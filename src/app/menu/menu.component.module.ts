import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {MenuComponent} from "./menu.component";

@NgModule({
  declarations: [
    MenuComponent,
  ],
  imports: [
    IonicPageModule.forChild(MenuComponent),
    TranslateModule.forChild()
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuComponentModule { }
