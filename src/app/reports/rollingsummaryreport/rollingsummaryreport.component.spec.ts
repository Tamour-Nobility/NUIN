import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollingsummaryreportComponent } from './rollingsummaryreport.component';

describe('RollingsummaryreportComponent', () => {
  let component: RollingsummaryreportComponent;
  let fixture: ComponentFixture<RollingsummaryreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollingsummaryreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollingsummaryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
