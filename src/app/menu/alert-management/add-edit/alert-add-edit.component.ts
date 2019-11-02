import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {EavWrapperService, HttpService} from '../../../utils/services';
import {DataPassService} from '../../../utils/services/data-pass-service';
import {Alert} from '../alert';
import {ErrorMessageService} from '../../../utils/services/error-message-service';
import {RouteStackService} from '../../../utils/services/routeStack.service';
import {StructureTreeService} from '../../../utils/services/structureTree.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'alert-add-edit',
    templateUrl: 'alert-add-edit.component.html'

})

export class AlertAddEditComponent implements OnInit {
    prepareAlert: Alert = new Alert({});
    editMode = false;
    addMode=false;
    public floorDropdownList: any = [];
    public areaDropdownList: any = [];
    public deviceTypeList: any = [];
    public deviceList: any = [];
    public selectedStaffList: any = [];
    public staffs = [];
    public selectedAreaId: any = 0;
    public selectedFloorId: any = 0;
    selectedAreaIndex = 0;
    selectedFloorIndex = 0;
    selectedStaffId: any;

    constructor(private  httpService: HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router,
                public translate: TranslateService,
                public dataPassService: DataPassService,
                private eavWrapperService: EavWrapperService,
                private errorService:ErrorMessageService,
                private stackService:RouteStackService,
                private structureTreeService:StructureTreeService,) {
        this.stackService.push(this.router.url,null);
        if (this.dataPassService.selectedAlert != null) {
            this.prepareAlert = this.dataPassService.selectedAlert;
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAaaa",this.prepareAlert);
            this.selectedStaffList = this.dataPassService.selectedAlert.stafflist;
        } else {
            this.editMode = true;
            this.addMode=true;
        }
    }

    ngOnInit() {

        this.floorDropdownList = this.dataPassService.floorList;

        if (this.floorDropdownList.length > 0) {
            for(let i=0;i< this.floorDropdownList.length;i++){
                if(this.floorDropdownList[i].id==this.prepareAlert.floorid){
                    this.selectedFloorId = this.floorDropdownList[i].id;
                    this.selectedFloorIndex=i;
                }
            }
            if(this.prepareAlert.floorid>0){
                this.getAllAreas(this.prepareAlert.floorid);
            }else{
                this.getAllAreas(this.floorDropdownList[0].id);
            }

        }
        for(let subsidiary of this.dataPassService.subsidiaryList){
            this.getAllUsers(subsidiary.id);
        }

    }
    saveAlertManage(){
        let i=1;
        for(let staffL of this.selectedStaffList){
            staffL.executionorder=i;
            i=i+1;
        }
        this.prepareAlert.stafflist=this.selectedStaffList;
        this.prepareAlert.floorid=this.selectedFloorId;
        this.prepareAlert.areaid=this.selectedAreaId;
        if(this.addMode){
            delete this.prepareAlert.id;
            this.httpService.postPe(  `/ALMS/CreateAlertList`,this.prepareAlert).subscribe(
                res => {
                    this.editMode=false;
                    if (res._body == 1) {
                        this.translate.get('error-messages.alert-add-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.errorService.PESuccess(subHeaderT);
                            }
                        );
                    }
                    if (res._body == 0) {
                        this.translate.get('error-messages.alert-add-failed', this.appService.currentLang).subscribe(
                            (translateRes) => {
                                this.errorService.PEErrors(translateRes);
                            }
                        );
                    }
                    if (res._body >= 2) {
                        this.errorService.PEErrors(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.alert-add-failed', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.errorService.PEErrors(subHeaderT);
                        }
                    );
                })
        }else{
            this.httpService.postPe(  `/ALMS/UpdateAlertList`,this.prepareAlert).subscribe(
                res => {
                    this.editMode=false;
                    if (res._body == 1) {
                        this.translate.get('error-messages.alert-update-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.errorService.PESuccess(subHeaderT);
                            }
                        );
                    }
                    if (res._body == 0) {
                        this.translate.get('error-messages.alert-update-failed', this.appService.currentLang).subscribe(
                            (translateRes) => {
                                this.errorService.PEErrors(translateRes);
                            }
                        );
                    }
                    if (res._body >= 2) {
                        this.errorService.PEErrors(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.alert-update-failed', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.errorService.PEErrors(subHeaderT);
                        }
                    );
                })
        }
    }
    setFloorIndex(index, floor) {
        if(this.editMode) {
            this.selectedFloorIndex = index;
            this.selectedFloorId = floor.id;
        }
    }
    setAreaIndex(index, area) {
        if(this.editMode) {
            this.selectedAreaIndex = index;
            this.selectedAreaId = area.id;
            this.getDeviceTypes(this.selectedAreaId);
        }
    }



    getAllAreas(floorId) {
        // console.log("floooooooooor",floor);
        this.selectedFloorId = floorId;

        this
            .httpService
            .get(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId)
            .subscribe(res => {
                this.areaDropdownList.splice(0, this.areaDropdownList.length);
                const allAreaList = JSON.parse(res._body);
                allAreaList.forEach(area => {

                    const areaJson = this
                        .eavWrapperService
                        .eavToJson(area, 'AREA');
                    if (areaJson !== null) {
                        this
                            .areaDropdownList
                            .push(areaJson);
                    }

                });
                //console.log(this.areaDropdownList,"rrrrrrrrrrrrrrrrrr");
                for(let i=0;i<this.areaDropdownList.length;i++){

                    if(this.areaDropdownList[i].id==this.prepareAlert.areaid){
                        this.selectedAreaId = this.areaDropdownList[i].id;
                        this.selectedAreaIndex=i;
                    }
                }
                if(this.prepareAlert.areaid>0){
                    this.getDeviceTypes(this.prepareAlert.areaid);
                }else{
                    this.getDeviceTypes(this.areaDropdownList[0].id);
                }
            }, (error: any) => {
                // this   .snackBar   .open('Error occured while retriving area list', 'Ok', {
                //   duration: 5000,     extraClasses: ['error-snackbar']   });
            });

    }
    getDeviceTypes(areaId) {
        this.httpService.getPe(`/Common/GetDeviceTypesByArea?id=` + areaId).subscribe(
            res => {
                this.deviceTypeList = JSON.parse(res._body);
                if (this.deviceTypeList.length > 0 && this.addMode) {
                    this.prepareAlert.devicetypeid = -1;

                }
                this.getDeviceByAreaNDeviceType();
            }, (error: any) => {
            });
    }
    getDeviceByAreaNDeviceType() {
        this.httpService.getPe(`/Common/GetDevicesByTypeNArea?typeid=` + this.prepareAlert.devicetypeid + `&areaid=` + this.selectedAreaId).subscribe(
            res => {
                this.deviceList = JSON.parse(res._body);
                if(this.addMode){
                    this.prepareAlert.deviceid=-1;
                }
            }, (error: any) => {
            });
    }

    getAllUsers(subsidiaryId) {

        this.httpService
            .get(`/rsb-security/security/staff/getAllStaffByDeptAndSubDept?dept=` + -1 + `&subDept=` + -1 + `&subId=` + subsidiaryId + `&name=` + this.dataPassService.searchText + `&employeeId=` + '' + `&size=` + 10000 + `&page=` + 0)
            .subscribe((res) => {
                    let allStaffs = JSON.parse(res._body);
                    for (let i = 0; i < allStaffs.content.length; i++) {
                        this.staffs.push(allStaffs.content[i]);
                        for (let staffA of this.selectedStaffList) {
                            if (staffA.staffid == this.staffs[i].id) {
                                staffA.firstNameMultiLingual = this.staffs[i].firstNameMultiLingual;
                                staffA.lastNameMultiLingual = this.staffs[i].lastNameMultiLingual;
                            }
                        }

                    }
                }
            );
    }

    changeEditMode(mode) {
        this.editMode = mode;
    }

    addToSelectedStaffList() {
        if (this.editMode) {
            let index = -1;
            for (let i = 0; i < this.staffs.length; i++) {
                if (this.selectedStaffId == this.staffs[i].id) {
                    let staffT = {
                        executionorder: 0,
                        staffid: this.staffs[i].id.toString(),
                        firstNameMultiLingual: this.staffs[i].firstNameMultiLingual,
                        lastNameMultiLingual: this.staffs[i].lastNameMultiLingual
                    };
                    this.selectedStaffList.push(staffT);
                    index = i;
                }

            }
            this.staffs.splice(index, 1);
            this.selectedStaffId=-1;
        }
    }

    setSelectedStaffId(id) {
        this.selectedStaffId = id;
    }

    deleteFromSelectedStaffList(staffId) {
        if (this.editMode) {
            let index = -1;
            for (let i = 0; i < this.selectedStaffList.length; i++) {
                if (staffId == this.selectedStaffList[i].staffid) {
                    this.staffs.push(this.selectedStaffList[i]);
                    index = i;
                }
            }
            this.selectedStaffList.splice(index, 1);
        }

    }
    deleteAlert(){
        this.httpService
            .getPe(`/ALMS/DeleteAlertList?id=` + this.prepareAlert.id)
            .subscribe((res) => {
                this.errorService.translateSuccess('delete-success');
                this.router.navigateByUrl('alert-management');
                }
            );

    }
    openModal(modalId){
        document.getElementById(modalId).style.display='block'
    }
    closeModal(modalId){
        document.getElementById(modalId).style.display='none'
    }
}
