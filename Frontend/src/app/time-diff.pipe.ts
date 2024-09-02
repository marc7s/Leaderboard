import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDiff'
})
export class TimeDiffPipe implements PipeTransform {

  transform(millis: number, compareMillis?: number): string {
    if(!compareMillis || millis == compareMillis)
      return '';

    const millisDiff: number = compareMillis - millis;
    const wholeSecondsDiff: number = Math.floor(Math.abs(millisDiff / 1000));
    const sign: string = millisDiff > 0 ? '-' : '+';
    let unit: string = '';
    let diff: string = '';

    if(wholeSecondsDiff >= 60){
      unit = 'm';
      diff = Math.floor(wholeSecondsDiff / 60).toString();
    } else {
      unit = 's';
      diff = `${wholeSecondsDiff}.${String(Math.abs(millisDiff) - 1000 * wholeSecondsDiff).padStart(3, '0')}`;
    }
    
    
    return `${sign}${diff}${unit}`;
  }

}
