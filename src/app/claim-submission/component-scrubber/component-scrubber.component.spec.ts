import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentScrubberComponent } from './component-scrubber.component';

describe('ComponentScrubberComponent', () => {
  let component: ComponentScrubberComponent;
  let fixture: ComponentFixture<ComponentScrubberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentScrubberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScrubberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
