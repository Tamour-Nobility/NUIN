import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitClaimActivityReportComponent } from './visit-claim-activity-report.component';

describe('VisitClaimActivityReportComponent', () => {
  let component: VisitClaimActivityReportComponent;
  let fixture: ComponentFixture<VisitClaimActivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitClaimActivityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitClaimActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
