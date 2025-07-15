import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EshaPlanAgingReportComponent } from './esha-plan-aging-report.component';

describe('EshaPlanAgingReportComponent', () => {
  let component: EshaPlanAgingReportComponent;
  let fixture: ComponentFixture<EshaPlanAgingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EshaPlanAgingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EshaPlanAgingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
