import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCptfeeScheduleTempComponent } from './provider-cptfee-schedule-temp.component';

describe('ProviderCptfeeScheduleTempComponent', () => {
  let component: ProviderCptfeeScheduleTempComponent;
  let fixture: ComponentFixture<ProviderCptfeeScheduleTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCptfeeScheduleTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCptfeeScheduleTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
