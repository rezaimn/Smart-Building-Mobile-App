export class ParkingStatusModel {
    parkingList:any[];
    parkingStatus:parkingStatus=new parkingStatus({});
    constructor(data: any = {}) {
        this.parkingList=data.parkingList||[];
    }
}
export class parkingStatus{
    occupied:number;
    free:number;
    outOfService:number;
    constructor(data:any={}){
        this.free=data.free||0;
        this.occupied=data.occupied||0;
        this.outOfService=data.outOfService||0;
    }
}