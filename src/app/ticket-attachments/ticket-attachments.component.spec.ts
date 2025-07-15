import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAttachmentsComponent } from './ticket-attachments.component';

describe('TicketAttachmentsComponent', () => {
  let component: TicketAttachmentsComponent;
  let fixture: ComponentFixture<TicketAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
