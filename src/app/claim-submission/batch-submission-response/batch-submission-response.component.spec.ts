import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSubmissionResponseComponent } from './batch-submission-response.component';

describe('BatchSubmissionResponseComponent', () => {
  let component: BatchSubmissionResponseComponent;
  let fixture: ComponentFixture<BatchSubmissionResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchSubmissionResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSubmissionResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
