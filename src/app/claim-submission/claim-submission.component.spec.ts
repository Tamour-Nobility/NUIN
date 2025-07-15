import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSubmissionComponent } from './claim-submission.component';

describe('ClaimSubmissionComponent', () => {
  let component: ClaimSubmissionComponent;
  let fixture: ComponentFixture<ClaimSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
