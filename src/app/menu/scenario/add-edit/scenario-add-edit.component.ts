import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../../utils/services';
import {DataPassService} from '../../../utils/services/data-pass-service';
import {ErrorMessageService} from '../../../utils/services/error-message-service';
import {OutputDevice, Scenario} from '../scenario';
import {RouteStackService} from '../../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'scenario-add-edit',
    templateUrl: 'scenario-add-edit.component.html'

})

export class ScenarioAddEditComponent implements OnInit, AfterViewInit {
    prepareScenario: Scenario = new Scenario({});
    outputDevice: OutputDevice = new OutputDevice({});
    inputDeviceTypeList = [];
    outputDeviceTypeList = [];
    inputDeviceList = [];
    outputDeviceList = [];
    outputSelectedList = [];
    showOutputtext = false;
    outputtypeid = 0;
    public device: any = {};
    outputtextvalue = '';
    public outputvalue: any;
    selectedOutputDeviceTypeId = 0;
    selectedOutputDeviceId = 0;
    selectedInputDeviceTypeId = 0;
    selectedInputDeviceId = 0;
    editMode = false;
    addMode = false;
    selectDeviceToUpdate = false;
    public inputSelections: any = [{'id': 'Tripped', 'value': 'Tripped'}, {'id': 'Un Tripped', 'value': 'Un Tripped'}];
    public skStatus: any = [{'id': 'On', 'value': 'On'}, {'id': 'Off', 'value': 'Off'}, {'id': 'Play', 'value': 'Play'}];

    constructor(private  httpService: HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router,
                public translate: TranslateService,
                public dataPassService: DataPassService,
                private errorService: ErrorMessageService,
                private stackService:RouteStackService) {
        this.stackService.push(this.router.url,null);
        if (this.dataPassService.selectedScenario != null) {
            this.prepareScenario = this.dataPassService.selectedScenario;
            this.selectedInputDeviceTypeId = this.prepareScenario.sourcedevicetypeid;
            this.selectedInputDeviceId = this.prepareScenario.sourcedeviceid;
            this.outputSelectedList = this.prepareScenario.destinationdevices;
        } else {
            this.editMode = true;
            this.addMode = true;
        }

    }

    ngOnInit() {

        this.getInputDeviceTypes();
        this.getOutputDeviceTypes();
    }

    getInputDeviceTypes() {
        this
            .httpService
            .getPe('/SP/GetSmartScenarioDeviceTypes')
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.inputDeviceTypeList = items;

                    for (let i = 0; i < this.inputDeviceTypeList.length; i++) {
                        if (this.inputDeviceTypeList[i].id == this.outputtypeid) {
                            if (this.inputDeviceTypeList[i].name == 'Thermostat') {
                                this.inputDeviceTypeList.splice(i, 1);

                            }
                        }
                    }
                    if (!this.addMode) {
                        this.getInputDevices();
                    }

                }
            }, (error: any) => {
                this.translate.get('error-messages.device-type-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.errorService.PEErrors(subHeaderT);
                    }
                );
            });
    }

    getOutputDeviceTypes() {
        this
            .httpService
            .getPe('/SP/GetSmartScenarioDeviceTypes')
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.outputDeviceTypeList = items;
                    if (this.outputDevice.destinationstate != null) {
                        this.selectedOutputDeviceTypeId = this.outputDevice.destinationdevicetypeid;
                        this.getOutputDevices();
                    }


                }
            }, (error: any) => {
                this.translate.get('error-messages.device-type-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.errorService.PEErrors(subHeaderT);
                    }
                );
            });
    }

    getInputDevices() {
        this
            .httpService
            .getPe('/Common/GetDevices?devicetypeid=' + this.selectedInputDeviceTypeId)
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.inputDeviceList = items;
                }
            }, (error: any) => {
                this.translate.get('error-messages.output-device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.errorService.PEErrors(subHeaderT);
                    }
                );

            });
    }

    getOutputDevices() {

        for (let i = 0; i < this.outputDeviceTypeList.length; i++) {
            if (this.outputDeviceTypeList[i].id == this.selectedOutputDeviceTypeId) {
                if (this.outputDeviceTypeList[i].name == 'Thermostat') {
                    this.showOutputtext = true;
                } else {
                    this.showOutputtext = false;
                }
            }
        }
        this
            .httpService
            .getPe('/Common/GetDevices?devicetypeid=' + this.selectedOutputDeviceTypeId)
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.outputDeviceList = items;
                    if (this.outputDevice.destinationstate != null) {
                        this.selectedOutputDeviceId = this.outputDevice.destinationdeviceid;
                    }

                }
            }, (error: any) => {
                this.translate.get('error-messages.output-device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.errorService.PEErrors(subHeaderT);
                    }
                );

            });
    }

    addToSelectedOutputList(status) {
        if (this.editMode) {

            let index = -1;
            for (let i = 0; i < this.outputDeviceList.length; i++) {
                if (this.selectedOutputDeviceId == this.outputDeviceList[i].id) {

                    let outputDT = new OutputDevice({});
                    outputDT.destinationdeviceid = this.selectedOutputDeviceId;
                    outputDT.destinationdevicetypeid = this.selectedOutputDeviceTypeId;
                    outputDT.destinationdevicename = this.outputDeviceList[i].name;
                    outputDT.destinationstate = this.outputDevice.destinationstate;
                    outputDT.destinationmode = this.outputDevice.destinationmode;
                    if (this.showOutputtext) {
                        outputDT.flag = 2;
                    }else{
                        outputDT.flag=null;
                    }
                    if (status == 'add') {
                        this.outputSelectedList.push(outputDT);
                        index = i;
                        this.outputDeviceList.splice(index, 1);
                        this.selectedOutputDeviceId = -1;
                    }
                    if (status == 'update') {
                        console.log(outputDT,"1111111111111111");
                        this.selectDeviceToUpdate=false;
                        for (let i = 0; i < this.outputSelectedList.length; i++) {
                            console.log(this.outputSelectedList[i].destinationdeviceid,"222222222222222222",this.outputDevice.destinationdeviceid);
                            if (this.outputDevice.destinationdeviceid == this.outputSelectedList[i].destinationdeviceid) {
                                this.outputSelectedList[i].destinationdeviceid=outputDT.destinationdeviceid;
                                this.outputSelectedList[i].destinationdevicetypeid=outputDT.destinationdevicetypeid;
                                this.outputSelectedList[i].destinationdevicename=outputDT.destinationdevicename;
                                this.outputSelectedList[i].destinationstate=outputDT.destinationstate;
                                this.outputSelectedList[i].destinationmode=outputDT.destinationmode;
                                this.outputSelectedList[i].flag=outputDT.flag;

                            }
                        }
                    }
                }

            }

        }
    }

    deleteFromSelectedOutputDeviceList(outputDeviceId) {
        //console.log(outputDeviceId);
        if (this.editMode) {
            let index = -1;
            for (let i = 0; i < this.outputSelectedList.length; i++) {
                if (outputDeviceId == this.outputSelectedList[i].id) {
                    this.outputDeviceList.push(this.outputSelectedList[i]);
                    console.log(this.outputDeviceList, 'eeeeeeeeeeeeeeeeeeee');
                    index = i;
                }
            }
            this.outputSelectedList.splice(index, 1);
        }

    }

    loadOutputDevice(output) {
        if(this.editMode){
            this.outputDevice = output;
            this.selectDeviceToUpdate = true;
            this.getOutputDeviceTypes();
        }

    }
    deleteScenario(){
         this
            .httpService
            .deletePe("/SP/DeleteSmartScenario?id="+this.prepareScenario.id)
            .subscribe(res => {
                if (res._body == 1 ){//&& JSON.stringify(res._body) ==="1") {
                    //this.closeModal();
                    this.translate.get('error-messages.device-type-delete-success', this.appService.currentLang).subscribe(
                        (messageText) => {
                            this.errorService.PESuccess(messageText);
                            this.router.navigateByUrl('scenario');
                        }
                    );
                }
                if (res._body == 0 ){//&& JSON.stringify(res._body) ==="1") {
                    this.translate.get('error-messages.device-type-delete-failed', this.appService.currentLang).subscribe(
                        (messageText) => {
                            this.errorService.PEErrors(messageText);
                        }
                    );
                }
                if (res._body >=2 ){//&& JSON.stringify(res._body) ==="1") {
                    //this.closeModal();
                    this.errorService.PEErrors(res._body);
                }
            }, (error: any) => {
                this.translate.get('error-messages.device-type-delete-failed', this.appService.currentLang).subscribe(
                    (messageText) => {
                        this.errorService.PEErrors(messageText);
                    }
                );

            });
    }
    addUpdateScenario() {
        console.log(this.prepareScenario);
        this.prepareScenario.destinationdevices = this.outputSelectedList;
        this.prepareScenario.sourcedeviceid = this.selectedInputDeviceId;
        this.prepareScenario.sourcedevicetypeid = this.selectedInputDeviceTypeId;
        if (this.addMode) {
            delete this.prepareScenario.id;
            this.httpService.postPe('/SP/InsertSmartScenario', this.prepareScenario).subscribe(
                (res: any) => {
                    let x = res._body;
                    if (x == 1) {
                        this.translate.get('error-messages.scenario-add-success', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.errorService.PESuccess(messageText);
                            }
                        );
                    }
                    if (x == 0) {
                        this.translate.get('error-messages.scenario-add-failed', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.errorService.PEErrors(messageText);
                            }
                        );
                    }
                    if (x >= 2) {
                        this.errorService.PEErrors(x);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.scenario-add-failed', this.appService.currentLang).subscribe(
                        (messageText) => {
                            this.errorService.PEErrors(messageText);
                        }
                    );
                }
            );
        }
        if (!this.addMode) {
            this.httpService.postPe('/SP/UpdateSmartScenario', this.prepareScenario).subscribe(
                (res: any) => {
                    let x = res._body;
                    if (x == 1) {
                        this.translate.get('error-messages.scenario-update-success', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.errorService.PESuccess(messageText);
                            }
                        );
                    }
                    if (x == 0) {
                        this.translate.get('error-messages.scenario-update-failed', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.errorService.PEErrors(messageText);
                            }
                        );
                    }
                    if (x >= 2) {
                        this.errorService.PEErrors(x);
                    }
                }, (error: any) => {

                    this.translate.get('error-messages.scenario-update-failed', this.appService.currentLang).subscribe(
                        (messageText) => {
                            this.errorService.PEErrors(messageText);
                        }
                    );
                }
            );
        }
    }

    ngAfterViewInit() {
    }

    changeEditMode(mode) {
        this.editMode = mode;
    }
    openModal(modalId){
        document.getElementById(modalId).style.display='block'
    }
    closeModal(modalId){
        document.getElementById(modalId).style.display='none'
    }

}
