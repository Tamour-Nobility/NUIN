import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'mwl-demo-utils-calendar-header',
  templateUrl: './calendar-header.component.html'
})
export class CalendarHeaderComponent implements OnInit {
  @Input() view: string;

  @Input() viewDate: Date;

  @Input() locale: string = 'en';

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

  minYear: number = new Date().getFullYear() - 10;
  maxYear: number = new Date().getFullYear() + 50;
  years: number[] = [];

  constructor(private titleCasePipe: TitleCasePipe) {
    for (var i = this.minYear; i <= this.maxYear; i++) {
      this.years.push(i);
    }
  }

  ngOnInit() {
    $('.date-own').datepicker({
      minViewMode: 2,
      format: 'yyyy'
    });
  }

  getViewText(view: string) {
    if (view.toLowerCase() === 'day')
      return 'Today';
    else
      return 'Current ' + this.titleCasePipe.transform(view);
  }

  onDateChanged(year: number) {
    var date = new Date();
    date.setFullYear(year, this.viewDate.getMonth(), this.viewDate.getDate());
    this.viewDateChange.next(date);
  }
}
