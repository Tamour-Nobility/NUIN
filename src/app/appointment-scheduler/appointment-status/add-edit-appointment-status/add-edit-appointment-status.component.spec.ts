import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAppointmentStatusComponent } from './add-edit-appointment-status.component';

describe('AddEditAppointmentStatusComponent', () => {
  let component: AddEditAppointmentStatusComponent;
  let fixture: ComponentFixture<AddEditAppointmentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAppointmentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAppointmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
