import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSubmissionErrorsComponent } from './claim-submission-errors.component';

describe('ClaimSubmissionErrorsComponent', () => {
  let component: ClaimSubmissionErrorsComponent;
  let fixture: ComponentFixture<ClaimSubmissionErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSubmissionErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSubmissionErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
