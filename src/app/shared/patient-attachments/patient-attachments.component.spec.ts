import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAttachmentsComponent } from './patient-attachments.component';

describe('PatientAttachmentsComponent', () => {
  let component: PatientAttachmentsComponent;
  let fixture: ComponentFixture<PatientAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
