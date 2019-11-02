import {Component} from '@angular/core';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {RouteStackService} from '../../utils/services/routeStack.service';


import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'logs',
    templateUrl: 'logs.component.html'
})
export class LogsComponent {
    page = 1;
    staffPage = 1;
    perPage = 10;
    deviceTypeList = [];
    deviceLogList = [];
    staffLogList = [];
    selectedDeviceTypeId = -1;
    selectedDeviceTypeIndex = 0;
    date = '';

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
        this.dataPassService.leadIcon="./assets/images/menu/log";
    }

    setDeviceIndex(index, deviceT) {
        this.selectedDeviceTypeId = deviceT.id;
        this.selectedDeviceTypeIndex = index;
        this.deviceLogList.splice(0, this.deviceLogList.length);
        this.page = 1;
        this.getAlertList();
    }

    ngOnInit() {

        this.getDeviceType();
        this.getStaffLogList();
    }

    getDeviceType() {
        console.log('rrrrrrrrrrrrrrrrrrrrrrrrr');
        this.httpService.getPe('/Common/GetDeviceTypes').subscribe(res => {
            if (res.status === 200) {
                this.deviceTypeList.splice(0, this.deviceTypeList.length);
                let allDevices = JSON.parse(res._body);
                let deviceTemp = {
                    id: -1,
                    name: 'All'
                };
                this.deviceTypeList.push(deviceTemp);
                for (let type of allDevices) {
                    this.deviceTypeList.push(type);
                }
                this.selectedDeviceTypeId = this.deviceTypeList[0].id;
                this.getAlertList();
            }
        }, (error: any) => {
        });
    }

    getAlertList() {
        this.httpService.getPe('/LNR/GetDeviceData?date=' + this.date + '&devicetypeid=' + this.selectedDeviceTypeId + '&page=' + this.page + '&records=' + this.perPage)
            .subscribe(res => {
                    if (res.status === 200) {
                        const deviceLog = JSON.parse(res._body);

                        for (let DeviceL of deviceLog.records) {
                            DeviceL.date = DeviceL.recorddate.substr(0, 10);
                            DeviceL.time = DeviceL.recorddate.substr(10, 11);
                            this.deviceLogList.push(DeviceL);
                        }
                    }
                }
                , (error: any) => {

                });
    }

    getStaffLogList() {
        this.httpService.get('/rsb-security/audit/listAudit?userId=' + this.dataPassService.loggedInUser.user_id + '&employeeId=null&page=' + this.staffPage + '&size=10'+'&sort=timestamp&timestamp.dir=asc')
            .subscribe(res => {
                    if (res.status === 200) {
                        const staffLog = JSON.parse(res._body);
                        for (let staffL of staffLog) {
                            let date = new Date(staffL.timestamp);
                            //console.log(date);
                            // Year
                            let year = date.getFullYear();
                            // Month
                            let month = '0' + (date.getMonth() + 1);
                            // Day
                            let day = date.getDate();
                            // Hours
                            let hours = date.getHours();
                            // Minutes
                            let minutes = '0' + date.getMinutes();
                            // Seconds
                            let seconds = '0' + date.getSeconds();
                            // Display date time in MM-dd-yyyy h:m:s format
                            let convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                            staffL.dateTime=convdataTime;
                            this.staffLogList.push(staffL);
                        }
                    }
                }
                , (error: any) => {

                });
    }

    loadMoreDeviceLog() {
        this.page = this.page + 1;
        this.getAlertList();
    }
    loadMoreStaffLog() {
        this.staffPage = this.staffPage + 1;
        this.getStaffLogList();
    }
}
