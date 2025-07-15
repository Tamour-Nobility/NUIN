import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOfficeTimingComponent } from './add-edit-office-timing.component';

describe('AddEditOfficeTimingComponent', () => {
  let component: AddEditOfficeTimingComponent;
  let fixture: ComponentFixture<AddEditOfficeTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditOfficeTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOfficeTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
