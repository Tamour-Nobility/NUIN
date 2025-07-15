import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErahistoryComponent } from './erahistory.component';

describe('ErahistoryComponent', () => {
  let component: ErahistoryComponent;
  let fixture: ComponentFixture<ErahistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErahistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErahistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
