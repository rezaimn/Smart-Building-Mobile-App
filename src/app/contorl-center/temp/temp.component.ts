import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DataPassService} from '../../utils/services/data-pass-service';
import {EavWrapperService, HttpService} from '../../utils/services';
import {RouteStackService} from '../../utils/services/routeStack.service';
import {StructureTreeService} from '../../utils/services/structureTree.service';
import {IonicPage} from "ionic-angular";
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import {environment} from "../../../environments/environment";

@IonicPage()
@Component({
  selector: 'temp',
  templateUrl: 'temp.component.html'
})
export class TempComponent {
  public selectedCampusId: any = 0;
  public selectedBuildingId: any = 0;
  public selectedFloorId: any = 0;
  selectedCampusIndex = 0;
  selectedBuildingIndex = 0;
  selectedFloorIndex = 0;
  selectedTPRIndex = 0;
  setpointValue = 10;
  showDialog = false;
  hvacList = [];
  floorList = [];
  buildingList = [];
  private stompClient;
  private serverUrl = environment.wsUrl;
  public rangeObject: any = {lower: 0, upper: 100};

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              public router: Router,
              public appService: AppService,
              private appComponent: App,
              public translate: TranslateService,
              public httpService: HttpService,
              private eavWrapperService: EavWrapperService,
              public dataPassService: DataPassService,
              private stackService: RouteStackService,
              private structureTreeService: StructureTreeService,
  ) {
    this.stackService.push(this.router.url, null);
    this.dataPassService.leadIcon = "./assets/images/control/thermostat";
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
    this.buildingList = this.structureTreeService.getCampusBuildings(null);
    if (this.buildingList.length > 0) {
      this.floorList = this.structureTreeService.getBuildingFloors(this.buildingList[0].location[3].enName);
    }
    if (this.floorList.length > 0) {
      this.selectedCampusId = this.dataPassService.campusList[0].id;
      this.selectedBuildingId = this.buildingList[0].id;
      this.selectedFloorId = this.floorList[0].id;
      this.getAllHvacDevices();
    }


  }

  async initializeWebSocketConnection() {
    let ws = new WebSocket(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/topic/device-operation', (message) => {
        if (message.body) {
          let devicestatus = JSON.parse(message.body);
          for (let hvac of that.hvacList) {
            if (hvac.deviceid == devicestatus.endPointUniqueId) {
              hvac.isProcessing = false;
              hvac.value = devicestatus.value;
            }

          }
        }
      });
    });
  }

  ngOnDestroy() {
    try {
      this.stompClient.disconnect();
    } catch (e) {
    }
  }

  setCampusIndex(index, campus) {
    this.selectedCampusIndex = index;
    this.selectedCampusId = campus.id;
    this.buildingList = this.structureTreeService.getCampusBuildings(campus.location[2].enName);
    if (this.buildingList.length > 0) {
      this.setBuildingIndex(0, this.buildingList[0]);
    } else {
      this.floorList = [];
    }
    this.selectedBuildingIndex = 0;
    this.selectedFloorIndex = 0;
  }

  setBuildingIndex(index, building) {
    this.selectedBuildingId = building.id;
    this.selectedBuildingIndex = index;
    if (this.buildingList.length > 0) {
      this.floorList = this.structureTreeService.getBuildingFloors(building.location[3].enName);
      if (this.floorList.length > 0) {
        this.setFloorIndex(0, this.floorList[0]);
      } else {
        this.hvacList = [];
      }
    } else {
      this.floorList = [];
      this.hvacList = [];
    }

    this.selectedFloorIndex = 0;
  }

  setFloorIndex(index, floor) {
    this.selectedFloorIndex = index;
    this.selectedFloorId = floor.id;
    this.getAllHvacDevices();
  }

  getAllHvacDevices() {
    this.hvacList = [];
    this
      .httpService
      .get('/rsb-vera/ems/vera/device/getAllVeraOzwDevice?campusId=' + this.selectedCampusId + '&buildingId=' + this.selectedBuildingId + '&floorId=' + this.selectedFloorId + '&workingState=-1&type=-1&queryType=HVAC' + `&size=` + 10000 + `&page=` + 0)
      .subscribe(res => {
          const allHvac = JSON.parse(res._body);
          this.hvacList = allHvac.content;
          for (let hvac of this.hvacList) {
            hvac.setpoint = 0;
            hvac.mode = 0;
            if (hvac.devicetype == 'TRM') {
              this.httpService.getPe(`/SEMS/GetHVACDeviceDataBySerialNumber?serialnumber=` + hvac.serialnumber).subscribe((res) => {
                let hvacData = JSON.parse(res._body);
                hvac.setpoint = hvacData.comforrtsetpoint;
                hvac.mode = hvacData.mode;
              }, (err) => {

              });
            }

          }
        }
      );
  }

  myOnFinish(setP, index) {
    this.showDialog = !this.showDialog;
    if (this.showDialog) {
      this.setpointValue = setP;
      this.openModal('temp', index);
    }

  }

  setTemper() {
    this.hvacList[this.selectedTPRIndex].isProcessing=true;
    let data = {
      operationType: 3,
      endPointUniqueId:this.hvacList[this.selectedTPRIndex].deviceid,
      value: this.setpointValue
    };
    this.httpService
      .post('/rsb-iot/device/command', data)
      .subscribe(data => {
        },
        (error)=>{
          this.hvacList[this.selectedTPRIndex].isProcessing=false;
        }
      );

  }

  openHmode(hvac) {
    this.dataPassService.selectedHvac = hvac;
    this.router.navigateByUrl('control/hvac-mode');
  }

  openModal(modalId, index) {
    this.selectedTPRIndex = index;
    document.getElementById(modalId).style.display = 'block';
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    this.httpService.getPe(`/SEMS/GetHVACDeviceDataBySerialNumber?serialnumber=` + this.hvacList[this.selectedTPRIndex].serialnumber).subscribe((res) => {
      let hvacData = JSON.parse(res._body);
      this.hvacList[this.selectedTPRIndex].setpoint = hvacData.comforrtsetpoint;
    }, (err) => {

    });
  }
}
