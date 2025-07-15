import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSubmissionReportComponent } from './claim-submission-report.component';

describe('ClaimSubmissionReportComponent', () => {
  let component: ClaimSubmissionReportComponent;
  let fixture: ComponentFixture<ClaimSubmissionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSubmissionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSubmissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
