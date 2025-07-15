import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuarantorsListComponent } from './guarantors-list.component';

describe('GuarantorsListComponent', () => {
  let component: GuarantorsListComponent;
  let fixture: ComponentFixture<GuarantorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuarantorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuarantorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
