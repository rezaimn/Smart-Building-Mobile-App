import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {CalculateHomeDataService} from '../../utils/services/calculateHomeData.service';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'parking-status',
    templateUrl: 'parking-status.component.html'

})

export class ParkingStatusComponent implements OnInit {
    constructor(private  httpService:HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router ,
                public translate:TranslateService,
                public dataPassService:DataPassService,
                public calculateHomeData:CalculateHomeDataService,
                private stackService:RouteStackService) {
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/home/areas/PARKING";
    }
    filterStatus='all';
    ngOnInit() {

        this.calculateHomeData.calculateParkingStatus();
    }
    setFilter(filter:any){
        this.filterStatus=filter;
    }

}
