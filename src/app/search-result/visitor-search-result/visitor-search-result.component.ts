import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {visitorInfo} from '../card-holder';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'visitor-search-result',
    templateUrl: 'visitor-search-result.component.html'

})

export class VisitorSearchResultComponent implements OnInit, AfterViewInit {
    public searchValue='';
    public workGroupId=0;
    public workGroups=[];
    public page: number = 0;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public totalElements: number;
    public endPoint: number = 0;
    public addClicked = false;
    public visitors: visitorInfo[] = [];
    public departmentId: number = 0;
    public subDepartmentId: number = 0;
    constructor(private  httpService:HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router ,
                public translate:TranslateService,
                public dataPassService:DataPassService,
                private stackService:RouteStackService) {
        //this.stackService.push(this.router.url,null);
    }
    ngOnInit() {
        this.getAllVisitors();
        this.dataPassService.searchTriggered.subscribe(
            (res:any)=>{
                if(this.dataPassService.selectedfilterType == 'all'||this.dataPassService.selectedfilterType == 'visitor') {
                    this.visitors.splice(0, this.visitors.length);
                    this.getAllVisitors();
                }
            }
        )
    }
    ngAfterViewInit() {
    }
    editVisitor(visitor) {
        this.dataPassService.selectedVisitor=visitor;
        this.router.navigateByUrl('visitor-edit');
    }

    getAllVisitors() {
        this.visitors.splice(0,this.visitors.length);
        this.httpService
            .get(`/rsb-spas/visitor?name=` + this.dataPassService.searchText + `&workgroupid=` +0+`&page=`+0+`&size=`+1000+`&lang=`+this.appService.currentLang)
            .subscribe((res) => {
                let visitorsT = JSON.parse(res._body).content;

                for(let v of visitorsT){
                    let vTemp=new visitorInfo(v);
                    vTemp.cardholder.isProcessing=false;
                    this.visitors.push(vTemp);
                }
            });
    }
    enableCardHolder(index) {
      this.visitors[index].cardholder.isProcessing = false;
        this.visitors[index].cardholder.isProcessing = true;
        this.visitors[index].cardholder.enabled = !this.visitors[index].cardholder.enabled;
        this
            .httpService
            .put('/rsb-spas/cardholder',this.visitors[index].cardholder)
            .subscribe((data) => {
                let cardHolder = JSON.parse(data._body);
                this.visitors[index].cardholder.enabled = cardHolder.enabled;
                console.log("enableeeeeeeeeeeeeeeeeee",this.visitors[index].cardholder.enabled);
                this.visitors[index].cardholder.isProcessing = false;
            }, (error) => {
                this.visitors[index].cardholder.enabled = !this.visitors[index].cardholder.enabled;
                this.visitors[index].cardholder.isProcessing = false;
            });
    }


}
