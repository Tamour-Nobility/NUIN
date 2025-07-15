import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldclaimsComponent } from './holdclaims.component';

describe('HoldclaimsComponent', () => {
  let component: HoldclaimsComponent;
  let fixture: ComponentFixture<HoldclaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldclaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldclaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
