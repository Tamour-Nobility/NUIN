import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLevelComponent } from './account-level.component';

describe('AccountLevelComponent', () => {
  let component: AccountLevelComponent;
  let fixture: ComponentFixture<AccountLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
