import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProceduresComponent } from './list-procedures.component';

describe('ListProceduresComponent', () => {
  let component: ListProceduresComponent;
  let fixture: ComponentFixture<ListProceduresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProceduresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
