import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {ScenarioComponent} from "./scenario.component";

@NgModule({
  declarations: [
    ScenarioComponent,
  ],
  imports: [
    IonicPageModule.forChild(ScenarioComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ScenarioComponent
  ]
})
export class ScenarioComponentModule { }
