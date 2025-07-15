import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubModuleComponent } from './list-sub-module.component';

describe('ListSubModuleComponent', () => {
  let component: ListSubModuleComponent;
  let fixture: ComponentFixture<ListSubModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
