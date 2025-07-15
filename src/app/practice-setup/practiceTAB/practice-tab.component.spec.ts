import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeTABComponent } from './practice-tab.component';

describe('PracticeTABComponent', () => {
  let component: PracticeTABComponent;
  let fixture: ComponentFixture<PracticeTABComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeTABComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeTABComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
