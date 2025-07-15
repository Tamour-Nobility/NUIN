import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligblityComponent } from './eligblity.component';

describe('EligblityComponent', () => {
  let component: EligblityComponent;
  let fixture: ComponentFixture<EligblityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligblityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligblityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
