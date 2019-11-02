import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../utils/services/index';
import {DataPassService} from '../../utils/services/data-pass-service';
import {AlertSettings} from './alert-settings';
import {RouteStackService} from '../../utils/services/routeStack.service';
import {IonicPage} from "ionic-angular";
@IonicPage()

@Component({
    selector: 'app-settings',
    templateUrl: 'app-settings.component.html'

})

export class AppSettingsComponent implements OnInit, AfterViewInit {
    alertSettings=new AlertSettings({});
    themeEditMode=false;
    alertEditMode=false;
    langEditMode=false;
    darkThemeTemp=false;
    langTemp='fa';
    hasNotif=false;
    hasSMS=false;
    hasEmail=false;
    twoFactor=false;
    constructor(private  httpService:HttpService,
                private route: ActivatedRoute,
                private appService: AppService,
                private router: Router ,
                public translate:TranslateService,
                public dataPassService:DataPassService,
                private stackService:RouteStackService) {
                    this.darkThemeTemp=this.appService.darkTheme;
                    this.langTemp=this.dataPassService.currentLang;
        this.stackService.empetyStack();
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/menu/app-settings";
    }

    ngOnInit() {

        this.getAlertSettings();
        this.getTwoFactor();
    }

    changeThemeEditMode(mode) {
        this.themeEditMode = mode;
    }
    changeLangEditMode(mode) {
        this.langEditMode = mode;
    }
    changeAlertEditMode(mode){
        this.alertEditMode=mode;
    }
    ngAfterViewInit() {
    }
    changeTheme(dark){
        if(dark!=this.appService.darkTheme){
            this.darkThemeTemp=dark;
            this.saveTheme();
        }
    }
    saveTheme(){

        this.appService.darkTheme2.emit(this.darkThemeTemp);
        this.appService.darkTheme=this.darkThemeTemp;
        const dom: any = document.querySelector('ion-app');
        dom.classList.toggle('dark');
        this.themeEditMode=false;
    }
    changeLang(lang: any) {
        // let currentURL=this.router.url;
        // if(currentURL.includes("lnr")){
        this.langTemp=lang;
        this.saveLang();
    }
    saveLang(){
        this.translate.use(this.langTemp);
        this.appService.currentLang = this.langTemp;
        this.dataPassService.currentLang = this.langTemp;
        this.appService.currentLangEmit.emit(this.langTemp);
        this.translate.get('dir', 'en').subscribe(
            (res) => {
                const dom: any = document.querySelector('ion-app');
                if (res == "ltr" && !dom.classList.contains('ltr-style')) {
                    dom.classList.toggle('ltr-style');
                }
                if (res == "ltr" && dom.classList.contains('ltl-style')) {
                    dom.classList.toggle('ltl-style');
                }
            }
        );
        this.langEditMode=false;
    }
    saveAlert(){
        this.httpService.post('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/settings' , this.alertSettings ).subscribe(
            (res: any) => {
            }
        );
        this.alertEditMode=false;
    }
    getAlertSettings(){
        this.httpService.get('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/settings').subscribe(
            (res:any)=>{
                this.alertSettings=JSON.parse(res._body);
                if(this.alertSettings.pushAlert!=0){
                    this.hasNotif=true;
                }else {
                    this.hasNotif=false;
                }
                if(this.alertSettings.smsAlert!=0){
                    this.hasSMS=true;
                }else {
                    this.hasSMS=false;
                }
                if(this.alertSettings.emailAlert!=0){
                    this.hasEmail=true;
                }else {
                    this.hasEmail=false;
                }
            }
        )
    }
    deActiveEmail(){
        this.hasEmail=!this.hasEmail;
        if(!this.hasEmail){
            this.alertSettings.emailAlert=0;
            this.alertSettings.dailyDigestAlert=-1;
        }else{
            this.alertSettings.emailAlert=1;
            this.alertSettings.dailyDigestAlert=0;
        }
    }
    deActiveNotif(){
        this.hasNotif=!this.hasNotif;
        if(!this.hasNotif){
            this.alertSettings.pushAlert=0;
        }else{
            this.alertSettings.pushAlert=1;
        }
    }
    deActiveSMS(){
        this.hasSMS=!this.hasSMS;
        if(!this.hasSMS){
            this.alertSettings.smsAlert=0;
        }else{
            this.alertSettings.smsAlert=1;
        }
    }
    setNotif(status){
        this.alertSettings.pushAlert=status;
    }
    setSMS(status){
        this.alertSettings.smsAlert=status;
    }
    setEmail(status){
        this.alertSettings.emailAlert=status;
    }
    setDaily(status){
        this.alertSettings.dailyDigestAlert=status;
    }
    defultSettings(){
        this.darkThemeTemp=true;
        this.langTemp='fa';
        this.alertSettings.pushAlert=1;
        this.alertSettings.emailAlert=1;
        this.alertSettings.smsAlert=1;
        this.alertSettings.dailyDigestAlert=0;
        this.alertSettings.twoPassVerification=false;
        this.hasNotif=true;
        this.hasSMS=true;
        this.hasEmail=true;
        this.changeLang('fa');
        this.changeTheme(true);
        this.saveAlert();
    }
    openModal(modalId){
        document.getElementById(modalId).style.display='block'
    }
    closeModal(modalId){
        document.getElementById(modalId).style.display='none'
    }


  twoFactorUpdate(twoFactor){
      let twoFactorVrify={
        twoPassVerification:twoFactor.target.checked,
        userId:this.dataPassService.loggedInUser.user_id
      }
    this.httpService.post('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/settings' ,twoFactorVrify ).subscribe(
      (res: any) => {
      }
    );
    this.alertEditMode=false;
  }
  getTwoFactor(){
    this.httpService.get('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/settings').subscribe(
      (res:any)=>{
        this.twoFactor=JSON.parse(res._body).twoPassVerification;
      }
    )
  }
}
