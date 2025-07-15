import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReasonsComponent } from './appointment-reasons.component';

describe('AppointmentReasonsComponent', () => {
  let component: AppointmentReasonsComponent;
  let fixture: ComponentFixture<AppointmentReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
