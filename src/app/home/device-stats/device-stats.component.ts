import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {DataPassService} from '../../utils/services/data-pass-service';
import {CalculateHomeDataService} from '../../utils/services/calculateHomeData.service';
import {RouteStackService} from '../../utils/services/routeStack.service';
import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'device-stats',
    templateUrl: 'device-stats.component.html'

})

export class DeviceStatsComponent implements OnInit, AfterViewInit {
    constructor(private route: ActivatedRoute,
                public appService: AppService,
                private router: Router ,
                public translate:TranslateService,
                public dataPassService:DataPassService,
                public calculateHomeData:CalculateHomeDataService,
                private stackService:RouteStackService) {
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/home/home-screen/device-stats";
    }
    ngOnInit() {

        this.calculateHomeData.calculateDeviceStats();
    }
    ngAfterViewInit() {
    }
}
