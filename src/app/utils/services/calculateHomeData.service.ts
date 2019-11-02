import {Injectable} from '@angular/core';
import {DataPassService} from './data-pass-service';
import {applianceStatus, dataByType, floorAppliance} from '../../home/appliance-grid/appliance.model';
import {HttpService} from './http.service';
import {StructureTreeService} from './structureTree.service';
import {lightByFloor, lightingStatus} from '../../home/lighting-grid/lighting.model';
import {
    batteryColor,
    batteryStatusCount,
    deviceStatus,
    floorSafetyStatus,
    statusByType
} from '../../home/safety-status/safety-status-model';
import {floorHvac, hvacStatusCount} from '../../home/hvac-grid/hvac-grid-model';
import {deviceCountT, deviceStatsByFloor} from '../../home/device-stats/device-stats.model';
import {parkingStatus} from '../../home/parking-status/parking-status-model';
import {areaFloor, areaTemp, staffFloor} from '../../home/organization-stats/organization.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ScreenPermissionService} from './screen-permission.service';
import {visitorByWorkGroup, VisitorModel} from '../../home/visitor-stats/visitor.model';

@Injectable()
export class CalculateHomeDataService {
    outLow = '#cf3b20';
    outMiddle = '#ff9205';
    outHigh = '#05a504';
    inLow = '#ff8a84';
    inMiddle = '#ffc36c';
    inHigh = '#8eff7e';
    outHighHvac = '#cf530c';
    outMiddleHvac = '#ff9205';
    outLowHvac = '#ffc413';
    inHighHvac = '#ff9f57';
    inMiddleHvac = '#ffc36c';
    inLowHvac = '#f6e769';

    constructor(private dataPassService: DataPassService,
                private httpService: HttpService,
                private structureTree: StructureTreeService,
                private sanitizer: DomSanitizer,
                private screenPermission: ScreenPermissionService) {

    }


    calculateAppliance() {
        this.dataPassService.applianceModel.applianceByType = [];
        this.dataPassService.applianceModel.applianceListByFloor = [];
        this.dataPassService.applianceModel.applianceStatusCount = new applianceStatus({});
        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=SPD')
            .subscribe(res => {
                    const allPlug = JSON.parse(res._body);
                    allPlug.forEach((appliance) => {
                        this.dataPassService.nodeList.forEach((node) => {
                                if (node.device.id == appliance.deviceid) {
                                    appliance.location = [...node.location];
                                }
                            }
                        );
                        if (appliance.deviceworkingstate == '1') {
                            this.dataPassService.applianceModel.applianceStatusCount.pluggedCount += 1;
                        } else {
                            this.dataPassService.applianceModel.applianceStatusCount.unPluggedCount += 1;
                        }

                        let existedInType = false;
                        let existedInFloor = false;
                        for (let floor of this.dataPassService.applianceModel.applianceListByFloor) {
                            if (floor.floorName == appliance.floorName) {
                                existedInFloor = true;
                                floor.applianceList.push(appliance);
                            }
                        }
                        if (!existedInFloor) {
                            let applianceByFloor: floorAppliance = new floorAppliance({});
                            applianceByFloor.floorId = appliance.floorid;
                            applianceByFloor.floorName = appliance.floorName;

                            applianceByFloor.applianceList.push(appliance);
                            this.dataPassService.applianceModel.applianceListByFloor.push(applianceByFloor);
                        }
                        for (let type of this.dataPassService.applianceModel.applianceByType) {
                            if (type.id == appliance.applianceid) {
                                existedInType = true;
                                if (appliance.deviceworkingstate == '1') {
                                    type.applianceStatusCount.pluggedCount = type.applianceStatusCount.pluggedCount + 1;
                                } else {
                                    type.applianceStatusCount.unPluggedCount = type.applianceStatusCount.unPluggedCount + 1;
                                }

                            }
                        }
                        if (!existedInType) {
                            let typeT: dataByType = new dataByType({});
                            typeT.id = appliance.applianceid;
                            typeT.faName = appliance.appliancemap.map.fa;
                            typeT.enName = appliance.appliancemap.map.en;
                            if (appliance.devicestatus == '1') {
                                typeT.applianceStatusCount.pluggedCount = 1;
                            } else {
                                typeT.applianceStatusCount.unPluggedCount = 1;
                            }
                            this.dataPassService.applianceModel.applianceByType.push(typeT);
                        }
                        this.dataPassService.nodeList.forEach((node, index) => {
                                if (node.device.id == appliance.deviceid) {
                                    appliance.location = [...node.location];
                                    this.dataPassService.applianceModel.applianceList.push(appliance);
                                }
                            }
                        );
                    });

                }
            );
        //console.log(this.dataPassService.applianceModel, 'ttttttttttttttttttttttttttttttt');
    }

    calculateDeviceStats() {
        this.dataPassService.deviceStatsModel.nodeList = this.dataPassService.nodeList;
        this.dataPassService.deviceStatsModel.deviceStatsByFloor = [];
        for (let node of this.dataPassService.deviceStatsModel.nodeList) {
            let existedInFloor = false;
            for (let floor of this.dataPassService.deviceStatsModel.deviceStatsByFloor) {
                if (floor.locationByNames[4].enName == node.location[4].enName) {
                    floor.count++;
                    let existedInType = false;
                    for (let deviceType of floor.deviceCountSt) {
                        if (deviceType.deviceType == node.deviceType) {
                            deviceType.count++;
                            existedInType = true;
                        }
                    }
                    if (!existedInType) {
                        let countType: deviceCountT = new deviceCountT({});
                        countType.deviceType = node.deviceType;
                        countType.count = 1;
                        floor.deviceCountSt.push(countType);
                    }
                    existedInFloor = true;
                }
            }
            if (!existedInFloor) {
                let deviceStByFloor: deviceStatsByFloor = new deviceStatsByFloor({});
                let countType: deviceCountT = new deviceCountT({});
                countType.deviceType = node.deviceType;
                countType.count = 1;
                deviceStByFloor.locationByNames = [...node.location];
                deviceStByFloor.deviceCountSt.push(countType);
                deviceStByFloor.count = 1;
                this.dataPassService.deviceStatsModel.deviceStatsByFloor.push(deviceStByFloor);
            }

        }
        console.log(this.dataPassService.deviceStatsModel.deviceStatsByFloor, ';;;;;;;;;;;;;;;;;;;;;;;;;;');
    }

    calculateHvacGrid() {
        this.dataPassService.hvacModel.floorHvac = [];
        this.dataPassService.hvacModel.hvacStatusCount = new hvacStatusCount({});
        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=TRM')
            .subscribe(res => {
                const allHvac = JSON.parse(res._body);
                allHvac.forEach((hvac) => {
                        this.dataPassService.nodeList.forEach((node) => {
                                if (node.device.id == hvac.deviceid) {
                                    hvac.location = [...node.location];
                                }
                            }
                        );
                        if (hvac.devicevalue <= hvac.setpoint + 3 && hvac.devicevalue >= hvac.setpoint - 3) {
                            hvac.outerStrokeColor = this.outMiddleHvac;
                            hvac.innerStrokeColor = this.inMiddleHvac;
                        }
                        if (hvac.devicevalue > hvac.setpoint + 3) {
                            hvac.outerStrokeColor = this.outHighHvac;
                            hvac.innerStrokeColor = this.inHighHvac;
                        }
                        if (hvac.devicevalue < hvac.setpoint - 3) {
                            hvac.outerStrokeColor = this.outLowHvac;
                            hvac.innerStrokeColor = this.inLowHvac;
                        }

                        if (hvac.devicestatus == '1') {
                            this.dataPassService.hvacModel.hvacStatusCount.inServiceCount++;
                        } else {
                            this.dataPassService.hvacModel.hvacStatusCount.outOfServiceCount++;
                        }
                        let existedInFloor = false;

                        for (let floor of this.dataPassService.hvacModel.floorHvac) {
                            if (floor.floorName == hvac.floorName) {
                                existedInFloor = true;
                                floor.hvacList.push(hvac);
                            }
                        }
                        if (!existedInFloor) {
                            let hvacByFloor: floorHvac = new floorHvac({});
                            hvacByFloor.floorId = hvac.floorid;
                            hvacByFloor.floorName = hvac.floorName;
                            hvacByFloor.hvacList.push(hvac);
                            this.dataPassService.hvacModel.floorHvac.push(hvacByFloor);
                        }
                        this.dataPassService.hvacModel.hvacList.push(hvac);

                    }

                );
                console.log(this.dataPassService.hvacModel.floorHvac,"hkkkkkkkkkk");
            });
    }

    calculateLightingGrid() {
        this.dataPassService.lightingModel.lightingByFloor = [];
        this.dataPassService.lightingModel.lightingStatusCount = new lightingStatus({});
        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=LTN')
            .subscribe(res => {
                    const allLight = JSON.parse(res._body);
                    allLight.forEach((lighting) => {
                        this.dataPassService.nodeList.forEach((node) => {
                                if (node.device.id == lighting.deviceid) {
                                    lighting.location = node.location;
                                    this.dataPassService.lightingModel.lightingList.push(lighting);
                                }
                            }
                        );
                        if (lighting.deviceworkingstate == '1') {
                            this.dataPassService.lightingModel.lightingStatusCount.onCount += 1;
                        } else {
                            this.dataPassService.lightingModel.lightingStatusCount.offCount += 1;
                        }
                        let existedInFloor = false;
                        for (let floor of this.dataPassService.lightingModel.lightingByFloor) {
                            if (floor.floorName == lighting.floorName) {
                                existedInFloor = true;
                                if (lighting.deviceworkingstate == 1) {
                                    floor.lightingStatusCount.onCount += 1;
                                } else {
                                    floor.lightingStatusCount.offCount += 1;
                                }
                                floor.lightingList.push(lighting);
                            }
                        }
                        if (!existedInFloor) {
                            let lightingByFloor: lightByFloor = new lightByFloor({});
                            lightingByFloor.floorId = lighting.floorid;
                            lightingByFloor.floorName = lighting.floorName;
                            if (lighting.deviceworkingstate == 1) {
                                lightingByFloor.lightingStatusCount.onCount += 1;
                            } else {
                                lightingByFloor.lightingStatusCount.offCount += 1;
                            }
                            lightingByFloor.lightingList.push(lighting);
                            this.dataPassService.lightingModel.lightingByFloor.push(lightingByFloor);
                        }

                    });
                }
            );
        //console.log(this.dataPassService.lightingModel, 'llllllllllllllllllllllllllllllllllllll');
    }

    calculateOrganizationStats() {
        this.dataPassService.organizationModel.staffByFloor = [];
        this.dataPassService.floorList.forEach((floor) => {
            let staffFloorT: staffFloor = new staffFloor({});
            staffFloorT.floor = floor;
            for (let staff of this.dataPassService.organizationModel.allUsers) {
                if (floor.id == staff.floorId) {
                    if (staff.phtoId == '' || staff.phtoId == null) {
                        staff.picture = './assets/images/avatar-orange.png';
                    } else {
                        this
                            .httpService
                            .get('/rsb-oms/oms/getFile/' + staff.phtoId)
                            .subscribe(res => {
                                const imageData = JSON.parse(res._body).data;
                                const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
                                staff.picture = profilePicture;
                            }, (error: any) => {
                            });
                    }
                    staffFloorT.staffList.push(staff);
                }
            }
            this.dataPassService.organizationModel.staffByFloor.push(staffFloorT);
            let areaByFloor: areaFloor = new areaFloor({});
            areaByFloor.floor = floor;
            for (let area of  this.dataPassService.areaList) {
                let areaIsExist = false;
                if (area.location[4].enName == floor.location[4].enName) {
                    for (let areaF of areaByFloor.areaList) {
                        if (areaF.type.enName == area.type.enName) {
                            areaF.count++;
                            areaIsExist = true;
                        }
                    }
                    if (!areaIsExist) {
                        let areaT: areaTemp = new areaTemp({});
                        areaT.name = area.location[5];
                        areaT.type = area.objectType;
                        areaT.count = 1;
                        areaByFloor.areaList.push(areaT);
                    }
                }
            }
            this.dataPassService.organizationModel.areaByFloor.push(areaByFloor);
        });

    }

    calculateParkingStatus() {
        this.dataPassService.parkingModel.parkingStatus = new parkingStatus({});
        this.dataPassService.parkingModel.parkingList.splice(0, this.dataPassService.parkingModel.parkingList.length);
        for (let floor of this.dataPassService.floorList) {


            if (floor.objectType.enName == 'parking') {
                this.httpService
                    .get(`/rsb-parking/parking/getAllForFloor?floorId=` + floor.id)
                    .subscribe(res => {
                            let parkings = JSON.parse(res._body);

                            for (let parking of parkings) {
                                let parkingStatus = '';
                                this.dataPassService.parkingModel.parkingList.push(parking);
                                if (parking.occupied == true) {
                                    parkingStatus = 'occupied';
                                    this.dataPassService.parkingModel.parkingStatus.occupied++;
                                }
                                if (parking.occupied == false) {
                                    parkingStatus = 'free';
                                    this.dataPassService.parkingModel.parkingStatus.free++;
                                }
                                if (parking.occupied == null) {
                                    parkingStatus = 'outOfService';
                                    this.dataPassService.parkingModel.parkingStatus.outOfService++;
                                }
                                parking.status = parkingStatus;
                            }
                        }
                    );
            }

        }

    }

    calculateSafetyStatus() {
        this.dataPassService.safetyDeviceModel.batteryStatusCount = new batteryStatusCount({});
        this.dataPassService.safetyDeviceModel.floorSafetyStatus = [];
        this.dataPassService.safetyDeviceModel.deviceStatusByType = [];
        this.dataPassService.safetyDeviceModel.statusCount = new deviceStatus({});
        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=WLS')
            .subscribe(res => {
                const WLSList = JSON.parse(res._body);
                this
                    .httpService
                    .get('/rsb-oms/oms/device/getAllInfo?deviceType=SDS')
                    .subscribe(res => {
                            const SDSList = JSON.parse(res._body);
                            this.dataPassService.safetyDeviceModel.safetyDeviceList = [].concat(WLSList, SDSList);
                            this
                                .httpService
                                .get('/rsb-oms/oms/device/getAllInfo?deviceType=DWS')
                                .subscribe(res => {
                                        const DWSList = JSON.parse(res._body);
                                        this.dataPassService.safetyDeviceModel.safetyDeviceList = [].concat(this.dataPassService.safetyDeviceModel.safetyDeviceList, DWSList);
                                        this
                                            .httpService
                                            .get('/rsb-oms/oms/device/getAllInfo?deviceType=SRN')
                                            .subscribe(res => {
                                                    const SRNList = JSON.parse(res._body);
                                                    this.dataPassService.safetyDeviceModel.safetyDeviceList = [].concat(this.dataPassService.safetyDeviceModel.safetyDeviceList, SRNList);
                                                    this.dataPassService.safetyDeviceModel.safetyDeviceList.forEach((device, deviceIndex) => {
                                                            this.dataPassService.nodeList.forEach((node) => {
                                                                    if (node.device.id == device.deviceid) {
                                                                        device.location = node.location;
                                                                        this.dataPassService.safetyDeviceModel.safetyDeviceList.push(device);
                                                                    }
                                                                }
                                                            );

                                                            let batteryColorT: batteryColor = new batteryColor({});
                                                            if (device.batterystate >= 66) {
                                                                batteryColorT.outerStrokeColor = this.outHigh;
                                                                batteryColorT.innerStrokeColor = this.inHigh;
                                                            }
                                                            if (device.batterystate < 66 && device.batterystate >= 33) {
                                                                batteryColorT.outerStrokeColor = this.outMiddle;
                                                                batteryColorT.innerStrokeColor = this.inMiddle;
                                                            }
                                                            if (device.batterystate < 33) {
                                                                batteryColorT.outerStrokeColor = this.outLow;
                                                                batteryColorT.innerStrokeColor = this.inLow;
                                                            }
                                                            device.batteryColor = batteryColorT;
                                                            if (device.devicestatus != '1') {
                                                                this.dataPassService.safetyDeviceModel.statusCount.outOfServiceCount += 1;
                                                            }
                                                            if (device.deviceworkingstate != '0') {
                                                                this.dataPassService.safetyDeviceModel.statusCount.triggeredCount += 1;
                                                            }
                                                            if (device.batterystate <= 33) {
                                                                this.dataPassService.safetyDeviceModel.batteryStatusCount.batteryLowCount += 1;
                                                            }
                                                            if (device.batterystate <= 66 && device.batterystate > 33) {
                                                                this.dataPassService.safetyDeviceModel.batteryStatusCount.batteryMediumCount += 1;

                                                            }
                                                            if (device.batterystate > 66) {
                                                                this.dataPassService.safetyDeviceModel.batteryStatusCount.batteryHighCount += 1;

                                                            }

                                                            let existedInType = false;
                                                            let existedInFloor = false;
                                                            for (let floor of this.dataPassService.safetyDeviceModel.floorSafetyStatus) {
                                                                if (floor.floorName == device.floorName) {
                                                                    existedInFloor = true;
                                                                    floor.safetyDeviceList.push(device);
                                                                }
                                                            }
                                                            if (!existedInFloor) {
                                                                let safetyByFloor: floorSafetyStatus = new floorSafetyStatus({});
                                                                safetyByFloor.floorId = device.floorid;
                                                                safetyByFloor.floorName = device.floorName;

                                                                safetyByFloor.safetyDeviceList.push(device);
                                                                this.dataPassService.safetyDeviceModel.floorSafetyStatus.push(safetyByFloor);
                                                            }
                                                            for (let type of this.dataPassService.safetyDeviceModel.deviceStatusByType) {
                                                                if (type.typeName == device.devicetype) {
                                                                    existedInType = true;
                                                                    if (device.deviceworkingstate == '1') {
                                                                        type.statusCount.triggeredCount += 1;
                                                                    }
                                                                    if (device.devicestatus != '1') {
                                                                        type.statusCount.outOfServiceCount += 1;
                                                                    }
                                                                    if (device.batterystate <= 33) {
                                                                        type.statusCount.batteryLowCount += 1;
                                                                    }

                                                                }
                                                            }
                                                            if (!existedInType) {
                                                                let typeT: statusByType = new statusByType({});
                                                                typeT.id = device.deviceid;
                                                                typeT.typeName = device.devicetype;
                                                                if (device.deviceworkingstate == '1') {
                                                                    typeT.statusCount.triggeredCount += 1;
                                                                }
                                                                if (device.devicestatus != '1') {
                                                                    typeT.statusCount.outOfServiceCount += 1;
                                                                }
                                                                if (device.batterystate <= 33) {
                                                                    typeT.statusCount.batteryLowCount += 1;
                                                                }
                                                                this.dataPassService.safetyDeviceModel.deviceStatusByType.push(typeT);
                                                            }
                                                        }
                                                    );
                                                }
                                            );
                                    }
                                );
                        }
                    );
            });
    }

    calculateVisitorStats() {
        this.dataPassService.visitorModel = new VisitorModel({});
        this.httpService
            .get(`/rsb-spas/visitor?name=&workgroupid=0` + `&page=` + 0 + `&size=` + 1000 + `&lang=` + this.dataPassService.currentLang)
            .subscribe((res) => {
                    this.dataPassService.visitorModel.visitorList = JSON.parse(res._body).content;
                    for (let visitor of  this.dataPassService.visitorModel.visitorList) {
                        let obj = {};
                        let flag = false;
                        for (let workGroup of  this.dataPassService.visitorModel.visitorByWorkGroup) {
                            if (workGroup.id == visitor.cardholder.workgroup.id) {
                                flag = true;
                                workGroup.count++;
                                break;
                            }
                        }
                        if (!flag) {
                            let visitorByWorkGroupTemp: visitorByWorkGroup = new visitorByWorkGroup({});
                            visitorByWorkGroupTemp.id = visitor.cardholder.workgroup.id;
                            visitorByWorkGroupTemp.nameFa = visitor.cardholder.workgroup.name.map.fa;
                            visitorByWorkGroupTemp.nameEn = visitor.cardholder.workgroup.name.map.en;
                            visitorByWorkGroupTemp.count = 1;
                            this.dataPassService.visitorModel.visitorByWorkGroup.push(visitorByWorkGroupTemp);
                        }
                    }

                }
            );
    }


}
