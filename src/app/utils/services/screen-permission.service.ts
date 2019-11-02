import {Injectable} from '@angular/core';
import {DataPassService} from './data-pass-service';


@Injectable()
export class ScreenPermissionService {

    constructor(public dataPassService:DataPassService){

    }
    hasAccessToScreen(moduleCode, screenCode) {
        for (let module of this.dataPassService.userPermissions) {
            if (module.module.code == moduleCode) {
                for (let screen of module.module.screens) {
                    if (screen.screen.code == screenCode && screen.permission.access != 2) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}