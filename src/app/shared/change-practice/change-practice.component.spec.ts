import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePracticeComponent } from './change-practice.component';

describe('ChangePracticeComponent', () => {
  let component: ChangePracticeComponent;
  let fixture: ComponentFixture<ChangePracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
