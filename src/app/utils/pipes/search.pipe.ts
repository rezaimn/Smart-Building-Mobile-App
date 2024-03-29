import { Injectable,Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})

@Injectable()
export class SearchPipe implements PipeTransform {

  transform(items: any[], field: string, value: string): any[] {
    if (!items) return [];
    return items.filter(it => it[field] == value);
  }

}
