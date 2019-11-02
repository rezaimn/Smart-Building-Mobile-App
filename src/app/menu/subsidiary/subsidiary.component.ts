import {Component} from '@angular/core';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {EavWrapperService, HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'subsidiary',
    templateUrl: 'subsidiary.component.html'
})

export class SubsidiaryComponent {

    selectedId=0;
    selectedSubsidiary=null;
    subsidiaries=[];
    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                private httpService:HttpService,
                private eavWrapper:EavWrapperService,
                public dataPassService:DataPassService,
                private stackService:RouteStackService
    ) {

        this.stackService.empetyStack();
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/menu/subsidiary";
    }

    ngOnInit() {

        this.getSubsidiary();
    }
    setId(subsidiary,id){
        this.selectedId=id;
        this.selectedSubsidiary=subsidiary;
    }
    getSubsidiary() {
        //console.log(this.dataPassService.selectedSubsidiary,"ssssssssssssuuuuuuuuubbbbbbbbbbb");
        this.subsidiaries = [];
        this
            .httpService
            .get(`/rsb-oms/oms/getChildEntities?parentId=` + this.dataPassService.organizationId+`&Accept-Language=`+this.appService.currentLang)
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
                    if(this.dataPassService.selectedSubsidiary!=null){
                        for(let i=0 ;i<this.subsidiaries.length;i++){
                            if(this.dataPassService.selectedSubsidiary.id==this.subsidiaries[i].id){
                                this.selectedId=this.subsidiaries[i].id;
                            }
                        }
                    }else{
                        this.selectedId=0;
                    }


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
    getBack(){
        this.appService.subHeaderName.emit('config');
        this.dataPassService.selectedSubsidiary=this.selectedSubsidiary;
        this.dataPassService.subsidiaryChanged.emit(this.selectedSubsidiary);
        this.router.navigateByUrl('home');
    }



}
