import {Component} from '@angular/core';
import {AppService} from '../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../app';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../utils/services';
import {DataPassService} from '../utils/services/data-pass-service';
import {RouteStackService} from '../utils/services/routeStack.service';
import {ScreenPermissionService} from '../utils/services/screen-permission.service';
import {ErrorMessageService} from '../utils/services/error-message-service';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import {IonicPage} from "ionic-angular";
import {environment} from "../../environments/environment";

@IonicPage()
@Component({
  selector: 'control',
  templateUrl: 'control.component.html'
})
export class ControlComponent {
  panicStatus = false;
  sosStatus = false;
  sirenPassword = '';
  private stompClient;
  private serverUrl = environment.wsUrl;
  SOSIsProcessing = false;
  panicIsProcessing = false;
  localPanicState=false;
  localSOSState=false;
  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              public router: Router,
              public appService: AppService,
              private appComponent: App,
              public translate: TranslateService,
              private httpService: HttpService,
              public dataPassService: DataPassService,
              private stackService: RouteStackService,
              public screenPermissionService: ScreenPermissionService,
              private errorMessageService: ErrorMessageService,
  ) {
    this.stackService.empetyStack();
    this.stackService.push(this.router.url, null);

  }

  ngOnInit() {
    this.initializeWebSocketConnection();
    this.getPanicStatus();
    this.localPanicState=this.dataPassService.panicStatus;
    if(this.dataPassService.sosStatus==1){
      this.localSOSState=true;
    }

  }
  getPanicStatus() {
    this.httpService
      .getPe('/SFMS/GetAllSirensState')
      .subscribe(data => {
        this.dataPassService.panicStatus = JSON.parse(data._body);
        this.localPanicState=this.dataPassService.panicStatus;
      });
  }
  async initializeWebSocketConnection() {
    let ws = new WebSocket(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/topic/device-operation', (message) => {
        if (message.body) {
          let devicestatus = JSON.parse(message.body);
          if (devicestatus.type == 'SRN') {
            this.panicIsProcessing = false;
            if(devicestatus.state==1){
              this.dataPassService.panicStatus = true;
            }else{
              this.dataPassService.panicStatus = false;
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

  openSiren() {
    this.router.navigateByUrl('control/siren');
  }

  openPlug() {
    this.router.navigateByUrl('control/plug');
  }

  openLight() {
    this.router.navigateByUrl('control/light');
  }

  openTemp() {
    this.router.navigateByUrl('control/temp');
  }

  openCam() {
    this.router.navigateByUrl('control/camera');
  }

  triggerPanic(status) {
    let statusT = 0;
    if (status) {
      statusT = 1;
    }
    if (this.sirenPassword == '0000') {
      this.panicIsProcessing = true;
      let data = {
        operationType: 3,
        type: 'SRN',
        state: statusT
      };
      this.httpService
        .post('/rsb-iot/device/command', data)
        .subscribe(data => {
            this.sirenPassword = '';
          },
          (error) => {
            this.panicIsProcessing = true;
            this.sirenPassword = '';
          }
        );

    } else {
      this.sirenPassword = '';
      this.errorMessageService.PEErrors("کلمه عبور اشتباه می باشد!");
    }
  }

  toggleSOS() {
    let status=0;
    if(!this.localSOSState){
      status=1;
    }
    this.httpService.get('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/sos?active='+status )
      .subscribe(data => {
          this.dataPassService.sosStatus = status;
            this.localSOSState=!this.localSOSState;
            console.log(this.localSOSState);
      }, (error: any) => {

      });
  }

  openModal(modalId) {
    // if(modalId=='panic'){
    //   this.dataPassService.panicStatus
    // }
    document.getElementById(modalId).style.display = 'block'
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';

  }

}
