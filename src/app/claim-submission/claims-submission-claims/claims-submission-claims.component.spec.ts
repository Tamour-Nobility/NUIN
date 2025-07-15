import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsSubmissionClaimsComponent } from './claims-submission-claims.component';

describe('ClaimsSubmissionClaimsComponent', () => {
  let component: ClaimsSubmissionClaimsComponent;
  let fixture: ComponentFixture<ClaimsSubmissionClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsSubmissionClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsSubmissionClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
