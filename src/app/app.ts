import {AppService} from './app.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {TranslateService} from '@ngx-translate/core';

import {DataPassService} from './utils/services/data-pass-service';
import {StructureTreeService} from './utils/services/structureTree.service';
import {RouteStackService} from './utils/services/routeStack.service';
import {ScreenPermissionService} from './utils/services/screen-permission.service';

import {AlertController, IonicPage, Platform} from "ionic-angular";
import {BackgroundMode} from "@ionic-native/background-mode";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {NativeStorage} from "@ionic-native/native-storage";
@IonicPage()
@Component({
    selector: 'ion-app',
    templateUrl: 'app.component.html',
    animations: [
        trigger('slideInOut', [
            // state('inen', style({
            //   transform: 'translate3d(100%, 0, 0)'
            // })),
            // state('outen', style({
            //   transform: 'translate3d(0%, 0, 0)'
            // })),
            // transition('inen => outen', animate('400ms ease-in-out')),
            // transition('outen => inen', animate('400ms ease-in-out')),
            state('in', style({
                transform: 'translate3d(0%, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})


export class App implements OnInit {
    title = 'app';
    data;
    counter=0;
    parking: any = [];
    langChange = false;
    public id: any;
    menuState: string = 'out';
    bodyLayout;
    sideMenu;
    @ViewChild('pageWrapper') public pageWrapper: ElementRef;

    constructor(public appService: AppService,
                private router: Router,
                private translate: TranslateService,
                public dataPassService:DataPassService,
                private structureTreeService:StructureTreeService,
                public stackService:RouteStackService,
                public screenPermissionService:ScreenPermissionService,
                private backgroundRunning:BackgroundMode,
                private localNotifications:LocalNotifications,
                private alertController:AlertController,
                private nativeStorage: NativeStorage,
                private platform:Platform) {

      this.platform.ready().then((readySource) => {
        this.backgroundRunning.enable();
        this.nativeStorage.getItem("rememberMe").then(
          (data)=>{

          },
          (error)=>{
            this.nativeStorage.setItem("rememberMe",false);
          }
        )
      });


        translate.addLangs(['en', 'fa']);
        this.translate.use('fa');

        this.appService.currentLang = 'fa';
        this.appService.currentLangEmit.emit('fa');
        this.appService.darkTheme2.emit(true);
        this.appService.darkTheme=true;
        const dom: any = document.querySelector('ion-app');
        dom.classList.toggle('dark');
        this.dataPassService.subsidiaryChanged.subscribe(
            (res:any)=>{
               this.structureTreeService.loadStructure();
            }
        )
    }
    backTo(){
        this.stackService.pop();
        this.router.navigateByUrl(this.stackService.pop().route);
    }
    ngOnInit() {
        setInterval(() => {
            if(this.dataPassService.isLoggedIn){
                this.structureTreeService.loadStructure();
            }
        }, 60 * (1000 * 60));
        this.bodyLayout = document.getElementById('body-layout');
        this.sideMenu = document.getElementById('side-menu-id');
        this.appService.currentLangEmit.subscribe(
            (res) => {
                this.langChange = true;
                this.toggleMenu();
            }
        );
        this.appService.menuItemSelect.subscribe(
            (res) => {
                this.toggleMenu();
            }
        );
        this.dataPassService.footerClicked.subscribe(
            (res:any)=>{
                if(this.menuState == 'in'){
                    this.toggleMenu();
                }
            }
        )

    }

    toggleMenu() {
        this.dataPassService.searchText="";
        if (this.menuState == 'out') {
            let bodyLayout = document.getElementById('body-layout');
            bodyLayout.style.right = '56vw';
            bodyLayout.style.left = 'auto';
            this.sideMenu.style.right = '0px';
            this.menuState = 'in';
            this.dataPassService.menuIsActive=true;
        }
        else if (this.menuState == 'in') {
            let bodyLayout = document.getElementById('body-layout');
            bodyLayout.style.right = '0px';
            bodyLayout.style.left = 'auto';
            this.sideMenu.style.right = '-56vw';
            this.menuState = 'out';
            this.dataPassService.menuIsActive=false;
        }

        this.langChange = false;


    }

    public changetType(type: any) {
        this.id = type;
    }

    public addClass(): void {
        this.pageWrapper.nativeElement.className += ' blur-bg';

    }

    // Function to remove the class upon closing of the Popup window
    public removeClass(): void {
        this.pageWrapper.nativeElement.className = 'page-wrapper';
    }
    searchResult(){
        this.dataPassService.searchTriggered.emit(true);
    }
    closeSideMenu(){
       if(this.menuState == 'in'){
           this.toggleMenu();
       }
    }
}
