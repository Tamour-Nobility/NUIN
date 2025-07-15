import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../components/services/api.service';
import { Common } from '../services/common/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GvarService } from '../components/services/GVar/gvar.service';
import { GvarsService } from '../services/G_vars/gvars.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Department, User } from '../user-management/classes/requestResponse';

@Component({
  selector: 'app-ticket-response',
  templateUrl: './ticket-response.component.html',
  styleUrls: ['./ticket-response.component.css']
})
export class TicketResponseComponent implements OnInit {
  @ViewChild('userModal') userModal: ModalDirective;
   @ViewChild('cremarkModal') cremarkModal: ModalDirective;
trackerForm: FormGroup;
editTicketalldate:any;
ticket_Type:any;
userId:any;
ticketMessage:any;
isOlderThan24Hours :boolean=false
assignedDept : any;
assignedUser : any;
closingRemarks: string = '';
checkTicketStatus:any;
ticketMessageArraya: any[] = [];
listUser: User[];
listDepartment : Department[];
CallerComponent:string;
  constructor(private route: ActivatedRoute,private apiService: APIService,private fb: FormBuilder,private gv: GvarsService,
    private toastr: ToastrService
  ) {
    this.listUser = [];
    this.listDepartment = []
    this.CallerComponent='Response'
   }

ngOnInit() {
  debugger
  
  this.userId=this.gv.currentUser.userId;
  this.route.queryParams.subscribe(params => {
    const ticketId = params['ticketId'];
    this.ticket_Type = params['ticketType'];
    if (ticketId != null && ticketId !== '') {
      this.getTicketById(ticketId);
    }
  });
  this.getUsersList();
  this.getDepartmentList();
  this.trackerForm = this.fb.group({
    Ticket_Id: [0],
    Department_Id: [''],
    Ticket_Type: [''],
    Ticket_Reason: [''],
    Ticket_Priority: [''],
    Ticket_Title: [''],
    Ticket_Message: [''],
    Practice_Code: [],
    practiceAddress:[''],
    practicePhone:[''],
    practiceFax:[''],
    NPI:[],
    taxId:[],
    taxonomyCode:[],
    division:[],
    Patient_Account: [null],
    Claim_No: [],
    First_Name: [],
    Last_Name: [],
    MI: [],
    PatientCell_Phone: [],
    PatientHome_Phone: [],
    Date_Of_Birth: [],
    SSN: [],
    DOS: [],
    Total_Billed: [],
    Patient_Due: [],
    Claim_Due: [],
    Ins_Mode: ["Null"],
    Ins_Type:[],
    Payer_Name: [],
    Payer_Id: [],
    Policy_No: [],
    RProvider_Id: [],
    renderingProvider:[],
    renderingAddress:[],
    reneringOfficePhone:[],   
    renderingNPI:[],
    renderingGroupNPI:[],
    renderingSSN:[],
    renderingTaxonomyCode:[],
    BProvider_Id: [],
    billingProvider:[],
    billingAddress:[],
    billingOfficePhone:[],
    billingNPI:[],
    billingGroupNPI:[],
    billingSSN:[],
    billingTaxonomyCode:[],
    Assigned_User: [],
    Created_By: [],
    Created_Date: [],
    Modified_By: [],
    Modified_Date: [],
    Ticket_Trail_Id: [],
    Ticket_Status: [""],
    Closing_Remarks: [""],
    Deleted: [false]
  });
}
  getEncodedUrl(claimNo, patientAccount, firstname, lastName) {
    return Common.encodeBase64(JSON.stringify({
      Patient_Account: patientAccount,
      PatientFirstName: firstname,
      PatientLastName: lastName,
      claimNo: claimNo,
      disableForm: false
    }));
  }

getTicketById(value: any) {
  debugger
  const ticketid = value;

  this.apiService.getData(`/TicketTracker/GetTicketTrackById?ticketid=${ticketid}`).subscribe(data => {
    if (data.Status === 'Success') {
      debugger
      debugger
      this.editTicketalldate = data.Response;
        this.checkTicketStatus=this.editTicketalldate.Ticket_Status;
if (this.editTicketalldate.TicketMessages) {
  this.ticketMessageArraya = [...this.editTicketalldate.TicketMessages].sort((a, b) => {
    return new Date(b.Created_Date).getTime() - new Date(a.Created_Date).getTime(); // Descending
    
  });
}
this.calculateTime();
    }
  });
  
}
calculateTime(){
  debugger
 const latestMessage = this.ticketMessageArraya[0];
        const createdDate = new Date(latestMessage.Created_Date);
        const now = new Date();

        const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
        if(diffInHours > 24){
          this.isOlderThan24Hours=true
        }
}
setStatus(status: 'In_Process' | 'Information_Required' | 'Closed'): void {
  debugger;
    this.trackerForm.get('Ticket_Status')!.setValue(status);
    if(this.trackerForm.value.Ticket_Status == "Closed"){
        this.cremarkModal.show();
    }
  }
onSubmit() {
  debugger
  if (this.trackerForm.invalid) {
    return;
  }

if(this.ticketMessage == null || this.ticketMessage == "" || this.ticketMessage == undefined){
       this.toastr.error('Please Enter Message!', 'Validation');
       return;
    }
    if(this.trackerForm.value.Ticket_Status == null || this.trackerForm.value.Ticket_Status == "" || this.editTicketalldate.Tick_Status == "New" || this.trackerForm.value.Ticket_Status == "New"){
       this.toastr.error('Please Set Ticket Status!', 'Validation');
       return;
    }
      if(this.assignedUser == null || this.assignedUser == "" || this.assignedUser == undefined ){
       this.toastr.error('Please Set Assigned User!', 'Validation');
       return;
    }
        if(this.assignedDept == null || this.assignedDept == "" || this.assignedDept == undefined  ){
       this.toastr.error('Please Set Assigned Department!', 'Validation');
       return;
    }
    if(this.trackerForm.value.Ticket_Status == "Closed"){
          if(this.closingRemarks == null || this.closingRemarks == ""){
               this.toastr.error('Please Set Closing Remarks!', 'Validation');
       return;
          }
    }
   const SaveTrackDetails
 = {
  Ticket_Id: this.editTicketalldate.Ticket_Id,
  Department_Id: this.assignedDept,
  Ticket_Status: this.trackerForm.value.Ticket_Status,
  Assigned_User:this.assignedUser,
  Ticket_Message:this.ticketMessage,
  Created_By: this.userId, 
  Closing_Remarks : this.closingRemarks,

};

if(this.ticketMessage!=null && this.ticketMessage != ""){
  this.apiService.PostData('/TicketTracker/SaveTrackDetails', SaveTrackDetails, (res: any) => {
    debugger;
    if (res.Status === 'Success') 
      {
         this.toastr.success(res.Response);
          this.getTicketById(this.editTicketalldate.Ticket_Id);
          this.ticketMessage=''
          this.assignedDept=""
          this.assignedUser=""
          this.trackerForm.value.Ticket_Status=''
          this.closingRemarks=""
      }
   else {
      this.toastr.error('Response Not Added');
    }
  });
}

}
onEditTicketTrack(msg : any){
  debugger
  if(this.editTicketalldate.Created_By != this.userId){
     this.toastr.warning('Only Authorize User Can Edit OR Delete the Response');
     return;
  }
  if(this.trackerForm.value.Ticket_Status!=null || this.trackerForm.value.Ticket_Status!= ""){
       msg.Ticket_Status=this.trackerForm.value.Ticket_Status;
  }
    if(this.assignedDept ==null || this.assignedDept == "" || this.assignedDept == undefined ){
       this.assignedDept=this.editTicketalldate.Department_Id;
  }
      if(this.assignedUser ==null || this.assignedUser == "" || this.assignedUser == undefined){
       this.assignedUser=this.editTicketalldate.Assigned_User;
  }
   if(this.trackerForm.value.Ticket_Status == "Closed"){
          if(this.closingRemarks == null || this.closingRemarks == ""){
               this.toastr.error('Please Set Closing Remarks!', 'Validation');
       return;
          }
    }
   const EditTrackDetails
 = {
  Trail_id: msg.Trail_id,
  Ticket_Status: msg.Ticket_Status,
  Ticket_Message:msg.Ticket_Message,
  Ticket_id:this.editTicketalldate.Ticket_Id,
  Created_By: this.userId, 
  AssignedDep : this.assignedDept,
  AssignedUser :this.assignedUser,

};
this.apiService.PostData('/TicketTracker/EditTrackDetails', EditTrackDetails, (res: any) => {
    debugger;
    debugger;
    if (res.Status === 'Success') 
      {
         this.toastr.success(res.Response);
         this.getTicketById(this.editTicketalldate.Ticket_Id);
          this.ticketMessage=''
          this.assignedDept=''
          this.assignedUser=''
          this.trackerForm.value.Ticket_Status=''
      }
   else {
      this.toastr.error('Response Not Added');
    }
  });
}
onDeleteTicketTrack(msg: any) {
  if (this.editTicketalldate.Created_By != this.userId) {
    this.toastr.warning('Only Authorized User Can Edit OR Delete the Response');
    return;
  }

  swal({
            title: 'Confirmation',
            text: " Are you sure you want to delete?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
  if (result) {
      const DeleteTrackDetails = {
        Trail_id: msg.Trail_id,
      };

      this.apiService.PostData('/TicketTracker/DeleteTrackDetails', DeleteTrackDetails, (res: any) => {
        if (res.Status === 'Success') {
          this.toastr.success(res.Response);
          this.getTicketById(this.editTicketalldate.Ticket_Id);
          this.ticketMessage = '';
        } else {
          this.toastr.error('Response Not Deleted');
        }
      });
    }
  });
}

onCancel(){
  debugger;
  this.ticketMessage=""
 this.trackerForm.value.Ticket_Status=""
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
modelClose(){
 this.userModal.hide();
 this.assignedDept=""
 this.assignedUser=""
}
closingRemrkModeClose(){
  this.cremarkModal.hide();
  this.closingRemarks=''
}

 
}
