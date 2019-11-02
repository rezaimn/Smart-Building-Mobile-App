import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../../utils/services';
import {DataPassService} from '../../../utils/services/data-pass-service';
import {PrepareDevice} from '../../device';
import {RouteStackService} from '../../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'device-edit',
    templateUrl: 'device-edit.component.html'

})

export class DeviceEditComponent implements OnInit, AfterViewInit {
    prepareDevice=new PrepareDevice({});
    editMode=false;
    addMode=false;
    public subDeviceList: Array<any> = [];
    public brandList: Array<any> = [];
    public modelList: Array<any> = [];
    public serialList: Array<any> = [];
    public deviceList: Array<any> = [];
    constructor(private  httpService:HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router ,
                public translate:TranslateService,
                public dataPassService:DataPassService,
                private stackService:RouteStackService) {
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/menu/device";
    }
    ngOnInit() {

        this.prepareDevice= new PrepareDevice({});
        if(this.dataPassService.selectedDevice!=null || this.dataPassService.selectedDevice!=undefined){
            this.prepareDevice.deviceId=this.dataPassService.selectedDevice.device_id;
            this.prepareDevice.type_id=this.dataPassService.selectedDevice.type_id;
            this.prepareDevice.sub_type_id=this.dataPassService.selectedDevice.sub_type_id;
            this.prepareDevice.brand_id=this.dataPassService.selectedDevice.brand_id;
            this.prepareDevice.modelId=this.dataPassService.selectedDevice.model_id;
            this.prepareDevice.serialNum=this.dataPassService.selectedDevice.serial_no;
            this.prepareDevice.status=this.dataPassService.selectedDevice.device_status;
            this.addMode=false;
            this.editDataFill(this.prepareDevice);
        }else{
            this.addMode=true;
            this.getDeviceType();
        }
    }
    ngAfterViewInit() {
    }

    changeEditMode(mode){
        this.editMode=mode;
    }
    editDataFill(deviceT){
        this
            .httpService
            .get(`/rsb-oms/oms/getAllDeviceType`)
            .subscribe((data) => {

                console.log("getAllDeviceType");
                this.deviceList = JSON.parse(data._body);
                for(let type of this.deviceList){
                    if(type.id==deviceT.type_id){
                        this.prepareDevice.type_id=type.id;
                        this
                            .httpService
                            .get(`/rsb-oms/oms/getSubDevicesByDeviceTypeId?id=`+deviceT.type_id)
                            .subscribe((data) => {

                                console.log("getSubDevicesByDeviceTypeId");
                                this.subDeviceList = JSON.parse(data._body);
                                for(let subType of this.subDeviceList) {
                                    if (subType.id == deviceT.sub_type_id) {
                                        this.prepareDevice.sub_type_id=subType.id;
                                        this
                                            .httpService
                                            .get(`/rsb-oms/oms/getDeviceBrandsByDeviceSubTypeId?id=`+deviceT.sub_type_id)
                                            .subscribe((data) => {

                                                console.log("getDeviceBrandsByDeviceSubTypeId");
                                                this.brandList = JSON.parse(data._body);
                                                for(let brand of this.brandList) {
                                                    if (brand.id == deviceT.brand_id) {

                                                        this.prepareDevice.brand_id=brand.id;
                                                        this
                                                            .httpService
                                                            .get(`/rsb-oms/oms/getDeviceModelByDeviceBrandId?id=`+deviceT.brand_id)
                                                            .subscribe((data) => {
                                                                console.log("getDeviceModelByDeviceBrandId");
                                                                this.modelList = JSON.parse(data._body);
                                                                for(let model of this.modelList) {
                                                                    if (model.id == deviceT.modelId) {
                                                                        this.prepareDevice.modelId=model.id;
                                                                    }
                                                                }

                                                            }, (error) => {
                                                                console.log(error);
                                                            });
                                                    }
                                                }
                                            }, (error) => {
                                                console.log(error);
                                            });
                                    }
                                }
                            }, (error) => {
                                console.log(error);
                            });
                    }
                }
            }, (error) => {
                console.log(error);
            });
    }

    getDeviceType() {
        this
            .httpService
            .get(`/rsb-oms/oms/getAllDeviceType`)
            .subscribe((data) => {
                this.deviceList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }
    /**
     @Desc get sub device data
     @Param event
     @return
     */
    getSubDevice(data) {
        this
            .httpService
            .get(`/rsb-oms/oms/getSubDevicesByDeviceTypeId?id=`+data)
            .subscribe((data) => {
                this.subDeviceList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }
    /**
     @Desc get device brand
     @Param event
     @return
     */
    getBrand(data) {
        this
            .httpService
            .get(`/rsb-oms/oms/getDeviceBrandsByDeviceSubTypeId?id=`+data)
            .subscribe((data) => {
                this.brandList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }
    /**
     @Desc get device model
     @Param event
     @return
     */
    getModel(data) {
        this
            .httpService
            .get(`/rsb-oms/oms/getDeviceModelByDeviceBrandId?id=`+data)
            .subscribe((data) => {
                this.modelList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }


    /**
     @Desc save or update device
     @Param
     @return
     */
    addUpdateDevice() {
        let url;
        let mes = "";

        if (this.editMode == true) {
            delete this.prepareDevice.brand_id;
            delete this.prepareDevice.sub_type_id;
            delete this.prepareDevice.type_id;
            delete this.prepareDevice.serialNum;
            delete this.prepareDevice.modelId;

            url = "/rsb-oms/ems/device/updateDeviceStatus";
            mes = "updated";
        }
        if(this.addMode==true) {

            url = "/rsb-oms/ems/device/createDevice";
            mes = "added";
        }
        this.httpService.post(url, this.prepareDevice)
            .subscribe((data) => {
                this.backTop();
            }, (error) => {
            });
    }
    deleteDevice(deviceId){
        console.log("delete");
        this.httpService.delete(`/rsb-oms/oms/deleteDevice?id=`+deviceId).subscribe((data) => {
            this.backTop();
        }, (error) => {

        });
    }
    backTop(){
        this.dataPassService.selectedfilterType='device';
        this.dataPassService.searchMode=true;
        this.dataPassService.manageMode=true;
        this.dataPassService.selectedDevice=new PrepareDevice({});
        this.router.navigateByUrl('search');
    }
    openModal(modalId){
        document.getElementById(modalId).style.display='block'
    }
    closeModal(modalId){
        document.getElementById(modalId).style.display='none'
    }
}
