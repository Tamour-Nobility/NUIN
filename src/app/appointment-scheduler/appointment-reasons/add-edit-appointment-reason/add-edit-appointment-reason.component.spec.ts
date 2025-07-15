import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAppointmentReasonComponent } from './add-edit-appointment-reason.component';

describe('AddEditAppointmentReasonComponent', () => {
  let component: AddEditAppointmentReasonComponent;
  let fixture: ComponentFixture<AddEditAppointmentReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAppointmentReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAppointmentReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
