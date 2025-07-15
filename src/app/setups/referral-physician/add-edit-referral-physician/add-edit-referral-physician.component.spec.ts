import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReferralPhysicianComponent } from './add-edit-referral-physician.component';

describe('AddEditReferralPhysicianComponent', () => {
  let component: AddEditReferralPhysicianComponent;
  let fixture: ComponentFixture<AddEditReferralPhysicianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditReferralPhysicianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditReferralPhysicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
