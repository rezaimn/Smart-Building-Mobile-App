import {Component} from '@angular/core';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {Profile} from './profile';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'user-profile',
    templateUrl: 'user-profile.component.html'
})
export class UserProfileComponent {

    editMode=false;
    profileLoadData:Profile=new Profile({});
    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                private httpService:HttpService,
                public dataPassService:DataPassService,
                private stackService:RouteStackService
    ) {
        this.stackService.empetyStack();
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/menu/profile";
        //this.profileLoadData.picture='./assets/images/avatar-blue.png';
    }
    changeEditMode(mode){
        this.editMode=mode;
    }
    ngOnInit() {

        this.profileLoad();

    }

    updateProfile() {

         this
            .httpService
            .post('/rsb-security/security/profileUpdate', this.profileLoadData).subscribe(
                (res:any)=>{
                    this.editMode=false;
                }
            );

    }
    profileLoad() {
         this
            .httpService
            .get('/rsb-security/security/profileLoad?userId='+this.dataPassService.loggedInUser.user_id).subscribe(
                (res:any)=>{
                    this.profileLoadData=JSON.parse(res._body);
                   // this.getUserPicture();
                }
            )
    }
}
