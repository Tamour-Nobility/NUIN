import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorsAddEditComponent } from './guarantors-add-edit.component';

describe('GuarantorsAddEditComponent', () => {
  let component: GuarantorsAddEditComponent;
  let fixture: ComponentFixture<GuarantorsAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorsAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
