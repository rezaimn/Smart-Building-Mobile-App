import {Component} from '@angular/core';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {EavWrapperService, HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {DatePipe} from '@angular/common';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'alert-management',
    templateUrl: 'alert-management.component.html'
})

export class AlertManagementComponent {
    public alertObj: any = {};
    public alertList=[];
    public currentDate: any;
    public fiveYearsAgo:any;
    staffs:any=[];
    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                private httpService:HttpService,
                public dataPassService:DataPassService,
                private eavWrapperService:EavWrapperService,

                private datePipe: DatePipe,

                private stackService:RouteStackService
    ) {
        this.stackService.empetyStack();
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/menu/alert";
        let now = new Date();
       // this.dateAdapter.setLocale('en-In');
        this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
        let changedYear= parseInt(this.currentDate.toString().substr(6,4))-5;
        this.fiveYearsAgo=this.currentDate.toString().substr(0,6)+changedYear.toString();
    }
    ngOnInit() {

       for(let floor of this.dataPassService.floorList){
           this.getAllAlerts(floor.id);
       }
       for(let subsidiary of this.dataPassService.subsidiaryList){
           this.getAllUsers(subsidiary.id);
       }
        
    }


    getAllAlerts(floorId){
        this.alertObj.pagination = {'page': 1, 'records': 10000};
        this.alertObj.fromdate=this.fiveYearsAgo;
        this.alertObj.todate=this.currentDate;
        this.alertObj.floorid = Number(floorId);

            this.httpService.postPe(`/ALMS/GetAlertListByFloor`,this.alertObj).subscribe(
                res => {
                    if (res.status === 200) {
                        let dataT = JSON.parse(res._body);
                        for(let alert of dataT.records){
                            this.alertList.push(alert);
                        }
                                            }
                }, (error: any) => {

                })
    }
    editAlert(alert) {
        this.dataPassService.selectedAlert=alert;
        this.router.navigateByUrl('alert-add-edit');
    }
    getAllUsers(subsidiaryId) {
        this.httpService
            .get(`/rsb-security/security/staff/getAllStaffByDeptAndSubDept?dept=` + -1 + `&subDept=` + -1 + `&subId=` + subsidiaryId + `&name=` + this.dataPassService.searchText + `&employeeId=` +'' + `&size=` +10000 + `&page=` + 0)
            .subscribe((res) => {
                    let allStaffs = JSON.parse(res._body);
                    for(let staff of allStaffs.content){
                        this.staffs.push(staff);
                    }
                }
            )
    }
}
