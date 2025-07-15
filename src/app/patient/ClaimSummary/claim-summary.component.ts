

import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ClaimSummaryModel } from '../../Claims/Classes/claimSummary'
import { DatePipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ClaimsComponent } from '../../Claims/claims.component'
import 'datatables.net'
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Common } from '../../services/common/common';
import { MessageModel , MessageModelnew} from '../Classes/PatientStatement.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { PatientStatementClaimsComponent } from '../../claim-submission/patient-statement-main/patient-statement-claims/patient-statement.claims.component';
import { StatmentDownloadRequest } from '../Classes/statmentDownloadRequest.model';
import { data } from 'jquery';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { AlertService } from '../../services/data/Alert.service';
//  
declare var $: any;

@Component({
  selector: 'app-claim-summary',
  templateUrl: './claim-summary.component.html',
  styleUrls: ['./claim-summary.component.css']
})
export class ClaimSummaryComponent implements OnInit {
  objClaimSummaryModel: ClaimSummaryModel;
  public tableWidget: any;
  dataTable: any;
  isDropdownOpen = false;
  showaddmessageModal = false;
  public temp_var: Object = false;
  @ViewChild(ClaimsComponent) childClaim;
  IncludeDeleted: boolean = false;
  messageModel:MessageModel;
  Addmodel:MessageModel;

  stringArray: string[] = ['Super Admin', 'Manager OPS', 'Sr. Manager Ops', 'value4', 'value5'];
   valueToCompare: string ; 
   someDataProperty :string = 'H';
   someOtherDataProperty:string = 'Pir Ubaid';
   alertMessage:string = 'Test message here.';
  selecteddata : MessageModel;
  value:any;
  showDownload: boolean = false;
  showAddPrint: boolean = false;
  showModal: boolean = false;
  close : string;
  dataTableClaimsSummary: any;
  EnteredMesages:string="";
  patientInfo: any;
  messages: string;
  selectedOption: string;
  messageToPrint:string;
  buttonname:string="Save";
  statementModelText:string="Add New Message"
  compareResult: boolean ;
   messagesArray: string[]; 
   isChecked: boolean = false;
   firstAlert: any;
   BillingTypeCheck:any="P";
   PracticeBillingType:any='';
   isModalActive = false; // To manage modal visibility
   messageModelCPT: any[] = []; // To hold claim details
   modalOptions: { backdrop: string } = { backdrop: 'static' }; // Modal options 

   isDisabled:boolean = false; 
  isAmountDueGreaterThanZero: boolean = false;
  statmentDownloadRequestModel: StatmentDownloadRequest;
  @ViewChild(PatientStatementClaimsComponent) PatientStatementClaimsComponent;
  @ViewChild(ModalDirective) modalWindow: ModalDirective;
  //@ViewChild(ModalDirective)modalWindowCPT:ModalDirective;
  @ViewChild('cptModal')cptModal:ModalDirective;  // added this 
  // @ViewChild(ModalDirective) modalWindowNewClaim: ModalDirective;
  @ViewChild('modalWindowNewClaim') modalWindowNewClaim: ModalDirective;
  constructor(public datepipe: DatePipe,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    public API: APIService,
    public GV: GvarsService,
    public router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private Gv: GvarsService,
    private apiService: APIService,
    private spinner: NgxSpinnerService) {

     
    this.objClaimSummaryModel = new ClaimSummaryModel();
    this.Addmodel=new MessageModel();
    this.buttonname="Save";
    this.statementModelText="Add New Message"
    this.selecteddata = new MessageModel(); 
    this.EnteredMesages = '';
//     debugger
// if(this.GV.currentUser.selectedPractice.Billing_Type==null ||this.GV.currentUser.selectedPractice.Billing_Type=="P" ){
//   this.BillingTypeCheck=false;
// }
this.PracticeBillingType=this.GV.currentUser.selectedPractice.Billing_Type.toLowerCase();

switch (this.PracticeBillingType) {
  case "p" :
    this.BillingTypeCheck = "p";
    break;
  case "i" :
    this.BillingTypeCheck = "i";
    break;
  case "p&i" :
    this.BillingTypeCheck = "p&i";
    break;
  case "null" :
    this.BillingTypeCheck = "p";
    break;
  case "institutional" :
    this.BillingTypeCheck = "i";
    break;
  case "professional" :
  this.BillingTypeCheck = "p";
    break;
  default:
    this.BillingTypeCheck = "p";
}



    this.getAlldata();
    this.valueToCompare=this.GV.currentUser.role;
    this.compareResult= this.compareWithStringArray(this.valueToCompare, this.stringArray); 
 }

 toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen; // Toggle the dropdown state
}


  compareWithStringArray(value: string, stringArray: string[]): boolean {
      
    return stringArray.includes(value);
  }
  ngOnInit() {
    this.IsButtonDisable();
    this.route.params.subscribe(qp => {
      if (qp) {
        this.patientInfo = JSON.parse(Common.decodeBase64(qp['param']));
        this.Gv.Patient_Account = this.patientInfo.Patient_Account;
        if (this.patientInfo.Patient_Account > 0) {
          this.getSummary();
        }
      }
    });

  }
  
 // Added by Pir Ubaid (USER STORY 204 : NPM ALERT )
 ngAfterViewInit() {
  debugger;
  this.alertService.getAlert().subscribe((data) => {
      if (data.Status === 'Success' && data.Response && data.Response.length > 0) {
          this.firstAlert = data.Response[0];
          console.log('Received alert data:', this.firstAlert);
          console.log('this.firstAlert.ClaimSummary', this.firstAlert.ClaimSummary);
          if (this.isAlertNotExpired()) {
              if (
                  this.firstAlert.ApplicableFor == 'S' &&
                  this.Gv.currentUser.userId == this.firstAlert.Created_By &&
                  this.firstAlert.ClaimSummary === true
              ) {
                  this.show();
              } else if (this.firstAlert.ApplicableFor == 'A' && this.firstAlert.ClaimSummary === true) {
                  this.show();
              } else {
                  console.log('Conditions not met.');
              }
          } else {
              console.log('Alert is expired.');
          }
      } else {
          console.log('No alert data available.');
          debugger;
      }
  });
}

showClaimCPTDetails(claimNo: number) {
  this.API.getData('/demographic/getClaimDetails?Claim_no=' + claimNo).subscribe(
    response => {
      if (response.Status === 'Success') {
        this.messageModelCPT = response.Response;
        //this.modalWindowCPT.show(); 
        $('#cptModal').modal('show'); ; // added this line
        this.isModalActive = true; // Show the modal
        console.log("Claim details:", this.messageModelCPT);
      } else {
        console.error('No data found:', response.Status); 
      }
    },
    error => {
      console.error('Error fetching claim details:', error);
    }
  );
}
  closeModalCPT() {
    this.isModalActive = false; // Hide the modal
  }

isAlertNotExpired(): boolean {
  console.log('this.firstAlert.EffectiveFrom', this.firstAlert.EffectiveFrom);
  console.log('this.firstAlert.EffectiveTo', this.firstAlert.EffectiveTo);
  console.log('new Date()', new Date());
  debugger;

  // Check if firstAlert or EffectiveFrom is null or undefined
  if (!this.firstAlert || !this.firstAlert.EffectiveFrom) {
    console.log('EffectiveFrom.jsdate is null or undefined');
    return false; // Or handle it according to your requirements
  }

  // Parse the EffectiveFrom date string into a JavaScript Date object
  const effectiveFromDate = new Date(this.firstAlert.EffectiveFrom);

  // If EffectiveTo is not defined, consider the alert to be lifetime from EffectiveFrom date
  if (!this.firstAlert.EffectiveTo) {
    // Set the time to midnight for comparison
    effectiveFromDate.setHours(0, 0, 0, 0);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate >= effectiveFromDate; // Display modal if current date is equal to or greater than EffectiveFrom date
  }

  // Parse the EffectiveTo date string into a JavaScript Date object
  const effectiveToDate = new Date(this.firstAlert.EffectiveTo);

  // Set the time to midnight for comparison
  effectiveFromDate.setHours(0, 0, 0, 0);
  effectiveToDate.setHours(0, 0, 0, 0);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if the current date is between EffectiveFrom and EffectiveTo dates
  return currentDate >= effectiveFromDate && currentDate <= effectiveToDate;
}






  

show() {
  debugger
  //set the modal body static.will close on click OK or Cross
  const modalOptions: ModalOptions = {
    backdrop: 'static'
  };
  this.modalWindow.config = modalOptions;
this.modalWindow.show();
}
showCPT() {
  debugger
  //set the modal body static.will close on click OK or Cross
  const modalOptions: ModalOptions = {
    backdrop: 'static'
  };
  this.cptModal.config = modalOptions; // added this line
this.cptModal.show();  // added this line
}


showAddNewClaim() {
  debugger
  //set the modal body static.will close on click OK or Cross
  const modalOptions: ModalOptions = {
    backdrop: 'static'
  };
  this.modalWindowNewClaim.config = modalOptions;
this.modalWindowNewClaim.show();
}
hideAddNewClaim() {
  debugger
this.modalWindowNewClaim.hide();
}


hide() {
this.modalWindow.hide();
}

hideCPT(){
  this.cptModal.hide();
}
  SHowaddmessage(){
    this.buttonname="Save";
    this.statementModelText="Add New Message"
    this. showaddmessageModal = true;
  }

  selectFirstOption() {
    
    this.showDownload = true;
    this. showAddPrint=false;
    this.showModal=true;
    this.selectedOption = 'option1'; 
    this.isChecked = false;

  }


  selectFirstOption1() {

    this.isChecked = false;
    
     this.showModal=true;
    this. showAddPrint=true;
    this.showDownload = false;
    this.selectedOption = 'option1'; }
  getAlldata(){

    this.API.getData(`/ItemizedPatientStatment/GetAllMessages`).subscribe(
      response => {
          
      
        if (response.Status === 'Success') {
          
          this.messageModel=response.Response;
         this.messagesArray = response.Response.map((messageModel: MessageModel) => messageModel.Messages);
          

         console.log("this is my message"+ this.messageModel)


  }});


  }
  

  getSummary() {
    this.API.getData(`/Demographic/GetPatientClaimsSummary?PatientAccount=${this.patientInfo.Patient_Account}&IncludeDeleted=${this.IncludeDeleted}&isAmountDueGreaterThanZero=${this.isAmountDueGreaterThanZero}`).subscribe(
      data => {
        debugger;
        if (data.Status === 'Sucess') {
          if (this.dataTableClaimsSummary) {
            this.dataTableClaimsSummary.destroy();
          }
          data.Response.claimlistdetails.forEach(item => {
            debugger;
            if (+item.Amt_Due > 0 && item.Pri_Status && (item.Pri_Status.toLowerCase() == 'n' || item.Pri_Status.toLowerCase() == 'r' || item.Pri_Status.toLowerCase() == 'b')) {
              item.ResponsibleParty = 'Primary Insurance';
            }
            else if (+item.Amt_Due > 0 && item.Sec_Status && (item.Sec_Status.toLowerCase() == 'n' || item.Sec_Status.toLowerCase() == 'r' || item.Sec_Status.toLowerCase() == 'b')) {
              item.ResponsibleParty = 'Secondary Insurance';
            }
            else if (+item.Amt_Due > 0 && item.Oth_Status && (item.Oth_Status.toLowerCase() == 'n' || item.Oth_Status.toLowerCase() == 'r' || item.Oth_Status.toLowerCase() == 'b')) {
              item.ResponsibleParty = 'Other Insurance';
            }
            else if (+item.Amt_Due > 0 && item.Pat_Status && (item.Pat_Status.toLowerCase() == 'n' || item.Pat_Status.toLowerCase() == 'r' || item.Pat_Status.toLowerCase() == 'b')) {
              item.ResponsibleParty = 'Patient';
            }
            else if (+item.Amt_Due > 0 && item.Pat_Status && (item.Pat_Status.toLowerCase() == 'd' || item.Pat_Status == 'D')) {
              item.ResponsibleParty = 'Dormant';
            }
            else if (+item.Amt_Due > 0 && item.Pat_Status && (item.Pat_Status.toLowerCase() == 'c' || item.Pat_Status == 'C')) {
              item.ResponsibleParty = 'Collection';
            }
            //Added BY hamza Akhlaq For Negative Balance
            if(item.Insurance_over_paid !=0 && item.Insurance_over_paid!=null || item.Patient_credit_balance != 0 && item.Patient_credit_balance != null)
              {
               if (item.Patient_credit_balance == null || item.Patient_credit_balance == 0  )
                {
                 item.OverPaymentResponsebleParty = 'Insurance';
               }
               else if (item.Insurance_over_paid == null || item.Insurance_over_paid == 0  ) {
                item.OverPaymentResponsebleParty = 'Patient';
              }
              else if (item.Insurance_over_paid != null && item.Patient_credit_balance != null && item.Insurance_over_paid != 0 && item.Patient_credit_balance != 0) {
                item.OverPaymentResponsebleParty = 'Both';
              }
               else {
                item.OverPaymentResponsebleParty=''
               }
            }
        
         
          });
          this.objClaimSummaryModel = data.Response;
          this.chRef.detectChanges();
          this.dataTableClaimsSummary = $('.dataTableClaimsSummary').DataTable({
            columnDefs: [
              {
                type: 'date', targets: [1, 2]
              },
              {
                orderable: false, targets: -1
              }
            ],
            language: {
              emptyTable: "No data available"
            }
          })
        } else {
          swal('Failed', data.Status);
        }
      });
  }


  // onItemSelected(Message: string) {
  //   console.log(Message)
  //   window.alert(this.selectedOption);

   
   
  //   }


   
  closeModal() {
    this.showaddmessageModal = false;
    this.EnteredMesages="";
    
  }

  canSaveedit() {
      
     
    if (this.isNullOrEmptyString( this.selecteddata.Messages)) {
      this.toaster.warning('Add Message', 'Validation');
      return false;
     
    }
    else {
      this.close="modal";
      return true;
    }

  }
    
  saveclaimassignee() {
  
    if(this.buttonname=="Save")
  {
   this.onSave()
  }
  else{
    if(this.canSave())
    {
      this.selecteddata.Messages=this.EnteredMesages;
      this.selecteddata.PracticeCode=this.GV.currentUser.selectedPractice;
      this.API.PostData(`/ItemizedPatientStatment/EditMessage`, this.selecteddata , (d) => {
        if (d.Status == "Success") {
          this. showaddmessageModal = false;
          this.EnteredMesages="";
          this.getAlldata();
          swal('Message Updated Successfully','', 'success');
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })


    }

     

  }
   
    
    }

    onCheckboxChange(checked: boolean) {
        
      if(checked==true){
        this.isChecked = checked;
        this.selectedOption="";
 }
 else{
  this.isChecked=false;
  this.selectedOption = 'option1'; 

 }

 console.log("this is checked" + checked)
    }



    canSave() {
      
       
      if (this.isNullOrEmptyString(this.EnteredMesages) ||this.EnteredMesages=="") {
        this.toaster.warning('Add Message', 'Validation');
        return false;
      }
      else {
        return true;
      }
  
    }

onSave()
{
  

    if (this.canSave()){
    this.Addmodel.PracticeCode = this.GV.currentUser.selectedPractice;
    this.Addmodel.Created_By=0;
      this.Addmodel.Messages = this.EnteredMesages;
      this.API.PostData(`/ItemizedPatientStatment/AddMessage`, this.Addmodel , (d) => {
        if (d.Status == "Success") {
          
          this.getAlldata();
          swal('Message Saved Successfully', '', 'success');
      
          this. showaddmessageModal = false;
          this.EnteredMesages="";
          this.Addmodel = new MessageModel;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })


    }
    
}


ondelete(id) {

  this.selecteddata.Message_ID=this.messageModel[id].Message_ID;
  this.API.confirmFun('Confirmation', 'Do you want to delete this message?', () => {
    debugger
    this.API.getData(`/ItemizedPatientStatment/DeleteMessage?MessageId=${this.selecteddata.Message_ID}`)
.subscribe(
  d => {
    if (d.Status == "Success") {
          swal('Delete Success', 'Message has been deleted successfully.', 'success');
        } else {
          swal('Delete Failed', 'Failed to delete the Message.', 'error');
        }
        this.getAlldata();
      });
  });
}

//     ondelete(id){

//       this.selecteddata.Message_ID=this.messageModel[id].Message_ID;

// this.API.getData(`/ItemizedPatientStatment/DeleteMessage?MessageId=${this.selecteddata.Message_ID}`)
// .subscribe(
//   d => {

//       if (d.Status == "Success") {

//           swal('Delete Success', 'Message Deleted Successfully', 'success');

//           this.getAlldata();
     
//         }
//         else {
//           swal('Failed', d.Status, 'error');
//         }
//       })

//       this.getAlldata();

//  }

    onEdit(id){
  
this.buttonname="Update";
this.statementModelText="Please Update Message"


this. showaddmessageModal = true;
      this.selecteddata=this.messageModel[id];
      this.EnteredMesages=this.selecteddata.Messages;

      console.log( "ths is my selected data"+    this.EnteredMesages)

     
      



    }
    onAddNewMessage(){

    }


    isNullOrEmptyString(str: string): boolean {
      if (str == undefined || str == null || $.trim(str) == '')
        return true;
      else
        return false;
    }
  
  
    isNullOrUndefinedNumber(num: number): boolean {
      if (num == undefined || num == null)
        return true;
      else
        return false;
    }

  getData() {
    this.getSummary();
  }

  editClaim(claimNo: number, PatientAccount: number) {
    this.router.navigate(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: PatientAccount,
        claimNo: claimNo, disableForm: false, 
        PatientLastName: this.patientInfo.PatientLastName,
        PatientFirstName: this.patientInfo.PatientFirstName
      }))]);
  }

  viewClaim(claimNo: number, PatientAccount: number) {
    this.router.navigate(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: PatientAccount,
        claimNo: claimNo,
        disableForm: true,
        PatientLastName: this.patientInfo.PatientLastName,
        PatientFirstName: this.patientInfo.PatientFirstName
      }))]);
  }
  getAlertNewClaim() {
    debugger
    // Return the observable directly
    return this.apiService.getData('/Alert/GetAlertForPatient?patientaccount=' + this.Gv.Patient_Account);
    
  }
   // Added by Pir Ubaid (USER STORY 204 : NPM ALERT )
  // callShowforNewClaim()  {
  //   debugger;
  //   this.getAlertNewClaim().subscribe((data) => {
  //     this.firstAlert = data.Response[0];
  //       if (data.Status === 'Success') {
  //         debugger
  //           this.firstAlert = data.Response[0];
  //            console.log('Received alert data:', this.firstAlert);
  // // Check if there is no response or data
  // if (!this.firstAlert) {
  //   debugger
  //   this.newClaim();
  //   //return; // Exit the method if there is no data
  // }

  //           // Check if AddNewClaim is false or null
  //     if (this.firstAlert.AddNewClaim !== true) {
  //       this.newClaim();
  //      // return; // Exit the method if AddNewClaim is false or null
  //     }
  //           console.log('this.firstAlert.ClaimSummary', this.firstAlert.ClaimSummary);
  //           if (this.isAlertNotExpired()) {
  //             debugger
  //               if (
  //                   this.firstAlert.ApplicableFor == 'S' &&
  //                   this.Gv.currentUser.userId == this.firstAlert.Created_By &&
  //                   this.firstAlert.AddNewClaim === true
  //               ) {
  //                   this.showAddNewClaim();
  //               } else if (this.firstAlert.ApplicableFor == 'A') {
  //                   this.showAddNewClaim();
  //               } else {
  //                   console.log('Conditions not met.');
  //               }
  //           } else {
  //               console.log('Alert is expired.');
  //           }
  //       } else {
  //           console.log('No alert data available.');
  //           debugger;
  //       }
  //   });
  // }

  callShowforNewClaim(type?:any)  {
    debugger;
    this.getAlertNewClaim().subscribe((data) => {
      if (data.Status === 'Success') {
        this.firstAlert = data.Response ? data.Response[0] : null; // Ensure the firstAlert is not null
  
        // if (!this.firstAlert) {
        //   console.log('No alert data available.');
        //   return; // Exit the method if there is no data
        // }
  
        console.log('Received alert data:', this.firstAlert);
  
        // If AddNewClaim is false or null, open the new claim form
        if (this.firstAlert.AddNewClaim !== true) {
          debugger
          this.newClaim(type);
         // return; // Exit the method if AddNewClaim is false or null
        }
  
        // If there is data and AddNewClaim is true, proceed with alert conditions
        if (this.isAlertNotExpired()) {
          debugger
          if (
              this.firstAlert.ApplicableFor == 'S' &&
              this.Gv.currentUser.userId == this.firstAlert.Created_By &&
              this.firstAlert.AddNewClaim === true
          ) {
              this.showAddNewClaim();
          } else if (this.firstAlert.ApplicableFor == 'A' &&  this.firstAlert.AddNewClaim === true) {
              this.showAddNewClaim();
          }
          else if (
             this.firstAlert.ApplicableFor == 'S' && this.Gv.currentUser.userId != this.firstAlert.Created_By) 
          {
            this.newClaim(type);
        } else {
              console.log('Conditions not met.');
          }
        } else {
          this.newClaim(type);
          console.log('Alert is expired.');
        }
      } else if (data.Status === 'No data found') {
       // console.log('No alert data found.');
        //this.toaster.error('No alert data found', 'error');

        this.newClaim(type);
        // Handle the case when no alert data is found
        // For example, display a message to the user indicating no alert data is available
      } else {
        console.log('Error occurred:', data.Status);
        debugger;
      }
    });
  }
  



  newClaim(type?:any) {
    this.router.navigate(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: this.patientInfo.Patient_Account,
        claimNo: 0,
        disableForm: false, 
        type,
        PatientLastName: this.patientInfo.PatientLastName,
        PatientFirstName: this.patientInfo.PatientFirstName
      }))]);
  }

  onDeleteClick(id: any) {
    this.API.confirmFun('Confirmation', 'Do you want to delete this Claim?', () => {
      this.API.getData(`/Demographic/DeleteClaim?ClaimNo=${id}`).subscribe(
        response => {
          if (response.Status === 'Sucess') {
            swal('Delete Success', 'Claim has been deleted successfully.', 'success');
          } else {
            swal('Delete Failed', 'Failed to delete the claims.', 'error');
          }
        }, () => {

        }, () => {
          this.getSummary();
        });
    });
  }

  onChangeShowDeleted(e: any) {
    this.getSummary();
  }

  onChangeAmountDue() {
    this.getSummary();
  }

  onDownloadItemizedPatientStatement(event: any) {
      
    this.statmentDownloadRequestModel = new StatmentDownloadRequest();
    this.statmentDownloadRequestModel.ExcludedClaimsIds = event.ExcludedClaimsIds;
    this.statmentDownloadRequestModel.PatientAccount = event.PatientAccount;
    this.statmentDownloadRequestModel.PracticeCode = this.GV.currentUser.selectedPractice.PracticeCode;
    this.statmentDownloadRequestModel.Message =this.selectedOption;
    // this.statmentDownloadRequestModel.Message=this.selectedOption;
   

    this.API.downloadFilePost('/ItemizedPatientStatment/GenerateItemizedPsForDownload', this.statmentDownloadRequestModel ).subscribe(
      d => {
        if (d != null) {
          var bolb = new Blob([d], { type: 'application/pdf' });
          saveAs(bolb, this.patientInfo.Patient_Account + '.pdf');
        }
        else {
          swal('', 'No Due Amount Against the Given Patient', 'warning');
        }
      })
  }

  Message(data:any){
    this.messages=data.target.value;
//     console.log(this.messages+"this is my message")
// this.onPrintItemizedPatientStatement();
    

  }

  onPrintItemizedPatientStatement() {
    
    this.messageToPrint=this.selectedOption;
 
    
    this.spinner.show();

      
    this.API.downloadFile(`/ItemizedPatientStatment/GenerateItemizedPsForPrint?PatientAccount=${this.patientInfo.Patient_Account}&practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}&messageToPrint=${this.messageToPrint}`).subscribe(
      d => {
        if (d != null) {
          var blob = new Blob([d], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = blobUrl;
          document.body.appendChild(iframe);
          this.spinner.hide();
          iframe.contentWindow.print();
        }
        else {
          swal('', 'No Due Amount Against the Given Patient', 'warning');
        }
      })
  }

  showPatientClaims() {
    this.PatientStatementClaimsComponent.show();
    this.showModal=false;
  
  }

  IsButtonDisable(){
    debugger
     this.isDisabled= this.Gv.IsbuttonDisable();
   
   
    }
}
