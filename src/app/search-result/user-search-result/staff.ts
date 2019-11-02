export class PersonalInfo {
    public id: number;
    public firstName: string;
    public firstNameMultiLingual = {

        'map': new multiLingMap
    }
    public lastName: string;
    public lastNameMultiLingual = {
        'map': new multiLingMap
    }
    public phtoId: string;
    public dob: string;
    public email: string;
    public fatherName: string;
    public fatherNameMultiLingual = {

        'map': new multiLingMap
    }
    public mobileNum: string;
    public nationalId: string;

    public resAddress: string;
    public resAddressMultiLingual = {

        'map': new multiLingMap
    }
    public resPhoneNum: string;
    public resAddressZipcode: string;

    public permAddress: string;
    public permAddressMultiLingual = {

        'map': new multiLingMap
    }
    public permAddressZipcode: string;
    public permPhoneNum: string;

    public ssn: string;
    public organization: any;
    public subsidyId: number;

    public profileImage: any;
    public employmentDetails: any;

    constructor(data: any = {}, organizationId, subsidiaryId, employmentDetails: EmploymentDetails) {
        if (data.dob) {
            this.dob = data.dob;
        } else {
            this.dob = "01/01/2000";
        }

        this.id = data.id || 0;
        this.firstName = data.firstName || '';
        this.firstNameMultiLingual = data.firstNameMultiLingual || this.firstNameMultiLingual;
        this.lastName = data.lastName || '';
        this.lastNameMultiLingual = data.lastNameMultiLingual || this.lastNameMultiLingual;
        this.email = data.email || '';
        this.phtoId = data.phtoId || '';
        this.fatherName = data.fatherName || 'not specified';
        this.fatherNameMultiLingual = data.fatherNameMultiLingual || this.fatherNameMultiLingual;
        this.mobileNum = data.mobileNum || '';
        this.nationalId = data.nationalId || '2222222222';
        this.permAddress = data.permAddress || 'not specified';
        this.permAddressMultiLingual = data.permAddressMultiLingual || this.permAddressMultiLingual;
        this.permPhoneNum = data.permPhoneNum || '1111111111';
        this.permAddressZipcode = data.permAddressZipcode || '1234512345';
        this.resAddress = data.resAddress || 'not specified';
        this.resAddressMultiLingual = data.resAddressMultiLingual || this.resAddressMultiLingual;
        this.resPhoneNum = data.resPhoneNum || '44444444444';
        this.resAddressZipcode = data.resAddressZipcode || '1234512345';
        this.ssn = data.ssn || '2323232424';
        this.organization = {id: organizationId};
        this.subsidyId = subsidiaryId;
        this.profileImage = '';
        this.employmentDetails = employmentDetails;
    }
}

export class multiLingMap {
    public en = '';
    public fa = '';
}

export class EmploymentDetails {
    public id: number;
    public employeeId: number;
    public doj: string;
    public lineSupervisorId: number;
    public lineMgrId: number;
    public basicSal: number;
    public staffId: number;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.staffId = data.staffId || 0;
        this.employeeId = data.employeeId || '';
        this.doj = data.doj || '01/01/2000';
        this.lineSupervisorId = data.lineSupervisorId || 0;
        this.lineMgrId = data.lineMgrId || 0;
        this.basicSal = data.basicSal || '0';
    }
}

export class StaffPolicy {
    public id: number;
    public staffId: number;
    public departmentId: number;
    public subDepartmentId: number;
    public designationId: number;
    public gradeId: number;
    public allownce: number;
    public allownceGroupId: number;
    public workTimePolicyId: number;
    public worktimePolicyGroupId: number;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.staffId = data.staffId || 0;
        this.departmentId = data.departmentId || -1;
        this.subDepartmentId = data.subDepartmentId || -1;
        this.designationId = data.designationId || -1;
        this.gradeId = data.gradeId || -1;
        this.allownce = data.allownce || -1;
        this.allownceGroupId = data.allownceGroupId || -1;
        this.workTimePolicyId = data.workTimePolicyId || -1;
        this.worktimePolicyGroupId = data.worktimePolicyGroupId || -1;
    }
}

export class StaffVehicle {
    public id: number;
    public staffId: number;
    public type: string;
    public regn: string;

    public brand: string;
    public brandMultiLingual = {
        'map': new multiLingMap
    }
    public colorMultiLingual = {
        'map': new multiLingMap
    }
    public color: string;
    public resLotNum: string;
    public expDate: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.staffId = data.staffId || 0;
        this.type = data.type || 'car';
        this.regn = data.regn || '';
        this.brand = data.brand || '';
        this.color = data.color || '';
        this.resLotNum = data.resLotNum || '';
        this.expDate = data.expDate || '';
        this.brandMultiLingual = data.brandMultiLingual || this.brandMultiLingual;
        this.colorMultiLingual = data.colorMultiLingual || this.colorMultiLingual;
    }
}

export class Department {
    public id: number;
    public name: string;
    public deptnameMultiLingual = {
        map : new multiLingMap
    };
    public code: string;
    public subdepartments: SubDepartment[];
    public designations: Designation[];

    constructor(data: any = {}, subdepartments: SubDepartment[] = [], designations: Designation[] = []) {
        this.id = data.id || 0;
        this.name = data.departmentName || '';
        this.deptnameMultiLingual=data.deptnameMultiLingual||this.deptnameMultiLingual;
        this.code = data.departmentCode || '';
        this.subdepartments = subdepartments || [];
        this.designations = designations || [];
    }
}

export class SubDepartment {
    public id: number;
    public name: string;
    public deptnameMultiLingual = {
        map : new multiLingMap
    };
    public code: string;
    public designations: Designation[];

    constructor(data: any = {}, designations: Designation[] = []) {
        this.id = data.id || 0;
        this.name = data.departmentName || '';
        this.code = data.departmentCode || '';
        this.deptnameMultiLingual=data.deptnameMultiLingual||this.deptnameMultiLingual;
        this.designations = designations || [];
    }
}

export class Designation {
    public id: number;
    public name: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.name = data.designation || '';
    }
}

export class PolicyViewObject {
    public department: string;
    public subDepartment: string;
    public subDeptnameMultiLingual={
        'map': new multiLingMap
    }
    public deptnameMultiLingual={
        'map': new multiLingMap
    }
    public designation: string;
    public grade: string;
    public allowance: string;
    public workStartTime: Date;
    public workEndTime: Date;
    public workDuration: string;
    public mealStartTime: Date;
    public mealEndTime: Date;
    public mealDuration: string;

    constructor(data: any = {}, todayDate) {
        this.department = data.department || '';
        this.subDepartment = data.subDepartment || '';
        this.deptnameMultiLingual=data.deptnameMultiLingual||this.deptnameMultiLingual;
        this.subDeptnameMultiLingual=data.subDeptnameMultiLingual||this.subDeptnameMultiLingual;
        this.designation = data.designation || '';
        this.grade = data.grade || '';
        this.allowance = data.allowance || '';
        if (data.workStartTime) {
            this.workStartTime = new Date(todayDate + data.workStartTime);
        } else {
            this.workStartTime = new Date();
        }
        if (data.workEndTime) {
            this.workEndTime = new Date(todayDate + data.workEndTime);
        } else {
            this.workEndTime = new Date();
        }
        this.workDuration = data.workDuration || '';
        if (data.mealStartTime) {
            this.mealStartTime = new Date(todayDate + data.mealStartTime);
        } else {
            this.mealStartTime = new Date();
        }
        if (data.mealEndTime) {
            this.mealEndTime = new Date(todayDate + data.mealEndTime);
        } else {
            this.mealEndTime = new Date();
        }
        this.mealDuration = data.mealDuration || '';
    }
}