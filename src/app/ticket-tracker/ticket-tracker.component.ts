import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Ticketsearch } from '../models/ticketsearch';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GvarsService } from '../services/G_vars/gvars.service';
import { APIService } from '../components/services/api.service';
import { Department, User } from '../user-management/classes/requestResponse';
import { Common } from '../services/common/common';
import * as moment from 'moment';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-tracker',
  templateUrl: './ticket-tracker.component.html',
  styleUrls: ['./ticket-tracker.component.css']
})

export class TicketTrackerComponent implements OnInit {
@ViewChild('userModal') userModal: ModalDirective;
SearchForm: FormGroup;
ticketsearch: Ticketsearch = new Ticketsearch();
listUser: User[];
listDepartment : Department[];
getPractices: any[] = [];
dataTabletickets: any;
tickets:any=[]
checkTicketType:boolean=false
selectedUser: string = '';
assignedTicket:any;
selectedTicketIds: any[] = [];
currentUser:any;
  constructor(private fb: FormBuilder ,
    private gv: GvarsService,
    public apiService: APIService,
    private chRef: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService,
  ) 
  {
    this.listUser = [];
    this.listDepartment = [];
   }

  ngOnInit() {
    debugger;
  this.currentUser=this.gv.currentUser.userId;
 this.getPractices=this.gv.currentUser.Practices
 this.getPractices = [
    { PracticeCode: null, PracticeLabel: 'Select' },
    ...this.gv.currentUser.Practices
  ];
  this.SearchForm = this.fb.group({
  ticketid: [null],
  ticketType: [null],
  ticketReason: [null],
  ticketPriority: [null],
  practice: [null],
  claimNumber: [null],
  status: [null],
  assignedDept: [null],
  caseCreatedBy: [null],
  assignedUser: [null],
  byPayer: [null],
  createdDateFrom: [null],
  createdDateTo: [null]
});
this.getUsersList();
this.getDepartmentList();
  }
  myDateRangePickerOptions: IMyDrpOptions = {
  dateFormat: 'mm/dd/yyyy',
  height: '26px',
  showClearDateRangeBtn: true
};
ngAfterViewInit() {
  setTimeout(() => {
    const table: any = $('.dataTabletickets');
    this.dataTabletickets = table.DataTable({
      columnDefs: [{ orderable: false, targets: -1 }],
      language: {
        emptyTable: "No data available"
      }
    });
  }, 0);
}
modifyTicket(ticketId: number) {
  debugger;
  this.router.navigate(['/create-ticket', ticketId]);
}
replyTicket(ticketId: number, ticketType: string) {
  debugger
  this.router.navigate(['/ticketresponse'], {
    queryParams: { ticketId: ticketId, ticketType: ticketType }
  });
}
getUsersList() 
  {
      this.apiService.getData('/UserManagementSetup/GetUsersList').subscribe(
      data => {
        if (data.Status === 'Success')
        {
           this.listUser = data.Response;
           let users = data.Response.map((user: any) => ({
        ...user,
        DisplayLabel: `${user.UserName} | ${user.FirstName} ${user.LastName}`
      }));
      this.listUser = [
          { UserId: null, DisplayLabel: 'Select' }, 
          ...users
        ];
      
        }
      });
  }
getDepartmentList() {
  this.apiService.getData('/TicketTracker/GetTTDepartmentsList').subscribe(
    data => {
      if (data.Status === 'Success' && Array.isArray(data.Response)) {
        let departments = data.Response.map((dept: any) => ({
          ...dept,
          DisplayLabel: `${dept.DepartmentName}`
        }));
        
        // Prepend a default "Select" item (optional)
        this.listDepartment = [
          { DepartmentId: null, DisplayLabel: 'Select' }, 
          ...departments
        ];
      } 
    },
    error => {
      this.listDepartment = [
      ];
    }
  );
}


onCreatedDateRangeChange(event: IMyDateRangeModel): void {
  const from = event.beginJsDate ? moment(event.beginJsDate).format('MM/DD/YYYY') : '';
  const to = event.endJsDate ? moment(event.endJsDate).format('MM/DD/YYYY') : '';

  this.SearchForm.patchValue({
    createdDateFrom: from,
    createdDateTo: to
  });
}
onSearchTickets() {
  // Reset current data
  debugger;
  this.tickets = [];

  const TicketSearch = {
    Ticket_Id: this.SearchForm.value.ticketid,
    Ticket_Type: this.SearchForm.value.ticketType,
    Ticket_Reason: this.SearchForm.value.ticketReason,
    Ticket_Priority: this.SearchForm.value.ticketPriority,
    Practice_Code: this.SearchForm.value.practice,
    Claim_No: this.SearchForm.value.claimNumber,
    Ticket_Status: this.SearchForm.value.status,
    Department_Id: this.SearchForm.value.assignedDept,
    Created_By: this.SearchForm.value.caseCreatedBy,
    Assigned_User: this.SearchForm.value.assignedUser,
    Payer_Name: this.SearchForm.value.byPayer,
    DateFrom: this.SearchForm.value.createdDateFrom,
    DateTo: this.SearchForm.value.createdDateTo
  };

  this.apiService.PostData('/TicketTracker/SearchTicket', TicketSearch, (res: any) => {
    // Step 1: Destroy previous DataTable if exists
    if (this.dataTabletickets) {
      this.dataTabletickets.clear().destroy();
      this.dataTabletickets = null;
    }

    // Step 2: Update local ticket list
    this.tickets = res.Response || [];

    // Step 3: Wait for DOM update
    this.chRef.detectChanges();

    setTimeout(() => {
      // Step 4: Re-initialize DataTable
      const table: any = $('.dataTabletickets');
      this.dataTabletickets = table.DataTable({
        columnDefs: [{ orderable: false, targets: -1 }],
        language: {
          emptyTable: "No data available"
        }
      });
    }, 0);
  });

  // Reset search form after request is made
  this.SearchForm.reset();
}

onSearchClear(){
  this.SearchForm.reset();
}
onSelectTicketType(event: any){
  debugger;
  const selectedValue = event.target.value;
  if(selectedValue=="Patient_Call"){
       this.checkTicketType=false;
  }
  else{
    this.checkTicketType=true;
  }
}

onTicketCheckboxChange(event: Event, ticketId: number) {
  debugger;
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    // Add ticketId if not already selected
    if (!this.selectedTicketIds.includes(ticketId)) {
      this.selectedTicketIds.push(ticketId);
    }
  } else {
    // Remove ticketId if unchecked
    this.selectedTicketIds = this.selectedTicketIds.filter(id => id !== ticketId);
  }
  this.assignedTicket;
  
  console.log('Selected ticket IDs:', this.selectedTicketIds);
  // You can call/send this.selectedTicketIds to any other function here
}

isSelected(ticketId: number): boolean {
  return this.selectedTicketIds.includes(ticketId);
}
ticketAssigned() {
  debugger;

  const payload = {
    userId: this.assignedTicket,
    CurrentUser:this.currentUser,
    ticketIds: this.selectedTicketIds
  };

  this.apiService.PostData(
    '/TicketTracker/TicketAssignment',
    payload,
    (res: any) => {
      if(res.status="Success"){
      this.toastr.success(res.Response);
      this.userModal.hide();
      this.selectedTicketIds = [];
     this.SearchForm.patchValue({
      assignedUser: this.assignedTicket
    });
      this.onSearchTickets();
       this.assignedTicket='';
       this.currentUser='';

      // Optionally, refresh ticket list here
      }
    },
    (err: any) => {
      console.error('Error assigning tickets', err);
    }
  );
}

}
