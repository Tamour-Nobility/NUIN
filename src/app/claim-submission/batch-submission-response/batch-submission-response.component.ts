import { Component, OnInit, ChangeDetectorRef, ViewChild,AfterViewInit  } from '@angular/core';
import { BatchesHistoryResponseModel, BatchesHistoryRequestModel, BatchDetails } from '../models/claims-submission.model';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { CSIBatchUploadRequest,CSIClaimBatchUploadRequest } from '../../models/common/dateRange.model';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { IMyDpOptions } from 'mydatepicker';
import { Common } from '../../services/common/common';
import { Subscription } from 'rxjs';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrentUserViewModel } from '../../models/auth/auth';
import * as JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
declare var $: any;

@Component({
  selector: 'app-batch-submission-response',
  templateUrl: './batch-submission-response.component.html',
  styleUrls: ['./batch-submission-response.component.css']
})
export class BatchSubmissionResponseComponent implements AfterViewInit , OnInit {
  dataTableBatchResponse: any;
  requestModel: BatchesHistoryRequestModel;
  batchResponseList: BatchesHistoryResponseModel[];       
  batchDetailsList: BatchDetails[];
  subProviderSelectList: Subscription;
  providerSelectList: SelectListViewModel[];
  isSearchInitiated = false;
  isExpanded: boolean = false;
  Response277:any="";
  Status277:boolean=false;
  isPrintable: boolean = false;
  PracticeBillingType:any='';
  dateRangeTypes = [
    { id: 'created_date', label: 'Creation Date' },
    { id: 'uploaded_date', label: 'Uploaded Date' }
  ];
  myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%', componentDisabled: true
  }
  CSIBatchUploadRequest: CSIBatchUploadRequest;
  CSIClaimBatchUploadRequest: CSIClaimBatchUploadRequest;
  @ViewChild(ModalDirective) modalWindow: ModalDirective;
  errorTitle: String = "Batch Claim Errors";
  errorDescription: String;
  errors: any;
  confirmation: boolean = false;
  selectedBatchId: number = null;
  errorStatus: string = "";
  firstStcSegment:any="";
  loggedInUser: CurrentUserViewModel
  claimsForm: FormGroup
  claimsForm1: FormGroup
  BillingType:string
  selType: string
  typeSelected: string
  submissionType: string
  StcCategoryDescription:any="";
  stcStatusCategoryDescription:any="";
  STCStatus:any="";
  expandedRowIndex: number | null = null;
  STCDescription:any="";
  StcEntitySegments="";
  DTPDates="";
  EnteredBy:any="";
  dataTable1="";
  StcStatusDescription:any="";
  EDIHistory: any[] = [];
  currentSegmentType: 'SVC' | 'STC' | 'DTP' = 'SVC'; 

  filteredBatchList = []; // List after filtering by search
  pageSize: number = 10;  // Set page size for pagination
  currentPage: number = 1; // Current page

  pageSizeOptions: number[] = [10, 25, 50,100]; // Options for page size

  searchTerm: string = '';

  constructor(private _apiService: APIService,
    private chRef: ChangeDetectorRef,
    private _gv: GvarsService,
    public apiService: APIService,
    private toastService: ToastrService,private gvService: GvarsService , private fb: FormBuilder,private toast: ToastrService,) {
    this.batchResponseList = [];
    this.providerSelectList = [];
    this.requestModel = new BatchesHistoryRequestModel();
    this.CSIBatchUploadRequest = new CSIBatchUploadRequest();
    this.CSIClaimBatchUploadRequest = new CSIClaimBatchUploadRequest();
    this.filteredBatchList = this.batchResponseList;
    this.claimsForm = this.fb.group({
      type: ['']
    });
    this.claimsForm1 = this.fb.group({
      type: ['']
    });
  }

  ngOnInit() {
    debugger
    this.loggedInUser = this.gvService.currentUser;
    this.claimsForm1.get('type').setValue('electronic');
    // if(!Common.isNullOrEmpty(this.loggedInUser.selectedPractice.Billing_Type))
    //   {
    //     if (this.loggedInUser.selectedPractice.Billing_Type.toLocaleLowerCase() == "p&i") 
    //       {
    //         this.claimsForm.get('type').setValue('all');
    //       }
    //     else if (this.loggedInUser.selectedPractice.Billing_Type.toLocaleLowerCase() == "professional" || this.loggedInUser.selectedPractice.Billing_Type == null) 
    //     {
    //       this.claimsForm.get('type').setValue('professional');
    //     } 
    //     else
    //     {
    //       this.claimsForm.get('type').setValue('institutional');
    //     }
    //   }
    this.submissionType = this.claimsForm1.get('type').value;
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
    this.onTypeProvider();
  }
  ngAfterViewInit(): void {
    // jQuery manipulation goes here
    $('.dataTableBatchResponse').css('property', 'value');
}

onSearch(): void {
  const searchTermLower = this.searchTerm ? this.searchTerm.toLowerCase() : '';

  this.filteredBatchList = this.batchResponseList.filter(response => {
    return Object.values(response).some(value => {
      // Convert value to string and do a case-insensitive check
      return value && value.toString().toLowerCase().includes(searchTermLower);
    });
  });
  

  this.currentPage = 1; // Reset to the first page on search
}

  onBillingTypeChange(selectedValue: string) {
    debugger
    if(selectedValue == "institutional")
    {
      this.typeSelected = "I"
      this.selType = this.typeSelected
    }
  else if(selectedValue == "professional")
    {
      this.typeSelected = "P"
      this.selType = this.typeSelected
    }
    else
    {
      this.typeSelected = selectedValue
      this.selType = this.typeSelected
    }
  }

  UploadCSIBatch(batchId){
    this.CSIBatchUploadRequest.BatcheIds=[]
    this.CSIBatchUploadRequest.BatcheIds.push(batchId);
    this._apiService.PostData(`/RealTimeClaimStatus/UploadBatches276`, this.CSIBatchUploadRequest, (res) => {
      if (res.Status == "Success") {
        debugger
        this.GetBatchResponseList();
        if (res.Response.Type == 1) {
          this.GetBatchResponseList();
          swal('Batch upload', res.Response.Message, 'success');
        } else if (res.Response.Type == 2) {
          this.GetBatchResponseList();
          swal('Batch upload', res.Response.Message, 'warning');
        } else if (res.Response.Type == 3) {
          this.GetBatchResponseList();
          swal('Batch upload', res.Response.Message, 'info');
        }
      } else {
        this.GetBatchResponseList();
        swal('Batch upload', res.Response, 'error');

      }
      //this.GetBatchesDetail();
    })
  }

  toggleRow(index: number) {
    console.log("id ",index)
    if (this.expandedRowIndex === index) {
      this.expandedRowIndex = null; // Collapse if the same row is clicked again
    } else {
      this.expandedRowIndex = index; // Expand the clicked row
    }
  }

  isRowExpanded(index: number): boolean {
    return this.expandedRowIndex === index;
  }

  closeCSIModel(){
    $('#exampleModal').modal('hide');
    this.Status277=false;
}

  UploadCSIClaim(claimId,insurance_Id,batch_id){
    this.CSIClaimBatchUploadRequest.BatcheIds=[]
    this.CSIClaimBatchUploadRequest.BatcheIds.push(batch_id);
    this.CSIClaimBatchUploadRequest.ClaimNo=claimId;
    this.CSIClaimBatchUploadRequest.InsuranceId=insurance_Id;
    this._apiService.PostData(`/RealTimeClaimStatus/SingleClaimUploadBatches276`, this.CSIClaimBatchUploadRequest, (res) => {
      this.GetBatchDetailsList(batch_id);
      if (res.Status == "Success") {
        this.GetBatchDetailsList(batch_id);
        if (res.Response.Type == 1) {
          this.GetBatchDetailsList(batch_id);
          swal('Batch upload', res.Response.Message, 'success');
        } else if (res.Response.Type == 2) {
          this.GetBatchDetailsList(batch_id);
          swal('Batch upload', res.Response.Message, 'warning');
        } else if (res.Response.Type == 3) {
          this.GetBatchDetailsList(batch_id);
          swal('Batch upload', res.Response.Message, 'info');
        }
        else if (res.Response.Type == 4) {
          this.GetBatchDetailsList(batch_id);
          swal('Batch upload', 'CSI request in already in process', 'info');
        }
      } else {
        this.GetBatchDetailsList(batch_id);
        swal('Batch upload', res.Response, 'error');
        
      }
      //this.GetBatchesDetail();
    })
  }

  updatePagination(pageSize) {
    this.pageSize=pageSize
  }
  

  GetBatchResponseList() {
    this.isSearchInitiated = true;
    if (!this.requestModel.Date_From || !this.requestModel.Date_To)
      this.requestModel.Date_Type = null;
    this.requestModel.Prac_type = this.typeSelected;
    this.requestModel.Sub_type = this.submissionType;
  
    this._apiService.PostData('/Submission/GetBatchesHistory', { 
      ...this.requestModel, 
      Practice_Code: this._gv.currentUser.selectedPractice.PracticeCode 
    }, (res) => {
      console.log('API Response:', res);  // Log the response to check the structure
  
      this.batchResponseList = [];
      if (res.Status === "Success") {
        this.batchResponseList = res.Response.map(r => {
          switch (r.Batch_Status999) {
            case "A":
              r.Batch_Status999 = "Accepted";
              break;
            case "E":
              r.Batch_Status999 = "Partially accepted";
              break;
            case "M":
              r.Batch_Status999 = "Rejected";
              break;
            // Handle other cases as necessary
            default:
              r.Batch_Status999;
          }
  
          // Handle the provider name
          if (!r.Provider_Code) {
            r.Provider_Name = 'All';
          } else {
            r.Provider_Name = r.Provid_FName + ', ' + r.Provid_LName;
          }
          return r;
        });
        console.log('Processed Batch Response:', this.batchResponseList);  // Log to ensure processing is done correctly
        this.filteredBatchList = this.batchResponseList;
      }
    });
  }
  
  

  GetBatchDetailsList(Batch_Id: any) {
    debugger
    this.isExpanded = !this.isExpanded;
    //if (Batch_Id && this.isExpanded) { //..this condition is updated below by muhammad abbas edi also added this.batchDetailsList=[]; this line aswell
      if (Batch_Id) {
        this.batchDetailsList=[];
      this._apiService.getData('/Submission/GetBatcheDetalis?batchId=' + Batch_Id).subscribe(
        res => {
          if (res.Status == 'Success') {
            this.batchDetailsList = res.Response;
            this.STCStatus = res.STCStatus;
          }
          else {
            swal('Error', res.Status, 'error');
          }
        }
      )
    }
  }

  extractSVCSegments(segments: string[], dtpDates: string[]) {
    const svcSegments = segments.filter(segment => segment.startsWith('SVC'));
    // const stcSegments = segments.filter(segment => segment.startsWith('STC'));
    // const dtpSegments = segments.filter(segment => segment.startsWith('DTP'));

    this.EDIHistory = [];

    if (this.currentSegmentType === 'SVC') {
        let stcCodes: string[] = [];
        let codeCategories: string[] = [];
        
        svcSegments.forEach((segment, index) => {
            const parts = segment.split('*');
            const svcData: any = {
                procedureCode: parts[1] ? parts[1].split(':')[1] : 'N/A',
                totalCharge: parts[2] || '0',
                allowedAmount: parts[4] || '0',
                paidAmount: parts[3] || '0',
                patientResponsibility: parts[5] || '0',
                deniedAmount: parts[6] || '0',
                stcCode: 'N/A',     
                codeCategory: 'N/A', 
                serviceDate: dtpDates[index] || 'N/A'
            };

            stcCodes = [];
            codeCategories = [];

            let nextSVCIndex = segments.indexOf(segment) + 1;

            while (nextSVCIndex < segments.length && !segments[nextSVCIndex].startsWith('SVC')) {
                const nextSegment = segments[nextSVCIndex];
                if (nextSegment.startsWith('STC')) {
                    const stcParts = nextSegment.split('*');
                    if (stcParts.length > 1) {
                        const stcCode = stcParts[1].split(':')[0];
                        const codeCategory = stcParts[1].split(':')[1] || 'N/A';

                        stcCodes.push(stcCode);
                        codeCategories.push(codeCategory);
                    }
                }
                nextSVCIndex++;
            }

            svcData.stcCode = stcCodes.join(', ');
            svcData.codeCategory = codeCategories.join(', ');

            this.EDIHistory.push({ ...svcData, type: 'SVC' });
            this.chRef.detectChanges();
        });

        if ($.fn.DataTable.isDataTable('.dataTable1')) {
            $('.dataTable1').DataTable().destroy();
        }

        this.dataTable1 = $('.dataTable1').DataTable({
            columnDefs: [
                {
                    type: 'date',
                },
                {
                    orderable: false, targets: -1
                }
            ],
            language: {
                emptyTable: "No data available"
            }
        });
        this.chRef.detectChanges();
    }
}

  GetCSIClaimResponse(Batch_Id: any,Claim_Id:any) {
    debugger
      this._apiService.getData('/Submission/GetCSIBatcheDetalis?batchId=' + Batch_Id + '&claimId=' + Claim_Id).subscribe(
        res => {
          
          console.log("GetCSIClaimResponse",res)
          if (res.Status == 'Success') {
            const segments = res.Response[0].Response_String_277.split('~');

            this.StcCategoryDescription=res.StcCategoryDescription
            this.stcStatusCategoryDescription = res.stcStatusCategoryDescription;
            this.STCDescription = res.STCDescription;
            this.STCStatus = res.STCStatus;
            this.StcEntitySegments = res.StcEntitySegments;
            this.DTPDates = res.DTPDates;
            this.EnteredBy =res.Response[0].UName;
            this.StcStatusDescription =res.StcStatusDescription;
            const dtpDatesArray = this.DTPDates.split(',').map(date => date.trim());
            this.extractSVCSegments(segments, dtpDatesArray);




            let firstStcSegment = null;
            const resultObject = {};
            segments.forEach(segment => {
              const parts = segment.split('*');
              if (parts.length > 1) {
                  const key = parts[0] + parts[1].replace(/:/g, '_');
                  const value = segment;
                  resultObject[key] = value;
                  if (parts[0] === 'STC' && firstStcSegment === null) {
                      firstStcSegment = segment;
                  }
              }
          });
          this.Response277 = resultObject;
          this.firstStcSegment = firstStcSegment;

          console.log("this.firstStcSegment",this.firstStcSegment)
          console.log("this.Response277",this.Response277)
          this.Status277 = true;
          $('#exampleModal').modal('show');
          }
          else {
            swal('Error', res.Status, 'error');
          }
        }
      )
  }

  formatDate(dateString: string): string {
    var year1 ='0000';
        var month1 = '00';
        var day1 = '00';

    if(dateString !=undefined || dateString !=null){
        if (dateString.length !== 8) return 'N/A'; // Check if the date string is valid

        var year = dateString.slice(0, 4);
        var month = dateString.slice(4, 6);
        var day = dateString.slice(6, 8);
    
        return `${month}/${day}/${year}`; 
    }
    return `${month1}/${day1}/${year1}`;
    
  }

  onTypeProvider() {
    if (!Common.isNullOrEmpty(this.subProviderSelectList)) {
      this.subProviderSelectList.unsubscribe();
    }
    this.subProviderSelectList =
      this._apiService
        .getDataWithoutSpinner(`/Demographic/GetProviderSelectList?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}&all=${true}&searchText=${''}`).subscribe(
          res => {
            if (res.Status == "Success") {
              this.providerSelectList = res.Response;
              if (this.providerSelectList.find(p => p.Name == 'All') == null) {
                this.providerSelectList = [new SelectListViewModel(-1, 'All'), ...this.providerSelectList]
              }
              this.requestModel.Provider_Code = -1;
            }
          });
  }

  onDateRangeChanged(event: IMyDateRangeModel) {
    this.requestModel.Date_From = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format("MM/DD/YYYY");
    this.requestModel.Date_To = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format("MM/DD/YYYY");
  }

  onDownload(batchId, batchName) {
    this._apiService.downloadFile(`/Submission/DownloadEDIFile?batchId=${batchId}`).subscribe(response => {
      let blob: any = new Blob([response], { type: 'text/plain; charset=utf-8' });
      saveAs(blob, `${batchName}.txt`);
    }), error => {
      console.info('File download error');
    },
      () => console.info('File downloaded successfully');
  }

  onRegenerate(batchId) {
    this.errors = [];
    this.errorStatus = "";
    this.errorDescription = "";
    this.modalWindow.hide();
    this.selectedBatchId = batchId;
    this._apiService.PostData(`/Submission/RegenerateBatchFile`, {
      Practice_Code: this._gv.currentUser.selectedPractice.PracticeCode,
      Batch_Id: batchId,
      Confirmation: this.confirmation
    }, (response => {
      this.confirmation = false;
      this.errorStatus = response.Status;
      if (response.Status === '1') {
        // Some claims has errors, User confirmation is required to process perfect claims
        this.errorDescription = 'Batch has errors in following claims, do you want regenerate?';
        this.errors = response.Response;
        this.modalWindow.show();
      } else if (response.Status === '2') {
        // All claims has errors, Can't regenerate and upload batch
        this.errorDescription = "Batch has errors in all claims. Batch file can't be regenerated.";
        this.errors = response.Response;
        this.modalWindow.show();
      } else if (response.Status === '3') {
        // No valid claim to regenerate and upload batch
        swal(this.errorTitle, "No valid claim in batch, batch file can't be regenerated.", 'error');
      }
      else if (response.Status === 'success') {
        // File regenerated and uploaded to FTP
        swal("Batch File Regenerated", "File regeneration has been completed successfully", 'success');
      } else if (response.Status === '4') {
        // Claims has errors while creating file
        swal(this.errorTitle, response.Response, 'error');
      }
      else if (response.Status === 'error') {
        swal('Error', response.Response)
      }
    }))
  }
  regeneratePrint(batchId = null,Batch_Name: string) {
debugger
   
      this.isPrintable = true;
    
      this.isPrintable = false;
      let batchid  = batchId;
      this.apiService.downloadFile(`/hcfa/GenerateBatchHcfa?batchIds=${batchId}&isPrintable=${this.isPrintable}&insuranceType=P`)
        .subscribe(async (response: any) => {

          await this.handleBatchPrintResponse(response, Batch_Name);
        }, error => {
          debugger
          console.error(`Error printing batch ID ${batchId}:`, error);
          swal("Error", `Failed to print batch ID ${batchId}`, "error");
        });

  }
  async handleBatchPrintResponse(response: Blob, batchName: string) {
    debugger
    if (response.type === 'application/zip' || response.type === 'application/pdf') {
      const mergedPdf = await PDFDocument.create();
    
      if (response.type === 'application/zip') {
        const zip = new JSZip();
        const arrayBuffer = await new Response(response).arrayBuffer();
        const unzipped = await zip.loadAsync(arrayBuffer);
        const fileEntries = Object.entries(unzipped.files);
    
        for (const [fileName, file] of fileEntries) {
          if (!fileName.toLowerCase().endsWith('.pdf')) continue;
    
          const fileData = await file.async('uint8array');
          const sourcePdf = await PDFDocument.load(fileData);
          const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        }
      } else if (response.type === 'application/pdf') {
        const arrayBuffer = await new Response(response).arrayBuffer();
        const sourcePdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
    
      //Generate merged PDF blob and open it
      const mergedPdfBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(mergedBlob);
    
      const printWindow = window.open(fileUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
    }
    else
    this.toast.warning(`No record found for batch ID: ${batchName}`);
    //this code is working for the zipped file not for single
      if (response.type === 'application/zip' || response.type === 'application/pdf') {
        const zip = new JSZip();
        const arrayBuffer = await new Response(response).arrayBuffer();
        const unzipped = await zip.loadAsync(arrayBuffer);
        const fileEntries = Object.entries(unzipped.files);
  
        const mergedPdf = await PDFDocument.create();
  
        for (const [fileName, file] of fileEntries) {
          if (!fileName.toLowerCase().endsWith('.pdf')) continue;
  
          const fileData = await file.async('uint8array');
          const sourcePdf = await PDFDocument.load(fileData);
          const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
  
          copiedPages.forEach(page => mergedPdf.addPage(page));
        }
  
        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(mergedBlob);
  
        const printWindow = window.open(fileUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        }
      }
     
    }

  show() {
    this.modalWindow.show();
  }

  hide() {
    this.modalWindow.hide();
  }

  onConfirm() {
    this.confirmation = true;
    this.onRegenerate(this.selectedBatchId);
  }

  onChangeDateType() {
    if (this.requestModel.Date_Type === null) {
      this.myDateRangePickerOptions = { ...this.myDateRangePickerOptions, componentDisabled: true };
      this.requestModel.Date_To = null;
      this.requestModel.Date_From = null;
    } else {
      this.myDateRangePickerOptions = { ...this.myDateRangePickerOptions, componentDisabled: false };
    }
  }
  onSubmissionTypeChange(selectedValue: string) {
    debugger
    if(selectedValue == "electronic")
    {
      this.submissionType = "electronic"
    }
  else if(selectedValue == "paper")
    {
      this.submissionType = "paper"
    }
    else
    {
      this.submissionType = "electronic"
    }
    console.log("submissionType",this.submissionType)
  }
}