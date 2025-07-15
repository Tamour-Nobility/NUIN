import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEditsComponent } from './custom-edits.component';

describe('CustomEditsComponent', () => {
  let component: CustomEditsComponent;
  let fixture: ComponentFixture<CustomEditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomEditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
