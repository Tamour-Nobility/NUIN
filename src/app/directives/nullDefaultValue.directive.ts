import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from '@angular/forms';

@Directive({
    selector: 'input[nullValue]'
})
export class NullDefaultValueDirective {
    constructor(private el: ElementRef, private control: NgControl) { }

    @HostListener('input', ['$event.target'])
    onEvent(target: HTMLInputElement) {
        this.setNull(target);
    }

    @HostListener('keyup', ['$event.target']) onkeyup(target: HTMLInputElement) {
        this.setNull(target);
    }

    setNull({ value }) {
        if (value === '')
            this.control.viewToModelUpdate(null)
    }
}