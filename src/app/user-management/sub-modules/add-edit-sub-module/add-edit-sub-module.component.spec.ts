import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubModuleComponent } from './add-edit-sub-module.component';

describe('AddEditSubModuleComponent', () => {
  let component: AddEditSubModuleComponent;
  let fixture: ComponentFixture<AddEditSubModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSubModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSubModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
