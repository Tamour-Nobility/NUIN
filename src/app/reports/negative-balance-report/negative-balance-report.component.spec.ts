import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeBalanceReportComponent } from './negative-balance-report.component';

describe('NegativeBalanceReportComponent', () => {
  let component: NegativeBalanceReportComponent;
  let fixture: ComponentFixture<NegativeBalanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativeBalanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
