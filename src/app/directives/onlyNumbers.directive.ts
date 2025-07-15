import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]'
})
export class onlyNumbers {
  @Input() onlyNumbers: boolean;
  @Input() enablePeriod: boolean;
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    if (this.enablePeriod)
      this.el.nativeElement.value = initalValue.replace(/[^0-9-.]*/g, '');
    else
      this.el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (this.onlyNumbers) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        //Allow: Cntl+V
        (e.keyCode == 86 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39) || e.keyCode == 13) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }

  @HostListener('drop', ['$event']) ondrop(event) {
    if (this.onlyNumbers) {
      let e = <DragEvent>event;
      let dt = e.dataTransfer;
      let getdata = dt.getData("text");
      let regex;
      if (this.enablePeriod)
        regex = RegExp("^[0-9-.]*$");
      else
        regex = RegExp("^[0-9]*$");
      if (!regex.test(getdata)) {
        e.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    if (this.onlyNumbers) {
      const pastedData = e.clipboardData.getData('text');
      let regex;
      if (this.enablePeriod)
        regex = RegExp("^[0-9-.]*$");
      else
        regex = RegExp("^[0-9]*$");
      if (!regex.test(pastedData)) {
        e.preventDefault();
      }
    }
  }
}
