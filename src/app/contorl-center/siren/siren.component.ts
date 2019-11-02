import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {EavWrapperService, HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {RouteStackService} from '../../utils/services/routeStack.service';
import {StructureTreeService} from '../../utils/services/structureTree.service';
import {IonicPage} from "ionic-angular";
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import {environment} from "../../../environments/environment";

@IonicPage()
@Component({
  selector: 'siren',
  templateUrl: 'siren.component.html'
})
export class SirenComponent {
  public hvacList = [];

  public selectedCampusId: any = 0;
  public selectedBuildingId: any = 0;
  selectedCampusIndex = 0;
  selectedBuildingIndex = 0;
  selectedFloorIndex = 0;
  selectedSRNIndex;
  buildingList = [];
  private stompClient;
  private serverUrl = environment.wsUrl;

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              public router: Router,
              public appService: AppService,
              private appComponent: App,
              public translate: TranslateService,
              public httpService: HttpService,
              public eavWrapperService: EavWrapperService,
              public dataPassService: DataPassService,
              private stackService: RouteStackService,
              private structureTreeService: StructureTreeService
  ) {

    this.stackService.push(this.router.url, null);
    this.dataPassService.leadIcon = "./assets/images/control/siren";
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
    this.buildingList = this.structureTreeService.getCampusBuildings(null);
    this.selectedCampusId = this.dataPassService.campusList[0].id;
    this.selectedBuildingId = this.buildingList[0].id;
    this.getAllHvacDevices();
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
              hvac.deviceworkingstate = devicestatus.state;
              if (devicestatus.state == 0) {
                hvac.on = false;
              } else {
                hvac.on = true;
              }
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
    this.setBuildingIndex(0, this.buildingList[0]);
    this.selectedBuildingIndex = 0;
    this.selectedFloorIndex = 0;
  }

  setBuildingIndex(index, building) {
    this.selectedBuildingId = building.id;
    this.selectedBuildingIndex = index;
    this.getAllHvacDevices();
  }


  getAllHvacDevices() {
    this.hvacList = [];
    this
      .httpService
      .get('/rsb-vera/ems/vera/device/getAllVeraOzwDevice?campusId=' + this.selectedCampusId + '&buildingId=' + this.selectedBuildingId + '&floorId=' + -1 + '&workingState=-1&type=-1&queryType=sfms' + `&size=` + 10000 + `&page=` + 0)
      .subscribe(res => {
        const allHvac = JSON.parse(res._body);
        this.hvacList = allHvac.content;
        for(let hvac of this.hvacList){
          hvac.isProcessing=false;
          if(hvac.deviceworkingstate=='1'){
            hvac.on=true;
          }else {
            hvac.on=false;
          }
        }
        }
      );
  }

  toggleSRN() {
    this.hvacList[this.selectedSRNIndex].isProcessing=true;
    let valueInt = 0;
    if (this.hvacList[this.selectedSRNIndex].deviceworkingstate == '1') {
      valueInt =0;
    } else {
      valueInt =1;
    }
    let data = {
      operationType: 3,
      endPointUniqueId:this.hvacList[this.selectedSRNIndex].deviceid,
      state:valueInt
    };
    this.httpService
      .post('/rsb-iot/device/command', data)
      .subscribe(data => {
        },
        (error)=>{
          this.hvacList[this.selectedSRNIndex].isProcessing=false;
          this.hvacList[this.selectedSRNIndex].on=!this.hvacList[this.selectedSRNIndex].on;
        }
      );

  }

  openModal(modalId, index) {
    this.selectedSRNIndex = index;
    document.getElementById(modalId).style.display = 'block';
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // this.getAllHvacDevices();
  }

}
