import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ERAImportComponent } from './eraimport.component';

describe('ERAImportComponent', () => {
  let component: ERAImportComponent;
  let fixture: ComponentFixture<ERAImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ERAImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ERAImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
