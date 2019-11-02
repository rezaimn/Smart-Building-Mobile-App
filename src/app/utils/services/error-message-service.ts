import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

//import { Subsidiary } from './shared/subsidiary';

@Injectable()
export class ErrorMessageService {

    constructor(private toastr: ToastrService, public translate: TranslateService, private appService: AppService) {
    }

    translateSuccess(message: any) {
        let lang = this.appService.currentLang;
        this.translate.get('CE-error-message.' + message, lang).subscribe(
            (res) => {
                this.toastr.success(res);
            }
        );
    }

    getCurrentLang() {
        return this.appService.currentLang;
    }

    translateErrors(errorCode, message) {
        let lang = this.appService.currentLang;
        this.translate.get('CE-error-message.' + errorCode, lang).subscribe(
            (res) => {
                let flag = res.includes('CE-error-message');
                if (!flag) {
                    this.toastr.error(res);
                } else {
                    this.toastr.error(message);
                }
            }
        );

    }

    PEErrors(message) {
        this.toastr.error(message);
    }
    PESuccess(message){
        this.toastr.success(message);
    }
}
