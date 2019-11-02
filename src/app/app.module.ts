import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {ConnectionBackend, HttpModule, RequestOptions, XHRBackend} from '@angular/http';
import {ChartsModule} from 'ng2-charts';
import 'chart.piecelabel.js';
import { RouterModule} from '@angular/router';

import {App} from './app';

import {AppService} from './app.service';

import {routing} from './app.routing';
import {HomeViewComponent} from './home/home-view.component';

import {FormsModule} from '@angular/forms';
import {HttpService} from './utils/services/http.service';

import {EavWrapperService, SvgService} from './utils/index';
import {FooterMenuComponent} from './footer-menu/footer-menu.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LoginComponent} from './login/login.component';
import {ApplianceGridComponent} from './home/appliance-grid/appliance-grid.component';
// import {SwiperModule} from 'angular2-useful-swiper';
import {TAB_COMPONENTS} from './utils/components/Tabset';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {SafetyStatusComponent} from './home/safety-status/safety-status.component';
import {ParkingStatusComponent} from './home/parking-status/parking-status.component';
import {ControlComponent} from './contorl-center/control.component';
import {LightingGridComponent} from './home/lighting-grid/lighting-grid.component';
import {HvacGridComponent} from './home/hvac-grid/hvac-grid.component';
import {SirenComponent} from './contorl-center/siren/siren.component';
import {PlugComponent} from './contorl-center/plug/plug.component';
import {LightComponent} from './contorl-center/light/light.component';
import {HvacModeComponent} from './contorl-center/temp/thermostat-mode/mode.component';
import {VisitorStatsComponent} from './home/visitor-stats/visitor-stats.component';
import {DeviceStatsComponent} from './home/device-stats/device-stats.component';
import {OrganizationStatsComponent} from './home/organization-stats/organization-stats.component';
import {TempComponent} from './contorl-center/temp/temp.component';
import {CameraComponent} from './contorl-center/camera/camera.component';
import {SetCameraComponent} from './contorl-center/camera/set-camera/set-camera.component';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {SearchResultComponent} from './search-result/search-result.component';
import {DataPassService} from './utils/services/data-pass-service';
import {NotifyComponent} from './notifications/notify.component';
import {UserSearchResultComponent} from './search-result/user-search-result/user-search-result.component';
import {DeviceSearchResultComponent} from './search-result/device-search-result/device-search-result.component';
import {VisitorSearchResultComponent} from './search-result/visitor-search-result/visitor-search-result.component';
import {DeviceEditComponent} from './search-result/device-search-result/device-edit/device-edit.component';
import {UserEditComponent} from './search-result/user-search-result/user-edit/user-edit.component';
import {VisitorEditComponent} from './search-result/visitor-search-result/visitor-edit/visitor-edit.component';
import {ConfigComponent} from './config/config.component';
import {ConfigListComponent} from './config/list/config-list.component';
import {SubsidiaryComponent} from './menu/subsidiary/subsidiary.component';
import {UserProfileComponent} from './menu/profile/user-profile.component';
import {LogsComponent} from './menu/logs/logs.component';
import {AppSettingsComponent} from './menu/app-settings/app-settings.component';
import {MenuComponent} from './menu/menu.component';
import {ScenarioComponent} from './menu/scenario/scenario.component';
import {AlertManagementComponent} from './menu/alert-management/alert-management.component';
import {AlertAddEditComponent} from './menu/alert-management/add-edit/alert-add-edit.component';
import {ScenarioAddEditComponent} from './menu/scenario/add-edit/scenario-add-edit.component';
import {ToastrModule} from 'ngx-toastr';
import {ErrorMessageService} from './utils/services/error-message-service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {StompConfig , StompService } from '@stomp/ng2-stompjs';
import {DatePipe} from '@angular/common';
import {AboutComponent} from './menu/about/about.component';
import {CalculateHomeDataService} from './utils/services/calculateHomeData.service';
import {StructureTreeService} from './utils/services/structureTree.service';
//import {Cam} from 'onvif/onvifcam';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import {RouteStackService} from './utils/services/routeStack.service';
import {AuthGuard} from './utils/authguard/routeguard';
import {ScreenPermissionService} from './utils/services/screen-permission.service';
import {AlertController, IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import {NativeStorage} from "@ionic-native/native-storage";
import {LoginService} from "./utils/services/login.service";
import {TwoFactorComponent} from "./login/two-factor/two-factor.component";
import {BackgroundMode} from "@ionic-native/background-mode";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {environment} from "../environments/environment";

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    observer: true,
    direction: 'horizontal',
    threshold: 50,
    spaceBetween: 15,
    slidesPerView: 1,
    centeredSlides: true
};
export function httpFactory(backend: ConnectionBackend, defaultOptions: RequestOptions,dataPassService:DataPassService,errorService:ErrorMessageService) {
    return new HttpService(backend, defaultOptions,dataPassService,errorService);
}
const stompConfig: StompConfig = {
    // Which server?
    url: environment.wsUrl,

    // Headers
    // Typical keys: login, passcode, host
    headers: {
        // login: 'guest',
        // passcode: 'guest'
    },

    // How often to heartbeat?
    // Interval in milliseconds, set to 0 to disable
    heartbeat_in: 0, // Typical value 0 - disabled
    heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
    // Wait in milliseconds before attempting auto reconnect
    // Set to 0 to disable
    // Typical value 5000 (5 seconds)
    reconnect_delay: 5000,

    // Will log diagnostics on console
    debug: true
};

export function HttpLoaderFactory(httpClient: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets_setup/i18n/', '.json');
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
@NgModule({
    declarations: [
        App,
        MenuComponent,
        SearchResultComponent,
        AppSettingsComponent,
        FooterMenuComponent,
        LoginComponent,
        ResetPasswordComponent,
        TwoFactorComponent,
        HomeViewComponent,
        ControlComponent,
        SirenComponent,
        PlugComponent,
        LightComponent,
        HvacModeComponent,
        TempComponent,
        CameraComponent,
        SetCameraComponent,
        NotifyComponent,
        ConfigComponent,
        ConfigListComponent,
        SubsidiaryComponent,
        UserProfileComponent,
        LogsComponent,
        ScenarioComponent,
        AlertManagementComponent,
        AlertAddEditComponent,
        ScenarioAddEditComponent,
        SafetyStatusComponent,
        ApplianceGridComponent,
        ParkingStatusComponent,
        LightingGridComponent,
        HvacGridComponent,
        VisitorStatsComponent,
        DeviceStatsComponent,
        OrganizationStatsComponent,
        SearchResultComponent,
        UserSearchResultComponent,
        DeviceSearchResultComponent,
        VisitorSearchResultComponent,
        DeviceEditComponent,
        UserEditComponent,
        VisitorEditComponent,
        AboutComponent,
        TAB_COMPONENTS
    ],
    imports: [

        IonicModule.forRoot(App),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpModule,
        ChartsModule,
        RouterModule,
        routing,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        SwiperModule,
        RoundProgressModule,
        NgCircleProgressModule.forRoot({

             backgroundStrokeWidth: 0,
             backgroundPadding: -50,
             radius: 31,
             space: 2,
             toFixed: 0,
             maxPercent: 100,
            outerStrokeWidth: 6,
            outerStrokeColor: "#FF6347",
            innerStrokeColor: "#ff8000",
             innerStrokeWidth: 2,
            titleFontSize: '14px',
            animationDuration: 600,
            showSubtitle: false

        }),
        IonRangeSliderModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-bottom-full-width',
            closeButton: true,
            easing: 'ease-in',
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning',
            },
            tapToDismiss: true,
            preventDuplicates: true
        }),

    ],
    providers: [
      AlertController,
      LocalNotifications,
      BackgroundMode,
      LoginService,
      NativeStorage,
      StatusBar,
      SplashScreen,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthGuard,
        DataPassService,
        ErrorMessageService,
        CalculateHomeDataService,
        StructureTreeService,
        DatePipe,
        {

            provide: HttpService,
            useFactory: httpFactory,
            deps: [XHRBackend, RequestOptions,DataPassService,ErrorMessageService]
        },

        AppService,
        EavWrapperService,
        SvgService,
        RouteStackService,
        ScreenPermissionService,
        StompService,
        {
            provide: StompConfig,
            useValue: stompConfig
        },
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        }

    ],
    bootstrap: [IonicApp],
    entryComponents: [

    ]
})


export class AppModule {
}
