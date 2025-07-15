import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BatchFileErrors, BatchErrorsRequestModel,BatchExceptionRequestModel,BatchFileException } from '../models/claims-submission.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Common } from '../../services/common/common';
import { IMyDpOptions } from 'mydatepicker';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { Router } from '@angular/router';
import * as moment from 'moment';
// import { CurrentUserViewModel } from 'src/app/models/auth/auth';
import { CurrentUserViewModel } from '../../models/auth/auth';
@Component({
  selector: 'app-claim-submission-errors',
  templateUrl: './claim-submission-errors.component.html',
  styleUrls: ['./claim-submission-errors.component.css']
})
export class ClaimSubmissionErrorsComponent implements OnInit {
  batchFileErrorsList: BatchFileErrors[];
  batchFileExceptionList: BatchFileException[]
  dataTableErrors: any;
  subProviderSelectList: Subscription;
  subBatchSelectList: Subscription;
  batchesSelectList: SelectListViewModel[];
  providerSelectList: SelectListViewModel[];
  providerSelectControl = new FormControl('', [Validators.required]);
  batchSelectControl = new FormControl('', [Validators.required]);
  requestModel: BatchErrorsRequestModel;
  requestModelexception: BatchExceptionRequestModel;
  isSearchInitiated = false;
  myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
  }
  BillingType:string
  loggedInUser: CurrentUserViewModel;
  selType: string
  typeSelected: string
  claimsForm: FormGroup;
  PracticeBillingType:any='';
  constructor(private apiService: APIService,
    private chRef: ChangeDetectorRef,
    private GV: GvarsService,
    private router: Router,private gvService: GvarsService,private fb: FormBuilder) {
    this.batchFileErrorsList = [];
    this.providerSelectList = [];
    this.batchesSelectList = [];
    this.requestModel = new BatchErrorsRequestModel();
    this.requestModelexception = new  BatchExceptionRequestModel();
    this.claimsForm = this.fb.group({
      type: ['']
    });
  }

  ngOnInit() {
    if (this.providerSelectList.find(p => p.Name == 'All') == null) {
      this.providerSelectList.push(new SelectListViewModel(-1, 'All'));
    }
    this.requestModel.providerCode = -1;
    this.requestModelexception.providerCode = -1;
  
    this.loggedInUser = this.gvService.currentUser;
//     if(!Common.isNullOrEmpty(this.loggedInUser.selectedPractice.Billing_Type))
//       {
//         if (this.loggedInUser.selectedPractice.Billing_Type == "P&I") 
//           {
//             this.claimsForm.get('type').setValue('all');
//           }
//         else if (this.loggedInUser.selectedPractice.Billing_Type.toLocaleLowerCase() == "professional" || this.loggedInUser.selectedPractice.Billing_Type == null) 
//         {
//           this.claimsForm.get('type').setValue('professional');
//         } 
//         else
//         {
//           this.claimsForm.get('type').setValue('institutional');
//         }
//       }
// if(this.loggedInUser.selectedPractice.Billing_Type)
//   {
//     if(this.loggedInUser.selectedPractice.Billing_Type.toLowerCase() == "institutional")
//       {
//         this.selType = "I"
//         this.typeSelected = this.selType
//       }
//       else if(this.loggedInUser.selectedPractice.Billing_Type.toLowerCase() == "professional")
//       {
//         this.selType = "P"
//         this.typeSelected = this.selType
//       }
//       else if(this.loggedInUser.selectedPractice.Billing_Type.toLowerCase() == "p&i")
//         {
//           this.selType = "all"
//           this.typeSelected = this.selType
//         }
//       else
//       this.selType = "P"
//         this.typeSelected = this.selType
//   }

this.PracticeBillingType=this.loggedInUser.selectedPractice.Billing_Type.toLowerCase()
switch (this.PracticeBillingType) {
  case "p" :
    this.claimsForm.get('type').setValue('professional');
    this.BillingType = "P"
    this.selType = "P"
    this.typeSelected = this.selType
    break;
  case "i" :
    this.claimsForm.get('type').setValue('institutional');
    this.BillingType = "I"
    this.selType = "I"
    this.typeSelected = this.selType
    break;
  case "p&i" :
    this.claimsForm.get('type').setValue('all');
    this.BillingType = "all"
    this.selType = "all"
    this.typeSelected = this.selType
    break;
  case "null" :
    this.claimsForm.get('type').setValue('professional');
    this.BillingType = "P"
    this.selType = "P"
    this.typeSelected = this.selType
    break;
  case "institutional" :
    this.claimsForm.get('type').setValue('institutional');
    this.BillingType = "I"
    this.selType = "I"
    this.typeSelected = this.selType
    break;
  case "professional" :
    this.claimsForm.get('type').setValue('professional');
    this.BillingType = "P"
    this.selType = "P"
    this.typeSelected = this.selType
    break;
  default:
    this.claimsForm.get('type').setValue('professional');
    this.BillingType = "P"
    this.selType = "P"
    this.typeSelected = this.selType
}


    this.onTypeProvider();
  }
  onBillingTypeChange(selectedValue: string) {
    debugger
    if(selectedValue == "institutional")
    {
      this.typeSelected = "I"
    }
  else if(selectedValue == "professional")
    {
      this.typeSelected = "P"
    }
    else
    this.typeSelected = selectedValue
    this.onTypeBatch()
  }

  GetBatchFileErrors(): any {
    this.GetBatchExceptions()
    this.isSearchInitiated = true;
    this.apiService.PostData(`/Submission/GetBatchFileErrors`, { ...this.requestModel, practiceCode: this.GV.currentUser.selectedPractice.PracticeCode }, (response) => {
      if (response.Status == "Success") {
        if (this.dataTableErrors) {
          this.dataTableErrors.destroy();
        }
        this.batchFileErrorsList = response.Response.map(e => ({ ...e, ErrorsArray: e.Errors.split(';') }));
        this.chRef.detectChanges();
        const table: any = $('.dataTableErrors');
        this.dataTableErrors = table.DataTable({
          language: {
            emptyTable: "No data available"
          }
        });
      }
    });
  }
  GetBatchExceptions(): any {
    debugger
    this.isSearchInitiated = true;
    this.apiService.PostData(`/Submission/GetBatchExceptions`, { ...this.requestModelexception, practiceCode: this.GV.currentUser.selectedPractice.PracticeCode }, (response) => {
      debugger
      if (response.Status == "Success") {
        if (this.dataTableErrors) {
          this.dataTableErrors.destroy();
        }
        this.batchFileExceptionList = response.Response.map(e => ({ ...e, ErrorsArray: e.Errors.split(';') }));
        this.chRef.detectChanges();
        const table: any = $('.dataTableErrors');
        this.dataTableErrors = table.DataTable({
          language: {
            emptyTable: "No data available"
          }
        });
      }
    });
  }
  //#region ngx-select

  onTypeProvider() {
    if (!Common.isNullOrEmpty(this.subProviderSelectList)) {
      this.subProviderSelectList.unsubscribe();
    }
    this.subProviderSelectList =
      this.apiService
        .getDataWithoutSpinner(`/Demographic/GetProviderSelectList?practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}&all=${true}&searchText=${''}`).subscribe(
          res => {
            if (res.Status == "Success") {
              this.providerSelectList = res.Response;
              if (this.providerSelectList.find(p => p.Name == 'All') == null) {
                this.providerSelectList = [new SelectListViewModel(-1, 'All'), ...this.providerSelectList]
              }
              this.requestModel.providerCode = -1;
              this.onTypeBatch()
            }
          });
  }

  onTypeBatch(e?: any) {
    if (!Common.isNullOrEmpty(this.subBatchSelectList)) {
      this.subBatchSelectList.unsubscribe();
    }
    this.requestModel.batch_type = this.typeSelected ? this.typeSelected :this.selType;
    this.subBatchSelectList =
      this.apiService.getDataWithoutSpinner(`/Submission/GetPendingBatchSelectListErrorCom?practiceCode=${this.GV.currentUser.selectedPractice.PracticeCode}&providerCode=${this.requestModel.providerCode}&practype=${this.requestModel.batch_type}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.batchesSelectList = res.Response;
          }
        });
  }

  resetBatchSelectList() {
    this.batchesSelectList = [];
    this.batchSelectControl.reset();
  }
  //#endregion

  onDateRangeChanged(event: IMyDateRangeModel) {
    this.requestModel.dateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format("MM/DD/YYYY");
    this.requestModel.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format("MM/DD/YYYY");
  }

  editClaim(claimNo, patientAccount, firstName, lastName) {
    this.router.navigate(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: patientAccount,
        claimNo: claimNo,
        disableForm: false,
        PatientLastName: lastName,
        PatientFirstName: firstName
      }))]);
  }

}
