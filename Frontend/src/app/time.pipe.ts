import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(millis: number): unknown {
    const t = new Date(millis);
    return `${this.pad(t.getMinutes())}:${this.pad(t.getSeconds())}.${this.padM(t.getMilliseconds())}`;
  }

  pad(num: number) {
    return num.toString().padStart(2, '0');
  }

  padM(num: number) {
    return num.toString().padStart(3, '0');
  }

}
