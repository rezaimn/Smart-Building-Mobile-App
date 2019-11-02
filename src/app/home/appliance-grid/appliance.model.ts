export class ApplianceModel {
    public applianceList:any[];
    public applianceListByFloor:floorAppliance[];
    public applianceByType:dataByType[];
    public applianceStatusCount:applianceStatus;
    constructor(data:any={}){
        this.applianceList=data.applianceList||[];
        this.applianceListByFloor=data.applianceListByFloor||[];
        this.applianceByType=data.applianceByType||[];
        this.applianceStatusCount=data.applianceStatusCount||new applianceStatus({});
    }
}
export class applianceStatus{
    public pluggedCount:number;
    public unPluggedCount:number;
    constructor(data:any={}){
        this.pluggedCount=data.pluggedCount||0;
        this.unPluggedCount=data.unPluggedCount||0;
    }
}
export class dataByType {
    public faName:string;
    public enName:string;
    public id:number;
    public applianceStatusCount:applianceStatus;
    constructor(data:any={}){
        this.faName=data.faName||'';
        this.enName=data.enName||'';
        this.id=data.id||0;
        this.applianceStatusCount=data.applianceStatusCount=new applianceStatus({});
    }
}
export class floorAppliance{
    floorId:number;
    floorName:string;
    applianceList:any=[];
    constructor(data:any={}){
        this.floorId=data.floorId||0;
        this.floorName=data.floorName||'';
        this.applianceList=data.applianceList||[];
    }
}