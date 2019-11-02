import { Http} from '@angular/http';

import {EventEmitter, Injectable} from '@angular/core';

// import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService {
    currentLang='fa';
    public subHeaderName = new EventEmitter<string>();
    public menuItemSelect=new EventEmitter<boolean>();
    public circle = 140;
    public circleFont = 20;
    public darkTheme=false;
    public darkTheme2=new EventEmitter<any>();

    public currentLangEmit=new EventEmitter<any>();

    //   @SessionStorage('subsidiary')
    //   public subsidiary;
    public currentUrl = new EventEmitter<string>();

    constructor(private http: Http ) {

    }


}

