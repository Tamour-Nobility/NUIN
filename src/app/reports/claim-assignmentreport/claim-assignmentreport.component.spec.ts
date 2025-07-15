import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAssignmentreportComponent } from './claim-assignmentreport.component';

describe('ClaimAssignmentreportComponent', () => {
  let component: ClaimAssignmentreportComponent;
  let fixture: ComponentFixture<ClaimAssignmentreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimAssignmentreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAssignmentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
