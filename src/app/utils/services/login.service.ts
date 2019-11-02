import {Injectable} from '@angular/core';
import {DataPassService} from './data-pass-service';
import {AlertSettings} from "../../menu/app-settings/alert-settings";
import {AppService} from "../../app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "./http.service";
import {DomSanitizer} from "@angular/platform-browser";
import {EavWrapperService} from "./eav-wrapper.service";
import {CalculateHomeDataService} from "./calculateHomeData.service";
import {StructureTreeService} from "./structureTree.service";
import {ErrorMessageService} from "./error-message-service";
import {RouteStackService} from "./routeStack.service";
import {NativeStorage} from "@ionic-native/native-storage";


@Injectable()
export class LoginService {
  public rememberMe=false;
  constructor(public appService: AppService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private dataPassService: DataPassService,
              private httpService: HttpService, private sanitizer: DomSanitizer,
              private eavWrapper: EavWrapperService,
              private calculateHomeData:CalculateHomeDataService,
              private structureTreeService:StructureTreeService,
              private errorMessageService:ErrorMessageService,
              private stackService:RouteStackService,
              private nativeStorage: NativeStorage) {
    this.nativeStorage.getItem("rememberMe").then(
      (data:any )=> {
        this.rememberMe = data;
      }
    )

  }
  loginUser(loginObject) {
    let loginData = {
      'loginUsername':loginObject
        .username
        .trim()
        .toUpperCase(),
      'loginPassword': loginObject.password
    };
    //
    this
      .httpService
      .login('/rsb-security/login', loginData)
      .subscribe((data) => {
        this.nativeStorage.setItem("userName",loginObject.username.trim());
        if (data !== null) { //Success Store the details of the user in session storage

          this.dataPassService.loggedInUser = JSON.parse(data._body);
          this.dataPassService.organizationId=this.dataPassService.loggedInUser.orgId;
          if(this.rememberMe){
            this.nativeStorage.setItem("loggedInUser",this.dataPassService.loggedInUser);
            this.nativeStorage.setItem("rememberMe",this.rememberMe);
          }

          if(this.dataPassService.loggedInUser.twoPassVerification){
            this
              .httpService
              .get('/rsb-security/sendOtp?username=' +loginObject.username.trim())
              .subscribe((res) => {
                this.router.navigateByUrl('two-factor');
                }
              )

          }else{
            this.getSubsidiary();
            this.getUserPicture();
            this.getAlertSettings();
            this.getRoles();
            this.dataPassService.isLoggedIn = true;
            this.getSOSStatus();
            this.getPanicStatus();
            this.structureTreeService.loadStructure();
            this.router.navigateByUrl('home');
          }

        }
      });
  }
  setRememberMe(rememberMeTemp){
    this.rememberMe=rememberMeTemp;
  }
  getRoles(){
    this
      .httpService
      .get('/rsb-security/security/authz/permission/permissionForUser?userId=' + this.dataPassService.loggedInUser.user_id)
      .subscribe((res) => {
          let permissionsT=JSON.parse(res._body);
          //console.log(res);
          let modules=[];
          if(permissionsT!=[]){
            this.dataPassService.roleName=permissionsT[0].role.roleName;
            for(let module of permissionsT[0].modules){
              let screens=[];
              for(let screen of module.module.screens){
                if(screen.permission.access!=2){
                  screens.push(screen);
                }
              }
              module.module.screens=screens;
              modules.push(module);
            }
          }
          this.dataPassService.userPermissions =modules;
        }
      );
  }
  getAlertSettings(){
    let alertSettings=new AlertSettings({});
    this.httpService.get('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/settings' ).subscribe(
      (res: any) => {
      },
      (error:any)=>{
        let errorData=JSON.parse(error._body)
        if(errorData.errorCode=='2002'){
          alertSettings.userId=this.dataPassService.loggedInUser.user_id;
          alertSettings.smsAlert=1;
          alertSettings.emailAlert=1;
          alertSettings.pushAlert=1;
          alertSettings.dailyDigestAlert=0;
          alertSettings.twoPassVerification=false;
          this.httpService.post('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/settings' , alertSettings ).subscribe(
            (res: any) => {
              // if(JSON.parse(res)==null){
              // }
            }
          );
        }
      }
    );
  }
  getUserPicture(){
    if (this.dataPassService.loggedInUser.picture == ''||this.dataPassService.loggedInUser.picture == null) {
      this.dataPassService.loggedInUser.picture = './assets/images/home/slider/org-stats/personnel-dark.png';
    } else {
      this
        .httpService
        .get('/rsb-oms/oms/getFile/'+this.dataPassService.loggedInUser.picture)
        .subscribe(res => {
          const imageData = JSON.parse(res._body).data;
          const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
          this.dataPassService.loggedInUser.picture = profilePicture;
          if(this.rememberMe){
            this.nativeStorage.setItem("loggedInUser",this.dataPassService.loggedInUser);
          }
        }, (error: any) => {
        });
    }
  }
  getSubsidiary() {
    this
      .httpService
      .get(`/rsb-oms/oms/getChildEntities?parentId=` + this.dataPassService.organizationId+`&Accept-Language=`+this.appService.currentLang)
      .subscribe(res => {
        let allSubsidiaries = JSON.parse(res._body);
        if(this.dataPassService.loggedInUser.subsidiaryId!=0){
          allSubsidiaries.forEach(subsidiary => {
            let subsidiaryJson = this
              .eavWrapper
              .eavToJson(subsidiary, 'SUBSIDIARY');
            if (subsidiaryJson !== null) {
              if(this.dataPassService.loggedInUser.subsidiaryId==subsidiaryJson.id){
                this.dataPassService.selectedSubsidiary=subsidiaryJson;
              }
            }
          });
        }else{
          this.dataPassService.selectedSubsidiary=null;
        }

      }, (error: any) => {

      });
  }
  getSOSStatus() {
    this.httpService.get('/rsb-security/security/user/'+this.dataPassService.loggedInUser.user_id+'/sos?active=0' )
      .map((res) => res.json())
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.dataPassService.sosStatus = data;
        }
      }, (error: any) => {
        // this.appService.showFail('FAILED TO TRIGGER SIRENS.');
      });
  }
  getPanicStatus() {
    this.httpService
      .getPe('/SFMS/GetAllSirensState')
      .subscribe(data => {
        this.dataPassService.panicStatus = JSON.parse(data._body);
      });
  }
  resetPassword(loginData){
    if (loginData.username.length > 0) {
      this.httpService.post('/rsb-security/forgotpassword?loginUsername=' + loginData.username, '').subscribe(res => {
        this.router.navigateByUrl('reset-password');
      });
    }else{
      this.errorMessageService.PEErrors("لطقا ابتدا ایمیل خود را وارد نمایید.");
    }

  }
}
