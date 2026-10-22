import { Pipe, PipeTransform } from '@angular/core';
import { Icon, IconSize, IconType } from './components/icon/icon';

@Pipe({
    name: 'icon',
    standalone: false
})
export class IconPipe implements PipeTransform {

  transform(url: string, alt?: string): Icon {
    return { 
      type: IconType.Image,
      size: IconSize.Icon,
      absPath: url,
      alt: alt ?? 'Icon'
     };
  }

}