import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {DataPassService} from './data-pass-service';
import {AppService} from '../../app.service';
import {EavWrapperService} from './eav-wrapper.service';
import {ScreenPermissionService} from './screen-permission.service';
import {applianceStatus} from '../../home/appliance-grid/appliance.model';
import {deviceCountT} from '../../home/device-stats/device-stats.model';
import {floorHvac} from '../../home/hvac-grid/hvac-grid-model';
import {lightingStatus} from '../../home/lighting-grid/lighting.model';
import {parkingStatus} from '../../home/parking-status/parking-status-model';
import {batteryStatusCount, deviceStatus} from '../../home/safety-status/safety-status-model';
import {SkSliderModel} from '../../home/sk-slider-model';

@Injectable()
export class StructureTreeService {
    constructor(private httpService: HttpService,
                private dataPassService: DataPassService,
                private appService: AppService,
                private eavWrapperService: EavWrapperService,
                private screenPermission: ScreenPermissionService
    ) {
    }

    loadStructure() {
        this.dataPassService.subsidiaryList.splice(0, this.dataPassService.subsidiaryList.length);
        this.dataPassService.campusList.splice(0, this.dataPassService.campusList.length);
        this.dataPassService.buildingList.splice(0, this.dataPassService.buildingList.length);
        this.dataPassService.floorList.splice(0, this.dataPassService.floorList.length);
        this.dataPassService.areaList.splice(0, this.dataPassService.areaList.length);
        this.dataPassService.nodeList.splice(0, this.dataPassService.nodeList.length);
        this.getSpaceStructureTree();
    }

    getSpaceStructureTree() {
        this
            .httpService
            .get(`/rsb-oms/oms/getSpaceTreeByOrgId?orgId=1`)
            .subscribe((data) => {
                    let structureTree = JSON.parse(data._body);

                    let orgObj: spaceDataModel = new spaceDataModel({});
                    orgObj.id = structureTree.id;
                    orgObj.type = structureTree.type;
                    orgObj.location.push(structureTree.location);
                    this.dataPassService.organization = orgObj;
                    this.getSpaceChildren(structureTree.children, orgObj.location);
                    this.loadAllSwipers();
                }
            );
    }

    getSpaceChildren(children, parentLocation) {
        for (let child of children) {
            if (child.type != 'point') {
                let space: spaceDataModel = new spaceDataModel({});
                space.id = child.id;
                space.type = child.type;
                if (child.objectType) {
                    space.objectType = child.objectType;
                }
                let tempLocation = [...parentLocation];
                tempLocation.push(child.location);
                space.location = [...tempLocation];
                switch (child.type) {
                    case 'subsidiary': {
                        if (this.dataPassService.selectedSubsidiary == null) {
                            this.dataPassService.subsidiaryList.push(space);
                        } else if (space.id == this.dataPassService.selectedSubsidiary.id) {
                            this.dataPassService.subsidiaryList.push(space);
                        }
                        break;
                    }
                    case 'campus': {
                        this.dataPassService.campusList.push(space);
                        break;
                    }
                    case 'structure': {
                        space.type = 'building';
                        this.dataPassService.buildingList.push(space);
                        break;
                    }
                    case 'level': {
                        space.type = 'floor';
                        this.dataPassService.floorList.push(space);
                        break;
                    }
                    case 'area': {
                        this.dataPassService.areaList.push(space);
                        break;
                    }
                }

                if (child.children) {
                    this.getSpaceChildren(child.children, tempLocation);
                }

            } else {
                if (child.device) {
                    let node: nodeDataModel = new nodeDataModel({});
                    node.id = child.id;
                    node.type = child.type;
                    node.deviceType = child.deviceType;
                    node.device = child.device;
                    node.location= [...parentLocation];
                    this.dataPassService.nodeList.push(node);
                }

            }

        }
    }


    loadAllSwipers() {
        if (this.screenPermission.hasAccessToScreen('HOME', 'APLG')) {
            this.calculateApplianceSwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'HVCG')) {
            this.calculateHvacSwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'LGHG')) {
            this.calculateLightingSwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'SFTS')) {
            this.calculateSafetySwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'VSTS')) {
            this.calculateVisitorSwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'DVCS')) {
            this.calculateDeviceSwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'ORGS')) {
            this.calculateOrganizationSwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'PRKS')) {
            this.calculateParkingSwiper();
        }
        if (this.screenPermission.hasAccessToScreen('HOME', 'SIGG')) {
            this.calculateSignageSwiper();
        }
        this.setTimeStamp();
    }

    setTimeStamp() {
        let now = new Date();
        this.dataPassService.timeStamp = now;
    }

    calculateVisitorSwiper() {
        this.httpService
            .get(`/rsb-spas/visitor?name=&workgroupid=0` + `&page=` + 0 + `&size=` + 1000 + `&lang=` + 'en')
            .subscribe((res) => {
                this.dataPassService.visitorCount = JSON.parse(res._body).content.length;
            });
    }

    calculateApplianceSwiper() {

        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=SPD')
            .subscribe(res => {
                    const allPlug = JSON.parse(res._body);
                    this.dataPassService.applianceModel.applianceList = allPlug;
                    this.dataPassService.applianceModel.applianceStatusCount = new applianceStatus({});
                    for (let appliance of this.dataPassService.applianceModel.applianceList) {
                        let nodeIndex;
                        this.dataPassService.nodeList.forEach((node, index) => {
                                if (node.device.id == appliance.deviceid) {
                                    nodeIndex = index;
                                }
                            }
                        );
                        if (nodeIndex == undefined) {
                            continue;
                        }
                        if (appliance.deviceworkingstate == '1') {
                            this.dataPassService.applianceModel.applianceStatusCount.pluggedCount += 1;
                        } else {
                            this.dataPassService.applianceModel.applianceStatusCount.unPluggedCount += 1;
                        }
                    }
                },
                (error) => {

                }
            );
    }

    calculateHvacSwiper() {

        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=TRM')
            .subscribe(res => {
                    const allHvac = JSON.parse(res._body);
                    this.dataPassService.hvacModel.hvacList = allHvac;
                    this.dataPassService.hvacModel.floorHvac = [];
                    this.dataPassService.hvacModel.tempratureBarChartLabels.splice(0, this.dataPassService.hvacModel.tempratureBarChartLabels.length);
                    this.dataPassService.hvacModel.hvacList.forEach((hvac) => {
                            let nodeIndex;
                            this.dataPassService.nodeList.forEach((node, index) => {
                                    if (node.device.id == hvac.deviceid) {
                                        nodeIndex = index;
                                    }
                                }
                            );
                            if (nodeIndex == undefined) {
                                return;
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
                        }
                    );
                    let tempratureBarChartLabels: string[] = [];
                    let tempratureChartBarData: any[] = [{data: [], label: 'میانگین دمای واقعی'}, {
                        data: [],
                        label: 'میانگین دمای مرجع'
                    }];
                    let avTemp: any [] = [];
                    let avSetP: any[] = [];
                    for (let floor of this.dataPassService.hvacModel.floorHvac) {
                        let avT = 0;
                        let avSP = 0;
                        let i = 0;
                        this.dataPassService.hvacModel.tempratureBarChartLabels.push(floor.floorName);
                        for (let temp of floor.hvacList) {
                            avT = avT + parseFloat(temp.devicevalue);
                            avSP = avSP + parseFloat(temp.setpoint);
                            i = i + 1;
                        }
                        avTemp.push((avT / i).toFixed(2));
                        avSetP.push((avSP / i).toFixed(2));
                    }

                    tempratureChartBarData = [{data: avTemp, label: 'میانگین دما'}, {data: avSetP, label: 'میانگین مرجع'}];
                    this.dataPassService.hvacModel.tempratureChartBarData = tempratureChartBarData;
                    //console.log('bbbbbbbbbbbbbbbbb',this.dataPassService.hvacModel.tempratureChartBarData);
                }
                ,
                (error) => {

                }
            );

    }

    calculateLightingSwiper() {
        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=LTN')
            .subscribe(res => {
                    const allLight = JSON.parse(res._body);
                    this.dataPassService.lightingModel.lightingList = allLight;
                    this.dataPassService.lightingModel.lightingStatusCount = new lightingStatus({});
                    for (let lighting of this.dataPassService.lightingModel.lightingList) {
                        let nodeIndex;
                        this.dataPassService.nodeList.forEach((node, index) => {
                                if (node.device.id == lighting.deviceid) {
                                    nodeIndex = index;
                                }
                            }
                        );
                        if (nodeIndex == undefined) {
                            continue;
                        }

                        if (lighting.deviceworkingstate == '1') {
                            this.dataPassService.lightingModel.lightingStatusCount.onCount += 1;
                        } else {
                            this.dataPassService.lightingModel.lightingStatusCount.offCount += 1;
                        }
                    }
                },
                (error) => {

                }
            );


    }

    calculateSafetySwiper() {
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
                                this.dataPassService.safetyDeviceModel.safetyDeviceList =[].concat(WLSList, SDSList);
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
                                                        this.dataPassService.safetyDeviceModel.safetyDeviceList =[].concat(this.dataPassService.safetyDeviceModel.safetyDeviceList, SRNList);
                                                        this.dataPassService.safetyDeviceModel.statusCount = new deviceStatus({});
                                                        this.dataPassService.safetyDeviceModel.batteryStatusCount = new batteryStatusCount({});
                                                        for (let device of this.dataPassService.safetyDeviceModel.safetyDeviceList) {
                                                            let nodeIndex;
                                                            this.dataPassService.nodeList.forEach((node, index) => {
                                                                    if (node.device.id == device.deviceid) {
                                                                        nodeIndex = index;
                                                                    }
                                                                }
                                                            );
                                                            if (nodeIndex == undefined) {
                                                                continue;
                                                            }
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
                                                        }
                                                    }
                                                );
                                        }
                                    );
                            }
                        );
                }
            );
    }

    calculateDeviceSwiper() {
        let deviceList = [];
        this.dataPassService.deviceStatsModel.nodeList = this.dataPassService.nodeList;
        this.dataPassService.deviceStatsModel.deviceCount = [];
        this
            .httpService
            .get(`/rsb-oms/oms/getAllDeviceType`)
            .subscribe((data) => {
                for (let type of JSON.parse(data._body)) {
                    let countType: deviceCountT = new deviceCountT({});
                    countType.deviceType = type.name;
                    countType.count = 0;
                    this.dataPassService.deviceStatsModel.deviceCount.push(countType);
                }
                for (let node of this.dataPassService.deviceStatsModel.nodeList) {

                    for (let deviceType of this.dataPassService.deviceStatsModel.deviceCount) {
                        if (deviceType.deviceType == node.deviceType) {
                            deviceType.count++;
                        }
                    }
                }

            }, (error) => {
                console.log(error);
            });


    }

    calculateOrganizationSwiper() {
        let nodeCount = 0;
        this.dataPassService.organizationModel.allUsers = [];
        for (let subsidiary of this.dataPassService.subsidiaryList) {
            let departmentId = -1;
            let subDepartmentId = -1;
            let status = 'ALL';
            let searchName = '';
            let searchId = '';
            this.httpService
                .get(`/rsb-security/security/staff/getAllStaffByDeptAndSubDept?dept=` + departmentId + `&subDept=` + subDepartmentId + `&subId=` + subsidiary.id + `&name=` + this.dataPassService.searchText + `&employeeId=` + searchId + `&size=` + 10000 + `&page=` + 0)
                .subscribe((res) => {
                    let allStaffs = JSON.parse(res._body);
                    for (let staff of allStaffs.content) {
                        this.dataPassService.organizationModel.allUsers.push(staff);
                    }
                });
        }
        this.dataPassService.nodeCount = this.dataPassService.nodeList.length;
    }

    calculateParkingSwiper() {
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

    calculateSignageSwiper() {
        this.dataPassService.signageModel = new SkSliderModel({});
        this
            .httpService
            .get('/rsb-oms/oms/device/getAllInfo?deviceType=DSP')
            .subscribe(res => {
                    let DSPList = JSON.parse(res._body);
                    this
                        .httpService
                        .get('/rsb-oms/oms/device/getAllInfo?deviceType=KIS')
                        .subscribe(res => {
                                let KISList = JSON.parse(res._body);
                                let list =[].concat(DSPList, KISList);
                                console.log(list,"lllllllllllllllllllllllll");
                                for (let sk of list) {
                                    if (sk.devicetype == 'DSP') {
                                        if (sk.devicestatus == '1') {
                                            this.dataPassService.signageModel.inServiceDisplayCount++;
                                        } else {
                                            this.dataPassService.signageModel.outOfServiceDisplayCount++;
                                        }
                                    }
                                    if (sk.devicetype == 'KIS') {
                                        if (sk.devicestatus == '1') {
                                            this.dataPassService.signageModel.inServiceKioskCount++;
                                        } else {
                                            this.dataPassService.signageModel.outOfServiceKioskCount++;
                                        }
                                    }
                                }
                            }
                        );
                },
                (error => {
                    }
                )
            );
    }

    getCampusBuildings(campusEnName) {
        let buildingList = [];
        for (let building of this.dataPassService.buildingList) {
            if (campusEnName == null) {
                buildingList.push(this.dataPassService.buildingList[0]);
            }
            else if (campusEnName == building.location[2].enName) {
                buildingList.push(building);
            }
        }
        return buildingList;
    }

    getBuildingFloors(buildingEnName) {
        let floorList = [];
        for (let floor of this.dataPassService.floorList) {
            if (buildingEnName == floor.location[3].enName) {
                floorList.push(floor);
            }
        }
        return floorList;
    }

    getFloorAreas(floorEnName) {
        let areaList = [];
        for (let area of this.dataPassService.areaList) {
            if (floorEnName == area.location[4].enName) {
                areaList.push(area);
            }
        }
        return areaList;
    }
}

export class spaceDataModel {
    type: string;
    id: number;
    location: any[];
    objectType: objectType;

    constructor(data: any = {}) {
        this.type = data.type || '';
        this.id = data.id || 0;
        this.location = data.location || [];
        this.objectType = data.objectType || new objectType({});
    }
}

export class objectType {
    enName: string;
    faName: string;

    constructor(data: any = {}) {
        this.enName = data.enName;
        this.faName = data.faName;
    }
}

export class nodeDataModel {
    type: string;
    id: number;
    deviceType: string;
    device: deviceModel;
    location: any[];

    constructor(data: any = {}) {
        this.type = data.type || '';
        this.id = data.id || 0;
        this.deviceType = data.deviceType || '';
        this.device = data.device || new deviceModel({});
        this.location = data.location || [];
    }
}

export class deviceModel {
    id: number;
    name: string;
    type: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.name = data.name || '';
        this.type = data.type || '';
    }
}