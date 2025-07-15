import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EshaPatientAgingReportComponent } from './esha-patient-aging-report.component';

describe('EshaPatientAgingReportComponent', () => {
  let component: EshaPatientAgingReportComponent;
  let fixture: ComponentFixture<EshaPatientAgingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EshaPatientAgingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EshaPatientAgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
