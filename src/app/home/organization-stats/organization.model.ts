export class OrganizationModel{
    areaByFloor:areaFloor[];
    staffByFloor:staffFloor[];
    allUsers:any[];
    constructor(data:any={}){
        this.areaByFloor=data.areaByFloor||[];
        this.staffByFloor=data.staffByFloor||[];
        this.allUsers=data.allUsers||[];
    }

}
export class staffFloor{
    staffList:any[];
    floor:any;
    constructor(data:any={}){
        this.floor=data.floor||null;
        this.staffList=data.staffList||[];
    }
}
export class areaFloor{
    floor:any;
    areaList:areaTemp[];
    constructor(data:any={}){
        this.areaList=data.areaList||[];
        this.floor=data.floor||null;
    }

}
export class areaTemp{
    name:any;
    type:any;
    count:number;
    constructor(data:any={}){
        this.name=data.name||null;
        this.type=data.type||null;
        this.count=data.count||0;
    }
}