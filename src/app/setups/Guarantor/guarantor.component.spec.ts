import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorComponent } from './guarantor.component';

describe('GuarantorComponent', () => {
  let component: GuarantorComponent;
  let fixture: ComponentFixture<GuarantorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
