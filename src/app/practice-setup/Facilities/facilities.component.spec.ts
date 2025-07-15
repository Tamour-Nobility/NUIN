import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracFacilitiesComponent } from './facilities.component';

describe('FacilitiesComponent', () => {
  let component: PracFacilitiesComponent;
  let fixture: ComponentFixture<PracFacilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracFacilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
