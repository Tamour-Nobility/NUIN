import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGuarantorSharedComponent } from './add-edit-guarantor-shared.component';

describe('AddEditGuarantorSharedComponent', () => {
  let component: AddEditGuarantorSharedComponent;
  let fixture: ComponentFixture<AddEditGuarantorSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditGuarantorSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditGuarantorSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
