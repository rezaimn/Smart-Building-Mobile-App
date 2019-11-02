import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../utils/services/index';
import {DataPassService} from '../utils/services/data-pass-service';
import {RouteStackService} from '../utils/services/routeStack.service';
import {ScreenPermissionService} from '../utils/services/screen-permission.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'search-result',
    templateUrl: 'search-result.component.html'

})

export class SearchResultComponent implements OnInit, AfterViewInit {
    constructor(private  httpService: HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router,
                public translate: TranslateService,
                public dataPassService: DataPassService,
                private stackService: RouteStackService,
                public screenPermissionService:ScreenPermissionService) {

        this.stackService.empetyStack();
        this.stackService.push(this.router.url, null);
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
    }

    userSearchResult() {
        this.dataPassService.isBackActive = true;
        this.dataPassService.filterIsActive = true;
        this.dataPassService.selectedfilterType = 'user';
    }

    visitorSearchResult() {
        this.dataPassService.isBackActive = true;
        this.dataPassService.filterIsActive = true;
        this.dataPassService.selectedfilterType = 'visitor';
    }

    deviceSearchResult() {
        this.dataPassService.isBackActive = true;
        this.dataPassService.filterIsActive = true;
        this.dataPassService.selectedfilterType = 'device';
    }

    clearSearchfilter() {
        this.dataPassService.filterIsActive = true;
        this.dataPassService.selectedfilterType = 'all';
        this.dataPassService.searchText='';
      this.dataPassService.searchTriggered.emit(true);
    }
}
