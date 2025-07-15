import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertAssignmentComponent } from './alert.component';

describe('AlertAssignmentComponent', () => {
  let component: AlertAssignmentComponent;
  let fixture: ComponentFixture<AlertAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
