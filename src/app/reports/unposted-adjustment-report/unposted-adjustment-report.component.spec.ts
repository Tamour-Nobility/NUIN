import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpostedAdjustmentReportComponent } from './unposted-adjustment-report.component';

describe('UnpostedAdjustmentReportComponent', () => {
  let component: UnpostedAdjustmentReportComponent;
  let fixture: ComponentFixture<UnpostedAdjustmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpostedAdjustmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpostedAdjustmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
