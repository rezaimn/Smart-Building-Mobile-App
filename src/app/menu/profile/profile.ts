export class Profile {
    id: number;
    auditparams = null;
    uid: number;
    email: string;
    roles = null;
    orgId: string;
    staffId: number;
    email_verified: string;
    firstLogin: boolean;
    username: string;
    phone_number: string;
    phone_verified: boolean;
    user_id: number;
    picture :any;
    name: string;
    nickname = null;
    given_name = null;
    family_name: string;
    password: string;
    connection = null;
    active: boolean;
    salt1: string;
    salt2: string;
    constructor(data:any={}){
        this.id=data.id||0;
        this.auditparams=data.auditparams||null;
        this.uid=data.uid||0;
        this.email=data.email||'';
        this.roles=data.roles||null;
        this.orgId=data.orgId||'';
        this.staffId=data.staffId||0;
        this.email_verified=data.email_verified||'';
        this.firstLogin=data.firstLogin||false;
        this.username=data.username||'';
        this.phone_number=data.phone_number||'';
        this.phone_verified=data.phone_verified||false;
        this.user_id=data.user_id||0;
        this.picture=data.picture||'./assets/images/admin-blue.png';
        this.nickname=data.nickname||null;
        this.given_name=data.given_name||null;
        this.family_name=data.family_name||'';
        this.password=data.password||'';
        this.connection=data.connection||null;
        this.active=data.active||false;
        this.salt1=data.salt1||null;
        this.salt2=data.salt2||null;

    }
}
