import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPanelCodeComponent } from './add-edit-panel-code.component';

describe('AddEditPanelCodeComponent', () => {
  let component: AddEditPanelCodeComponent;
  let fixture: ComponentFixture<AddEditPanelCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPanelCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPanelCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
