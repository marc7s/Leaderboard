import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(time: string): unknown {
    const t = new Date(time);
    return `${this.pad(t.getMinutes())}:${this.pad(t.getSeconds())}.${this.padM(t.getMilliseconds())}`;
  }

  pad(num: number) {
    return num.toString().padStart(2, '0');
  }

  padM(num: number) {
    return num.toString().padEnd(3, '0');
  }

}
