import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAgingReportComponent } from './patient-aging-report.component';

describe('PatientAgingReportComponent', () => {
  let component: PatientAgingReportComponent;
  let fixture: ComponentFixture<PatientAgingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAgingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
