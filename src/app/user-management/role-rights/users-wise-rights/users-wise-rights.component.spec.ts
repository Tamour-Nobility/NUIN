import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWiseRightsComponent } from './users-wise-rights.component';

describe('UsersWiseRightsComponent', () => {
  let component: UsersWiseRightsComponent;
  let fixture: ComponentFixture<UsersWiseRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersWiseRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersWiseRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
