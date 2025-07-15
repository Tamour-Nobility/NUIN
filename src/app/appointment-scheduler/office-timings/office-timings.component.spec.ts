import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeTimingsComponent } from './office-timings.component';

describe('OfficeTimingsComponent', () => {
  let component: OfficeTimingsComponent;
  let fixture: ComponentFixture<OfficeTimingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeTimingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
