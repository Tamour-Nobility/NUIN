import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStatementReportComponent } from './patient-statement-report.component';

describe('PatientStatementReportComponent', () => {
  let component: PatientStatementReportComponent;
  let fixture: ComponentFixture<PatientStatementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientStatementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStatementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
