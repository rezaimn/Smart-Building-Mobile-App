import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpService } from '../utils/index';

@Injectable()
export class SubsidiaryListService {

  constructor(private httpService: HttpService) { }

  getSubsidiaryList(url: any): Observable<any> {
    return this
      .httpService
      .getPe(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

}
