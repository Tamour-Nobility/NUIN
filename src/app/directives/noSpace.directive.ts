import { HostListener, Directive, ElementRef } from '@angular/core';
@Directive({
    selector: '[noSpace]'
})
export class NoSpace {
    inputElement: HTMLElement;
    constructor(public el: ElementRef) {
        this.inputElement = el.nativeElement;
    }
    @HostListener('keydown', ['$event'])
    onkeydown(e: KeyboardEvent) {
        if (e.keyCode == 32) {
            e.preventDefault();
        }
    }
    @HostListener('paste', ['$event'])
    onPaste(e: ClipboardEvent) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim().replace(/\s/g, '');
        document.execCommand('insertText', false, pastedData);
    }
    @HostListener('drop', ['$event'])
    ondrop(e: DragEvent) {
        e.preventDefault();
        const draggedData = e.dataTransfer.getData('text').replace(/\s/g, '');
        document.execCommand('insertText', false, draggedData);
    }
}