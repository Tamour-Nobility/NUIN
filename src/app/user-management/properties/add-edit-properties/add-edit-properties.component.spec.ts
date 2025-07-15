import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPropertiesComponent } from './add-edit-properties.component';

describe('AddEditPropertiesComponent', () => {
  let component: AddEditPropertiesComponent;
  let fixture: ComponentFixture<AddEditPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
