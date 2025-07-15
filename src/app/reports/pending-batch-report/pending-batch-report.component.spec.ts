import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBatchReportComponent } from './pending-batch-report.component';

describe('PendingBatchReportComponent', () => {
  let component: PendingBatchReportComponent;
  let fixture: ComponentFixture<PendingBatchReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingBatchReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBatchReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
