import { Directive, Input, HostListener } from "@angular/core";

@Directive({
    selector: '[alphabetsWithSpace]'
})
export class AlphabetsWithSpace {
    @Input() alphabetsWithSpace: boolean;

    @HostListener('keydown', ['$event']) onkeydown(e: KeyboardEvent) {
        if (this.alphabetsWithSpace) {
            let keycode = e.which || e.keyCode;
            if ((keycode > 64 && keycode < 91) || (e.charCode > 96 && keycode < 123) || keycode == 8 || keycode == 9 || keycode == 32 ||
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
        if (this.alphabetsWithSpace) {
            let e = <DragEvent>event;
            let dt = e.dataTransfer;
            let getdata = dt.getData("text");
            var regex = RegExp("^[A-Za-z ]*$");
            if (!regex.test(getdata)) {
                e.preventDefault();
            }
        }
    }

    @HostListener('paste', ['$event']) onPaste(e: ClipboardEvent) {
        if (this.alphabetsWithSpace) {
            const pastedData = e.clipboardData.getData('text');
            var regex = RegExp("^[A-Za-z ]*$");
            if (!regex.test(pastedData)) {
                e.preventDefault();
            }
        }
    }
}