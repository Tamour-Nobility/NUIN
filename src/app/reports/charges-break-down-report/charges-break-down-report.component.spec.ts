import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargesBreakDownReportComponent } from './charges-break-down-report.component';

describe('ChargesBreakDownReportComponent', () => {
  let component: ChargesBreakDownReportComponent;
  let fixture: ComponentFixture<ChargesBreakDownReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargesBreakDownReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargesBreakDownReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
