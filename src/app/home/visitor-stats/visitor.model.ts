

export class VisitorModel {
    public visitorList:any[];
    public visitorByWorkGroup:visitorByWorkGroup[];

    constructor(data:any={}){
        this.visitorList=data.visitorList||[];
        this.visitorByWorkGroup=data.visitorByWorkGroup||[];
    }
}
export class visitorByWorkGroup{
    public id:number;
    public nameFa:string;
    public nameEn:string;
    public count:number;
    constructor(data:any={}){
        this.id=data.id||0;
        this.nameEn=data.nameEn||'';
        this.nameFa=data.nameFa||'';
        this.count=data.count||'';
    }
}