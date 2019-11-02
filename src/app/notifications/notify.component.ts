import {Component} from '@angular/core';
import {AppService} from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../app';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../utils/services';
import {DataPassService} from '../utils/services/data-pass-service';
import {RouteStackService} from '../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'notify',
    templateUrl: 'notify.component.html'
})
export class NotifyComponent {
    selectedNotifId = -1;

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                private httpService: HttpService,
                public dataPassService: DataPassService,
                private stackService:RouteStackService
    ) {

        this.stackService.empetyStack();
        this.stackService.push(this.router.url,null);
    }

    ngOnInit() {

       // this.getNotifications();
    }

    // getNotifications() {
    //     this.httpService.getLocal('./assets/json/notification.json').subscribe(
    //         (res: any) => {
    //             this.dataPassService.notificationsStack = JSON.parse(res._body);
    //             console.log(this.dataPassService.notificationsStack);
    //         }
    //     );
    // }

    setHeight(index) {

        if(index==this.selectedNotifId){

            let styles = {
                'height':7+ ((this.dataPassService.notificationsStack[index].events.length + 1) * 3) + 'vh'
            };
            console.log(styles);
            return styles;
        }else{
            let styles = {
                'height': 14+ 'vh'
            };
            return styles;
        }

    }

    selectedNotif(index) {
        this.dataPassService.notificationsStack[index].hasNotSeen=false;
        for(let event of this.dataPassService.notificationsStack[index].events){
            if(event.isSeen==false){
                event.isSeen=true;
                this.dataPassService.notificationsCount=this.dataPassService.notificationsCount-1;
            }

        }
        if(this.selectedNotifId == index){
            this.selectedNotifId = -1;
        }else{
            this.selectedNotifId = index;
        }

    }
    visibilityStatus(index){

        if(index==this.selectedNotifId){
            let styles = {
                'visibility':'visible'
            };
            return styles;
        }else{
            let styles = {
                'visibility':'hidden'
            };
            return styles;
        }
    }
}
