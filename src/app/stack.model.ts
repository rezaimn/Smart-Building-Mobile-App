export class StackModel{
    public route:string;
    public selectedItemIndex:number;
    constructor(route:string,index:number){
        this.route=route||'';
        this.selectedItemIndex=index||0;
    }
}