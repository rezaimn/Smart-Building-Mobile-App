import {Component} from '@angular/core';
import {AppService} from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../app';
import {TranslateService} from '@ngx-translate/core';
import {EavWrapperService, HttpService} from '../utils/services';
import {DataPassService} from '../utils/services/data-pass-service';
import {PointDetail} from './point';
import {RouteStackService} from '../utils/services/routeStack.service';
import {StructureTreeService} from '../utils/services/structureTree.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'config',
    templateUrl: 'config.component.html'
})
export class ConfigComponent {
    lastAreaId=0;
    public manageDeviceList= [];
    public favoriteDevicesList=[];
    selectedCampusIndex=0;
    selectedBuildingIndex=0;
    selectedFloorIndex=0;
    floorList=[];
    buildingList=[];
    areaList=[];
    public deviceData: any;
    public pointIndex: number;
    public point: PointDetail = new PointDetail({});
    public deviceId: number;

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                private httpService:HttpService,
                public dataPassService:DataPassService,
                private eavWrapperService:EavWrapperService,
                private stackService:RouteStackService,
                private structureTreeService:StructureTreeService,
    ) {

        this.stackService.empetyStack();
        this.stackService.push(this.router.url,null);
    }
    setCampusIndex(index,campus){
        this.selectedCampusIndex=index;
        this.buildingList=this.structureTreeService.getCampusBuildings(campus.location[2].enName);
        if(this.buildingList.length>0) {
            this.setBuildingIndex(0, this.buildingList[0]);
        }else {
            this.buildingList=[];
            this.floorList=[];
            this.areaList=[];
            this.manageDeviceList=[];
        }
        this.selectedBuildingIndex=0;
        this.selectedFloorIndex=0;
    }
    setBuildingIndex(index,building){
        this.selectedBuildingIndex=index;
        if(this.buildingList.length>0) {
            this.floorList = this.structureTreeService.getBuildingFloors(building.location[3].enName);
        }else{
            this.floorList=[];
            this.areaList=[];
            this.manageDeviceList=[];
        }
        if(this.floorList.length>0){
            this.setFloorIndex(0, this.floorList[0]);
        }else{
            this.floorList=[];
            this.areaList=[];
            this.manageDeviceList=[];
        }
        this.selectedFloorIndex=0;
    }
    setFloorIndex(index,floor){
        if(this.floorList.length>0) {
            this.areaList = this.structureTreeService.getFloorAreas(floor.location[4].enName);
        }else{
            this.areaList=[];
            this.manageDeviceList=[];
        }
        this.manageDeviceList.splice(0,this.manageDeviceList.length);
        if(this.areaList.length>0){
            for(let area of this.areaList){
                this.getInstallationPoints(area);
            }
        }else {
            this.areaList=[];
            this.manageDeviceList=[];
        }


        this.selectedFloorIndex=index;
    }
    ngOnInit() {
        this.buildingList=this.structureTreeService.getCampusBuildings(null);
        if(this.buildingList.length>0){
            this.floorList=this.structureTreeService.getBuildingFloors(this.buildingList[0].location[3].enName);
            if(this.floorList.length>0){
                this.areaList=this.structureTreeService.getFloorAreas(this.floorList[0].location[4].enName);
            }
        }


        for(let area of this.areaList){
            this.getInstallationPoints(area);
        }
    }
    getInstallationPoints(area) {
        this
            .httpService
            .get(`/rsb-oms/oms/getPointsByAreaId?id=` + area.id)
            .subscribe(res => {
                if (res._body !== '') {
                    const ipList = JSON.parse(res._body);
                    ipList.forEach(ip => {
                        let ipItem =ip;
                        if (ipItem !== null) {
                            this.manageDeviceList.push(ipItem);
                        }
                    });

                }
                if(area.id==this.lastAreaId){
                    this.getFavoriteDevices();
                }
            }, (error: any) => {

            });
    }
    getFavoriteDevices(){
        this
            .httpService
            .get('/rsb-vera/ems/vera/device/getFavoriteDevices?size=100000&page=0')
            .subscribe(res => {
                if (res._body !== '') {
                    console.log("allDevices",this.manageDeviceList);

                    this.favoriteDevicesList = JSON.parse(res._body).content;
                    console.log("favorites",this.favoriteDevicesList);
                    for(let device of this.manageDeviceList){
                        device.isFavorite=false;
                        for(let fav of this.favoriteDevicesList){
                            if(device.devices){
                                if(fav.deviceId==device.devices[0].deviceId){
                                    device.isFavorite=true;
                                }
                            }

                        }
                    }
                }
                console.log(this.manageDeviceList);
            });
    }
    setAsFavorits(deviceId,index){
        this
            .httpService
            .get('/rsb-vera/ems/vera/device/toggleFavorite?deviceid='+deviceId)
            .subscribe(res => {
               this.manageDeviceList[index].isFavorite=(!this.manageDeviceList[index].isFavorite);
            }
            )
    }
    openList(point){
        this
            .manageDeviceList
            .forEach((element, index) => {
                if (element.id == this.deviceId) {
                    this.point = element;
                    this.pointIndex = index;
                }
            });
            this.deviceData = {
                'deviceId': this.deviceId,
                'point': this.point,
                'index': this.pointIndex
            };
        this.dataPassService.selectedPoint=point;
        this.appService.subHeaderName.emit('config');
        this.router.navigateByUrl('config/list-config');
    }
    getAreaName(areaId){
        for(let area of this.dataPassService.areaList){
            if(areaId==area.id){
                if(this.dataPassService.currentLang=='fa'){
                    return area.location[5].faName;
                }
                if(this.dataPassService.currentLang=='en'){
                    return area.location[5].enName;
                }
            }
        }
    }
}
