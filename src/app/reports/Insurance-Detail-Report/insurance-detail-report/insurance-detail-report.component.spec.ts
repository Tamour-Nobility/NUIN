import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDetailReportComponent } from './insurance-detail-report.component';

describe('InsuranceDetailReportComponent', () => {
  let component: InsuranceDetailReportComponent;
  let fixture: ComponentFixture<InsuranceDetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceDetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
