import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimInsurancesComponent } from './claim-insurances.component';

describe('ClaimInsurancesComponent', () => {
  let component: ClaimInsurancesComponent;
  let fixture: ComponentFixture<ClaimInsurancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimInsurancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimInsurancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
