export class Scenario {
    name:string;
    sourcedeviceid:number;
    sourcestate:any;
    destinationdevices: OutputDevice[];
    id: number;
    frequency: string;
    executiontime: string;
    sourcedevicetypeid: number;
    sourcedevicetypename: string;
    constructor(data:any={}){
        this.id=data.id||0;
        this.name=data.name||'';
        this.sourcedeviceid=data.sourcedeviceid||0;
        this.sourcestate=data.sourcestate;
        this.destinationdevices=data.destinationdevices||new OutputDevice({});
        this.frequency=data.frequency||'';
        this.executiontime=data.executiontime||'';
        this.sourcedevicetypeid=data.sourcedevicetypeid||0;
        this.sourcedevicetypename=data.sourcedevicetypename||'';
    }
}
export class OutputDevice {
    destinationdeviceid:number;
    destinationstate: any;
    destinationmode: number;
    flag:number;
    destinationdevicename:string;
    destinationdevicetypeid: number;
    destinationdevicetypename: string;

    constructor(data:any={}){
        this.destinationdeviceid=data.destinationdeviceid||0;
        this.destinationstate=data.destinationstate||null;
        this.destinationmode=data.destinationmode||0;
        this.flag=data.flag||null;
        this.destinationdevicename=data.destinationdevicename||'';
        this.destinationdevicetypeid=data.destinationdevicetypeid||0;
        this.destinationdevicetypename=data.destinationdevicetypename||'';


    }
}