import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app.service';
import {App} from '../app';
import {TranslateService} from '@ngx-translate/core';
import {DataPassService} from '../utils/services/data-pass-service';
import {HttpService} from '../utils/services';
import {RouteStackService} from '../utils/services/routeStack.service';
import {ScreenPermissionService} from '../utils/services/screen-permission.service';


import {IonicPage} from "ionic-angular";
import {NativeStorage} from "@ionic-native/native-storage";
@IonicPage()
@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html'

})
export class MenuComponent implements OnInit {
    @ViewChild('pageWrapper') public pageWrapper: ElementRef;
    @ViewChild('mainPanel') public mainPanel: ElementRef;

    selectedMenuItem='';

    constructor(
                private route: ActivatedRoute,
                public translate:TranslateService,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                public appComponent: App,
                public dataPassService:DataPassService,
                private httpService:HttpService,
                private stackService:RouteStackService,
                public screenPermissionService:ScreenPermissionService,
                private nativeStorage: NativeStorage
    ) {
    }

    ngOnInit() {

    }


    openManageUsers(){
        this.stackService.empetyStack();
        this.dataPassService.isBackActive=false;
        this.dataPassService.selectedfilterType='user';
        this.router.navigateByUrl('/search');
        this.appService.menuItemSelect.emit(true);
        this.selectedMenuItem='user';
        this.dataPassService.searchMode=true;
        this.dataPassService.manageMode=true;
    }
    openManageVisitors() {
        this.selectedMenuItem='visitor';
        this.stackService.empetyStack();
        this.dataPassService.isBackActive=false;
        this.dataPassService.selectedfilterType='visitor';
        this.router.navigateByUrl('/search');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=true;
        this.dataPassService.manageMode=true;
    }

    openManageDevices() {
        this.selectedMenuItem='device';
        this.stackService.empetyStack();
        this.dataPassService.isBackActive=false;
        this.dataPassService.selectedfilterType='device';
        this.router.navigateByUrl('/search');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=true;
        this.dataPassService.manageMode=true;
    }

    openManageAlerts() {
        this.selectedMenuItem='alert';
        this.dataPassService.isBackActive=false;
        // this.translate.get('bar.energy', this.appService.currentLang).subscribe(
        //     (energyRes) => {
        //         this.appService.subHeaderName.emit(energyRes);
        //         this.router.navigateByUrl('energy');
        //     }
        //
        // );
            this.router.navigateByUrl('alert-management');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=false;
    }
    openManageScenario(){
        this.selectedMenuItem='scenario';
        this.dataPassService.isBackActive=false;
        // this.translate.get('bar.card-holders', this.appService.currentLang).subscribe(
        //     (cardHoldersRes) => {
        //         this.appService.subHeaderName.emit(cardHoldersRes);
        //         this.router.navigateByUrl('card-holders');
        //     }
        //
        // );
        this.router.navigateByUrl('scenario');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=false;
    }
    openAppSettings(){
        this.selectedMenuItem='app-setting';
        this.dataPassService.isBackActive=false;
        this.router.navigateByUrl('app-settings');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=false;
    }
    openLogs() {
        this.selectedMenuItem='log';
        this.dataPassService.isBackActive=false;
        // this.translate.get('bar.dashboard', this.appService.currentLang).subscribe(
        //     (dashboardRes) => {
        //         this.appService.subHeaderName.emit(dashboardRes);
        //
        //     }
        //
        // );
        this.router.navigateByUrl('logs');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=false;
    }

    openProfile(){
        this.selectedMenuItem='profile';
        this.dataPassService.isBackActive=false;
        // this.translate.get('bar.screen-captures', this.appService.currentLang).subscribe(
        //     (screenRes) => {
        //         this.appService.subHeaderName.emit(screenRes);
        //
        //     }
        //
        // );
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=false;
        this.router.navigateByUrl('user-profile');
    }
    openSubsidiary() {
        this.selectedMenuItem='subsidiary';
        this.dataPassService.isBackActive=false;
        // this.translate.get('bar.general-reports', this.appService.currentLang).subscribe(
        //     (reportsRes) => {
        //         this.appService.subHeaderName.emit(reportsRes);
        //
        //     }
        //
        // );
        this.router.navigateByUrl('subsidiary');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=false;
    }
    openAbout(){
        this.selectedMenuItem='about';
        this.dataPassService.isBackActive=false;
        this.router.navigateByUrl('about');
        this.appService.menuItemSelect.emit(true);
        this.dataPassService.searchMode=false;
    }
    openLogout() {
        this.selectedMenuItem='logout';
        this.dataPassService.isBackActive=false;
        this
            .httpService
            .logout('/rsb-security/logout')
            .subscribe((data) => {
                if (data !== null) { //Success Store the details of the user in session storage
                    this.dataPassService.loggedInUser =null;
                    this.dataPassService.clearLocalData();
                    this.dataPassService.isLoggedIn = false;
                    this.appService.menuItemSelect.emit(true);
                    this.dataPassService.searchMode=false;
                    this.nativeStorage.setItem("loggedInUser",null);
                    this.nativeStorage.setItem("rememberMe",false);
                  this.router.navigateByUrl('');
                }
            });
    }




}
