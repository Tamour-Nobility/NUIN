import { PipeTransform, Pipe } from '@angular/core';
import { Common } from '../services/common/common';

@Pipe({
    name: 'shortString'
})
export class ShortStringPipe implements PipeTransform {
    transform(value: any, ...args: any[]): string {
        let defaultSize = 49;
        let size = args[0] ? args[0] : defaultSize;
        if (!Common.isNullOrEmpty(value)) {
            if (value.length > size) {
                return `${value.substr(0, size)}...`;
            }
        }
        return value;
    }
}