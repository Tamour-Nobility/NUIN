import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsAssignmentComponent } from './claims-assignment.component';

describe('ClaimsAssignmentComponent', () => {
  let component: ClaimsAssignmentComponent;
  let fixture: ComponentFixture<ClaimsAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
