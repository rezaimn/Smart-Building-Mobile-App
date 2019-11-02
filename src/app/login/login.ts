export class Login {
    public username: string;
    public password: string;
    constructor(d: any = {}) {
        this.username = d.username || '';
        this.password = d.password || '';
    }
}
export class ResetPassword{
    public newPassword:string;
    public confirmPassword:string;
    public otpToken:string;
    constructor(data:any={}){
        this.newPassword=data.newPassword||'';
        this.confirmPassword=data.confirmPassword||'';
        this.otpToken=data.otpToken||'';
    }
}
export class User {
    public id: number;
    public first_name: string;
    public last_name: string;
    public email: string;
    public mobile: string;
    public user_role: string;
    public orgId: number;
    public uid: string;
    public sessionToken: string;
    public csrfToken: string;
    public accessToken: string;
    public tokenId: string;
    public response: string;
    public roles: any;
    public staff_id : any;
    public user_id: any;
    public subsidiaryId: any;
    public designationId : any;
    public designationName : any;
    public managerName : any;
    public supervisorName : any;
    public photoUrl: any;
    public employeeId : any;

    constructor(data: any = {}) {
        this.id = data.id ? data.id : 0;
        this.first_name = data.username || '';
        this.last_name = data.family_name || '';
        this.email = data.user_id || '';
        this.mobile = data.phone_number || '';
        // this.user_role = data.roles[0].roleName;
        this.orgId = data.orgId || 0;
        this.uid = data.uid || '';
        this.sessionToken = data.sessionToken || '';
        this.csrfToken = data.csrfToken || '';
        this.accessToken = data.accessToken || '';
        this.tokenId = data.tokenId || '';
        this.response = data.response || null;
        this.staff_id = data.staffId;
        this.user_id = data.user_id;
        this.managerName = data.managerName;
        this.supervisorName = data.supervisorName;
        this.photoUrl = data.photoUrl;
        this.employeeId = data.employeeId;
        this.subsidiaryId =data.subsidiaryId ? data.subsidiaryId : 0;
        this.designationId =data.designationId ? data.designationId : 0;
        this.designationName = data.designationName || '';

    }
}