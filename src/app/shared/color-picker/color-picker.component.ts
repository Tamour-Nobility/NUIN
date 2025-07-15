import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {
  @Input() color: string;
  @Output() select: EventEmitter<any> = new EventEmitter();
  presetColors = ['#fff', '#000', '#2889e9', '#e920e9', '#fff500', 'rgb(236,64,64)'];
  constructor() { }

  ngOnInit() {
  }

  onColorSelect(event: any) {
    this.select.emit(event);
  }

}
