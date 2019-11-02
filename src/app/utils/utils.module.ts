import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './services/http.service';
import { routerTransition } from './animations/router.animation';
import { HttpModule, XHRBackend, RequestOptions, Http } from '@angular/http';
import { SearchPipe } from './pipes/search.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgService } from './services/svg.service';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import { AuthGuard } from './authguard/routeguard';
import {DataPassService} from './services/data-pass-service';
import {ErrorMessageService} from './services/error-message-service';
export function httpServiceFactory(backend: XHRBackend, defaultOptions: RequestOptions,dataPassService:DataPassService,errorService:ErrorMessageService) {
  return new HttpService(backend, defaultOptions,dataPassService,errorService);
}
@NgModule({
imports : [
  CommonModule, FormsModule, MalihuScrollbarModule.forRoot()
],
  declarations: [SearchPipe],
  exports: [],
  providers: [
    AuthGuard,
    SvgService
  ],
  entryComponents: []
})
export class UtilsModule { }