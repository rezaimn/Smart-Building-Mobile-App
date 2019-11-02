import {RouterModule, Routes} from '@angular/router';
import {HomeViewComponent} from './home/home-view.component';

import {LoginComponent} from './login/login.component';
import {ApplianceGridComponent} from './home/appliance-grid/appliance-grid.component';
import {SafetyStatusComponent} from './home/safety-status/safety-status.component';
import {ParkingStatusComponent} from './home/parking-status/parking-status.component';
import {LightingGridComponent} from './home/lighting-grid/lighting-grid.component';
import {HvacGridComponent} from './home/hvac-grid/hvac-grid.component';
import {ControlComponent} from './contorl-center/control.component';
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
import {SearchResultComponent} from './search-result/search-result.component';
import {NotifyComponent} from './notifications/notify.component';
import {UserEditComponent} from './search-result/user-search-result/user-edit/user-edit.component';
import {VisitorEditComponent} from './search-result/visitor-search-result/visitor-edit/visitor-edit.component';
import {DeviceEditComponent} from './search-result/device-search-result/device-edit/device-edit.component';
import {ConfigComponent} from './config/config.component';
import {ConfigListComponent} from './config/list/config-list.component';
import {SubsidiaryComponent} from './menu/subsidiary/subsidiary.component';
import {UserProfileComponent} from './menu/profile/user-profile.component';
import {LogsComponent} from './menu/logs/logs.component';
import {AppSettingsComponent} from './menu/app-settings/app-settings.component';
import {ScenarioComponent} from './menu/scenario/scenario.component';
import {AlertManagementComponent} from './menu/alert-management/alert-management.component';
import {AlertAddEditComponent} from './menu/alert-management/add-edit/alert-add-edit.component';
import {ScenarioAddEditComponent} from './menu/scenario/add-edit/scenario-add-edit.component';
import {AboutComponent} from './menu/about/about.component';
import {AuthGuard} from './utils/authguard/routeguard';
import {ResetPasswordComponent} from "./login/reset-password/reset-password.component";
import {TwoFactorComponent} from "./login/two-factor/two-factor.component";

const appRoutes: Routes = [

  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    component: SearchResultComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user-edit',
    component: UserEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'visitor-edit',
    component: VisitorEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'device-edit',
    component: DeviceEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'app-settings',
    component: AppSettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomeViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/appliance-grid',
    component: ApplianceGridComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/safety-status',
    component: SafetyStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/parking-status',
    component: ParkingStatusComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/lighting-grid',
    component: LightingGridComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/hvac-grid',
    component: HvacGridComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/visitor-stats',
    component: VisitorStatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/device-stats',
    component: DeviceStatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home/organization-stats',
    component: OrganizationStatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'control',
    component: ControlComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'control/siren',
    component: SirenComponent,
    canActivate: [AuthGuard],
  }, {
    path: 'control/plug',
    component: PlugComponent,
    canActivate: [AuthGuard],

  }, {
    path: 'control/light',
    component: LightComponent,
    canActivate: [AuthGuard],

  }, {
    path: 'control/hvac-mode',
    component: HvacModeComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'control/temp',
    component: TempComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'control/camera',
    component: CameraComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'control/set-camera',
    component: SetCameraComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'notify',
    component: NotifyComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'config',
    component: ConfigComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'config/list-config',
    component: ConfigListComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'subsidiary',
    component: SubsidiaryComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'scenario',
    component: ScenarioComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'alert-management',
    component: AlertManagementComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'alert-add-edit',
    component: AlertAddEditComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'scenario-add-edit',
    component: ScenarioAddEditComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'two-factor',
    component: TwoFactorComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];


export const routing = RouterModule.forRoot(appRoutes);

