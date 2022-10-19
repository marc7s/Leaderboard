import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagelink'
})
export class PagelinkPipe implements PipeTransform {

  transform(shortName: string): string {
    return shortName
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[åä]/g, 'a')
      .replace(/[ö]/g, 'o');
  }

}
