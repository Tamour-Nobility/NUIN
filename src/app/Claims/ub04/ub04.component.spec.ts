import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UB04Component } from './ub04.component';

describe('UB04Component', () => {
  let component: UB04Component;
  let fixture: ComponentFixture<UB04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UB04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UB04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
