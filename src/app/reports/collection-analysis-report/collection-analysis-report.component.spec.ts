import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionAnalysisReportComponent } from './collection-analysis-report.component';

describe('CollectionAnalysisReportComponent', () => {
  let component: CollectionAnalysisReportComponent;
  let fixture: ComponentFixture<CollectionAnalysisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionAnalysisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
