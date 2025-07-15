import { Directive, ElementRef } from '@angular/core';
declare var $: any;
@Directive({
    selector: '[icheck]'
})
export class ICheckDirective {
    constructor(private el: ElementRef) {
        $(el.nativeElement).iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green',
        });
    }
}