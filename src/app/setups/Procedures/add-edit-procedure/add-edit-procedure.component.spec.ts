import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProcedureComponent } from './add-edit-procedure.component';

describe('AddEditProcedureComponent', () => {
  let component: AddEditProcedureComponent;
  let fixture: ComponentFixture<AddEditProcedureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProcedureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
