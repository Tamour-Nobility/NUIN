import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTrackerComponent } from './ticket-tracker.component';

describe('TicketTrackerComponent', () => {
  let component: TicketTrackerComponent;
  let fixture: ComponentFixture<TicketTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
