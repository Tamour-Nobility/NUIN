import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubModuleDetailComponent } from './sub-module-detail.component';

describe('SubModuleDetailComponent', () => {
  let component: SubModuleDetailComponent;
  let fixture: ComponentFixture<SubModuleDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubModuleDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubModuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
