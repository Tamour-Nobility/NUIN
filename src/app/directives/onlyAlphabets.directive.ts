import { Directive, Input, HostListener } from "@angular/core";

@Directive({
    selector: '[onlyAlphabets]'
})
export class onlyAlphabets {
    @Input() onlyAlphabets: boolean;

    @HostListener('keydown', ['$event']) onkeydown(e: KeyboardEvent) {
        if (this.onlyAlphabets) {
            let keycode = e.which || e.keyCode;
            if ((keycode > 64 && keycode < 91) || (e.charCode > 96 && keycode < 123) || keycode == 8 || keycode == 9 || e.keyCode == 13 ||
                // Allow: Ctrl+A
                (keycode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (keycode == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (keycode == 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (keycode >= 35 && keycode <= 39) || keycode == 13) {
                // let it happen, don't do anything
                return;
            } else {
                e.preventDefault();
            }
        }
    }

    @HostListener('drop', ['$event']) ondrop(e: DragEvent) {
        if (this.onlyAlphabets) {
            let e = <DragEvent>event;
            let dt = e.dataTransfer;
            let getdata = dt.getData("text");
            var regex = RegExp("^[A-Za-z]*$");
            if (!regex.test(getdata)) {
                e.preventDefault();
            }
        }
    }

    @HostListener('paste', ['$event']) onPaste(e: ClipboardEvent) {
        if (this.onlyAlphabets) {
            const pastedData = e.clipboardData.getData('text');
            var regex = RegExp("^[A-Za-z]*$");
            if (!regex.test(pastedData)) {
                e.preventDefault();
            }
        }
    }
}