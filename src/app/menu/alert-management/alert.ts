export class Alert {
    id:number;
    name:string;
    campusid:number;
    buildingid:number;
    createdby:number;
    floorid: number;
    areaid:number;
    moduleid:number;
    devicetypeid:number;
    deviceid: number;
    departmentid:number;
    subdepartmentid:number;
    stafflist:staffTemp[]= [];
    etchours: number;
    etcminutes:number;
    severityid:number;
    isnotification:number;
    isemail: number;
    issms:number;
    constructor(data:any={}){
        this.createdby=data.createdby||0;
        this.id=data.id||0;
        this.name=data.name||'';
        this.campusid=data.campusid||0;
        this.buildingid=data.buildingid||0;
        this.floorid=data.floorid||0;
        this.areaid=data.areaid||0;
        this.moduleid=data.moduleid||5;
        this.devicetypeid=data.devicetypeid||0;
        this.deviceid=data.deviceid||0;
        this.departmentid=data.departmentid||0;
        this.subdepartmentid=data.subdepartmentid||0;
        this.stafflist=data.stafflist||new staffTemp({});
        this.etchours=data.etchours||0;
        this.etcminutes=data.etcminutes||0;
        this.severityid=data.severityid||1;
        this.isnotification=data.isnotification||1;
        this.isemail=data.isemail||1;
        this.issms=data.issms||1;

    }
}
export class staffTemp{
    executionorder: number;
    staffid:string;
    constructor(data:any={}){
        this.executionorder=data.executionorder||0;
        this.staffid=data.staffid||'';
    }
}
