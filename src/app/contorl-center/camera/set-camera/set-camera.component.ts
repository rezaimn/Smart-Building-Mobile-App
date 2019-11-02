import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../../app.service';
import {App} from '../../../app';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {EavWrapperService, HttpService} from '../../../utils/services';
import {DataPassService} from '../../../utils/services/data-pass-service';
import {RouteStackService} from '../../../utils/services/routeStack.service';
import {StructureTreeService} from '../../../utils/services/structureTree.service';
import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'set-camera',
    templateUrl: 'set-camera.component.html'
})
export class SetCameraComponent  {
    public selectedFloorId: any = 0;
    selectedCampusIndex = 0;
    selectedBuildingIndex = 0;
    selectedFloorIndex = 0;
    selectedCAMIndex;
    cameraList = [];
    floorList=[];
    buildingList=[];
    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                public httpService: HttpService,
                private eavWrapperService: EavWrapperService,
                public dataPassService: DataPassService,
                private stackService:RouteStackService,
                private structureTreeService:StructureTreeService,
    ) {
        this.stackService.push(this.router.url,null);
    }
    ngOnInit() {
        this.buildingList=this.structureTreeService.getCampusBuildings(null);
        if(this.buildingList.length>0){
            this.floorList=this.structureTreeService.getBuildingFloors(this.buildingList[0].location[3].enName);
        }
        if(this.floorList.length>0){
            this.selectedFloorId=this.floorList[0].id;
            this.getAllCameras();
        }

    }
    setCampusIndex(index,campus){
        this.selectedCampusIndex=index;
        this.buildingList=this.structureTreeService.getCampusBuildings(campus.location[2].enName);
        if(this.buildingList.length>0){
            this.setBuildingIndex(0,this.buildingList[0]);
        }else{
            this.floorList=[];
        }
        this.selectedBuildingIndex=0;
        this.selectedFloorIndex=0;
    }
    setBuildingIndex(index,building){
        this.selectedBuildingIndex=index;
        if(this.buildingList.length>0) {
            this.floorList = this.structureTreeService.getBuildingFloors(building.location[3].enName);
            if(this.floorList.length>0){
                this.setFloorIndex(0,this.floorList[0]);
            }else{
                this.cameraList=[];
            }
        }else{
            this.floorList=[];
            this.cameraList=[];
        }

        this.selectedFloorIndex=0;
    }
    setFloorIndex(index, floor) {
        this.selectedFloorIndex = index;
        this.selectedFloorId = floor.id;
        this.getAllCameras();
    }


    getAllCameras(){
        this.cameraList=[];
        this
            .httpService
            .getPe(`/SSMS/GetCamerasByFloor?id=` + this.selectedFloorId + "&page=" + 1 + "&records=" + 10000)
            .subscribe(res => {

                if (res.status === 200) {
                    let cameras = JSON.parse(res._body);
                    this.cameraList = cameras.records;
                    for (let cam of this.cameraList) {
                        var rtspaddress = cam.ipaddress;
                        var i = rtspaddress.indexOf("/");
                        rtspaddress = rtspaddress.substr(0, i);
                        rtspaddress = "rtsp://" + rtspaddress + "/Streaming/Channels/1";
                        cam.rtspaddress = rtspaddress;
                    }
                }
                }
            );
    }
    setIndex(camera,index){
        this.selectedCAMIndex=index;

        if(this.dataPassService.selectedCamera=="cam1"){
            this.dataPassService.camera1=camera;
        }
        if(this.dataPassService.selectedCamera=="cam2"){
            this.dataPassService.camera2=camera;
        }
        this.stackService.pop();
        this.router.navigateByUrl(this.stackService.pop().route);
    }


}
