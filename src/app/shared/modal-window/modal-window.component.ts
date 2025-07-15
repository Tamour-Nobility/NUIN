import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindow implements OnInit {
  @Input() title: string = 'Modal';
  @Input() size: string = 'modal-lg';
  @Input() titleClass: string = '';
  @Input() description = '';
  @Input() hasFooter: false;
  @Output() onShown: EventEmitter<any> = new EventEmitter();
  @Output() onHidden: EventEmitter<any> = new EventEmitter();
  @ViewChild(ModalDirective) modalWindow: ModalDirective;
  constructor() {
  }

  ngOnInit() {

  }

  onModalHidden(event: any) {
    this.onHidden.emit();
  }

  onModalShown(event: any) {
    this.onShown.emit();
  }

  show() {
    this.modalWindow.show();
  }

  hide() {
    this.modalWindow.hide();
  }
}
