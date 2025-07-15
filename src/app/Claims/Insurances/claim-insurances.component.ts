import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Insurancemodel, PatientInsuranceResponse, claimInusrance } from '../../Claims/Classes/ClaimsModel'
import { APIService } from '../../components/services/api.service';
import { insuranceResponseModel, insuranceSearchModel } from '../../Claims/Classes/InsuranceModel'
import { DatePipe } from '@angular/common'
import 'datatables.net'
import { SelectListViewModel } from '../../models/common/selectList.model';
import { GuarantorComponent } from '../../setups/Guarantor/guarantor.component';
import { ModalWindow } from '../../shared/modal-window/modal-window.component';
import { ListGuarantorsSharedComponent } from '../../shared/guarantors/list-guarantors-shared/list-guarantors-shared.component';
import { AddEditGuarantorSharedComponent } from '../../shared/guarantors/add-edit-guarantor-shared/add-edit-guarantor-shared.component';
import { Common } from '../../services/common/common';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { InsuranceSearchComponent } from '../../shared/insurance-search/insurance-search.component';
import { Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BatchSubmissionResponseComponent } from '../../../app/claim-submission/batch-submission-response/batch-submission-response.component';
import { CSIClaimBatchUploadRequest } from '../../models/common/dateRange.model';
import { BatchDetails } from '../../../app/claim-submission/models/claims-submission.model';
declare var $: any

@Component({
    selector: 'app-claim-insurances',
    templateUrl: './claim-insurances.component.html',
    styleUrls: ['./claim-insurances.component.css'],
})
export class ClaimInsurancesComponent implements OnInit {
    stringres: any = ""
    isInsExpand: boolean = false;
    dataTable: any;
    tempVariable: string = "";
    insSearchResponse: insuranceResponseModel;
    claimInsuranceModel: Insurancemodel[];
    showInsuranceNamePopup: boolean = false;
    claimInsurances: claimInusrance[];
    selectedInsName: number;
    InsuranceNames: any = [];
    nameData: any;
    CSIButton: boolean = false;
    isMedicare: boolean = false;
    batchID: number;
    claimNo: number;
    insuranceid: number;
    getUpdatedCSI: boolean = false;
    CSIClaimBatchUploadRequest: CSIClaimBatchUploadRequest;
    isExpanded: boolean = false;
    batchDetailsList: BatchDetails[];
    CSIbuttonColor: any = 'grey';
    CSINonParAccess_CSIParPayer: boolean = false;
    CSIEnrollmentRequired: boolean = false;
    EnrollmentCompleted: any;
    Status277: boolean = false;
    Status999: boolean = false;
    Response277: any = "";
    Response999: any = "";
    Response277_999: any = ""
    STCDescription: any = ""
    STCStatus: any = ""
    firstStcSegment = ""
    STC = ""
    DTPDates = ""
    EnteredBy: any = ""
    dataTable1 = ""
    stcStatusCategoryDescription: any = ""
    StcEntitySegments = ""
    StcStatusDescription: any = ""
    EDIHistory: any[] = [];
    StcCategoryDescription: any = ""
    currentSegmentType: 'SVC' | 'STC' | 'DTP' = 'SVC';
    segments: string[] = [];
    page: number = 1;
    itemsPerPage: number = 5;
    PatientInsuranceResponse: PatientInsuranceResponse[];
    currentInsuranceNumber: number;
    relationsList: SelectListViewModel[];
    changeInsurenceItem: any = ["1", "2", "3"];
    changesofInsurance = false
    changeInsuranceNumber: any = [];
    @ViewChild('insuranceSearch') insuranceModal: ModalWindow;
    @ViewChild('guarantorModalWindow') guarantorModal: ModalWindow;
    @ViewChild(AddEditGuarantorSharedComponent) guarantorAddEdit: AddEditGuarantorSharedComponent;
    @ViewChild(ListGuarantorsSharedComponent) guarantorList: ListGuarantorsSharedComponent;
    @ViewChild(InsuranceSearchComponent) ins: InsuranceSearchComponent;
    @ViewChild(BatchSubmissionResponseComponent) BatchSubmissionChild;
    guarantorModalWindowProp: any;
    addGuarantor: boolean;
    eligiblityBtnColor: string = 'Grey';
    isTableVisible: boolean = false
    clickButtonColor: any
    @Input() patAccount: any;
    @Input() providerCode: any;
    @Output() newItemEvent = new EventEmitter<any>()
    @Output() InsEvent = new EventEmitter<any>()
    newInsurances: boolean;
    CPTTable: any;
    isViewMode: boolean = false;
    isNewClaim: boolean;
    constructor(
        public route: ActivatedRoute, private toaster: ToastrService, private gvService: GvarsService,
        private cd: ChangeDetectorRef,
        private API: APIService,
        private datePipe: DatePipe,
        private _gv: GvarsService, private _apiService: APIService,) {
        this.insSearchResponse = new insuranceResponseModel;
        this.claimInsuranceModel = [];
        this.PatientInsuranceResponse = [];
        this.CSIClaimBatchUploadRequest = new CSIClaimBatchUploadRequest();
        this.claimInsurances = [];
        this.relationsList = [];
        this.BatchSubmissionChild = BatchSubmissionResponseComponent;
    }
    ngOnInit() {
        this.getPatientInsurances();
        this.getRelations();
    }

    checkmedicare(claimno: number, insuranceid: number, callback: () => void) {
        this.API.getData('/submission/CheckMedicareClaim?claimId=' + claimno + '&insurance_id=' + insuranceid)
            .subscribe(res => {
                if (res.Status === "Success") {
                    this.isMedicare = res.Response.Medicare_Claim;
                    this.batchID = res.Response.batch_id;
                    callback(); // continue after values are set
                } else {
                    swal("Medicare claims", res.Status, "error");
                }
            });
    }
    onAction() {
        this.getUpdatedCSI = true;
        this.UploadCSIClaim(this.claimNo, this.insuranceid, this.batchID)
    }
    UploadCSIClaim(claimId, insurance_Id, batch_id) {
        debugger
        this.CSIClaimBatchUploadRequest.BatcheIds = []
        this.CSIClaimBatchUploadRequest.BatcheIds.push(batch_id);
        this.CSIClaimBatchUploadRequest.ClaimNo = claimId;
        this.CSIClaimBatchUploadRequest.InsuranceId = insurance_Id;
        this._apiService.PostData(`/RealTimeClaimStatus/SingleClaimUploadBatches276?getUpdatedCSI=${this.getUpdatedCSI}`, this.CSIClaimBatchUploadRequest, (res) => {
            //this.GetBatchDetailsList(batch_id);
            if (res.Status == "Success") {
                //this.GetBatchDetailsList(batch_id);
                if (res.Response.Type == 1) {
                    //this.GetBatchDetailsList(batch_id);
                    this.CSIButton=false
                
                    swal('Batch upload', res.Response.Message, 'success');
                    this.cd.detectChanges();
                } else if (res.Response.Type == 2) {
                    //this.GetBatchDetailsList(batch_id);
                    swal('Batch upload', res.Response.Message, 'warning');
                } else if (res.Response.Type == 3) {
                    //this.GetBatchDetailsList(batch_id);
                    swal('Batch upload', res.Response.Message, 'info');
                }
                else if (res.Response.Type == 4) {
                    this.GetBatchDetailsList(batch_id);
                    swal('Batch upload', 'CSI request in already in process', 'info');
                  }
            } else {
                //this.GetBatchDetailsList(batch_id);
                this.clickButtonColor=insurance_Id;
                this.CSIbuttonColor='red'
                let errorMessage = '';
                $('#exampleModal').modal('hide');

if (typeof res.Response === 'string') {
  errorMessage = res.Response;
} else if (res.Response && typeof res.Response === 'object') {
  errorMessage = res.Response.Message || JSON.stringify(res.Response);
} else {
  errorMessage = 'An unexpected error occurred.';
}

swal('Failed', 'Request failed! Please request again', 'error');
                //swal('Batch upload', res.Response?.Message || JSON.stringify(res.Response), 'error');
                this.cd.detectChanges();

            }
            //this.GetBatchesDetail();
        })
    }
    GetBatchDetailsList(Batch_Id: any) {
        debugger
        this.isExpanded = !this.isExpanded;
        //if (Batch_Id && this.isExpanded) { //..this condition is updated below by muhammad abbas edi also added this.batchDetailsList=[]; this line aswell
        if (Batch_Id) {
            this.batchDetailsList = [];
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

    GetCSIClaimResponse(Batch_Id: any, Claim_Id: any) {
        debugger
        this._apiService.getData('/Submission/GetCSIBatcheDetalis?batchId=' + Batch_Id + '&claimId=' + Claim_Id).subscribe(
            res => {

                console.log("GetCSIClaimResponse", res)
                if (res.Status == 'Success') {
                    const segments = res.Response[0].Response_String_277.split('~');

                    this.StcCategoryDescription = res.StcCategoryDescription
                    this.stcStatusCategoryDescription = res.stcStatusCategoryDescription;
                    this.STCDescription = res.STCDescription;
                    this.STCStatus = res.STCStatus;
                    this.StcEntitySegments = res.StcEntitySegments;
                    this.DTPDates = res.DTPDates;
                    this.EnteredBy = res.Response[0].UName;
                    this.StcStatusDescription = res.StcStatusDescription;
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

                    console.log("this.firstStcSegment", this.firstStcSegment)
                    console.log("this.Response277", this.Response277)
                    this.Status277 = true;
                    $('#exampleModal').modal('show');
                    this.CSIbuttonColor = 'grey'
                    this.cd.detectChanges();
                }
                else {
                    swal('Error', res.Status, 'error');
                }
            }
        )
    }
    Get277Response(p) {

        if(this.CSIbuttonColor == 'red')
        {
            this.CSIbuttonColor = 'grey'
            this.cd.detectChanges();
        }
        this.checkmedicare(p.claimInsurance.Claim_No, p.claimInsurance.Insurance_Id, () => {
            this.claimNo = p.claimInsurance.Claim_No;
            this.insuranceid = p.claimInsurance.Insurance_Id;
            if (this.isMedicare == true && (this.batchID)) {
                this._apiService.getData('/Submission/GetCSIBatcheResponseDetalis?batchId=' + this.batchID + '&claimId=' + p.claimInsurance.Claim_No).subscribe(
                    res => {
                        if (res.Status == 'Success') {
                            if (!Common.isNullOrEmpty(res.Response) && (!Common.isNullOrEmpty(res.Response.Response_String_277))) {
                                    this.GetCSIClaimResponse(this.batchID, p.claimInsurance.Claim_No)
                            }
                            else if (!Common.isNullOrEmpty(res.Response) && res.Response.Status_277 == 'Pending') {
                                    swal('info', 'CSI request is already in process', 'info');
                            }
                            else {
                                this.UploadCSIClaim(p.claimInsurance.Claim_No, p.claimInsurance.Insurance_Id, this.batchID)
                            }
                        }
                    }
                )
            }
            else if (this.isMedicare == true && (Common.isNullOrEmpty(this.batchID))) {
                swal('Error', 'Requested Claim batch is not submitted', 'error');
            }
            else {
                this.clickButtonColor = p.claimInsurance.Insurance_Id

                this.Response277_999 = "";
                this.Response999 = "";
                this.Response277 = "";
                this.CSIbuttonColor = 'grey'

                if (this.CSIButton) {
                    if (!this.CSINonParAccess_CSIParPayer) {
                        if (this.CSIEnrollmentRequired == false) {
                            this.API.PostData(
                                '/RealTimeClaimStatus/GenerateBatch276?' +
                                'practice_id=' + this._gv.currentUser.selectedPractice.PracticeCode +
                                '&claim_id=' + this.claimInsuranceModel[0].claimInsurance.Claim_No +
                                '&Insurance_Id=' + this.clickButtonColor +
                                '&unique_name=' + this.gvService.currentUser.unique_name,
                                '',
                                (res) => {
                                    this.stringres = res.ErrorMessage
                                    if (res.ErrorMessage === "Success") {
                                        const segments = res.Transaction277.split('~');
                                        this.StcCategoryDescription = res.StcCategoryDescription
                                        this.stcStatusCategoryDescription = res.stcStatusCategoryDescription;
                                        this.STCDescription = res.STCDescription;
                                        this.STCStatus = res.STCStatus;
                                        this.StcEntitySegments = res.StcEntitySegments;
                                        this.DTPDates = res.DTPDates;
                                        this.EnteredBy = res.EnteredBy;
                                        this.StcStatusDescription = res.StcStatusDescription;
                                        const dtpDatesArray = this.DTPDates.split(',').map(date => date.trim());
                                        this.extractSVCSegments(segments, dtpDatesArray);
                                        const resultObject = {};
                                        let firstStcSegment = null;
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

                                        this.Response277_999 = resultObject;
                                        this.Response277 = resultObject;

                                        this.firstStcSegment = firstStcSegment;

                                        if (this.Response277_999.ST999) {
                                            this.Response999 = this.Response277_999;
                                            this.CSIbuttonColor = 'red'
                                            this.Status999 = true;
                                            // $('#exampleModal').modal('show');
                                            swal('Failed', 'Transaction cannot be completed', 'error');
                                        }

                                        if (this.Response277_999.ST277) {
                                            this.Response277 = this.Response277_999;
                                            this.Status277 = true;
                                            this.CSIbuttonColor = 'green'
                                            this.isTableVisible = true
                                            $('#exampleModal').modal('show');
                                        }

                                        console.log("this.Response999", this.Response999);
                                        console.log("this.Response277", this.Response277);
                                    }
                                    else {
                                        swal('Failed', this.stringres, 'error');
                                        // $('#exampleModal').modal('show');
                                    }
                                }
                            );
                        } else {
                            if (this.CSIEnrollmentRequired == true && this.EnrollmentCompleted == 1) {
                                this.API.PostData(
                                    '/RealTimeClaimStatus/GenerateBatch276?' +
                                    'practice_id=' + this._gv.currentUser.selectedPractice.PracticeCode +
                                    '&claim_id=' + this.claimInsuranceModel[0].claimInsurance.Claim_No +
                                    '&Insurance_Id=' + this.clickButtonColor +
                                    '&unique_name=' + this.gvService.currentUser.unique_name,
                                    '',
                                    (res) => {
                                        this.stringres = res.ErrorMessage
                                        if (res.ErrorMessage === "Success") {
                                            const segments = res.Transaction277.split('~');
                                            this.StcCategoryDescription = res.StcCategoryDescription
                                            this.stcStatusCategoryDescription = res.stcStatusCategoryDescription;
                                            this.STCDescription = res.STCDescription;
                                            this.STCStatus = res.STCStatus;
                                            this.StcEntitySegments = res.StcEntitySegments;
                                            this.DTPDates = res.DTPDates;
                                            this.EnteredBy = res.EnteredBy;
                                            this.StcStatusDescription = res.StcStatusDescription;
                                            const dtpDatesArray = this.DTPDates.split(',').map(date => date.trim());
                                            this.extractSVCSegments(segments, dtpDatesArray);
                                            const resultObject = {};
                                            let firstStcSegment = null;
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

                                            this.Response277_999 = resultObject;
                                            this.Response277 = resultObject;

                                            this.firstStcSegment = firstStcSegment;

                                            if (this.Response277_999.ST999) {
                                                this.Response999 = this.Response277_999;
                                                this.CSIbuttonColor = 'red'
                                                this.Status999 = true;
                                                // $('#exampleModal').modal('show');
                                                swal('Failed', 'Transaction cannot be completed', 'error');
                                            }

                                            if (this.Response277_999.ST277) {
                                                this.Response277 = this.Response277_999;
                                                this.Status277 = true;
                                                this.CSIbuttonColor = 'green'
                                                this.isTableVisible = true
                                                $('#exampleModal').modal('show');
                                            }

                                            console.log("this.Response999", this.Response999);
                                            console.log("this.Response277", this.Response277);
                                        }
                                        else {
                                            swal('Failed', this.stringres, 'error');
                                            // $('#exampleModal').modal('show');
                                        }
                                    }
                                );
                            }
                            else {
                                swal('Failed', 'Enrollment missing with payer', 'error');
                            }


                            //$('#exampleModal').modal('show');
                        }
                    } else {
                        swal('Failed', 'Not authorized for Non-Par payer', 'error');
                        //$('#exampleModal').modal('show');
                    }
                }
            }
        });
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
                this.cd.detectChanges();
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
            this.cd.detectChanges();
        }
    }

    closeCSIModel() {
        $('#exampleModal').modal('hide');
        this.Status277 = false;
        this.Status999 = false;
    }

    checkCSIStatus(Practice, Claim) {
        debugger;

        const url = `/RealTimeClaimStatus/GetCSIStatus?&practiceCode=${Practice}&ClaimNo=${Claim}`;

        this.API.PostData(url, '', (data) => {
            console.log("RealTimeClaimStatus", data);

            // Check if the status is "Success"
            if (data.Status === "Success") {
                console.log("RealTimeClaimStatusdata.response", data.Response);

                // Check if CSI features are supported
                if (data.Response[0].CSI_Feature && data.Response[0].CSI_Service_Supported) {
                    this.CSIButton = true;
                    console.log("this.CSIButton", this.CSIButton);

                    // Handle Non-Par Access and Enrollment Requirements
                    const response = data.Response[0];

                    if (response.CSI_Non_Par_Access) {
                        this.CSINonParAccess_CSIParPayer = false;

                        this.EnrollmentCompleted = Number(response.EnrollmentCompleted);
                        this.CSIEnrollmentRequired = response.CSI_Enrollment_Required;
                    } else if (response.CSI_Par_Payer) {
                        this.CSINonParAccess_CSIParPayer = false;
                        this.EnrollmentCompleted = Number(response.EnrollmentCompleted);
                        this.CSIEnrollmentRequired = response.CSI_Enrollment_Required;
                    } else {
                        this.CSINonParAccess_CSIParPayer = true;
                    }
                }

                // Trigger change detection
                this.cd.detectChanges();


                if (this.CPTTable) {
                    this.cd.detectChanges();
                    this.CPTTable.destroy();

                    this.CPTTable = $('.myDataTable').DataTable({
                        language: {
                            emptyTable: "No data available"
                        }
                    });
                }
            }
        });
        this.cd.detectChanges();
        this.GetCSIClaimResponseStatus(Claim);
    }

    getRelations(): any {
        this.API.getData('/InsuranceSetup/GetRelationsSelectList').subscribe(
            res => {
                if (res.Status == "Success") {
                    this.relationsList = res.Response;
                }
                else {
                    swal("Relationships", res.Status, "error");
                }
            });
    }

    ShowInsuranceNamePopup(ndx: number) {
        this.insuranceModal.show();
        this.currentInsuranceNumber = ndx;
    }
    addNewItem(value: string) {
        this.newItemEvent.emit(value);
    }


    addNewIns(value: string) {
        this.InsEvent.emit(value)

    }
    AddNewInsurance() {
        debugger;
        let noofdel = 0;
        this.newInsurances = true;
        for (var i = 0; i < this.claimInsuranceModel.length; i++) {
            if (this.claimInsuranceModel[i].claimInsurance.Deleted) {
                noofdel++;
            }
        }
        if (this.claimInsuranceModel.length - noofdel == 3) {
            return;
        }
        var cp: claimInusrance;
        cp = new claimInusrance();
        cp.claimInsurance.Relationship
        cp.claimInsurance.Relationship = "7";
        cp.claimInsurance.Print_Center = false;
        cp.claimInsurance.Corrected_Claim = false;
        cp.claimInsurance.Late_Filing = false;
        cp.claimInsurance.Send_notes = false;
        cp.claimInsurance.Send_Appeal = false;
        cp.claimInsurance.Medical_Notes = false;
        cp.claimInsurance.Reconsideration = false;
        cp.claimInsurance.Returned_Hcfa = false;
        cp.claimInsurance.Deleted = false;
        cp.claimInsurance.Claim_Insurance_Id= 0;
        //this.claimInsuranceModel.Response.push(new claimInsurance());
        this.claimInsuranceModel.push(cp);
    }

    NewRowInsurances(event: KeyboardEvent, ndx: number) {
        if (event.keyCode == 40) {
            let claimInsuranceLength = 0;
            for (var notDel = 0; notDel < this.claimInsuranceModel.length; notDel++) {
                if (!this.claimInsuranceModel[notDel].claimInsurance.Deleted)
                    claimInsuranceLength++;
            }
            let rowFlag: number = -1;
            var element = $("#insurance-section table tbody tr:visible");
            if (claimInsuranceLength - 1 > ndx) {
                var input = $($(element)[ndx]).find(":focus").is("input");
                if (input) {
                    $($($(element[ndx + 1]).find("input"))[0]).focus();
                    return;
                }
            }
            for (var i = 0; i < element.length - 1; i++) {
                var hasfocus = $($(element)[i]).find(":focus").length;
                var isInput = $($(element)[i]).find(":focus").is("input");
                if (hasfocus > 0 && isInput) {
                    this.AddNewInsurance();
                    rowFlag = i;
                }
            }
            if (rowFlag > -1) {
                setTimeout(function () {
                    $($($($("#insurance-section table tbody tr:visible")[rowFlag + 1]).find("input"))[0]).focus();
                }, 200);
            }
        }
    }

    getPatientInsurances() {
        // this.claimInsuranceModel = [];
        
        if (this.claimInsuranceModel.length == 0 && this.isNewClaim) {
            if (this.PatientInsuranceResponse != null) {
                for (var i = 0; i < this.PatientInsuranceResponse.length; i++) {
                    this.claimInsuranceModel.push(new claimInusrance());
                    this.claimInsuranceModel[i].claimInsurance.Co_Payment = this.PatientInsuranceResponse[i] == null ? "" : this.PatientInsuranceResponse[i].Co_Payment;
                    this.claimInsuranceModel[i].claimInsurance.Co_Payment_Per = this.PatientInsuranceResponse[i] == null ? 0 : this.PatientInsuranceResponse[i].Co_Payment_Per;
                    this.claimInsuranceModel[i].claimInsurance.Deductions = this.PatientInsuranceResponse[i].Deductions == null ? 0 : this.PatientInsuranceResponse[i].Deductions;
                    this.claimInsuranceModel[i].claimInsurance.Group_Name = this.PatientInsuranceResponse[i].Group_Name == null ? "" : this.PatientInsuranceResponse[i].Group_Name;
                    this.claimInsuranceModel[i].claimInsurance.Group_Number = this.PatientInsuranceResponse[i].Group_Number == null ? "" : this.PatientInsuranceResponse[i].Group_Number;
                    this.claimInsuranceModel[i].claimInsurance.Pri_Sec_Oth_Type = this.PatientInsuranceResponse[i].Pri_Sec_Oth_Type == null ? "" : this.PatientInsuranceResponse[i].Pri_Sec_Oth_Type;
                    this.claimInsuranceModel[i].claimInsurance.Insurance_Id = this.PatientInsuranceResponse[i].Insurance_Id == null ? 0 : this.PatientInsuranceResponse[i].Insurance_Id;
                    this.claimInsuranceModel[i].InsurancePayerName = this.PatientInsuranceResponse[i].PayerDescription
                    // this.claimInsurances[i].INSURANCE_NAME = this.PatientInsuranceResponse[i].INSURANCE_NAME == null ? "" : this.PatientInsuranceResponse[i].INSURANCE_NAME;
                    this.claimInsuranceModel[i].claimInsurance.Policy_Number = this.PatientInsuranceResponse[i].Policy_Number == null ? "" : this.PatientInsuranceResponse[i].Policy_Number;
                    this.claimInsuranceModel[i].claimInsurance.Relationship = this.PatientInsuranceResponse[i].Relationship == null ? "" : this.PatientInsuranceResponse[i].Relationship;
                    this.claimInsuranceModel[i].claimInsurance.Subscriber = this.PatientInsuranceResponse[i].Subscriber == null ? 0 : (this.PatientInsuranceResponse[i].Subscriber);
                    this.claimInsuranceModel[i].claimInsurance.Deleted = false;
                    this.claimInsuranceModel[i].SubscriberName = this.PatientInsuranceResponse[i].SubscriberName == null ? "" : this.PatientInsuranceResponse[i].SubscriberName;
                    this.claimInsuranceModel[i].claimInsurance.Effective_Date = this.datePipe.transform(this.PatientInsuranceResponse[i].Effective_Date, "MM/dd/yyyy");
                    this.claimInsuranceModel[i].claimInsurance.Termination_Date = this.datePipe.transform(this.PatientInsuranceResponse[i].Termination_Date, "MM/dd/yyyy");
                }
            }
            if (this.PatientInsuranceResponse.length == 0) {
                this.newInsurances = true;
            }
        }
        else {

            for (var x = 0; x < this.claimInsuranceModel.length; x++) {
                // if (this.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "P")
                //     if (this.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "S")
                //         if (this.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "O")
                if (!Common.isNullOrEmpty(this.claimInsuranceModel[x].claimInsurance.Effective_Date))
                    this.claimInsuranceModel[x].claimInsurance.Effective_Date = this.datePipe.transform(this.claimInsuranceModel[x].claimInsurance.Effective_Date, 'MM/dd/yyyy');
                if (!Common.isNullOrEmpty(this.claimInsuranceModel[x].claimInsurance.Termination_Date))
                    this.claimInsuranceModel[x].claimInsurance.Termination_Date = this.datePipe.transform(this.claimInsuranceModel[x].claimInsurance.Termination_Date, 'MM/dd/yyyy');
                if (!Common.isNullOrEmpty(this.claimInsuranceModel[x].claimInsurance.Visits_Start_Date))
                    this.claimInsuranceModel[x].claimInsurance.Visits_Start_Date = this.datePipe.transform(this.claimInsuranceModel[x].claimInsurance.Visits_Start_Date, 'MM/dd/yyyy');
                if (!Common.isNullOrEmpty(this.claimInsuranceModel[x].claimInsurance.Visits_End_Date))
                    this.claimInsuranceModel[x].claimInsurance.Visits_End_Date = this.datePipe.transform(this.claimInsuranceModel[x].claimInsurance.Visits_End_Date, 'MM/dd/yyyy');
                if (!Common.isNullOrEmpty(this.claimInsuranceModel[x].claimInsurance.Created_Date))
                    this.claimInsuranceModel[x].claimInsurance.Created_Date = this.datePipe.transform(this.claimInsuranceModel[x].claimInsurance.Created_Date, 'MM/dd/yyyy');
                debugger
                // this.clickButtonColor = this.claimInsuranceModel[x].claimInsurance.Insurance_Id
                if(this.claimInsuranceModel[x].Status277 == 'Complete')
                {
                    this.clickButtonColor = this.claimInsuranceModel[x].claimInsurance.Insurance_Id
                    this.CSIbuttonColor = 'green'
                }
            }
            
        }
    }

    showSubscriber(ndx: number) {
        debugger;
        if (+this.claimInsuranceModel[ndx].claimInsurance.Relationship !== 7) {
            this.currentInsuranceNumber = ndx;
            this.guarantorModalWindowProp = {
                title: 'Subscriber',
                description: 'Find or Add and Select Subscriber.',
                caller: 'CLAIM_INSURANCE'
            };
            this.guarantorModal.show();
        }
    }

    onSelectGuarantor(response) {
        if (response.for === 'CLAIM_INSURANCE') {
            const { guarantorCode, guarantorName } = response.data;
            this.claimInsuranceModel[this.currentInsuranceNumber].claimInsurance.Subscriber = guarantorCode;
            this.claimInsuranceModel[this.currentInsuranceNumber].claimInsurance.SubscriberName = guarantorName;
            this.claimInsuranceModel[this.currentInsuranceNumber].SubscriberName = guarantorName;

            this.addGuarantor = false;
            this.guarantorModal.hide();
        }
    }

    onGuarantorHidden(event: any) {
        this.addGuarantor = false;
        if (!Common.isNullOrEmpty(this.guarantorAddEdit))
            this.guarantorAddEdit.resetForm();
        if (!Common.isNullOrEmpty(this.guarantorList))
            this.guarantorList.ClearSearchFields();
    }

    RelationChange(relation: string, index: number) {
        if (relation == "7") {
            this.claimInsuranceModel[index].claimInsurance.SubscriberName = "";
            this.claimInsuranceModel[index].SubscriberName = "";
            this.claimInsuranceModel[index].claimInsurance.Subscriber = null;
            $("#disabledspan").css("pointer-events", "none");
        }
        else {
            $("#disabledspan").css("pointer-events", "auto");
        }
    }

    onSelectInsurance({ Insurance_Id, Inspayer_Description }) {
        this.claimInsuranceModel[this.currentInsuranceNumber].InsurancePayerName = Inspayer_Description;
        this.claimInsuranceModel[this.currentInsuranceNumber].claimInsurance.Insurance_Id = Number(Insurance_Id);

        this.insuranceModal.hide();
    }

    DeleteInsurance(ndx: number) {
        debugger
        this.claimInsuranceModel[ndx].claimInsurance.Deleted = true;
        this.claimInsuranceModel[ndx].claimInsurance.Insurance_Id = 0;

    }

    CheckPercentage(ndx: number, p: number) {
        if (p < 0) {
            this.claimInsuranceModel[ndx].claimInsurance.Co_Payment_Per = 0;
        }
        if (p > 100) {
            this.claimInsuranceModel[ndx].claimInsurance.Co_Payment_Per = 100;
        }
    }

    changeInInsurance(p, i) {
        this.changesofInsurance = true
        const insurance = { index: i, claimIns: p };
        this.changeInsurenceItem[i] = insurance;
        console.log("this.changeInsurenceItem", this.changeInsurenceItem);
        if (!this.changeInsuranceNumber.includes(i)) {
            this.changeInsuranceNumber.push(i);
        }
        console.log("this.changeInsuranceNumber", this.changeInsuranceNumber)
    }


    InsuranceChange() {
        // for (var i = 0; i < this.claimCharges.length; i++) {
        //     if (oldValue == "P" && oldValue != value) {
        //         if (this.claimCharges[i].disableCPT == false) {
        //             this.claimCharges[i].reviewed = false;
        //         }
        //     }

        // }
        // this.addStatus();
    }

    validateDate(p: string, type: string, index: number) {
        if (p != undefined && p != "") {
            if (!this.validateD(p)) {
                swal('Failed', "Invalid Date format", 'error');
                if (type == "EffectiveDate")
                    this.claimInsuranceModel[index].claimInsurance.Effective_Date = "";
                if (type == "TerminationDate")
                    this.claimInsuranceModel[index].claimInsurance.Termination_Date = "";
            }
        }
    }

    validateD(testdate) {
        if (testdate.includes("T")) {
            testdate = testdate.substring(0, testdate.indexOf("T"));
            testdate = this.datePipe.transform(testdate, "MM/dd/yyyy")
        }
        var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)[0-9]{2}$/;
        return date_regex.test(testdate);
    }

    Tooltip(name: number, index: number) {
        if (index == undefined) {
            index = 0;
        }
        this.tempVariable = $.trim($($("select[name='" + name + "']")[index]).find("option:selected").text());
    }

    InsKeyDown(event: KeyboardEvent) {
        if (event.keyCode == 13) {
        }
    }

    keyUpEvent() {
        {
        }
    }

    insExpand() {
        this.isInsExpand = !this.isInsExpand;
    }

    validateDateFormat(dt: string, Type: string, ndx: number, event: KeyboardEvent) {
        if ((event.key == "Backspace" || event.key == "Delete") && (!dt))
            return;
        if (dt.length == 2 || dt.length == 5) {
            if (Type == "EffectiveDate")
                this.claimInsuranceModel[ndx].claimInsurance.Effective_Date = dt + "/";
            else if (Type == "TerminationDate")
                this.claimInsuranceModel[ndx].claimInsurance.Termination_Date = dt + "/";
            else if (Type == "StartDate")
                this.claimInsuranceModel[ndx].claimInsurance.Visits_Start_Date = dt + "/";
            else if (Type == "EndDate")
                this.claimInsuranceModel[ndx].claimInsurance.Visits_End_Date = dt + "/";
        }
    }

    checkCorrectedClaim(chkCorrectedClaim: boolean) {
        if (chkCorrectedClaim == true)
            swal('Claim Insurances', 'Please enter ICN Number.', 'error');
    }
    mydata() {
        this.eligiblityBtnColor;
    }

    first() {
        this.mydata()
    }
    checkEligibility(eligibilityData) {

        this.API.getData(`/Demographic/InquiryByPracPatProvider?PracticeCode=${this._gv.currentUser.selectedPractice.PracticeCode}&PatAcccount=${this.patAccount}&ProviderCode=${this.providerCode}&insurance_id=${eligibilityData.claimInsurance.Insurance_Id}`).subscribe(response => {
            this.nameData
            var obj = JSON.parse(response.Data)
            console.log("eligibilityData Response", obj)
            if (response.Status == 'Success' && response.Response == "Red") {
                this.eligiblityBtnColor = response.Response;
                this.first();
            }
            else if (response.Status == 'Success' && response.Response == "Green") {
                this.eligiblityBtnColor = response.Response;
                this.first();
            }
            else {
                swal("Eligibility Check", response.Response, 'error');
            }
        })
    }

    onCloseSearch() {
        this.ins.clearForm();

    }

    formatDate(dateString: string): string {
        console.log("My Date", dateString)
        var year1 = '0000';
        var month1 = '00';
        var day1 = '00';

        if (dateString != undefined || dateString != null) {
            if (dateString.length !== 8) return 'N/A'; // Check if the date string is valid

            var year = dateString.slice(0, 4);
            var month = dateString.slice(4, 6);
            var day = dateString.slice(6, 8);

            return `${month}/${day}/${year}`;
        }
        return `${month1}/${day1}/${year1}`;

    }


    get practiceCode(): number {
        return this._gv.currentUser.selectedPractice.PracticeCode;
    }
    GetCSIClaimResponseStatus(Claim_Id: any) {
        debugger
        this._apiService.getData('/Submission/GetCSIBatcheDetalisStatus?claimId=' + Claim_Id).subscribe(
            res => {

                console.log("GetCSIClaimResponse", res)

            }
        )
    }

}
