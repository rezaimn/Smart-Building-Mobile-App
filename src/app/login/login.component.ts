import {Component,OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Login} from './login';

import {AppService} from '../app.service';
import {DataPassService} from '../utils/services/data-pass-service';
import {EavWrapperService, HttpService} from '../utils/services';
import {DomSanitizer} from '@angular/platform-browser';
import {CalculateHomeDataService} from '../utils/services/calculateHomeData.service';
import {StructureTreeService} from '../utils/services/structureTree.service';
import {RouteStackService} from '../utils/services/routeStack.service';
import {ErrorMessageService} from '../utils/services/error-message-service';
import {NativeStorage} from "@ionic-native/native-storage";
import {IonicPage} from "ionic-angular";
import {LoginService} from "../utils/services/login.service";

@IonicPage()
@Component({selector: 'app-login', templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {

    public loadURL: string; // Loading the source file path for the background image
    public loginData: Login = new Login({}); // Creating an instance of Login Model to store the value
    public loader: boolean; // variable to check the current status of the background image loader animation
    public msg: string;

    public loginClicked: boolean = false;
    public rememberMe=false;
    public rememberMeTemp=false;
    public progressBar: any;
    public elem: any;
    public width: any;
    public id: any;

    public stompClient: any;

    constructor(public appService: AppService, private router: Router,
                private activatedRoute: ActivatedRoute,
                private dataPassService: DataPassService,
                private httpService: HttpService, private sanitizer: DomSanitizer,
                private eavWrapper: EavWrapperService,
                private calculateHomeData:CalculateHomeDataService,
                private structureTreeService:StructureTreeService,
                private errorMessageService:ErrorMessageService,
                private stackService:RouteStackService,
                private nativeStorage: NativeStorage,
                public loginService:LoginService) {




      this.nativeStorage.getItem("userName").then(
        (data:any )=>{
          this.loginData.username=data;
        }
      )
    }

    ngOnInit() {

    }



}
