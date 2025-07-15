import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPracticeComponent } from './add-edit-practice.component';

describe('AddEditPracticeComponent', () => {
  let component: AddEditPracticeComponent;
  let fixture: ComponentFixture<AddEditPracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
