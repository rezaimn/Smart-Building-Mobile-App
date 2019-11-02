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
import {FilterComponent, ManageDevice} from '../device';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'device-search-result',
    templateUrl: 'device-search-result.component.html'
})

export class DeviceSearchResultComponent implements OnInit, AfterViewInit {
    public manageDeviceList: ManageDevice[]=[];
    public getDevice: any = new FilterComponent({});
    pageCount=1;
    startItem=0;
    pageSize=10;
    constructor(private  httpService:HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router ,
                public translate:TranslateService,
                public dataPassService:DataPassService,
                private stackService:RouteStackService) {
       // this.stackService.push(this.router.url,null);
    }
    ngOnInit() {
        this.getFilterDevice();
        this.dataPassService.searchTriggered.subscribe(
            (res:any)=>{
                if(this.dataPassService.selectedfilterType == 'all'||this.dataPassService.selectedfilterType == 'device') {
                    this.manageDeviceList.splice(0, this.manageDeviceList.length);
                    this.getFilterDevice();
                }
            }
        )
    }
    ngAfterViewInit() {
    }
    getFilterDevice() {

        let filterData = Object.assign({}, this.getDevice);
        delete filterData.inUse;
        delete filterData.faulty;
        delete filterData.inService;
        delete filterData.notInUse;
        delete filterData.outOfService;
        filterData.startLimit=this.startItem;
        filterData.endLimit=this.pageSize;
        filterData.serialNo=this.dataPassService.searchText;


        this.httpService.post(`/rsb-oms/oms/getDevicesBySearch`, filterData).subscribe((res) => {
            let devices = JSON.parse(res._body);
            for(let device of devices){
                this.manageDeviceList.push(device);
            }
        }, (error) => {
            // this.snackBar.open('error in getting data', '', { duration: 2000 });
        });
    }
    editDevice(device) {
        this.dataPassService.selectedDevice=device;
        this.router.navigateByUrl('device-edit');
    }
    loadMoreDevice(){
        this.startItem=this.startItem+10;
        this.getFilterDevice();
    }
}
