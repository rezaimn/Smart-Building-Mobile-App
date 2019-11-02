import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {cardHolder} from '../card-holder';
import {RouteStackService} from '../../utils/services/routeStack.service';
import {DomSanitizer} from '@angular/platform-browser';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'user-search-result',
    templateUrl: 'user-search-result.component.html'

})

export class UserSearchResultComponent implements OnInit, AfterViewInit {
    public staffArrayTemp: cardHolder[] = [];
    public cardHolders: cardHolder[] = [];
    public staffs= [];
    public departmentId: number = -1;
    public subDepartmentId: number = -1;
    public status: string = 'ALL';
    public searchName: any;
    public searchId: any;
    size = 10;
    page = 0;

    constructor(private  httpService: HttpService,
                private route: ActivatedRoute,
                public appService: AppService,
                private router: Router,
                private sanitizer: DomSanitizer,
                public translate: TranslateService,
                public dataPassService: DataPassService,
                private stackService:RouteStackService) {
        //this.stackService.push(this.router.url,null);
    }

    ngOnInit() {
        this.cardHolders.splice(0, this.cardHolders.length);
        for(let subsidiary of this.dataPassService.subsidiaryList){
            this.getAllUsers(subsidiary.id);
        }

        this.dataPassService.searchTriggered.subscribe(
            (res: any) => {
                if(this.dataPassService.selectedfilterType == 'all'||this.dataPassService.selectedfilterType == 'user'){
                    this.cardHolders.splice(0, this.cardHolders.length);
                    for(let subsidiary of this.dataPassService.subsidiaryList){
                        this.getAllUsers(subsidiary.id);
                    }
                }

            }
        );
    }

    ngAfterViewInit() {
    }

    editStaff(cardHolder) {
        console.log(this.staffs,"aaaaaaaaaaaaaaaaa");

                    for(let staff of this.staffs){
                        if(staff.employments[0].employeeId==cardHolder.employeeId){

                            this.dataPassService.selectedUser=staff;
                            console.log(this.dataPassService.selectedUser,"bbbbbbbbbbbbbbbb");
                        }
                    }

                    this.dataPassService.selectedCardHolder = cardHolder;
                    this.router.navigateByUrl('user-edit');

    }

    addStaff() {
        this.dataPassService.selectedUser=null;
        this.router.navigateByUrl('user-edit');
    }

    getAllUsers(subsidiaryId) {
        this.departmentId = -1;

        this.subDepartmentId = -1;

        this.status = 'ALL';

        this.searchName = '';

        this.searchId = '';

        this.httpService
            .get(`/rsb-security/security/staff/getAllStaffByDeptAndSubDept?dept=` + this.departmentId + `&subDept=` + this.subDepartmentId + `&subId=` + subsidiaryId + `&name=` + this.dataPassService.searchText + `&employeeId=` + this.searchId + `&size=` + this.size + `&page=` + this.page)
            .subscribe((res) => {

                let allStaffs = JSON.parse(res._body);

                allStaffs.content.forEach(staff => {
                    let staffObject = new cardHolder(staff);
                    if (staff.phtoId == '' || staff.phtoId == null) {
                        staff.picture = './assets/images/avatar-orange.png';
                    } else {
                        this
                            .httpService
                            .get('/rsb-oms/oms/getFile/' + staff.phtoId)
                            .subscribe(res => {
                                const imageData = JSON.parse(res._body).data;
                                const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
                                staff.picture = profilePicture;
                                staffObject.picture=staff.picture;
                            }, (error: any) => {
                            });
                    }
                    staffObject.id = 0;
                    staffObject.cardNumber = '';
                    staffObject.employeeId = staff.employments[0].employeeId;
                    this.cardHolders.push(staffObject);
                    this.staffs.push(staff);


                });
                this.httpService.get(`/rsb-spas/cardholder`).subscribe(
                    (res: any) => {
                        let cardHolders = JSON.parse(res._body);
                        for (let i = 0; i < this.cardHolders.length; i++) {
                            for (let CH of cardHolders) {
                                if (this.cardHolders[i].employeeId == CH.employeeId) {
                                    if (CH.workgroup != null) {
                                        this.cardHolders[i].workgroup = CH.workgroup;
                                    }
                                    if (CH.accessElement != null) {
                                        this.cardHolders[i].accessElement = CH.accessElement;
                                    }
                                    if (CH.timeSchedule != null) {
                                        this.cardHolders[i].timeSchedule = CH.timeSchedule;
                                    }
                                    if (CH.contractStartDate != null) {
                                        this.cardHolders[i].contractStartDate = CH.contractStartDate;
                                    }
                                    if (CH.contractEndDate != null) {
                                        this.cardHolders[i].contractEndDate = CH.contractEndDate;
                                    }
                                    if (CH.startDate != null) {
                                        this.cardHolders[i].startDate = CH.startDate;
                                    }
                                    if (CH.endDate != null) {
                                        this.cardHolders[i].endDate = CH.endDate;
                                    }
                                    if (CH.enabled != null) {
                                        this.cardHolders[i].enabled = CH.enabled;
                                    }
                                    this.cardHolders[i].cardNumber = CH.cardNumber;
                                    this.cardHolders[i].id = CH.id;
                                }
                            }
                        }
                    }
                );

            });
    }

    enableCardHolder(index) {
        this.cardHolders[index].isProcessing=true;
        this.cardHolders[index].enabled = !this.cardHolders[index].enabled;
        this
            .httpService
            .put('/rsb-spas/cardholder', this.cardHolders[index])
            .subscribe((data) => {
                let cardHolder = JSON.parse(data._body);
                this.cardHolders[index].enabled = cardHolder.enabled;
              this.cardHolders[index].isProcessing=false;
            }, (error) => {
                this.cardHolders[index].enabled = !this.cardHolders[index].enabled;
              this.cardHolders[index].isProcessing=true;
            });
    }

    loadMoreStaffs() {
        this.page = this.page + 1;
        for(let subsidiary of this.dataPassService.subsidiaryList){
            this.getAllUsers(subsidiary.id);
        }
    }
}
