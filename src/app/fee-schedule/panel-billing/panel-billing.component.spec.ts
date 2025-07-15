import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelBillingComponent } from './panel-billing.component';

describe('PanelBillingComponent', () => {
  let component: PanelBillingComponent;
  let fixture: ComponentFixture<PanelBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
