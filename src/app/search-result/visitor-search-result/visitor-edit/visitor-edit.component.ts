import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import 'chart.piecelabel.js';
import {AppService} from '../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../../utils/services';
import {DataPassService} from '../../../utils/services/data-pass-service';
import {visitorInfo} from '../../card-holder';
import {RouteStackService} from '../../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'visitor-edit',
    templateUrl: 'visitor-edit.component.html'

})

export class VisitorEditComponent implements OnInit, AfterViewInit {
    public prepareVisitor = new visitorInfo({});
    public workGroups = [];
    addMode = false;
    editMode = false;
    public workGroupId = 0;
    closeResult = '';

    constructor(
        private  httpService: HttpService,
        private route: ActivatedRoute,
        public appService: AppService,
        private router: Router,
        public translate: TranslateService,
        public dataPassService: DataPassService,
        private stackService: RouteStackService) {
        this.stackService.push(this.router.url, null);
        this.dataPassService.leadIcon="./assets/images/menu/visitor";
    }

    ngOnInit() {

        this.prepareVisitor = new visitorInfo({});
        this.getAllWorkGroups();

        if (this.dataPassService.selectedVisitor != null || this.dataPassService.selectedVisitor != undefined) {
            this.prepareVisitor = this.dataPassService.selectedVisitor;
            this.workGroupId = this.prepareVisitor.cardholder.workgroup.id;
            this.addMode = false;
        } else {
            this.addMode = true;
        }
    }

    getAllWorkGroups() {
        this.workGroups = [];

        this.httpService
            .get(`/rsb-spas/workgroup?type=`+'visitor'+`&lang=`+this.appService.currentLang+`&page=0&size=10000`)
            .subscribe((res) => {

                this.workGroups = JSON.parse(res._body).content;

            }, (err) => {

            });
    }

    ngAfterViewInit() {
    }

    changeEditMode(mode) {
        this.editMode = mode;
    }

    deleteVisitorAccess() {
        this.httpService
            .delete('/rsb-spas/visitor?id=' + this.dataPassService.selectedVisitor.id)
            .subscribe((res) => {
                this.backTop();
            }, (err) => {
            });
    }

    addUpdateVisitor() {
        this.setWorkGroupForVisitor();
        delete this.prepareVisitor.cardholder.employeeId;

        // delete this.prepareVisitor.cardholder.accessElements[0].doors;
        delete this.prepareVisitor.cardholder.department;
        delete this.prepareVisitor.cardholder.subDepartment;
        delete this.prepareVisitor.cardholder.lastNameMultiLingual;
        delete this.prepareVisitor.cardholder.firstNameMultiLingual;
        delete this.prepareVisitor.cardholder.timeSchedule;
        delete this.prepareVisitor.cardholder.accessElement;

        if (this.addMode == true) {
            delete this.prepareVisitor.id;
            delete this.prepareVisitor.cardholder.id;
            this.prepareVisitor.cardholder.enabled = true;
            this
                .httpService
                .post('/rsb-spas/cardholder', this.prepareVisitor.cardholder)
                .subscribe((cardH) => {
                        let CHId = JSON.parse(cardH._body).id;
                        this.prepareVisitor.cardholder.id = CHId;
                        this
                            .httpService
                            .post('/rsb-spas/visitor', this.prepareVisitor)
                            .subscribe((visitor) => {
                                this.backTop();
                                //  let jsonData = JSON.parse(visitor._body);
                            }, (error) => {

                            });
                    }
                );
        }
        if (this.editMode == true) {
            this.editMode = false;
            this
                .httpService
                .put('/rsb-spas/cardholder', this.prepareVisitor.cardholder)
                .subscribe((data) => {
                        this
                            .httpService
                            .put('/rsb-spas/visitor', this.prepareVisitor)
                            .subscribe((data) => {
                                this.backTop();
                                //let jsonData = JSON.parse(data._body);
                            }, (error) => {

                            });
                    }
                );
        }
    }

    setWorkGroupForVisitor() {
        for (let WG of this.workGroups) {
            if (WG.id == this.workGroupId) {
                this.prepareVisitor.cardholder.workgroup = WG;
            }
        }
    }

    backTop() {
        this.dataPassService.selectedfilterType = 'visitor';
        this.dataPassService.searchMode = true;
        this.dataPassService.manageMode = true;
        this.dataPassService.selectedVisitor = new visitorInfo({});
        this.router.navigateByUrl('search');
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}
