import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DespositSlipComponent } from './desposit-slip.component';

describe('DespositSlipComponent', () => {
  let component: DespositSlipComponent;
  let fixture: ComponentFixture<DespositSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DespositSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DespositSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
