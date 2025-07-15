import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseRightsComponent } from './role-wise-rights.component';

describe('RoleWiseRightsComponent', () => {
  let component: RoleWiseRightsComponent;
  let fixture: ComponentFixture<RoleWiseRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleWiseRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleWiseRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
