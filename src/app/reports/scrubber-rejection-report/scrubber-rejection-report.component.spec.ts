import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrubberRejectionReportComponent } from './scrubber-rejection-report.component';

describe('ScrubberRejectionReportComponent', () => {
  let component: ScrubberRejectionReportComponent;
  let fixture: ComponentFixture<ScrubberRejectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrubberRejectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrubberRejectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
