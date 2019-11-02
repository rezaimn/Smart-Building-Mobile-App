import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../app.service';
import {App} from '../../app';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DataPassService} from '../../utils/services/data-pass-service';
import {RouteStackService} from '../../utils/services/routeStack.service';
//import {Cam} from 'onvif/onvifcam';

//
// declare var require: any
// var http = require('http');
//     var IPCam =new Cam({
//         hostname:'192.168.10.208',
//         username: 'admin',
//         password: 'Aa12345*'
//     }, function(err) {
//         this.absoluteMove({x: 1, y: 1, zoom: 1});
//         this.getStreamUri({protocol:'RTSP'}, function(err, stream) {
//             http.createServer(function (req, res) {
//                 res.writeHead(200, {'Content-Type': 'text/html'});
//                 res.end('<html><body>' +
//                     '<img src="' + stream.uri + '">' +
//                     '</body></html>');
//             }).listen(3030);
//         });
//     });

import {IonicPage} from "ionic-angular";
@IonicPage()
@Component({
    selector: 'camera',
    templateUrl: 'camera.component.html'
})
export class CameraComponent {

    constructor(private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                public router: Router,
                public appService: AppService,
                private appComponent: App,
                public translate: TranslateService,
                public dataPassService: DataPassService,
                private stackService:RouteStackService
    ) {
        this.stackService.push(this.router.url,null);
        this.dataPassService.leadIcon="./assets/images/control/camera";
    }

    ngOnInit() {
    }

    openSetCam(cam) {
        // this.translate.get('control-center.sirens.title', this.appService.currentLang).subscribe(
        //     (SS) => {
        //         this.appService.subHeaderName.emit(SS);
        this.dataPassService.selectedCamera = cam;
        this.router.navigateByUrl('control/set-camera');
        //             // this.appService.currentUrl.emit('appliance-grid');
        //         }
        //
        //     );
        // }

    }
}
