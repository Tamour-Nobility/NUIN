import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimLevelComponent } from './claim-level.component';

describe('ClaimLevelComponent', () => {
  let component: ClaimLevelComponent;
  let fixture: ComponentFixture<ClaimLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
