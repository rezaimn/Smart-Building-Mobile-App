export class LightingModel {
    public lightingList:any;
    public lightingStatusCount:lightingStatus;
    public lightingByFloor:lightByFloor[];
    constructor(data:any={}){
        this.lightingList=data.lightingList||[];
        this.lightingStatusCount=data.lightingStatusCount||new lightingStatus({});
        this.lightingByFloor=data.lightingByFloor||[];
    }
}
export class lightByFloor {
    floorId:number;
    floorName:string;
    lightingList:any[];
    public lightingStatusCount:lightingStatus;
    constructor(data:any={}){
        this.floorId=data.floorId||0;
        this.floorName=data.floorName||'';
        this.lightingList=data.lightingList||[];
        this.lightingStatusCount=data.lightingStatusCount=new lightingStatus({});
    }
}
export class lightingStatus{
    public onCount:number;
    public offCount:number;
    constructor(data:any={}){
        this.onCount=data.onCount||0;
        this.offCount=data.offCount||0;
    }
}