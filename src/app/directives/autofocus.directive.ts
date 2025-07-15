import { Directive, Input, ElementRef, OnInit } from "@angular/core";

@Directive({
    selector: '[autoFocus]'
})
export class AutoFocus implements OnInit {

    private focus = true;
    scrollTop: any;
    constructor(private el: ElementRef) {
        this.scrollTop = document.body.scrollTop;
    }

    ngOnInit() {
        if (this.focus) {
            window.setTimeout(() => {
                this.el.nativeElement.focus();
            });
        }
        if (!this.focus) {
            window.setTimeout(() => {
                this.el.nativeElement.blur();
            });
        }
    }

    protected ngOnChanges() {
        if (this.focus) {
            this.el.nativeElement.focus();
            document.body.scrollTop = this.scrollTop;
        }

    }

    @Input() set autoFocus(condition: boolean) {
        this.focus = condition !== false;
    }
}