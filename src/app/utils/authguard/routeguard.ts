import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Router, CanActivate, CanActivateChild} from '@angular/router';
import {DataPassService} from '../services/data-pass-service';
import {NativeStorage} from "@ionic-native/native-storage";
import {LoginService} from "../services/login.service";
import {StructureTreeService} from "../services/structureTree.service";
import {Platform} from "ionic-angular";

/**
 * @class AuthGuard
 * @classdesc
 *AuthGuard class checks for the session token, userid and csrf token,which in turn
 shows user is logged in and return true or else false.
 Which further used to redirect through navigate to other route
 * @var authguard is a variable which return boolean value to specify user login interaction
 * @return Flag with boolean value will be returned. True: If User is Authorized else False
 * @author gaurav.rao
 **/

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router,
              public dataPassService: DataPassService,
              private nativeStorage: NativeStorage,
              public loginService: LoginService,
              private structureTreeService: StructureTreeService,
              private platform: Platform) {
  }

  /* Function to check whether user is logged in or not*/
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (this.dataPassService.isLoggedIn) {
      return true;
    } else {
      this.platform.ready().then((readySource) => {
          this.nativeStorage.getItem("rememberMe").then(
            (rememberMe: any) => {

              if (rememberMe) {
                this.nativeStorage.getItem("loggedInUser").then(
                  (data: any) => {
                    this.dataPassService.loggedInUser = data;
                    this.loginService.getSubsidiary();
                    this.loginService.getUserPicture();
                    this.loginService.getAlertSettings();
                    this.loginService.getRoles();
                    this.dataPassService.isLoggedIn = true;
                    this.loginService.getSOSStatus();
                    this.loginService.getPanicStatus();
                    this.structureTreeService.loadStructure();
                    this.router.navigateByUrl('home');
                    return true;
                  }
                )
              } else {
                this.router.navigateByUrl('login');
                return false;
              }

            },
            (error: any) => {
              this.router.navigateByUrl('login');
              return false;
            }
          )
        }
      )
    }
  }

  /* Call the Parent function even for child routes*/
  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    alert("reeeeeeeeeeeeeeeeza");
    if (this.dataPassService.isLoggedIn) {
      return true;
    } else {
      this.router.navigateByUrl('');
      return false;
    }
    ;
  }

}
