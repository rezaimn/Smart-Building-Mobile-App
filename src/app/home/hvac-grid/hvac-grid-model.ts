export class HvacGridModel {
    public hvacList:any=[];
    public floorHvac:floorHvac[];
    public hvacStatusCount:hvacStatusCount;
    public tempratureChartBarData:any[];
    public tempratureBarChartLabels: any[]
    constructor(data: any = {}) {
        this.hvacList=data.hvacList||[];
        this.floorHvac=data.floorHvac||[];
        this.hvacStatusCount=data.batteryStatusCount||new hvacStatusCount();
        this.tempratureChartBarData=data.tempratureChartBarData||[{data: [], label: 'میانگین دمای واقعی'}, {data: [], label: 'میانگین دمای مرجع'}];
        this.tempratureBarChartLabels=data.tempratureBarChartLabels||[];
    }
}
export class hvacStatusCount{
    inServiceCount:number;
    outOfServiceCount:number;
    constructor(data:any={}){
        this.inServiceCount=data.inServiceCount||0;
        this.outOfServiceCount=data.outOfServiceCount||0;
    }
}

export class floorHvac{
    floorId:number;
    floorName:string;
    hvacList:any=[];
    constructor(data:any={}){
        this.floorId=data.floorId||0;
        this.floorName=data.floorName||'';
        this.hvacList=data.safetyDeviceList||[];
    }
}
export class temperColor {
    public outerStrokeColor:string;
    public innerStrokeColor:string;
    constructor(data:any={}){
        this.outerStrokeColor=data.outerStrokeColor||'#aaa';
        this.innerStrokeColor=data.innerStrokeColor||'#aaa';
    }
}