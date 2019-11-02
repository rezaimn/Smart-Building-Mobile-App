import {Component} from '@angular/core';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../utils/services';
import {DataPassService} from '../../utils/services/data-pass-service';
import {ErrorMessageService} from '../../utils/services/error-message-service';
import {RouteStackService} from '../../utils/services/routeStack.service';

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'scenario',
    templateUrl: 'scenario.component.html'
})

export class ScenarioComponent {

    scenarioList = [];

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                private httpService: HttpService,
                public dataPassService: DataPassService,
                private errorService: ErrorMessageService,
                private stackService: RouteStackService
    ) {

        this.stackService.empetyStack();
        this.stackService.push(this.router.url, null);
        this.dataPassService.leadIcon="./assets/images/menu/scenario";
    }

    ngOnInit() {

        this.getScenario();
    }

    getScenario() {
        this.scenarioList = [];
        this
            .httpService.getPe('/SP/GetSmartScenarios?page=' + 1 + '&records=' + 10000)

            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.scenarioList = items.records;
                    for (let i = 0; i < this.scenarioList.length; i++) {
                        var temdp = this.scenarioList[i].destinationdevices;
                        var outdevices: string = '';
                        for (let j = 0; j < temdp.length; j++) {
                            if (temdp[j])
                                outdevices = outdevices + temdp[j].destinationdevicename + '(' + temdp[j].destinationdevicetypename + '); ';
                        }
                        this.scenarioList[i].outdevices = outdevices;
                    }
                    //console.log(this.scenes);


                }
            }, (error: any) => {
                this.translate.get('error-messages.device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.errorService.PEErrors(subHeaderT);
                    }
                );

            });
    }

    editScenario(scenario) {
        this.dataPassService.selectedScenario = scenario;
        this.router.navigateByUrl('scenario-add-edit');
    }

}
