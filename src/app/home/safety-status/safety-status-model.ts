export class SafetyStatusModel {
    public safetyDeviceList:any=[];
    public deviceStatusByType:statusByType[];
    public floorSafetyStatus:floorSafetyStatus[];
    public statusCount:deviceStatus;
    public batteryStatusCount:batteryStatusCount;
    constructor(data: any = {}) {
        this.safetyDeviceList=data.safetyDeviceList||[];
        this.deviceStatusByType=data.deviceStatusByType||[];
        this.floorSafetyStatus=data.floorSafetyStatus||[];
        this.statusCount=data.statusCount||new deviceStatus({});
        this.batteryStatusCount=data.batteryStatusCount||new batteryStatusCount();
    }
}
export class batteryStatusCount{
    batteryLowCount:number;
    batteryMediumCount:number;
    batteryHighCount:number;
    constructor(data:any={}){
        this.batteryLowCount=data.batteryLowCount||0;
        this.batteryMediumCount=data.batteryMediumCount||0;
        this.batteryHighCount=data.batteryHighCount||0;
    }
}

export class deviceStatus{
    public triggeredCount:number;
    public outOfServiceCount:number;
    public batteryLowCount:number;
    constructor(data:any={}){
        this.triggeredCount=data.triggeredCount||0;
        this.outOfServiceCount=data.unPluggedCount||0;
        this.batteryLowCount=data.batteryLowCount||0;
    }
}
export class statusByType {
    public id:number;
    public typeName:string;
    public typeId:number;
    public statusCount:deviceStatus;
    constructor(data:any={}){
        this.id=data.id||0;
        this.typeId=data.typeId||0;
        this.typeName=data.typeName||'';
        this.statusCount=data.statusCount||new deviceStatus({});
    }
}
export class floorSafetyStatus{
    floorId:number;
    floorName:string;
    safetyDeviceList:any=[];
    constructor(data:any={}){
        this.floorId=data.floorId||0;
        this.floorName=data.floorName||'';
        this.safetyDeviceList=data.safetyDeviceList||[];
    }
}
export class batteryColor {
    public outerStrokeColor:string;
    public innerStrokeColor:string;
    constructor(data:any={}){
        this.outerStrokeColor=data.outerStrokeColor||'#aaa';
        this.innerStrokeColor=data.innerStrokeColor||'#aaa';
    }
}