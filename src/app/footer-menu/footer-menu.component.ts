import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../app.service';
import {TranslateService} from '@ngx-translate/core';
import {DataPassService} from '../utils/services/data-pass-service';
import {StompService} from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import {environment} from '../../environments/environment';
import {IonicPage} from "ionic-angular";
import {LocalNotifications} from "@ionic-native/local-notifications";

@IonicPage()
@Component({
  selector: 'footer-menu',
  templateUrl: 'footer-menu.component.html'

})

export class FooterMenuComponent implements OnInit, OnDestroy {
  private stompClient;
  counter = 0;
  private user;
  private serverUrl = environment.wsUrl;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public appService: AppService,
              public translate: TranslateService,
              public dataPassService: DataPassService,
              private localNotifications: LocalNotifications) {
    this.user = this.dataPassService.loggedInUser;
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
  }

  async initializeWebSocketConnection() {
    let ws = new WebSocket(this.serverUrl);
    // var _transportClose = ws._transportClose;
    // ws._transportClose = function (code, reason) {
    //   try {
    //     if (this._transport && this._transport.close) {
    //       this._transport.close();
    //     }
    //     _transportClose.call(this, code, reason);
    //   } catch (e) {
    //   }
    // };
    //alert("run");

    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {


//alert("stomp created");

      that.stompClient.subscribe('/topic/notify1', (message) => {

        //alert("notification received");
        if (message.body) {

          let staffId = that.user.staffId;
          let devicestatus = JSON.parse(message.body);
          //alert(devicestatus.message);
          if (devicestatus.device == null) {
            let audio = new Audio();
            audio.src = "./assets/sounds/sos-alarm.mp3";
            audio.load();
            audio.play();
          }
          that.localNotifications.schedule({
            id: ++that.counter,
            title: 'Maata Notification',
            text: devicestatus.message,
            icon: 'file://assets/images/home/home-screen/logo.png',
            led: {color: '#ff0c4b', on: 2500, off: 1500},
            lockscreen: true,
            vibrate: true,
            foreground: true,
          });
          that.localNotifications.on('click').subscribe(
            (data) => {
              that.router.navigateByUrl('notify');
              that.localNotifications.clearAll();
            }
          )


          if (staffId == devicestatus.staffId || staffId == 0) {

            that.dataPassService.notificationsCount = that.dataPassService.notificationsCount + 1;
            let isInNotifArray = false;
            let event = {
              id: devicestatus.id,
              message: devicestatus.message,
              time: devicestatus.date.substr(11, 8),
              staffId: devicestatus.staffId,
              isSeen: false
            };
            let notifObj = {
              date: '',
              hasNotSeen: true,
              device: null,
              events: []
            };
            for (let notif of that.dataPassService.notificationsStack) {
              if (devicestatus.device != null && notif.device != null) {
                if (notif.device.id == devicestatus.device.id && notif.date == devicestatus.date.substr(0, 10)) {
                  notif.events.unshift(event);
                  notif.hasNotSeen = true;
                  isInNotifArray = true;
                  break;
                }
              } else {
                if (notif.date == devicestatus.date.substr(0, 10) && notif.device == null && devicestatus.device == null) {
                  notif.events.unshift(event);
                  notif.hasNotSeen = true;
                  isInNotifArray = true;
                  break;
                }
              }
            }
            if (!isInNotifArray) {
              notifObj.date = devicestatus.date.substr(0, 10);
              if (devicestatus.device != null) {
                notifObj.device = devicestatus.device;
              }
              notifObj.events.push(event);
              that.dataPassService.notificationsStack.unshift(notifObj);

            }

          }


        }


      });

    });
    //
    // setInterval(() => {
    //     this.stompClient.send('/app/ticketCount', {}, this.user.staff_id);
    //     this.stompClient.send('/app/notificationCount', {}, this.user.staff_id);
    //     // let var1:string = "{\"staffId\": \"0\" , \"message\":\"hello1\"}";
    //     // this.stompClient.send("/app/notify1" , {}, var1);
    //
    // }, (60000));
  }

  ngOnDestroy() {
    try {
      this.stompClient.disconnect();
    } catch (e) {
    }
  }

  openHome() {
    this.dataPassService.footerClicked.emit(true);
    this.dataPassService.isBackActive = false;
    this.dataPassService.searchMode = false;
    this.appService.subHeaderName.emit('home');
    this.dataPassService.footerActiveIcon = 'home';
    this.dataPassService.searchText = '';
    this.dataPassService.homeSelected.emit(true);
    this.router.navigateByUrl('home');
    // this.appService.currentUrl.emit('home');

  }

  openControl() {
    this.dataPassService.footerClicked.emit(true);
    this.dataPassService.isBackActive = false;
    this.dataPassService.searchMode = false;
    this.dataPassService.searchText = '';
    // this.appService.subHeaderName.emit('control');
    this.router.navigateByUrl('control');
    // this.appService.currentUrl.emit('control');
    this.dataPassService.footerActiveIcon = 'control';
  }

  openSearch() {
    this.dataPassService.footerClicked.emit(true);
    this.dataPassService.isBackActive = false;
    this.dataPassService.searchText = '';
    this.dataPassService.searchMode = true;
    this.appService.subHeaderName.emit('search');
    // this.appService.currentUrl.emit('home');
    this.dataPassService.footerActiveIcon = 'search';
    // this.dataPassService.selectedfilterType = '';
    this.dataPassService.manageMode = false;
    this.dataPassService.filterIsActive = true;
    this.dataPassService.selectedfilterType = 'all';
    this.router.navigateByUrl('search');
  }

  openConfig() {
    this.dataPassService.footerClicked.emit(true);
    this.dataPassService.isBackActive = false;
    this.dataPassService.searchText = '';
    this.dataPassService.searchMode = false;
    this.appService.subHeaderName.emit('config');
    this.router.navigateByUrl('config');
    // this.appService.currentUrl.emit('home');
    this.dataPassService.footerActiveIcon = 'config';
  }

  openNotif() {
    this.dataPassService.footerClicked.emit(true);
    this.dataPassService.isBackActive = false;
    this.dataPassService.searchText = '';
    this.dataPassService.searchMode = false;
    this.appService.subHeaderName.emit('notif');
    this.router.navigateByUrl('notify');
    // this.appService.currentUrl.emit('home');
    this.dataPassService.footerActiveIcon = 'notif';
  }

  userHasAccessToModule(moduleName) {
    for (let module of this.dataPassService.userPermissions) {
      if (module.module.code == moduleName) {
        for (let screen of module.module.screens) {
          if (screen.permission.access != 2) {
            return true;
          }
        }

      }
    }

    return false;
  }
}
