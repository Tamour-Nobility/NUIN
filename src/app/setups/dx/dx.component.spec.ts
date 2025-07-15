import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DXComponent } from './dx.component';

describe('DXComponent', () => {
  let component: DXComponent;
  let fixture: ComponentFixture<DXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
