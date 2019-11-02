import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {EavWrapperService, HttpService} from '../../../utils/services';
import {DataPassService} from '../../../utils/services/data-pass-service';
import {Department, Designation, EmploymentDetails, PersonalInfo, StaffPolicy, SubDepartment} from '../staff';
import {accessLevel, cardHolder, workGroup} from '../../card-holder';
import {DatePipe} from '@angular/common';
import {RouteStackService} from '../../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'user-edit',
    templateUrl: 'user-edit.component.html'

})

export class UserEditComponent implements OnInit {
    public personalInfo: PersonalInfo = new PersonalInfo({}, this.dataPassService.organizationId, null, new EmploymentDetails({}));
    public prepareCardHolder: cardHolder = new cardHolder({});
    public preparePolicy: StaffPolicy = new StaffPolicy({});
    public employmentDetails: EmploymentDetails = new EmploymentDetails({});
    cardEditMode = false;
    cardAddMode = false;
    employmentsEditMode = false;
    employmentsAddMode = false;
    staffEditMode = false;
    staffAddMode = false;
    public pickedCFromDate = '';
    public CFromDate: any;
    public pickedCToDate = '';
    public CToDate: any;
    public pickedFromDate = '';
    public fromDate: any;
    public pickedToDate = '';
    public toDate: any;
    workGroups = [];
    accessLevels = [];
    timeSchedules = [];
    public staffs = [];
    accessLevelId = 0;
    workGroupId = 0;
    departments = [];
    subdepartments = [];
    designations = [];
    subsidiaries = [];
    timeScheduleId = 0;

    constructor(private  httpService: HttpService,
                private eavWrapper: EavWrapperService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router,
                public translate: TranslateService,
                public dataPassService: DataPassService,
                private datePipe: DatePipe,
                private stackService: RouteStackService) {
        this.stackService.push(this.router.url, null);
        this.dataPassService.leadIcon="./assets/images/menu/users";
    }

    convertDateToCalendarFormat(date: string) {
        let tempDate = '';
        if (date != '' && date != null) {
            tempDate = date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2);
            return tempDate;
        }
        return '';
    }

    changeCardEditMode(mode) {
        this.cardEditMode = mode;
    }

    changeEmploymentsEditMode(mode) {
        this.employmentsEditMode = mode;
    }

    changeStaffEditMode(mode) {
        this.staffEditMode = mode;
    }

    ngOnInit() {

        this.getAllWorkGroups();
        this.getAllAccessLevels();
        this.getAllTimeSchedules();
        for (let subsidiary of this.dataPassService.subsidiaryList) {
            this.getAllUsers(subsidiary.id);
            this.getDepartmentDetails(subsidiary.id);
        }

        this.getSubsidiary();
        if (this.dataPassService.selectedUser != null || this.dataPassService.selectedUser != undefined) {
            this.personalInfo = this.dataPassService.selectedUser;
            this.staffAddMode = false;
            if (this.dataPassService.selectedUser.employments != null) {
                this.employmentDetails = this.dataPassService.selectedUser.employments[0];
                this.employmentDetails.lineMgrId = parseInt(this.dataPassService.selectedUser.employments[0].lineMgrId);
                this.employmentDetails.lineSupervisorId = parseInt(this.dataPassService.selectedUser.employments[0].lineSupervisorId);
                //this.employmentsAddMode=false;
            } else {
                //this.employmentsAddMode=true;
            }
        } else {
            this.staffAddMode = true;
        }
        if (this.dataPassService.selectedCardHolder != null || this.dataPassService.selectedCardHolder != undefined) {
            this.prepareCardHolder = this.dataPassService.selectedCardHolder;
            this.workGroupId = this.prepareCardHolder.workgroup.id;
            this.accessLevelId = this.prepareCardHolder.accessElement.id;
            this.timeScheduleId = this.prepareCardHolder.timeSchedule.id;
            this.pickedCFromDate = this.convertDateToCalendarFormat(this.prepareCardHolder.contractStartDate);
            this.pickedCToDate = this.convertDateToCalendarFormat(this.prepareCardHolder.contractEndDate);
            this.pickedFromDate = this.convertDateToCalendarFormat(this.prepareCardHolder.startDate);
            this.pickedToDate = this.convertDateToCalendarFormat(this.prepareCardHolder.endDate);
            this.cardAddMode = false;
        } else {
            this.cardAddMode = true;
        }
        this.getPolicyDetails();
        //  console.log(this.employmentDetails,"eeeeeeeeeeeeeeeeeemmmmmmmmmmmmmmmm");
    }

    getAllUsers(subsidiaryId) {
        this.httpService
            .get(`/rsb-security/security/staff/getAllStaffByDeptAndSubDept?dept=` + -1 + `&subDept=` + -1 + `&subId=` + subsidiaryId + `&name=` + this.dataPassService.searchText + `&employeeId=` + '' + `&size=` + 10000 + `&page=` + 0)
            .subscribe((res) => {
                    let allStaffs = JSON.parse(res._body);
                    for (let staff of allStaffs.content) {
                        this.staffs.push(staff);
                    }
                }
            );
    }

    getPolicyDetails() {
        this.httpService
            .get(`/rsb-oms/oms/staff/getStaffPolicy?staffId=` + this.personalInfo.id)
            .subscribe((res) => {
                this.preparePolicy = new StaffPolicy(JSON.parse(res._body));
            }, (err) => {

            });
    }

    getDepartmentDetails(subsidiaryId) {
        this.departments.splice(0, this.departments.length);
        this
            .httpService
            .get(`/rsb-oms/oms/dept/getDeptBySubsidiary?subsidiaryId=` + subsidiaryId)
            .subscribe(res => {
                if (res.status === 200) {
                    let departmentDetails = JSON.parse(res._body);
                    departmentDetails.forEach(department => {
                        let sds: SubDepartment[] = [];
                        if (department.subDepartments !== undefined && department.subDepartments.length > 0) {
                            department.subDepartments.forEach(subdepartment => {
                                let dss: Designation[] = [];
                                if (subdepartment.designations !== undefined && subdepartment.designations.length > 0) {
                                    subdepartment.designations.forEach(designation => {
                                        let dObject = new Designation(designation);
                                        dss.push(dObject);
                                    });
                                }
                                let sdObject = new SubDepartment(subdepartment, dss);
                                sds.push(sdObject);
                            });
                        }

                        let ds: Designation[] = [];
                        if (department.designations !== undefined && department.designations.length > 0) {
                            department.designations.forEach(designation => {
                                let dObject = new Designation(designation);
                                ds.push(dObject);
                            });
                        }

                        let dptObject = new Department(department, sds, ds);
                        this.departments.push(dptObject);
                    });
                    this.updateSubDepartments();
                    //this.updateDegisnations();
                }
            }, (error: any) => {

            });
    }

    updateSubDepartments() {
        this.subdepartments = [];

        this.designations = [];


        this.departments.forEach(department => {
            if (department.id === this.preparePolicy.departmentId) {
                this.subdepartments = department.subdepartments;
                this.designations = department.designations;
            }
        });
        console.log('pppppppppppppppp', this.subdepartments, this.designations);
    }

    // updateDegisnations() {
    //     this.designations = [];
    //
    //
    //     if (this.preparePolicy.subDepartmentId == 0) {
    //         this.departments.forEach(department => {
    //             if (department.id === this.preparePolicy.departmentId) {
    //                 this.designations = department.designations;
    //             }
    //         });
    //     } else {
    //         this.subdepartments.forEach(department => {
    //             if (department.id === this.preparePolicy.subDepartmentId) {
    //                 this.designations = department.designations;
    //             }
    //         });
    //     }
    // }
    getSubsidiary() {
        this.subsidiaries = [];
        this
            .httpService
            .get(`/rsb-oms/oms/getChildEntities?parentId=` + this.dataPassService.organizationId + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    let allSubsidiaries = JSON.parse(res._body);
                    allSubsidiaries.forEach(subsidiary => {
                        let subsidiaryJson = this
                            .eavWrapper
                            .eavToJson(subsidiary, 'SUBSIDIARY');
                        if (subsidiaryJson !== null) {
                            this
                                .subsidiaries
                                .push(subsidiaryJson);
                        }
                    });
                }
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured', 'Ok', {
                //     duration: 5000,
                //     // extraClasses: ['error-snackbar']
                //   });
            });
    }

    backTop() {
        this.dataPassService.selectedUser = new PersonalInfo({}, this.dataPassService.organizationId, null, new EmploymentDetails({}));
        this.dataPassService.selectedCardHolder = new cardHolder({});
        this.dataPassService.selectedfilterType = 'user';
        this.dataPassService.searchMode = true;
        this.dataPassService.manageMode = true;
        this.router.navigateByUrl('search');
    }

    getAllWorkGroups() {
        this.workGroups = [];

        this.httpService
            .get(   `/rsb-spas/workgroup?type=`+'department'+`&lang=`+this.appService.currentLang+`&page=0&size=10000`)
            .subscribe((res) => {

                this.workGroups = JSON.parse(res._body).content;
                console.log(this.workGroups, 'ooooooooooooooooooooooooooooooooooooooooooo');

            }, (err) => {

            });
    }

    getAllAccessLevels() {
        this.accessLevels = [];

        this.httpService
            .get(`/rsb-spas/accesselement/?type=AREA`)
            .subscribe((res) => {

                this.accessLevels = JSON.parse(res._body).content;
                console.log(this.accessLevels, 'ooooooooooooooooooooooooooooooooooooooooooo');
            }, (err) => {

            });

    }

    getAllTimeSchedules() {
        this.httpService
            .get(`/rsb-spas/timeschedule`)
            .subscribe((res) => {
                this.timeSchedules.splice(0, this.timeSchedules.length);
                this.timeSchedules = JSON.parse(res._body);

            }, (err) => {
            });
    }

    setWorkGroupForCardHolder() {
        for (let WG of this.workGroups) {
            if (WG.id == this.workGroupId) {
                this.prepareCardHolder.workgroup = WG;
            }
        }
    }

    setAccessElementForCardHolder() {
        if (this.accessLevelId != 0) {
            for (let AL of this.accessLevels) {
                if (AL.id == this.accessLevelId) {
                    this.prepareCardHolder.accessElement = AL;
                }
            }
        }
    }

    setTimeScheduleForCardHolder() {
        if (this.timeScheduleId != 0) {
            for (let TS of this.timeSchedules) {
                if (TS.id == this.timeScheduleId) {
                    this.prepareCardHolder.timeSchedule = TS;
                }
            }
        }
    }

    addUpdateStaff() {
        if (this.staffAddMode) {
            delete this.personalInfo.id;
            delete this.personalInfo.profileImage;
            delete this.personalInfo.employmentDetails;
            if (this.dataPassService.currentLang == 'fa') {
                this.personalInfo.firstName = this.personalInfo.firstNameMultiLingual.map.fa;
                this.personalInfo.lastName = this.personalInfo.lastNameMultiLingual.map.fa;
            }
            if (this.dataPassService.currentLang == 'en') {
                this.personalInfo.firstName = this.personalInfo.firstNameMultiLingual.map.en;
                this.personalInfo.lastName = this.personalInfo.lastNameMultiLingual.map.en;
            }
            this.httpService.post(`/rsb-security/security/staff/createStaff?Accept-Language=` + this.dataPassService.currentLang, this.personalInfo)
                .subscribe(res => {
                    // Get the Staff Id from the Response and Make API calls for,
                    // Employment, Policy, Vehicle
                    let staff = JSON.parse(res._body);
                    // Assign the Id coming from the API response
                    let staffId = staff.id;
                    //Make Serial Calls for Proper flow
                    this.addEmployment(this.employmentDetails, staffId);
                }, (err: any) => {
                    // this.createStaffError('error occured while creating the staff');
                });
        }
        if (this.staffEditMode) {
            this.personalInfo.dob = this.datePipe.transform(this.personalInfo.dob, 'dd/MM/yyyy');
            this.httpService.post(`/rsb-security/security/staff/updateStaff?Accept-Language=` + this.dataPassService.currentLang, this.personalInfo)
                .subscribe(res => {
                    this.staffEditMode = false;
                    let staffId = this.personalInfo.id;
                    //Make Serial Calls for Proper flow
                    this.updateEmployments(this.employmentDetails);
                }, (err: any) => {
                    //this.createStaffError('error occured while updating the staff personal info');
                });
        }
    }

    addEmployment(employementDetails: EmploymentDetails, staffId: number) {
        employementDetails.staffId = staffId;
        employementDetails.doj = this.datePipe.transform(this.employmentDetails.doj, 'dd/MM/yyyy');
        delete employementDetails.id;
        this.httpService.post(`/rsb-security/security/staff/createEmployment`, employementDetails)
            .subscribe(res => {
                this.addPolicy(this.preparePolicy, staffId);
            }, (err: any) => {
                //this.createStaffError('error occured while adding the employment details');
            });
    }

    addPolicy(policyDetails: StaffPolicy, staffId) {

        // console.log(policyDetails);
        delete policyDetails.id;
        policyDetails.staffId = staffId;
        // API to integrate
        this.httpService.post(`/rsb-security/security/staff/createStaffPolicy`, policyDetails)
            .subscribe(res => {
                this.staffAddMode = false;
            }, (err: any) => {
                //  console.log(err);
                // this.createStaffError('error occured while adding the staff details');
            });
    }


    updateEmployments(employementDetails) {
        employementDetails.doj = this.employmentDetails.doj;
        this.httpService.post(`/rsb-security/security/staff/updateEmployment`, employementDetails)
            .subscribe(res => {
                this.updatePolicy(this.preparePolicy);
                // this.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
            }, (err: any) => {
                // this.createStaffError('error occured while updating the staff employement details');
            });
    }

    updatePolicy(policyDetails) {
        policyDetails.id = this.preparePolicy.id;
        policyDetails.staffId = this.personalInfo.id;
        // console.log(this.policyDetails);
        this.httpService.post(`/rsb-security/security/staff/updateStaffPolicy`, policyDetails)
            .subscribe(res => {
                this.staffAddMode = false;
            }, (err: any) => {
                //this.createStaffError('error occured while updating the staff policy');
            });
    }

    deleteStaff() {
        this.httpService.delete('/rsb-security/security/staff/deleteStaff?staffId=' + this.personalInfo.id)
            .subscribe(res => {
                this.backTop();
            }, (err: any) => {
                //this.createStaffError('error occured while updating the staff policy');
            });

    }

    addUpdateCardHolder() {

        this.setWorkGroupForCardHolder();
        this.setAccessElementForCardHolder();
        this.setTimeScheduleForCardHolder();
        this.prepareCardHolder.startDate = this.fromDate;
        this.prepareCardHolder.endDate = this.toDate;
        this.prepareCardHolder.contractStartDate = this.CFromDate;
        this.prepareCardHolder.contractEndDate = this.CToDate;
        this.prepareCardHolder.enabled = true;
        delete this.prepareCardHolder.accessElement.doors;
        if (this.accessLevelId == 0) {
            this.prepareCardHolder.accessElement = null;
        }
        if (this.timeScheduleId == 0) {
            this.prepareCardHolder.timeSchedule = null;
        }
        console.log(this.prepareCardHolder);
        if (this.cardAddMode) {
            delete this.prepareCardHolder.id;
            this
                .httpService
                .post('/rsb-spas/cardholder', this.prepareCardHolder)
                .subscribe((data) => {
                    let jsonData = JSON.parse(data._body);

                    if (jsonData.length) {
                        jsonData = JSON.parse(jsonData);
                    } else {
                    }

                }, (error) => {
                    this.prepareCardHolder.workgroup = new workGroup({});
                    this.prepareCardHolder.accessElement = new accessLevel({});
                    this.prepareCardHolder.cardNumber = '';
                });

        }
        if (this.cardEditMode) {
            this.cardEditMode = false;
            this
                .httpService
                .put('/rsb-spas/cardholder', this.prepareCardHolder)
                .subscribe((data) => {

                    let jsonData = JSON.parse(data._body);

                    if (jsonData.length) {

                        jsonData = JSON.parse(jsonData);

                    } else {

                    }
                }, (error) => {

                });

        }

    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}
