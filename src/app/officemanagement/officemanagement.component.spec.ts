import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficemanagementComponent } from './officemanagement.component';

describe('OfficemanagementComponent', () => {
  let component: OfficemanagementComponent;
  let fixture: ComponentFixture<OfficemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
