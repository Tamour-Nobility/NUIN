import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAssignmentreportComponent } from './account-assignmentreport.component';

describe('AccountAssignmentreportComponent', () => {
  let component: AccountAssignmentreportComponent;
  let fixture: ComponentFixture<AccountAssignmentreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAssignmentreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAssignmentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
