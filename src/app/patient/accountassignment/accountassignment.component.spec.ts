import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountassignmentComponent } from './accountassignment.component';

describe('AccountassignmentComponent', () => {
  let component: AccountassignmentComponent;
  let fixture: ComponentFixture<AccountassignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
