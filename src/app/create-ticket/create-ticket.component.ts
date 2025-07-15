import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { APIService } from '../components/services/api.service';
import { Department } from '../user-management/classes/requestResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GvarsService } from '../services/G_vars/gvars.service';
import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FileHandlerService } from '../components/services/file-handler/filehandler.service';
import { drawButton } from 'pdf-lib';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DenialReport } from '../reports/classes/denial-report-model';
import { HttpClient, } from '@angular/common/http';




@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {
@ViewChild('ticketAttachments') ticketAttachments!: ModalDirective;
@Input() CallerComponent;
@Input() TicketId;
createForm: FormGroup;
listDepartment : Department[];
getPractices: any[] = [];
getPatients: any[]= [];
getClaims: any[]=[];
getInsurances: any[]=[];
selectedFiles: File[] = [];
providers:any[]=[]
insuranceCall:boolean = true
patientCall : boolean = false
practiceCode:any;
patientAccount :any;
claimNumber : any;
selDateDOB: any;
selDateDOS: any;
renderingProviderCode: any;
billingProviderCode: any;
practiceSoft : any;
checkSoft:boolean =false;
checkTicketType : boolean = true;
userId:any;
ticketAging:number=1
ediTicketId:any;
editTicketalldate:any;
restButton:boolean=true;
practiceCodeforassigneduser:any;
assignedUserValue : number;
selectedDepartmentName:string;
  today = new Date();
      public myDatePickerOptionForDOBAndDeath: IMyDpOptions = {
          dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
          disableSince: {
              year: this.today.getFullYear(),
              month: this.today.getMonth() + 1,
              day: this.today.getDate() + 1,
          }
      };

  //..below 3 items for files uploading
  uploadProgress: number = 0;
  message: string = '';

    form: FormGroup;
  uploading = false;

  constructor(public apiService: APIService,private fb: FormBuilder,private gv: GvarsService,
   private toastr: ToastrService,public  _fileHandlerService: FileHandlerService,private router: Router,
  private route: ActivatedRoute,private http: HttpClient,) { 
    this.listDepartment = [];
 this.form = this.fb.group({});
  }

ngOnInit() {
  debugger
  
  const ticketId = this.route.snapshot.paramMap.get('id');
  this.ediTicketId=ticketId
  this.checkSoft=false;
  if(ticketId!=null && ticketId !="")
  {
    this.restButton=false
     this.getTicketById(ticketId);
  }
  this.userId=this.gv.currentUser.userId
  this.practiceCodeforassigneduser=this.gv.currentUser.selectedPractice.PracticeCode
  this.getPractices=this.gv.currentUser.Practices
  this.getPractices = [
    { PracticeCode: null, PracticeLabel: 'Select' },
    ...this.gv.currentUser.Practices
  ];
  const selectOption = { Patient_Account: null, PatientName: 'Select' };
  const selectedOption = { ClaimNo: null, ClaimLabel: 'Select' };
   this.getPatients = [selectOption];
   this.getClaims = [selectedOption]
   this.getDepartmentList();
   this.getAssignedUser();
this.createForm = this.fb.group({
  Ticket_Id: [0],
  Department_Id: ['', Validators.required],
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
  Ticket_Status: ["New"],
  Closing_Remarks: [],
  Deleted: [false]
});
if(this.TicketId)
{
  this .getTicketById(this.TicketId)
  this.createForm.disable();
}
  
console.log("Caller", this.CallerComponent)
}
getDepartmentList() {
  debugger
  this.apiService.getData('/TicketTracker/GetTTDepartmentsList').subscribe(
    data => {
      if (data.Status === 'Success' && Array.isArray(data.Response)) {
        debugger;
        let departments = data.Response.map((dept: any) => ({
          ...dept,
          DisplayLabel: `${dept.DepartmentName}`
        }));
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
onDepartmentChange(departmentId: any) {
  debugger;
 const dept = this.listDepartment.find(d => d.DepartmentId === departmentId);
  this.selectedDepartmentName = dept ? dept.DepartmentName : '';
} 

 getPracInfo(event: any) {
  debugger;
  if (event) {
  this.practiceCode = event.PracticeCode || event.value || event;
  const selectedOption = { ClaimNo: null, ClaimLabel: 'Select' };
  this.getClaims=[selectedOption];
   } 
  else {
  this.practiceCode = null; // or set a default value
  this.getPatients=[];
  const selectedOption = { ClaimNo: null, ClaimLabel: 'Select' };
  this.getClaims=[selectedOption];
  const selectOption = { Patient_Account: null, PatientName: 'Select' };
   this.getPatients = [selectOption];
     }
  this.patientAccount = null; 

  this.createForm.patchValue({
    practiceAddress: '',
    practicePhone: '',
    practiceFax: '',
    NPI: '',
    taxId: '',
    taxonomyCode: '',
    division: '',
    Patient_Account:'',
    Ins_Mode:'',
    Payer_Id:'',
    Payer_Name:'',
    Policy_No:'',
    renderingProvider:'',
    renderingAddress:'',
    reneringOfficePhone:'',
    renderingNPI:'',
    renderingGroupNPI:'',
    renderingSSN:'',
    renderingTaxonomyCode:'',
    billingProvider:'',
    billingAddress:'',
    billingOfficePhone:'',
    billingNPI:'',
    billingGroupNPI:'',
    billingSSN:'',
    billingTaxonomyCode:'',
  });
  if(this.practiceCode != null && this.practiceCode != undefined && this.practiceCode != ''){
  this.apiService.getTicketData(`/TicketTracker/GetPracticeInfo?practiceCode=${this.practiceCode}`).subscribe(
   data => {
      if (data.Status === 'Success' && Array.isArray(data.Response)) {
        debugger;
          const practiceInfo = data.Response[0];
          this.practiceSoft = practiceInfo.Prac_Soft;
          if(this.practiceSoft == "NPMSoft"){
            this.checkSoft=false;
          }
          else{
            this.checkSoft=true;
            this.getProviders(this.practiceCode);
            
          }

             this.createForm.patchValue({
            practiceAddress: practiceInfo.Prac_Address || '',
            practicePhone: practiceInfo.Prac_Phone || '',
            practiceFax: practiceInfo.Prac_Alternate_Phone || '',
            NPI: practiceInfo.NPI || '',
            taxId: practiceInfo.Prac_Tax_Id || '',
            taxonomyCode: practiceInfo.TAXONOMY_CODE || '',
            division: practiceInfo.DivisionName || ''
  });
  if(this.checkSoft==false){
    debugger
    debugger;

  this.getPatientAccounts();


  }
         
      } 
      
    },
    
  );
 
}
}
getProviders(value :any){
  debugger
  this.providers=[];
  //      this.createForm.patchValue({ 
  //           renderingProvider:'',
  //           renderingAddress:'',
  //           reneringOfficePhone:'',
  //           renderingNPI:'',
  //           renderingGroupNPI:'',
  //           renderingSSN:'',
  //           renderingTaxonomyCode:'',
  // });
     if(this.practiceCode != null && this.practiceCode != undefined && this.practiceCode != ""){
       this.apiService.getTicketData(`/TicketTracker/GetProviderList?practicecode=${this.practiceCode}`).subscribe(
   data => {
    debugger
    debugger;
      if (data.Status === 'Success' && data.Response) {
        debugger;
        this.providers = data.Response


this.providers = [
  { PracticeCode: null, ProviderLabel: 'Select' }, // default option
  ...this.providers.map(p => ({
    PracticeCode: p.Provider_Code,
    ProviderLabel: `${p.Provid_LName}, ${p.Provid_FName}`
  }))
];
  //         this.createForm.patchValue({ 
  //           renderingProvider:rendProvider.Provid_FName +" "+ rendProvider.Provid_LName,
  //           renderingAddress:rendProvider.ADDRESS,
  //           reneringOfficePhone:rendProvider.Phone_One,
  //           renderingNPI:rendProvider.NPI,
  //           renderingGroupNPI:rendProvider.group_npi,
  //           renderingSSN:rendProvider.SSN,
  //           renderingTaxonomyCode:rendProvider.Taxonomy_Code,
  // });
      } 
    },
  );
}
}
getPatientAccounts() {
  debugger;
  //const selectedPracticeCode = event.PracticeCode || event.value || event;
  this.createForm.patchValue({
  
  });
  if(this.practiceCode!=null && this.practiceCode != undefined && this.practiceCode != ""){
     this.apiService.getTicketData(`/TicketTracker/GetPatientAccounts?practiceCode=${this.practiceCode}`).subscribe(
   data => {
     const selectOption = { Patient_Account: null, PatientName: 'Select' };
       if (data.Status === 'Success' && Array.isArray(data.Response) && data.Response.length > 0) {
      const patients = data.Response.map((p: any) => ({
        Patient_Account: p.Patient_Account,
        PatientName: p.Patient_Account
      }));
   console.log("check patient list",this.getPatients)
      this.getPatients = [selectOption, ...patients];

      this.createForm.patchValue({
        Patient_Account:Number(this.editTicketalldate.Patient_Account)
      })
    } else {
      // 👇 Still show "Select" even if no data is found
      this.getPatients = [selectOption];
    }

  });
  }
 
}
onDateChangedDOB(event) {
        // this.patient.Date_Of_Birth = event.formatted;
}
dateMask(event: any) {
        var v = event.target.value;
        if (v.match(/^\d{2}$/) !== null) {
            event.target.value = v + '/';
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
            event.target.value = v + '/';
        }
}
onPatientAccountChange(event: any) {
      debugger
      debugger;
      if (event) {
     this.patientAccount = event.Patient_Account || event.value || event;
   } 
   else {
  this.patientAccount = null; // or set a default value
     }
      this.createForm.patchValue({
            First_Name:  '',
            MI: '',
            Last_Name:  '',
            PatientCell_Phone:  '',
            PatientHome_Phone:  '',
            Date_Of_Birth :  '',
            SSN : '',
            Payer_Id:'',
            Payer_Name:'',
            Policy_No:'',
            renderingProvider:'',
            renderingAddress:'',
            reneringOfficePhone:'',
            renderingNPI:'',
            renderingGroupNPI:'',
            renderingSSN:'',
            renderingTaxonomyCode:'',
            billingProvider:'',
            billingAddress:'',
            billingOfficePhone:'',
            billingNPI:'',
            billingGroupNPI:'',
            billingSSN:'',
            billingTaxonomyCode:'',
      });
      if(this.patientAccount!=null  && this.patientAccount!= undefined){
        this.apiService.getTicketData(`/TicketTracker/GetPatientInfo?patientacc=${this.patientAccount}`).subscribe(
   data => {
    debugger
    debugger;
      if (data.Status === 'Success' && data.Response) {
        debugger;
        debugger;
          const patientInfo = data.Response.Patient;
        const selectedOption = { Claim_No: null, ClaimLabel: 'Select' };

this.getClaims = [selectedOption, ...(data.Response.Claims || []).map(claim => ({
  ...claim,
  Claim_No: claim.Claim_No
}))];
if( this.ediTicketId!=0 &&  this.ediTicketId != null &&  this.ediTicketId != null){
this.createForm.patchValue({
        Claim_No:Number(this.editTicketalldate.Claim_No)
      })
}
    
const dateString = patientInfo.Date_Of_Birth; // e.g., "1927-09-13T00:00:00"

if (dateString) {
  const dob = new Date(dateString);
  const dobFormatted = {
    year: dob.getFullYear(),
    month: dob.getMonth() + 1,
    day: dob.getDate()
  };
  this.selDateDOB = dobFormatted;
  this.createForm.patchValue({
    Date_Of_Birth: dobFormatted
  });
} else {
  this.createForm.patchValue({ Date_Of_Birth: null });
}

  debugger
  debugger
this.createForm.patchValue({
            First_Name: patientInfo.First_Name || '',
            MI: patientInfo.MI || '',
            Last_Name: patientInfo.Last_Name || '',
            PatientCell_Phone: patientInfo.Cell_Phone || '',
            PatientHome_Phone: patientInfo.Home_Phone || '',
            Date_Of_Birth : patientInfo.Date_Of_Birth || '',
            SSN : patientInfo.SSN || '',
  });

          
      } 
    },
  );
      }

      this.getPatientDueAmt();
      

      
}
onClaimChange(event: any) {
      debugger
     if (event) {
     this.claimNumber = event.ClaimNo || event.value || event;
   } 
   else {
  this.claimNumber = null; // or set a default value
     }
     this.getInsurances=[];
     if(this.editTicketalldate != true){
     this.createForm.patchValue({
           DOS:'',
           Claim_Due:'',
           Total_Billed:'',
           Payer_Name:'',
           Payer_Id:'',
           Policy_No:'',
      });
     }

     if(this.claimNumber != null && this.claimNumber != undefined){
       this.apiService.getTicketData(`/TicketTracker/GetClaimInfo?claimno=${this.claimNumber}`).subscribe(
   data => {
  if (data.Status === 'Success' && data.Response) {
       const claimInfo=data.Response.Claim;
       this.getInsurances=data.Response.Insurances;
       this.renderingProviderCode=claimInfo.Attending_Physician;
       this.billingProviderCode=claimInfo.Billing_Physician;
    let matchingInsurance = null;

if (
  this.ediTicketId &&
  this.editTicketalldate &&
  this.editTicketalldate.Ins_Mode
) {
  matchingInsurance = this.getInsurances.find(
    x => x.Pri_Sec_Oth_Type === this.editTicketalldate.Ins_Mode
  );
} else {
  matchingInsurance = this.getInsurances.length > 0 ? this.getInsurances[0] : null;
}

this.createForm.patchValue({
  Ins_Type: matchingInsurance || null,
  Payer_Name: (this.editTicketalldate && this.editTicketalldate.Payer_Name) || (matchingInsurance && matchingInsurance.Inspayer_Description) || '',
  Payer_Id: (this.editTicketalldate && this.editTicketalldate.Payer_Id) || (matchingInsurance && matchingInsurance.Inspayer_Id) || '',
  Policy_No: (this.editTicketalldate && this.editTicketalldate.Policy_No) || (matchingInsurance && matchingInsurance.Policy_Number) || ''
});

  
       
    
const dateString = claimInfo.DOS; // e.g., "1927-09-13T00:00:00"
if (dateString) {
  const dob = new Date(dateString);
  const dobFormatted = {
    year: dob.getFullYear(),
    month: dob.getMonth() + 1,
    day: dob.getDate()
  };
  this.selDateDOS = dobFormatted;
  this.createForm.patchValue({
    DOS: dobFormatted
  });
} else {
  this.createForm.patchValue({ DOS: null });
}
          this.createForm.patchValue({
            DOS : claimInfo.DOS || '',
            Claim_Due: claimInfo.Amt_Due != null ? claimInfo.Amt_Due : '',
            Total_Billed : claimInfo.Claim_Total  != null ? claimInfo.Amt_Due : '',
  });
  if(this.checkSoft == false){
 this.onClaimChangeGetRenderingProvider();
  }
 
      } 
    },
  );
     }
    
}
onInsuranceChange(): void {
    debugger
    debugger
    this.createForm.patchValue({
           Payer_Id:'',
           Payer_Name:'',
           Policy_No:'',
      });
  const selectedInsurance = this.createForm.get('Ins_Type').value;

  if (selectedInsurance) {
    this.createForm.patchValue({
      Ins_Mode: selectedInsurance.Pri_Sec_Oth_Type || null,
      Payer_Id: selectedInsurance.Inspayer_Id,
      Payer_Name: selectedInsurance.Inspayer_Description,
      Policy_No: selectedInsurance.Policy_Number
    });
  }
}
onClaimChangeGetRenderingProvider() {
      debugger
       this.createForm.patchValue({ 
            renderingProvider:'',
            renderingAddress:'',
            reneringOfficePhone:'',
            renderingNPI:'',
            renderingGroupNPI:'',
            renderingSSN:'',
            renderingTaxonomyCode:'',
  });
     if(this.renderingProviderCode != null && this.renderingProviderCode != undefined){
       this.apiService.getTicketData(`/TicketTracker/GetRenderingProvider?providercode=${this.renderingProviderCode}`).subscribe(
   data => {
    debugger
    debugger;
      if (data.Status === 'Success' && data.Response) {
        debugger;
        const rendProvider = data.Response[0]
          this.createForm.patchValue({ 
            renderingProvider:rendProvider.Provid_FName +" "+ rendProvider.Provid_LName,
            renderingAddress:rendProvider.ADDRESS,
            reneringOfficePhone:rendProvider.Phone_One,
            renderingNPI:rendProvider.NPI,
            renderingGroupNPI:rendProvider.group_npi,
            renderingSSN:rendProvider.SSN,
            renderingTaxonomyCode:rendProvider.Taxonomy_Code,
  });
      } 
    },
  );
     }

    this.onClaimChangeBillingProvider();
}
onClaimChangeBillingProvider(){
     debugger
      this.createForm.patchValue({ 
            billingProvider:'',
            billingAddress:'',
            billingOfficePhone:'',
            billingNPI:'',
            billingGroupNPI:'',
            billingSSN:'',
            billingTaxonomyCode:'',
  });
     if(this.billingProviderCode != null && this.billingProviderCode != undefined){
       this.apiService.getTicketData(`/TicketTracker/GetRenderingProvider?providercode=${this.billingProviderCode}`).subscribe(
   data => {
    debugger
    debugger;
      if (data.Status === 'Success' && data.Response) {
        debugger;
        const billingProvider = data.Response[0]
          this.createForm.patchValue({ 
            billingProvider:billingProvider.Provid_FName +" "+ billingProvider.Provid_LName,
            billingAddress:billingProvider.ADDRESS,
            billingOfficePhone:billingProvider.Phone_One,
            billingNPI:billingProvider.NPI,
            billingGroupNPI:billingProvider.group_npi,
            billingSSN:billingProvider.SSN,
            billingTaxonomyCode:billingProvider.Taxonomy_Code,
  });
      } 
    },
  );
     }
}
handleRenderingProviderDropdownChange(event: any) {
  debugger
   this.createForm.patchValue({
      //renderingProvider: '',
      renderingAddress: '',
      reneringOfficePhone: '',
      renderingNPI: '',
      renderingGroupNPI: '',
      renderingSSN: '',
      renderingTaxonomyCode: '',
    }, { emitEvent: false });
  if (event) {
     this.renderingProviderCode = event.Provider_Code || event.value || event;
    this.onOtherSoftChangeGetRenderingProvider();
  }
}
onOtherSoftChangeGetRenderingProvider() {
  debugger;

  // Call API only if code is valid
  if (this.renderingProviderCode != null && this.renderingProviderCode !== '' && this.renderingProviderCode != undefined) {
    this.apiService.getTicketData(`/TicketTracker/GetRenderingProvider?providercode=${this.renderingProviderCode}`)
      .subscribe({
        next: (data) => {
          if (data.Status === 'Success' && Array.isArray(data.Response) && data.Response.length > 0) {
            const rendProvider = data.Response[0];
       
            // Optional: keep form value as Provider_Code (not full name)
            this.createForm.patchValue({
              //renderingProvider: rendProvider.Provid_FName +" "+ rendProvider.Provid_LName,  // <-- keep ID in form
              renderingAddress: rendProvider.ADDRESS ,
              reneringOfficePhone: rendProvider.Phone_One,
              renderingNPI: rendProvider.NPI ,
              renderingGroupNPI: rendProvider.group_npi ,
              renderingSSN: rendProvider.SSN ,
              renderingTaxonomyCode: rendProvider.Taxonomy_Code,
            }, { emitEvent: false });
          }
        },
        error: (err) => {
          console.error('Error fetching provider data:', err);
        }
      });
  }
}
onOtherSoftChangeBillingProvider(){

 debugger
 debugger;
 debugger;

     if(this.billingProviderCode != null && this.billingProviderCode != undefined && this.billingProviderCode != ''){
       this.apiService.getTicketData(`/TicketTracker/GetRenderingProvider?providercode=${this.billingProviderCode}`)
        .subscribe({
        next: (data) => {
          debugger

          if (data.Status === 'Success' && Array.isArray(data.Response) && data.Response.length > 0) {
            const billingProvider = data.Response[0];
             debugger
             debugger
             debugger
            // Optional: keep form value as Provider_Code (not full name)
            this.createForm.patchValue({
            //billingProvider:billingProvider.Provid_FName +" "+ billingProvider.Provid_LName,
            billingAddress:billingProvider.ADDRESS,
            billingOfficePhone:billingProvider.Phone_One,
            billingNPI:billingProvider.NPI,
            billingGroupNPI:billingProvider.group_npi,
            billingSSN:billingProvider.SSN,
            billingTaxonomyCode:billingProvider.Taxonomy_Code,
            }, { emitEvent: false });

            // this.createForm.get('billingProvider').setValue(billingProvider.Provid_FName +" "+ billingProvider.Provid_LName, { emitEvent: false });
          }
         
        },
        error: (err) => {
          console.error('Error fetching provider data:', err);
        }
      });
     }
}
handleBillingProviderDropdownChange(event: any) {
  debugger
   this.createForm.patchValue({ 
            //billingProvider:'',
            billingAddress:'',
            billingOfficePhone:'',
            billingNPI:'',
            billingGroupNPI:'',
            billingSSN:'',
            billingTaxonomyCode:'',
  });
  if (event) {
          this.billingProviderCode = event.Provider_Code || event.value || event;
    this.onOtherSoftChangeBillingProvider();
  }
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
getPatientDueAmt(){
  if(this.patientAccount!=null && this.patientAccount != undefined){
    this.apiService.getTicketData(`/TicketTracker/GetPatientDueAmt?patientacc=${this.patientAccount}`).subscribe(
    data => {
      if (data.Status === 'Success') {
        const patdueamt=data.Response

         this.createForm.patchValue({
            Patient_Due:patdueamt.PAT_DUE!= null ? patdueamt.PAT_DUE : '',
  });
      } 
    },
    
  );
}
  }
// ticketAttachments() {
// }
    onPatientAttachmentsShown() {
      
    }
    onPatientAttachmentsHidden(){

    }
onSubmit(): void {
  debugger;
  if(this.createForm.value.Department_Id == null || this.createForm.value.Department_Id == ""){
       this.toastr.warning('Please Enter Responsible Department', 'Validation');
      return;
  }
    if(this.selectedDepartmentName != "PHD"){
       this.assignedUserValue = 0
     }
    if(this.createForm.value.Ticket_Type == null || this.createForm.value.Ticket_Type == ""){
       this.toastr.warning('Please Enter Ticket Type', 'Validation');
      return;
  }
      if(this.createForm.value.Ticket_Reason == null || this.createForm.value.Ticket_Reason == ""){
       this.toastr.warning('Please Enter Ticket Reason', 'Validation');
      return;
  }
      if(this.createForm.value.Ticket_Priority == null || this.createForm.value.Ticket_Priority == ""){
       this.toastr.warning('Please Enter Ticket Priority', 'Validation');
      return;
  }
        if(this.createForm.value.Ticket_Title == null || this.createForm.value.Ticket_Title == ""){
       this.toastr.warning('Please Enter Ticket Title', 'Validation');
      return;
  }
          if(this.createForm.value.Ticket_Message == null || this.createForm.value.Ticket_Message == ""){
       this.toastr.warning('Please Enter Ticket Message', 'Validation');
      return;
  }
            if(this.createForm.value.Practice_Code == null || this.createForm.value.Practice_Code == ""){
       this.toastr.warning('Please Select Practice Code', 'Validation');
      return;
  }
              if(this.createForm.value.Patient_Account == null || this.createForm.value.Patient_Account == ""){
       this.toastr.warning('Please Select Patient Account', 'Validation');
      return;
  }
                if(this.createForm.value.Claim_No == null || this.createForm.value.Claim_No == ""){
       this.toastr.warning('Please Select Claim Number', 'Validation');
      return;
  }

  if(this.checkSoft == true){
 if(this.createForm.value.First_Name == null || this.createForm.value.First_Name == ""){
       this.toastr.warning('Please Enter First Name', 'Validation');
      return;
     }
      if(this.createForm.value.MI == null || this.createForm.value.MI == ""){
       this.toastr.warning('Please Enter Middle Name', 'Validation');
      return;
     }
      if(this.createForm.value.Last_Name == null || this.createForm.value.Last_Name == ""){
       this.toastr.warning('Please Enter Last Name', 'Validation');
      return;
     }
     if(this.createForm.value.Date_Of_Birth == null || this.createForm.value.Date_Of_Birth == ""){
       this.toastr.warning('Please Enter Date of Birth', 'Validation');
      return;
     }
          if(this.createForm.value.DOS == null || this.createForm.value.DOS == ""){
       this.toastr.warning('Please Enter Claim DOS', 'Validation');
      return;
     }
     if(this.createForm.value.Total_Billed == null || this.createForm.value.Total_Billed == ""){
       this.toastr.warning('Please Enter Total Billed Amount', 'Validation');
      return;
     }
  }
    if(this.createForm.value.Ticket_Type == "Insurance_Call" )
  {
    if(this.createForm.value.Ins_Type == null || this.createForm.value.Ins_Type == ""){
       this.toastr.warning('Please Enter Insuracne Mode', 'Validation');
      return;
     }
      if(this.createForm.value.Payer_Name == null || this.createForm.value.Payer_Name == ""){
       this.toastr.warning('Please Enter Payer_Name', 'Validation');
      return;
     }
      if(this.createForm.value.Payer_Id == null || this.createForm.value.Payer_Id == ""){
       this.toastr.warning('Please Enter Payer ID', 'Validation');
      return;
    }
       if(this.createForm.value.Policy_No == null || this.createForm.value.Policy_No == ""){
       this.toastr.warning('Please Enter Policy Number', 'Validation');
       return;
    }
  }
  if(this.checkSoft == true &&  this.checkTicketType == false){
     if(this.createForm.value.PatientCell_Phone == null || this.createForm.value.PatientCell_Phone == ""){
       this.toastr.warning('Please Enter Cell Number', 'Validation');
      return;
     }
          if(this.createForm.value.PatientHome_Phone == null || this.createForm.value.PatientHome_Phone == ""){
       this.toastr.warning('Please Enter Home Number', 'Validation');
      return;
     }
     if(this.createForm.value.PatientHome_Phone == null || this.createForm.value.PatientHome_Phone == ""){
       this.toastr.warning('Please Enter Home Number', 'Validation');
      return;
     }
        
  }
  if(this.checkSoft == true &&  this.checkTicketType == true){
 if(this.createForm.value.renderingProvider == null || this.createForm.value.renderingProvider == ""){
       this.toastr.warning('Please Enter Rendering Provider', 'Validation');
      return;
     }
              if(this.createForm.value.billingProvider == null || this.createForm.value.billingProvider == ""){
       this.toastr.warning('Please Enter Billing Provider', 'Validation');
      return;
     }
  }
 
  
                
const dobRaw = this.createForm.value.Date_Of_Birth;

const formattedDOB = dobRaw && dobRaw.jsdate instanceof Date
  ? dobRaw.jsdate.toISOString()
  : null;
 const dos=this.createForm.value.DOS
 const formattedDOS = dos && dos.jsdate instanceof Date
  ? dos.jsdate.toISOString()
  : null;
  // Combine form data + additional fields
  const Tickettracker
 = {
  Ticket_Id: this.createForm.value.Ticket_Id,
  Department_Id: this.createForm.value.Department_Id,
  Ticket_Type: this.createForm.value.Ticket_Type,
  Ticket_Reason: this.createForm.value.Ticket_Reason,
  Ticket_Priority: this.createForm.value.Ticket_Priority,
  Ticket_Status: this.createForm.value.Tick_Status,
  Ticket_Title: this.createForm.value.Ticket_Title,
  Closing_Remarks: this.createForm.value.Closing_Remarks,
  Practice_Code: this.createForm.value.Practice_Code,
  Patient_Account: this.createForm.value.Patient_Account,
  Claim_No: this.createForm.value.Claim_No,
  DOS:formattedDOS,
  First_Name: this.createForm.value.First_Name,
  Last_Name: this.createForm.value.Last_Name,
  MI: this.createForm.value.MI,
  Date_Of_Birth: formattedDOB,
  SSN: this.createForm.value.SSN,
  Patient_Due: this.createForm.value.Patient_Due,
  Claim_Due: this.createForm.value.Claim_Due,
   Total_Billed : this.createForm.value.Total_Billed,
   Ins_Mode: this.createForm.value.Ins_Mode,
  Payer_Name: this.createForm.value.Payer_Name,
   Payer_Id: this.createForm.value.Payer_Id,
   Policy_No: this.createForm.value.Policy_No,
   Ticket_Message: this.createForm.value.Ticket_Message,
   Ticket_Aging:this.ticketAging,
   Created_By: this.userId,          // string
   RProvider_Id: this.renderingProviderCode != null ? Number(this.renderingProviderCode) : null, // int?
  BProvider_Id: this.billingProviderCode != null ? Number(this.billingProviderCode) : null, 
  Assigned_User: this.assignedUserValue   // int?

};
   this.apiService.PostData('/TicketTracker/SaveTicket', Tickettracker
, (res: any) => {
  debugger;
    if (res.Status === 'Success') {
      debugger;
      this.createForm.reset({
      Assigned_User: '',
      Created_By: '',
      Practice_Code: '',
      });
      this.router.navigate(['/ticket-tracker']);
      this.toastr.success(res.Response);
    } else {
      this.toastr.error(res.Response, 'Submit failed');
    }
  });
}

  onUpload() {
    debugger
  if (this.selectedFiles.length === 0) {
      this.message = 'Please select at least one file.';
      return;
    }

    const formData = new FormData();
    formData.append("TicketId", '123');
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    this.uploading = true;
   this._fileHandlerService.UploadFile(formData, '/patientattachments/UploadFiles')
      .subscribe(res => {
        if (res.Status === "success") {
          debugger;
          this.toastr.success("Files uploaded successfully.");
        } else {
          this.toastr.error(res.Response, 'Upload Failure');
        }
      }, (error) => {
          this.uploading = false;
          this.toastr.error("Error uploading files.");
      });
  }
  onFileSelected(event: any): void {
    debugger
  const files: FileList = event.target.files;

  // Convert FileList to an array and add to existing selectedFiles
  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (file && !this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
      this.selectedFiles.push(file);
    }
  }

  console.log('Selected files:', this.selectedFiles);
}


onChangeFile(event: any): void {
  const files: FileList = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);

    if (file) {
       const fileName = file.name;
      const isValidName = /^[a-zA-Z0-9._-]+$/.test(fileName);
      const alreadyAdded = this.selectedFiles.some(f => f.name === file.name);
        if (alreadyAdded) {
        this.toastr.warning(`File "${file.name}" is already selected.`);
        continue;
        }
      //   if (!isValidName) {
      //   this.toastr.warning(`File name must not contain special characters, Invalid Filename.`);
      //   continue;
      // }
        if (this.selectedFiles.length < 4) {
          this.selectedFiles.push(file);
        } else {
           this.toastr.warning('You can only upload up to 4 files');
          break;
        }
      
    }
  }
  event.target.value = '';
   if (this.ticketAttachments) {
      this.ticketAttachments.hide();
    }
  
}
removeFile(index: number): void {
  this.selectedFiles.splice(index, 1);
}
getTicketById(value: any) {
  debugger
  debugger
  const ticketid = value;

  this.apiService.getTicketData(`/TicketTracker/GetTicketById?ticketid=${ticketid}`).subscribe(data => {
    debugger;
    debugger;
    if (data.Status === 'Success') {
      this.editTicketalldate = data.Response;
      if(this.editTicketalldate.Ticket_Type=="Patient_Call"){
       this.checkTicketType=false;
  }
  else{
    this.checkTicketType=true;
  }
       this.createForm.patchValue({
        Ticket_Id: this.editTicketalldate.Ticket_Id,
        Department_Id: this.editTicketalldate.Department_Id,
        Ticket_Type: this.editTicketalldate.Ticket_Type,
        Ticket_Reason: this.editTicketalldate.Ticket_Reason,
        Ticket_Priority: this.editTicketalldate.Ticket_Priority,
        Ticket_Title: this.editTicketalldate.Ticket_Title,
        Ticket_Message: this.editTicketalldate.Ticket_Message,
       Practice_Code: Number(this.editTicketalldate.Practice_Code),
       
      });
      this.getPracInfo(this.editTicketalldate.Practice_Code);
     // this.patientAccount = this.editTicketalldate.Patient_Account;
      if (this.editTicketalldate.Soft == false) {
        this.onPatientAccountChange(this.editTicketalldate.Patient_Account);
        this.onClaimChange(this.editTicketalldate.Claim_No);
      } 
      else{
        this.getTicketBYIDForOtherSoft(this.editTicketalldate.Ticket_Id)
      }
      // else 
      // {
      //   // Format Date_Of_Birth properly for form
      // const dateString = this.editTicketalldate.Date_Of_Birth;
      // let dobFormatted: any = null;
      
      // if (dateString) {
      //   const dob = new Date(dateString);
      //   dobFormatted = {
      //     year: dob.getFullYear(),
      //     month: dob.getMonth() + 1,
      //     day: dob.getDate()
      //   };
      //   this.selDateDOB = dobFormatted;
      // }

      //  const dateStrings = this.editTicketalldate.DOS;
      //  let dosFormatted: any = null;
       
      //  if (dateStrings) {
      //    const dos = new Date(dateStrings);
      //    dosFormatted = {
      //      year: dos.getFullYear(),
      //      month: dos.getMonth() + 1,
      //      day: dos.getDate()
      //    };
      //    this.selDateDOS = dosFormatted;
      //  }
      //           this.createForm.patchValue({
      //      Patient_Account: isNaN(this.editTicketalldate.Patient_Account)
      //      ? this.editTicketalldate.Patient_Account
      //      : Number(this.editTicketalldate.Patient_Account),
      //      Claim_No: isNaN(this.editTicketalldate.Claim_No)
      //      ? this.editTicketalldate.Claim_No
      //      : Number(this.editTicketalldate.Claim_No),
      //      First_Name: this.editTicketalldate.First_Name,
      //      Last_Name: this.editTicketalldate.Last_Name,
      //      MI: this.editTicketalldate.MI,
      //      PatientCell_Phone: this.editTicketalldate.PatientCell_Phone,
      //      Date_Of_Birth: dobFormatted,
      //      SSN: this.editTicketalldate.SSN,
      //      DOS: dosFormatted,
      //      Total_Billed: Number(this.editTicketalldate.Total_Billed),
      //      Claim_Due:Number(this.editTicketalldate.Claim_Due),
      //      Payer_Name:this.editTicketalldate.Payer_Name,
      //      Payer_Id:this.editTicketalldate.Payer_Id,
      //      Policy_No:this.editTicketalldate.Policy_No,
      //      Ins_Type:this.editTicketalldate.Ins_Mode,

         
      //    });
      // this.getPracInfo(this.editTicketalldate.Practice_Code);

      //   //this.handleRenderingProviderDropdownChange(this.editTicketalldate.RProvider_Id);
      //   //this.handleBillingProviderDropdownChange(this.editTicketalldate.BProvider_Id);
      // }

      // Always patch ticket info
     
    }
  });
}
getTicketBYIDForOtherSoft(value: any){
 debugger
  debugger
  const ticketid = value;

  this.apiService.getTicketData(`/TicketTracker/GetTicketById?ticketid=${ticketid}`).subscribe(data => {
    debugger;
    debugger;
    if (data.Status === 'Success') {
      this.editTicketalldate = data.Response;
      if(this.editTicketalldate.Ticket_Type=="Patient_Call"){
       this.checkTicketType=false;
  }
  else{
    this.checkTicketType=true;
  }
      
      const dateString = this.editTicketalldate.Date_Of_Birth;
      let dobFormatted: any = null;
      
      if (dateString) {
        const dob = new Date(dateString);
        dobFormatted = {
          year: dob.getFullYear(),
          month: dob.getMonth() + 1,
          day: dob.getDate()
        };
        this.selDateDOB = dobFormatted;
      }

       const dateStrings = this.editTicketalldate.DOS;
       let dosFormatted: any = null;
       
       if (dateStrings) {
         const dos = new Date(dateStrings);
         dosFormatted = {
           year: dos.getFullYear(),
           month: dos.getMonth() + 1,
           day: dos.getDate()
         };
         this.selDateDOS = dosFormatted;
       }
       
          this.createForm.patchValue({
           Patient_Account: isNaN(this.editTicketalldate.Patient_Account)
           ? this.editTicketalldate.Patient_Account
           : Number(this.editTicketalldate.Patient_Account),
           Claim_No: isNaN(this.editTicketalldate.Claim_No)
           ? this.editTicketalldate.Claim_No
           : Number(this.editTicketalldate.Claim_No),
           First_Name: this.editTicketalldate.First_Name,
           Last_Name: this.editTicketalldate.Last_Name,
           MI: this.editTicketalldate.MI,
           PatientCell_Phone: this.editTicketalldate.PatientCell_Phone,
           Date_Of_Birth: dobFormatted,
           SSN: this.editTicketalldate.SSN,
           DOS: dosFormatted,
           Total_Billed: Number(this.editTicketalldate.Total_Billed),
           Claim_Due:Number(this.editTicketalldate.Claim_Due),
           Payer_Name:this.editTicketalldate.Payer_Name,
           Payer_Id:this.editTicketalldate.Payer_Id,
           Policy_No:this.editTicketalldate.Policy_No,
           Ins_Type:this.editTicketalldate.Ins_Mode,
              renderingAddress: '' ,
              reneringOfficePhone: '',
              renderingNPI: '' ,
              renderingGroupNPI: '' ,
              renderingSSN: '',
              renderingTaxonomyCode: '',
            billingAddress:'',
            billingOfficePhone:'',
            billingNPI:'',
            billingGroupNPI:'',
            billingSSN:'',
            billingTaxonomyCode:'',
        
  

         });
         

               

          debugger;
          debugger;
         this.billingProviderCode=this.editTicketalldate.BProvider_Id;
         this.renderingProviderCode=this.editTicketalldate.RProvider_Id;
         this.onOtherSoftChangeGetRenderingProvider();
        this.onOtherSoftChangeBillingProvider();
    }
  });
}

onCreateReset(){
   this.createForm.reset();
}
onCancel(){
  this.router.navigate(['/ticket-tracker']);
}
getAssignedUser(){
  debugger
  this.practiceCode=this.practiceCodeforassigneduser
  if(this.practiceCode != null && this.practiceCode != undefined && this.practiceCode != ''){
  this.apiService.getTicketData(`/TicketTracker/GetAssignedUser?practiceCode=${this.practiceCode}`).subscribe(
   data => {
      if (data.Status === 'Success') {
        debugger;    
         debugger;
        this.assignedUserValue = data.Response.PHD_POCid;   
        this.practiceCode=''
         
      } 
      
    },
    
  );
 
}
}

}
