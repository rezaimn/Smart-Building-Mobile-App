import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../../app.service';
import {App} from '../../../app';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DataPassService} from '../../../utils/services/data-pass-service';
import {HttpService} from '../../../utils/services/index';
import {RouteStackService} from '../../../utils/services/routeStack.service';
import {IonicPage} from "ionic-angular";
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import {environment} from "../../../../environments/environment";

@IonicPage()
@Component({
  selector: 'hvac-mode',
  templateUrl: 'mode.component.html'
})
export class HvacModeComponent {
  selectedIndex = 0;
  private stompClient;
  private serverUrl = environment.wsUrl;
  isProcessing=false;
  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              public router: Router,
              public appService: AppService,
              private appComponent: App,
              public translate: TranslateService,
              public dataPassService: DataPassService,
              private httpService: HttpService,
              private stackService: RouteStackService
  ) {
    this.stackService.push(this.router.url, null);
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
    this.selectedIndex = this.dataPassService.selectedHvac.mode;
  }

  async initializeWebSocketConnection() {
    let ws = new WebSocket(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/topic/device-operation', (message) => {
        if (message.body) {
          let devicestatus = JSON.parse(message.body);

            if (this.dataPassService.selectedHvac.deviceid == devicestatus.endPointUniqueId) {
              this.isProcessing = false;
              this.selectedIndex = devicestatus.state;
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

  setIndex(index) {
    this.selectedIndex = index;
    this.openModal();
  }

  openModal() {
    document.getElementById('hvac-mode').style.display = 'block';
  }

  closeModal(modal) {
    document.getElementById(modal).style.display = 'none';
    //this.selectedIndex=this.dataPassService.hvacMode;
  }

  setHvacMode() {
    this.isProcessing=true;
    let data = {
      operationType: 3,
      endPointUniqueId:this.dataPassService.selectedHvac.deviceid,
      state: this.selectedIndex
    };
    this.httpService
      .post('/rsb-iot/device/command', data)
      .subscribe(data => {
        },
        (error)=>{
          this.isProcessing=false;
        }
      );

  }

}
