import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCptPlanNotesComponent } from './provider-cpt-plan-notes.component';

describe('ProviderCptPlanNotesComponent', () => {
  let component: ProviderCptPlanNotesComponent;
  let fixture: ComponentFixture<ProviderCptPlanNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCptPlanNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderCptPlanNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
