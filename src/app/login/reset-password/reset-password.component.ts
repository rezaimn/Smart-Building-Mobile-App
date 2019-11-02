import {Component,OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {DataPassService} from '../../utils/services/data-pass-service';
import {HttpService} from '../../utils/services';

import {ResetPassword} from '../login';
import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({selector: 'app-reset-password', templateUrl: 'reset-password.component.html'})
export class ResetPasswordComponent implements OnInit {

    public loadURL: string; // Loading the source file path for the background image
    public resetPassData: ResetPassword = new ResetPassword({}); // Creating an instance of Login Model to store the value
    public loader: boolean; // variable to check the current status of the background image loader animation
    public msg: string;

    public loginClicked: boolean = false;
    passwordsMatched=false;
    public progressBar: any;
    public elem: any;
    public width: any;
    public id: any;

    public stompClient: any;

    constructor(public appService: AppService, private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataPassService: DataPassService,
                private httpService: HttpService) {

    }
    ngOnInit() {

    }
    cancel() {
        this.resetPassData=new ResetPassword({});
        this.router.navigateByUrl('login');
    }
    checkPassword(){
        if(this.resetPassData.newPassword==this.resetPassData.confirmPassword&&this.resetPassData.newPassword.length>=4){
            this.passwordsMatched=true;
        }else{
            this.passwordsMatched=false;
        }
    }
    submitPassword() {
        let resetPassword = {
            'password': this.resetPassData.newPassword,
            'verifyToken': this.resetPassData.otpToken
        };
        this
            .httpService
            .post(`/rsb-security/resetPassword`, resetPassword)
            .subscribe((cardH) => {
                this.router.navigateByUrl('login');
                }
            );
    }
}
