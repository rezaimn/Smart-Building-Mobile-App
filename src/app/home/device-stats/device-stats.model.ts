export class DeviceStatsModel {
    public nodeList:any;
    public deviceCount:deviceCountT[];
    public deviceStatsByFloor:deviceStatsByFloor[];
    constructor(data:any={}){
        this.nodeList=data.nodeList||[];
        this.deviceCount=data.deviceCount||[];
        this.deviceStatsByFloor=data.deviceStatsByFloor||[];
    }
}
export class deviceStatsByFloor {
    locationByNames:any[];
    count:number;
    public deviceCountSt:deviceCountT[];
    constructor(data:any={}){
        this.locationByNames=data.locationByNames||[];
        this.count=data.count||0;
        this.deviceCountSt=data.deviceCountSt=[];
    }
}
export class deviceCountT{
    public deviceType:string;
    public count:number;
    constructor(data:any={}){
        this.deviceType=data.deviceType||0;
        this.count=data.count||0;
    }
}