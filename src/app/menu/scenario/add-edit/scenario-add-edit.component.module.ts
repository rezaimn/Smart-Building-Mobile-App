import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {ScenarioAddEditComponent} from "./scenario-add-edit.component";

@NgModule({
  declarations: [
    ScenarioAddEditComponent,
  ],
  imports: [
    IonicPageModule.forChild(ScenarioAddEditComponent),
    TranslateModule.forChild()
  ],
  exports: [
    ScenarioAddEditComponent
  ]
})
export class ScenarioAddEditComponentModule { }
