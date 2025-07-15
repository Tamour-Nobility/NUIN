import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracTabInsuranceSearchComponent  } from './prac-tab-insurance-search.component';

describe('InsuranceSearchComponent', () => {
  let component: PracTabInsuranceSearchComponent ;
  let fixture: ComponentFixture<PracTabInsuranceSearchComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracTabInsuranceSearchComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracTabInsuranceSearchComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
