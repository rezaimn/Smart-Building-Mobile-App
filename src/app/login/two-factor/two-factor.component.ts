import {Component,OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {DataPassService} from '../../utils/services/data-pass-service';
import {HttpService} from '../../utils/services';

import {IonicPage} from "ionic-angular";
import {ErrorMessageService} from "../../utils/services/error-message-service";
import {LoginService} from "../../utils/services/login.service";
import {StructureTreeService} from "../../utils/services/structureTree.service";
@IonicPage()
@Component({selector: 'app-reset-password', templateUrl: 'two-factor.component.html'})
export class TwoFactorComponent implements OnInit {

    public OTPData='';
    constructor(public appService: AppService, private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataPassService: DataPassService,
                private httpService: HttpService,
                private errorMessage:ErrorMessageService,
                private loginService:LoginService,
                private structureTreeService:StructureTreeService) {

    }
    ngOnInit() {


    }
    submitPassword(OTP) {
        let verifyObject={
          username:this.dataPassService.loggedInUser.username,
          token:OTP
        }
        this
            .httpService
            .post(`/rsb-security/verifyOtp`, verifyObject)
            .subscribe((cardH) => {
                this.loginService.getSubsidiary();
                this.loginService.getUserPicture();
                this.loginService.getAlertSettings();
                this.loginService.getRoles();
                this.dataPassService.isLoggedIn = true;
                this.loginService.getSOSStatus();
                this.loginService.getPanicStatus();
                this.structureTreeService.loadStructure();
                this.router.navigateByUrl('home');
                },
              (error:any)=>{
              let errorCode=JSON.parse(error._body).errorCode;
                   this.errorMessage.translateErrors(errorCode,'');
              }

            );

    }
}
