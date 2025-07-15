import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBalanceReportComponent } from './credit-balance-report.component';

describe('CreditBalanceReportComponent', () => {
  let component: CreditBalanceReportComponent;
  let fixture: ComponentFixture<CreditBalanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditBalanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
