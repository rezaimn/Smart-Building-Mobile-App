export class AlertSettings{
  userId:number;
  smsAlert:number;
  emailAlert:number;
  pushAlert:number;
  dailyDigestAlert:number;
  twoPassVerification:boolean;
  constructor(data:any={}){
    this.userId=data.userId||0;
    this.smsAlert=data.smsAlert||0;
    this.emailAlert=data.emailAlert||0;
    this.pushAlert=data.pushAlert||0;
    this.dailyDigestAlert=data.dailyDigestAlert||0;
    this.twoPassVerification=data.twoPassVerification||false;
  }
}
