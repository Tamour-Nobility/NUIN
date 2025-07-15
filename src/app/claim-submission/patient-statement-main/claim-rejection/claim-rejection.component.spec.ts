import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRejectionComponent } from './claim-rejection.component';

describe('ClaimRejectionComponent', () => {
  let component: ClaimRejectionComponent;
  let fixture: ComponentFixture<ClaimRejectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimRejectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRejectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
