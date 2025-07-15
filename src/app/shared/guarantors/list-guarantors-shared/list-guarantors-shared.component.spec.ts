import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGuarantorsSharedComponent } from './list-guarantors-shared.component';

describe('ListGuarantorsSharedComponent', () => {
  let component: ListGuarantorsSharedComponent;
  let fixture: ComponentFixture<ListGuarantorsSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGuarantorsSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGuarantorsSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
