import {Component} from '@angular/core';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {DataPassService} from '../../utils/services/data-pass-service';
import {CreateConfig, DeviceType} from '../point';
import {HttpService} from '../../utils/services';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'list-config',
    templateUrl: 'config-list.component.html'
})
export class ConfigListComponent {
    addMode = false;
    editMode = false;
    public serialList: Array<any> = [];
    public createConfig: CreateConfig = new CreateConfig({});
    public devicePoint: DeviceType = new DeviceType();
    public deviceList: Array<any> = [];
    public subDeviceList:Array<any>=[];
    public brandList:Array<any>=[];
    public modelList:Array<any>=[];

    public configData: Array<any> = [];
    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                public dataPassService:DataPassService,
                private httpService:HttpService,
                private stackService:RouteStackService
    ) {
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/footer/config-selected";
    }

    ngOnInit() {

        this.getDeviceType();
        this.getConfigData();
    }

    getConfigData() {
        this.httpService.get(`/rsb-oms/oms/getDevicesByPointId?pointId=` + this.dataPassService.selectedPoint.id)
            .subscribe((data) => {
                this.configData = JSON.parse(data._body);

                if (this.configData.length > 0) {
                    this.addMode=false;
                    this.devicePoint.deviceId = this.configData[0].deviceName;
                    this.devicePoint.deviceModel = parseInt(this.configData[0].model_id);
                    this.devicePoint.deviceBrand = parseInt(this.configData[0].brand_id);
                    this.devicePoint.deviceSubType = parseInt(this.configData[0].sub_type_id);
                    this.createConfig.id = parseInt(this.configData[0].serial_id);
                    this.createConfig.installationLabel = this.configData[0].installation_label;
                    this.createConfig.ipAddress = this.configData[0].ip_address;
                    this.createConfig.backeEndDeviceId = this.configData[0].backend_device_id;
                    this.createConfig.deviceName = this.configData[0].device_name;
                }
                else {
                    this.addMode=true;
                    this.editMode=false;
                }
            }, (error) => {
                console.log(error);
            });
    }

    changeEditMode(mode) {
        this.editMode = mode;
    }

    getDeviceType() {
        this
            .httpService
            .get(`/rsb-oms/oms/getAllDeviceType`)
            .subscribe((data) => {
                this.deviceList = JSON.parse(data._body);
                for(let type of this.deviceList){
                    if(type.name == this.dataPassService.selectedPoint.deviceType){
                        this.getSubDevice(type.id);
                    }
                }
                //this.getDeviceId();
            }, (error) => {
                console.log(error);
            });
    }
    // getDeviceId() {
    //     this.deviceList.forEach(element => {
    //         if (element.name == this.dataPassService.selectedPoint.deviceType) {
    //             this.getSubDevice(element.id);
    //         }
    //     });
    // }
    getSubDevice(data) {
        this.httpService.get(`/rsb-oms/oms/getSubDevicesByDeviceTypeId?id=`+data)
            .subscribe((data) => {
                this.subDeviceList = JSON.parse(data._body);
                this.brandList.splice(0,this.brandList.length);
                this.modelList.splice(0,this.modelList.length);
                this.serialList.splice(0,this.serialList.length);
                for(let subD of this.subDeviceList){
                    this.getBrand(subD.id);
                }

            }, (error) => {
                console.log(error);
            });
    }

    getBrand(data) {
        this.httpService.get(`/rsb-oms/oms/getDeviceBrandsByDeviceSubTypeId?id=`+data)
            .subscribe((data) => {
                let brandT=JSON.parse(data._body);
                for(let brand of brandT){
                    this.brandList.push(brand);
                    this.getModel(brand.id);
                }
            }, (error) => {
                console.log(error);
            });
    }

    getModel(data) {
        this.httpService.get(`/rsb-oms/oms/getDeviceModelByDeviceBrandId?id=`+data)
            .subscribe((data) => {
                let modelT=JSON.parse(data._body);
                for(let model of modelT){
                    this.modelList.push(model);
                    this.getSerial(model.id);
                }
            }, (error) => {
                console.log(error);
            });
    }

    getSerial(data) {
        this.httpService.get(`/rsb-oms/oms/getDeviceSerialByModelId?id=`+data)
            .subscribe((data) => {
                let serialT=JSON.parse(data._body);
                for(let serial of serialT){
                    this.serialList.push(serial);
                }
            }, (error) => {
                console.log(error);
            });
    }

    save() {
        console.log("1111111111111111111111111111111111111111",this.dataPassService.selectedPoint);
        // delete this.dataPassService.selectedPoint.point.coordinate;
        // delete this.dataPassService.selectedPoint.point.deviceCode;
        // delete this.dataPassService.selectedPoint.point.deviceColor;
        // delete this.dataPassService.selectedPoint.point.deviceType;
        this.createConfig.points.areaId = this.dataPassService.selectedPoint.areaId;
        this.createConfig.points.id = this.dataPassService.selectedPoint.id;
        this.createConfig.points.x = this.dataPassService.selectedPoint.x;
        this.createConfig.points.y = this.dataPassService.selectedPoint.y;
        this.httpService.post(`/rsb-oms/oms/installDevice`, this.createConfig).subscribe(res => {
            this.editMode=false;
                this.router.navigateByUrl('config');
            },
            (error: any) => {

            }
        );
    }
    deleteConfig() {

        let deleteUrl = '/rsb-oms/oms/uninstallDevice?deviceId=' + this.dataPassService.selectedPoint.device.id;
        this.httpService.delete(deleteUrl).subscribe(res => {
                this.router.navigateByUrl('config');
            },
            (error: any) => {

            }
        );
    }
    openModal(modalId){
        document.getElementById(modalId).style.display='block'
    }
    closeModal(modalId){
        document.getElementById(modalId).style.display='none'
    }
}
