import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {AppService} from '../app.service';
import {App} from '../app';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../utils/services';
import {DataPassService} from '../utils/services/data-pass-service';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {CalculateHomeDataService} from '../utils/services/calculateHomeData.service';
import {RouteStackService} from '../utils/services/routeStack.service';
import {ScreenPermissionService} from '../utils/services/screen-permission.service';
import {StructureTreeService} from '../utils/services/structureTree.service';
@Component({
    selector: 'home-view',
    templateUrl: 'home-view.component.html'
})
export class HomeViewComponent {
    public tempratureBarChartLabels: string[] = [];
    public tempratureChartBarData: any[] = [{data: [], label: 'میانگین دمای واقعی'}, {data: [], label: 'میانگین دمای مرجع'}];
    public barChartLegend: boolean = true;
    public barChartType: string = 'line';

    public lineChartOptions:any = {
        responsive: true
    };

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private  httpService:HttpService,
                public router: Router,
                public appService:AppService,
                private appComponent:App,
                public translate:TranslateService,
                public dataPassService:DataPassService,
                private calculateHomeData:CalculateHomeDataService,
                private stackService:RouteStackService,
                public screenPermissionService:ScreenPermissionService,
                private structureTree:StructureTreeService
    ){
        this.stackService.empetyStack();
        this.stackService.push(this.router.url,null);

    }
    public barChartOptions: any = {
        legend: {position: 'top', color: 'rgba(255,255,255,1)'},
        scaleShowVerticalLines: true,
        responsive: true,

        scales: {
            xAxes: [{
                barPercentage: 0.8,
                gridLines: {
                    color: 'rgba(255,255,255,255)',
                    lineWidth: 2
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 40,
                    min: 10,
                    stepSize: 10,
                    color: 'rgba(255,255,255,255)'

                },
                gridLines: {
                    color: 'rgba(255,255,255,255)',
                    lineWidth: 1
                }
            }]
        },
        animation: {
            onComplete: function () {
                var chartInstance = this.chart,
                    ctx = chartInstance.ctx;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function (bar, index) {
                        var data = dataset.data[index];
                        ctx.fillText(data, bar._model.x, bar._model.y - 5);
                    });
                });
            }
        }
    };


    @ViewChild('pageWrapper') public pageWrapper: ElementRef;
    @ViewChild('mainPanel') public mainPanel: ElementRef;

    public config: SwiperConfigInterface = {
        observer: true,
        direction: 'horizontal',
        threshold: 50,
        spaceBetween: 10,
        slidesPerView: 1.2,
        centeredSlides: true
    };
    ngOnInit() {

        //this.getTemperatue();
        this.theme(false);
        this.appService.darkTheme2.subscribe(
            (res:any)=>{
                this.theme(res);
            }
        )
        this.setMenuAsActive();
        this.appService.currentUrl.subscribe(
            (res: any) => {
                // this.setMenuItemAsActiveForHome(res);
                this.translate.get('bar.'+res, this.appService.currentLang).subscribe(
                    (homeRes) => {
                        this.appService.subHeaderName.emit(homeRes);

                    }

                );
            }
        )

    }

    theme(theme:any){
        if(theme){
            this.barChartOptions= {
                legend: {position: 'bottom', color: 'rgba(255,255,255,1)' ,fontColor: "white",},
                scaleShowVerticalLines: true,
                responsive: true,
                scales: {
                    xAxes: [{
                        barPercentage: 0.8,
                        gridLines: {
                            fontColor: "white",
                            color: 'rgba(255,255,255,255)',
                            lineWidth: 2
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontColor: "white",
                            beginAtZero: true,
                            max: 50,
                            min: 0,
                            stepSize: 5,
                            color: 'rgba(255,255,255,255)'

                        },
                        gridLines: {
                            fontColor: "white",
                            color: 'rgba(255,255,255,255)',
                            lineWidth: 1
                        }
                    }]
                },
                animation: {
                    onComplete: function () {
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            });
                        });
                    }
                }
            };
        }
    }
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }




    openApplianceGrid() {
        this.translate.get('home.appliance-grid', this.appService.currentLang).subscribe(
            (AG) => {
                this.appService.subHeaderName.emit(AG);
                this.router.navigateByUrl('home/appliance-grid');
               // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }
    openSafetyStatus() {
        this.translate.get('home.safety-status.title', this.appService.currentLang).subscribe(
            (SS) => {
                this.appService.subHeaderName.emit(SS);
                this.router.navigateByUrl('home/safety-status');
                // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }
    openParkingStatus() {
        this.translate.get('home.parking-status.title', this.appService.currentLang).subscribe(
            (PS) => {
                this.appService.subHeaderName.emit(PS);
                this.router.navigateByUrl('home/parking-status');
                // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }
    openLightingGrid() {
        this.translate.get('home.lighting-grid.title', this.appService.currentLang).subscribe(
            (PS) => {
                this.appService.subHeaderName.emit(PS);
                this.router.navigateByUrl('home/lighting-grid');
                // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }

    openHvacGrid() {
        this.translate.get('home.hvac-grid.title', this.appService.currentLang).subscribe(
            (PS) => {
                this.appService.subHeaderName.emit(PS);
                this.router.navigateByUrl('home/hvac-grid');
                // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }
    openVisitorStats() {
        this.translate.get('home.visitor-stats.title', this.appService.currentLang).subscribe(
            (PS) => {
                this.appService.subHeaderName.emit(PS);
                this.router.navigateByUrl('home/visitor-stats');
                // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }
    openDeviceStats() {
        this.translate.get('home.device-stats.title', this.appService.currentLang).subscribe(
            (PS) => {
                this.appService.subHeaderName.emit(PS);
                this.router.navigateByUrl('home/device-stats');
                // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }
    openOrganizationStats() {
        this.translate.get('home.organization-stats.title', this.appService.currentLang).subscribe(
            (PS) => {
                this.appService.subHeaderName.emit(PS);
                this.router.navigateByUrl('home/organization-stats');
                // this.appService.currentUrl.emit('appliance-grid');
            }

        );
    }

    about(){
        this.router.navigateByUrl('about');
    }
    reloadSwipers(){
        this.structureTree.loadAllSwipers();
    }
    setMenuAsActive() {
        var header = document.getElementById('menu-ul');
        var btns = header.getElementsByClassName('side-menu-items');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function () {
                var current = document.getElementsByClassName('active-menu-item');
                current[0].className = current[0].className.replace(' active-menu-item', '');
                this.className += ' active-menu-item';
            });
        }
    }
    userHasAccessToModule(moduleName){
        for(let module of this.dataPassService.userPermissions){
            if(module.module.code==moduleName){
                for(let screen of module.module.screens){
                    if(screen.permission.access!=2){
                        return true;
                    }
                }

            }
        }

        return false;
    }


}

