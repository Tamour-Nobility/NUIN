import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPhysicianComponent } from './referral-physician.component';

describe('ReferralPhysicianComponent', () => {
  let component: ReferralPhysicianComponent;
  let fixture: ComponentFixture<ReferralPhysicianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralPhysicianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
