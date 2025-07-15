import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'countDown'
})
export class CountDownPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        let maxLength = args[0];
        try {
            let length: number = value.length;
            return (maxLength - length);
        } catch (error) {
            return maxLength;
        }
    }

}