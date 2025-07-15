import { AfterViewInit, Component, ElementRef, HostListener, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, OnInit } from '@angular/core';
import { ViewChild, ChangeDetectorRef } from '@angular/core';

import { APIService } from '../components/services/api.service';
import { GvarsService } from '../services/G_vars/gvars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common'
import { PatientInsuranceResponse, CPTRequest, ClaimViewModel, ClaimModel, claimCharges, claimPayments, claimInusrance } from './Classes/ClaimsModel'
import { DiagnosisComponent } from './Diagnosis/diagnosis.component'
import { ClaimInsurancesComponent } from './Insurances/claim-insurances.component'
import { PaymentsComponent } from './Payments/payments.component';
import { IMyDpOptions } from 'mydatepicker';
import { ClaimsAssignmentComponent } from './claims-assignment/claims-assignment.component';
import { FacilitiesComponent } from '../setups/Facility/facilities.component'
import { ClaimNotesComponent } from './claimNotes/claim-notes.component';
import { ClaimCharges, charges, claimPayment } from './Classes/index';
import { Diag } from './Classes/Diagnosis'
import { ChangeDetectionStrategy } from '@angular/core';
import { UB04Component } from './ub04/ub04.component';
import { Common } from '../services/common/common';
import { FormGroup, Validators, FormControl, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdmissionDetails, Admission_Detail, ClaimsUbDropdowns, ConditionCodeModel, UbClaimDropdowns, ValueCode, allDropdowns } from './ub04/Classes/ubclasses';
import { ClaimService } from '../services/claim/claim.service';
import { Subscription } from 'rxjs';
import { IMyDateRangeModel, IMyDate } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import _ from 'lodash';
import { saveAs } from 'file-saver';
import { DebugContext } from '@angular/core/src/view';
import { PatientStatementReport } from '../reports/classes/appointment-detail-report';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { AlertService } from '../services/data/Alert.service';
import { CCOde, OccurrenceCodeModel, OccSpanCode } from './ub04/Classes/ubclasses';
import { forEach } from '@angular/router/src/utils/collection';
import { Revenue_Codes } from './Classes/ClaimAssignee';
import { PaymentResponsbility } from '../models/payment-responsbility.model';
import { debounce, retry } from 'rxjs/operators';
import { CurrentUserViewModel } from '../models/auth/auth';
import { claimNotes } from './Classes/claimNotes'
import { SelectListViewModel } from '../models/common/selectList.model';
declare var $: any
export function numberOrDashValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const valid = value === '-' || /^-?\d+$/.test(value); // Allows negative sign and numbers only
      return valid ? null : { invalidValue: { value } };
    };
  }
@Component({
    selector: 'app-claims',
    templateUrl: './claims.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements  OnInit {
    @ViewChild('bsModal') bsModal: ModalDirective;
    TotalCharges:any;
    TotalPaidAmt : any;
    TotalAdjamt : any;
    TotaldueAmt : any;
    Totalamtadj : any;
    selectedResponsibleParty :any="Select Responsible";
    Claimview:boolean;
    NewClaimtype:any;
    TotalPIblaance:boolean=true;
    amount:any;
    insuranceoverpaid: any;  
    patientcreditbalance: any;
    Diag: Diag[];
    autofill:boolean=false;
    public placeholder: string = 'MM/DD/YYYY';
    dxList: Array<{ name: string, description: string, beforeEffective : boolean, afterExpiry:boolean }> = [];
    codeHasIssue:string;
    // This is used to access the Claim Insurance Values from Child Component of Insurance.
    @ViewChild(ClaimInsurancesComponent) InsChild;
    @ViewChild(FacilitiesComponent) vfc: FacilitiesComponent
    ClaimBillingType:any;
    dueRespSide: string;
    billingPhyforFee: string;
    Admissiondetails:Admission_Detail
    alreadySaveOnce: boolean;
    ListCodes:ClaimsUbDropdowns;
    private customerDiffer: KeyValueDiffer<string, any>;
    PTLReasons: any[] = [];
    listPatientReportStatement: PatientStatementReport[];
    modifiers: any;
    updatedvalue:any='W'
    states: any;
    showButton: boolean;
    changeFieldName: any;
    fieldName: string;
    dataFromParent : string = '';
    procedureCode: any = '';
    isValidationError: boolean = false;
    CTValue!: boolean;
    setE: any;
    firstAlert: any;
    PrirAuthorization: string[] = [];
    claimForAlert: any;
    fetchedClaimNo: string;
    yourMethodValue: any='';
    isDisabled:boolean = false;
    DateFrom: any;
    DateTo: { year: number; month: number; day: number; };
    cdRef: any;
    scenario:any;
    Sequence_of_care_Id: any="";
    Type_of_Care_Id: any="";
    Type_of_Facility_Id: any="";
    concatenatedIds: string="";
    concatenated_TOB: string="";
    panelCodeInput: string = '';
    alreadyExists: boolean;
    public claimNotesModel: claimNotes;
    previousPatientStatus:string;
    currentPatientStaus:string;
    insuranceMode:any;
    updatePatientIns:any;
    updatePatientInsPolicyNumber:any;
    addPatientIns:any;
    insuranceIndex:any;
    loggedInUser: CurrentUserViewModel;
    PracticeCode: number;
    paymentresponsbility:PaymentResponsbility;
    paymentResponsibilityForm: FormGroup;
    claimViewModel: ClaimViewModel;
    claimviewmodel_default: ClaimViewModel;
    claimviewmodel_original: ClaimModel;
    currentInsuranceNumber: number;
    isClaimEdit: number;
    blnEditDemoChk: boolean = false;
    showInsuranceNamePopup: boolean = false;
    isChargesExpand: boolean = false;
    dataTable: any;
    charges: any = [];
    IsAutoFillEnable:boolean=false
    retPostData:string;
    saveclaimtype:string='';
    DOS:any;
    ScanDate:any;
    HCFA:boolean;
    HCFAType:any;
    lastIndexforadd:any=null;
    DxCode : any=null;
    AddForDx;any=null;
    DeletedDX:any=null;
    Deletedoriginalindex:any;
    Deletedindex:any=null;
    AddDx:any=null;
    Addoriginaldx:any=null;
    addnewindex:any=null;
    UpdateDx:any=null;
    oldDX:any=null;
    Deletedcpt:boolean=false;
    Addedcpt:boolean=false;
    deletedcptseq:any
    deletedindex:any
    Cptsequenceno:any;
    DeleteCpt:any=null;
    DeleteCptSeq:any=null;
    updateoriginalindex:any=null;
    updatenewindex:any=null;
    notestringfordeleteddx:any=""
    panelcodenote:any=""
    autonotemodelskip:boolean=false;
    combinedNoteString :any="";
    notestringforprocedure:any=""
    notestringforprocedureupdate:any=""
    deletedproceduremessage:String[]=[];
    addproccodeuremessage:String[]=[]
    adddaigcodemessage:String[]=[]
    deletedaigcodemessage:String[]=[]
    updatedaigcodemessage:String[]=[]
    updatedraftmessage:String[]=[]
    updatemessageofdxafterdelete:any=""
    relationsList: SelectListViewModel[];
   

    dxcodearraylength:any=null;
    response: any[] = []; 
    resetPopup() {
        this.vfc.ClearSearchFields();
        // this.vfc.showHideFacilityElements = false;
    }
    ngAfterViewInit(): void {
        this.vfc.isFromAnotherComponent = 'claim';
        this.vfc.ClearSearchFields();
        //throw new Error('Method not implemented.');
    }
    @ViewChild('opModal')opModal:ModalDirective;
    @ViewChild('upModal')upModal:ModalDirective;
    @ViewChild('tcbModal') tcbModal:ModalDirective;
    @ViewChild('NoteModal')NoteModal:ModalDirective;
    @ViewChild(ClaimNotesComponent) ChildNotes;
    @ViewChild(ClaimsAssignmentComponent) childAssignment;
    // @ViewChild(ModalDirective) modalWindow: ModalDirective;
    @ViewChild('modalWindow') modalWindow: ModalDirective;
    @ViewChild('PanelCodeModal') PanelCodeModal: ModalDirective;
    Dateoptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    ClaimNumber: number;
    currentDate: any;
    @ViewChild(PaymentsComponent) paymentChild;
    @ViewChild(DiagnosisComponent) ChildDiagnosis: DiagnosisComponent;
    @ViewChild(UB04Component) ChildUB04: UB04Component;
    claimCharges: ClaimCharges[];
    cPTRequest: CPTRequest;
    AllDropdowns:allDropdowns = new allDropdowns();
    chargesList: charges;
    callFrom: string;
    claimDos: string;
    today = new Date();
    recentClaimDetails:any;
    oldClaimType:any;
    oldClaimCharges:any;
    oldClaimChargesoriginal:any;
    oldClaimInsuranceList:any;
    oldClaimInsuranceListoriginal:any;
    parsedData:any;
    claimType:any='';
    CheckNewClaim:boolean=false;
    ClaimDraftStatus:boolean=false
    previousdata:any;
    updatedNotes: string[] = [];
    updatedNotesForDraft:string[]=[]
    notesPopUpData: string = "";
    tcbModalShow:boolean=false;
    // Declarations
    public dosDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
        disableSince: {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate() + 1,
        }
    };
    public myDateRangePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
        // disableSince: {
        //     year: this.today.getFullYear(),
        //     month: this.today.getMonth() + 1,
        //     day: this.today.getDate() + 1,
        // },
    };
    public scanDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy',
        height: '25px',
        width: '100%',
        disableSince: {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate() + 1,
        }
    };
    //see
    //#region dates
    selDOS: IMyDate = {
        day: 0,
        month: 0,
        year: 0
    };
    selDOI: IMyDate = {
        day: 0,
        month: 0,
        year: 0
    };
    selHF: IMyDate = {
        day: 0,
        month: 0,
        year: 0
    };
    selScanDate: IMyDate = {
        day: 0,
        month: 0,
        year: 0
    };
    selBillDate: IMyDate = {
        day: 0,
        month: 0,
        year: 0
    };
    //#endregion
    assigneeID: any = null;
    SpanCodeList: OccSpanCode[];
    OccCodeList: OccurrenceCodeModel[];
    ConditionCodeList: CCOde[];
    ValueCode:ValueCode[];
    Codeslist:UbClaimDropdowns;
    dxNumber: string;
    PatientInsuranceResponse: PatientInsuranceResponse[];
    disableForm: boolean = false;
    disableSave: boolean = false;
    claimInfo: any;
    claimForm: FormGroup;
    selectedHour: number;
    hours: number[] = Array.from({ length: 24 }, (_, i) => i);
    // subscriptions
    facilitySubscription: Subscription;
    ptlSubscription: Subscription;
    physicalMoifiersList: any = [
        { key: 'P1', value: 0 },
        { key: 'P2', value: 0 },
        { key: 'P3', value: 1 },
        { key: 'P4', value: 2 },
        { key: 'P5', value: 3 },
        { key: 'P6', value: 0 },
    ]; 
    currentUser: CurrentUserViewModel;//..This variable is declared by Tamour Ali for Anestheisa task purpose
    oldclaimpayments:any;
    transfercrditbalPayment:any;
    showoverpayment:boolean=true;
    SaveOverpayment:boolean=false;
     noteDetail = "";
    constructor(private claimService: ClaimService,
        private cd: ChangeDetectorRef,
        public router: Router,
        public route: ActivatedRoute,
        public datepipe: DatePipe,
        public API: APIService,
        public Gv: GvarsService,
        private alertService: AlertService,
        private toast: ToastrService,
        private fb: FormBuilder
        
    ) 
    {
        this.relationsList = [];
        this.paymentResponsibilityForm = this.fb.group({
            creditbalance: ['-', [Validators.required, this.negativeValueValidator]], // Apply the validators
            overpaid: ['-', [Validators.required, this.negativeValueValidator]]
          });
            this.claimNotesModel = new claimNotes;
            this.claimNotesModel.Response.Note_Id = 0;
            this.claimNotesModel.Response.Note_Detail = "";
            this.claimNotesModel.Response.Claim_Notes_Id = 0;
        this.PTLReasons = [
            {
                id: 'OCBO', name: 'NOT COVERED BY THIS PAYER'
            },
            {
                id: 'OAUT', name: 'NEED AUTH'
            },
            {
                id: 'OCFI', name: '	SEE FIN NOTE'
            },
            {
                id: 'OCPT', name: 'NEED CPT CODE'
            },
            {
                id: 'ODIA', name: 'DIAGNOSIS NEEDED'
            },
            {
                id: 'OIDN', name: 'INSURANCE POLICY NUMBER IS INCORRECT'
            },
            {
                id: 'ONOT', name: '	NOTES NEEDED'
            },
            {
                id: 'ODOS', name: 'DATE OF SERVICE CLARIFICATION NEEDED'
            },
            {
                id: 'OPOS', name: 'NEED CORRECTED PLACE OF SERVICE'
            },
            {
                id: 'OREF', name: 'REFERRING PHYSICAN NEEDED'
            },
            {
                id: 'OPTA', name: 'PATIENTS ADDRESS NEEDED'
            },
            {
                id: 'OPTB', name: 'PATIENTS BIRTHDAY NEEDED'
            },
            {
                id: 'OPTS', name: 'PATIENTS SEX NEEDED'
            }
        ]
        this.Admissiondetails= new Admission_Detail();
        this.claimViewModel = new ClaimViewModel();
        this.claimviewmodel_default = new ClaimViewModel();
        this.PatientInsuranceResponse = [];
        this.cPTRequest = new CPTRequest
        this.AllDropdowns=new allDropdowns();
        this.claimType='';
        this.claimCharges = [];
        // this.ListCodes.CcOde=[];
        // this.ListCodes.OccCode=[];
        // this.ListCodes.OccSpanCode=[];
        // this.ListCodes.ValueCode=[];
        this.ListCodes=new ClaimsUbDropdowns()
        this.SpanCodeList=[];
        this.OccCodeList=[];
        this.ValueCode=[];
        this.ConditionCodeList=[]
        this.chargesList = new charges;
        this.Codeslist= new UbClaimDropdowns();
        this.clearClaimAmount();
        this.paymentresponsbility= new PaymentResponsbility();
        this.Diag = [];

        this.currentUser = new CurrentUserViewModel();
        // this.getClaimModel();
    }
    ngOnInit() {
        this.getRelations();
        this.initializeForm();
        this.IsAutoFillEnableForPractice();
        this.IsButtonDisable(); 
        this.claimService.claimTabActive.next("claims");
        this.initForm();
        this.getModifiers();
        this.getSates();
        this.getGetallDropdowns();
        this.dynamicValidationFacility();
        this.claimDos = "";
        this.selectedResponsibleParty="Select Responsible"
       
        this.route.params.subscribe(params => {
            if (params) {
                this.claimInfo = JSON.parse(Common.decodeBase64(params['param']));
                this.NewClaimtype=this.claimInfo.type;
                this.Claimview=this.claimInfo.disableForm;                ;  
                this.Gv.Patient_Account = this.claimInfo.Patient_Account; 
               if(this.claimInfo.type && this.claimInfo.type!== undefined){
                
                switch (this.claimInfo.type) {
                    case "I" :
                        this.ClaimBillingType ='I'
                      break;
                    case "i" :
                        this.ClaimBillingType ='I'
                      break;
                      case "Institutional" :
                        this.ClaimBillingType ='I'
                      break;
                    case "institutional" :
                        this.ClaimBillingType ='I'
                      break;
                    case "p" :
                      this.ClaimBillingType ='P'
                      break;
                    case "P" :
                      this.ClaimBillingType ='P'
                      break;
                    case "professional" :
                      this.ClaimBillingType ='P'
                      break;
                      case "Professional" :
                      this.ClaimBillingType ='P'
                      break;
                  }
               }

           this.claimType=this.claimInfo.type;
                this.disableForm = this.claimInfo.disableForm;
                if (this.disableForm) {
                    this.claimForm.disable();
                    this.InsChild.isViewMode = true;
                    this.ChildDiagnosis.isViewMode = true;
                    this.paymentChild.isViewMode = true;
                }
                else
                    this.claimForm.enable();
                if (this.claimInfo.claimNo > 0) {
                    this.getClaimModel();
                    this.GetOverPaymentModel();
                    if (this.claimViewModel.ClaimModel.PTL_Status)
                        this.dynamicValidationPTL();
                }
                else {
                    this.InsChild.isNewClaim = true;
                    this.getEmptyClaim();         
                    this.alreadySaveOnce = false;
                    this.insuranceoverpaid=0;
                    this.patientcreditbalance=0;
                }
            }
        });
        this.getClaimsWithPatientDue();
        // this.formControls['hospitalization'].get('ptlStatus').setValue(this.claimViewModel.ClaimModel.PTL_Status)

   
    


        //Added By Pir Ubaid (USER STORY : 205 Prior Authorization)
        this.getPAByAccount(); 

        this.GetAdmissionType();
    
        this.Gv.CCrowAdded = false;
        this.Gv.OCrowAdded = false;
        this.Gv.OSCrowAdded = false;
        this.Gv.VCrowAdded = false;

        this.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;
        
    }
    AddPanelCode(){
        const modalOptions: ModalOptions = {
            backdrop: 'static'
          };
          this.PanelCodeModal.config = modalOptions;
        this.PanelCodeModal.show();
    }
    hidePanelCode(){
        this.panelCodeInput = '';
        this.PanelCodeModal.hide();
    }
   
    isAlertNotExpired(): boolean {
    // Check if firstAlert or EffectiveFrom is null or undefined
        if (!this.firstAlert || !this.firstAlert.EffectiveFrom) {
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
    //set the modal body static.will close on click OK or Cross
    const modalOptions: ModalOptions = {
        backdrop: 'static'
      };
      this.modalWindow.config = modalOptions;
      this.modalWindow.show();
    
  }

  hide() {
    this.TotaldueAmt=0;
    this.paymentResponsibilityForm.reset({
        creditbalance: '-', // Reset to initial value '-'
        overpaid: '-'       // Reset to initial value '-'
    });
    this.modalWindow.hide();
  }
    
    receiveListFromChild(data: { type: string, list: any[] }) {
         
   
       
        // Handle the received list in the parent component based on the type
        if (data.type === 'occurenceSpan') {      
         
          this.ListCodes.OccSpanCode = data.list;
            //   this.Codeslist.OccspanCode.forEach(item => {
            //     item.OccSpanCode.DateFrom = moment(item.OccSpanCode.DateFrom).format("MM/DD/YYYY");
            //   });
            //   this.Codeslist.OccspanCode.forEach(item => {
            //     item.OccSpanCode.DateThrough = moment(item.OccSpanCode.DateThrough).format("MM/DD/YYYY");
            //   });
            //   this.Codeslist.OccspanCode ;

          // Handle the received OccurenceSpan list
        } else if (data.type === 'occurrenceCode') {
         this.ListCodes.OccCode = data.list;
            //   this.Codeslist.Occcode.forEach(item => {
            //     item.OccCode.Date
            //   });
            //   this.Codeslist.Occcode ;
          // Handle the received OccurrenceCode list
        } else if (data.type === 'ConditionCode') {
            this.ListCodes.CcOde= data.list;
          // Handle the received ConditionCode list
        }
        else if(data.type==='ValueCode'){

            this.ListCodes.ValueCode=data.list;
        }
         
      }

    shouldHide(provider: any): boolean {
        // if(this.claimInfo.claimNo > 0){

        //     return provider.Is_Active;
        // }
        return !provider.Is_Active;
    }



    // this.formControls['hospitalization'].get('ptlStatus').setValue(this.claimViewModel.ClaimModel.PTL_Status)
    getGetallDropdowns(){
        this.API.getData('/UBClaim/GetallDropdowns').subscribe(
          data => {
            if (data.Status === 'Sucess') {
      this.AllDropdowns=data.Response
        }  });
          }

    dynamicValidationPTL() {
        if (this.ptlSubscription != null && this.ptlSubscription != undefined)
            this.ptlSubscription.unsubscribe();

        this.ptlSubscription = this.formControls['hospitalization'].get('ptlStatus').valueChanges.subscribe(() => {
            if (this.formControls['hospitalization'].get('ptlStatus').value) {
                this.formControls['hospitalization'].get('ptlReason').setValidators([Validators.required]);
                this.formControls['hospitalization'].get('ptlReason').updateValueAndValidity({ onlySelf: true, emitEvent: false });
            } else {

                this.formControls['hospitalization'].get('ptlReason').clearValidators();
                this.formControls['hospitalization'].get('ptlReason').setValue(null);
                this.formControls['hospitalization'].get('ptlReason').updateValueAndValidity({ onlySelf: true, emitEvent: true });
            }
        })

    }

    dynamicValidationFacility() {
        
        if (this.facilitySubscription != null && this.facilitySubscription != undefined)
            this.facilitySubscription.unsubscribe();
        this.facilitySubscription = this.formControls['hospitalization'].get('facility').valueChanges.subscribe(() => {
            if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Facility_Code) && !Common.isNullOrEmpty(this.formControls['hospitalization'].get('facility').value)) {
                this.formControls['hospitalization'].get('Hospital_From').setValidators([Validators.required]);
                this.formControls['hospitalization'].get('Hospital_From').updateValueAndValidity({ onlySelf: true, emitEvent: false });
            } else {
                this.formControls['hospitalization'].get('Hospital_From').clearValidators();
                this.formControls['hospitalization'].get('Hospital_From').updateValueAndValidity({ onlySelf: true, emitEvent: false });
                this.formControls['hospitalization'].get('Hospital_From').reset()
                this.claimViewModel.ClaimModel.Facility_Code = null;
                this.claimViewModel.ClaimModel.Hospital_To = "";
                this.claimViewModel.ClaimModel.Hospital_From = "";
            }
        });
    }

    onDateRangeChanged(event: IMyDateRangeModel) {
        this.claimViewModel.ClaimModel.Hospital_From = Common.isNullOrEmpty(event.beginJsDate) ? null : event.beginJsDate.toDateString();
        this.claimViewModel.ClaimModel.Hospital_To = Common.isNullOrEmpty(event.endJsDate) ? null : event.endJsDate.toDateString();
    }
    onDateRangeChangedIns(event: any , dateType:string) {
        event.formatted;
        if(dateType=="From")
        {
            this.claimViewModel.ClaimModel.Hospital_From = Common.isNullOrEmpty(event.formatted) ? null : event.formatted.toString();        
        }
        else{
            this.claimViewModel.ClaimModel.Hospital_To = Common.isNullOrEmpty(event.formatted) ? null : event.formatted.toString();
        }
     this.AddAutoNotesForUpdateClaim();
      }

    onDateChangedFrom(event) {
        
       this.claimViewModel.ClaimModel.Hospital_From = event.formatted;

       // this.claimForm.get('hospitalization.Hospital_From').setValue(this.claimViewModel.ClaimModel.Hospital_From);
    }
    
    onDateChangedTo(event){
        
        //const jsDate = new Date(event.year, event.month - 1, event.day);
        //this.claimViewModel.ClaimModel.Hospital_From = Common.isNullOrEmpty(jsDate) ? null : jsDate.toDateString();
        this.claimViewModel.ClaimModel.Hospital_To = event.formatted;
    }
    
    

    // onDateRangeChangedIns(event: any , dateType:string) {
    //     event.formatted;
    //     if(dateType=="From")
    //     {
    //         this.claimViewModel.ClaimModel.Hospital_From = Common.isNullOrEmpty(event.formatted) ? null : event.formatted.toString();        
    //     }
    //     else{
    //         this.claimViewModel.ClaimModel.Hospital_To = Common.isNullOrEmpty(event.formatted) ? null : event.formatted.toString();
    //     }
    //   }

    initForm() {
        this.claimForm = new FormGroup({
            main: new FormGroup({
                selfPay: new FormControl(false),
                dos: new FormControl(null, [Validators.required]),
                scanDate: new FormControl(null, [Validators.required]),
                claimDate: new FormControl(null),
                location: new FormControl(null, [Validators.required]),
                rendPhy: new FormControl(null),
                resourcePhy: new FormControl(null),
                billPhy: new FormControl(null, [Validators.required]),
                refPhy: new FormControl(null),
                supPhy: new FormControl(null),
                referral: new FormControl('', [Validators.maxLength(50)]),
                pa: new FormControl('', [Validators.maxLength(50)]),
                additionalClaimInfo: new FormControl('', [Validators.minLength(10), Validators.maxLength(80)]),
                patientStatus: new FormControl(null),
                priStatus: new FormControl(null),
                secStatus: new FormControl(null),
                othStatus: new FormControl(null),
                autofill: new FormControl(false)
            }),
            hospitalization: new FormGroup({
                facility: new FormControl(null),
                //facilityDates: new FormControl(''),
                Hospital_From : new FormControl(null, [Validators.required]),
                Hospital_To : new FormControl(''),
                ptlStatus: new FormControl(false),
                ptlReason: new FormControl(null),
                ptlReasonDetail: new FormControl(''),
                docFeedback: new FormControl('')
            }),
            correctedClaimGroup: new FormGroup({
                ICN_Number: new FormControl(null),
                Is_Corrected: new FormControl(false),
                RSCode: new FormControl(null)
            })
        });
    }

    get formControls() {
        return this.claimForm.controls;
    }
    //api/PracticeSetup/IsAutoFillEnableForPractice?practiceCode={practiceCode}
    
    getClaimModel() {
        this.API.getData('/Demographic/GetClaimModel?PatientAccount= ' + this.claimInfo.Patient_Account + '&ClaimNo=' + this.claimInfo.claimNo + '').subscribe(
            data => {
                this.claimViewModel = new ClaimViewModel();
                this.claimviewmodel_default = new ClaimViewModel();
                this.claimviewmodel_original = new ClaimModel();
               
                
                this.clearClaimAmount();
               
                // for(var i=0;data.Response.length>i;i++)
                //this.parsedData = JSON.parse(JSON.stringify(data.Response));
                this.oldClaimType = { ...data.Response.ClaimModel };
                this.oldClaimCharges = JSON.parse(JSON.stringify(data.Response.claimCharges));
                this.oldClaimChargesoriginal=this.oldClaimCharges;
           
                this.claimviewmodel_default = data.Response;
                this.claimViewModel = data.Response;
                this.oldclaimpayments = JSON.parse(JSON.stringify(data.Response.claimPayments));
                debugger
                debugger
                if( this.transfercrditbalPayment&&this.transfercrditbalPayment.length>0){
                    const claimPayments = data.Response.claimPayments;
               
                    this.transfercrditbalPayment.forEach(tp => {
                        if (tp.claimPayments.Payment_Source === 'T') {
                            tp.claimPayments.Amount_Paid = Math.abs(tp.claimPayments.Amount_Paid); // ignore +/- sign
    
                            const match = claimPayments.find(cp =>
                                Math.abs(cp.claimPayments.Amount_Paid) === tp.claimPayments.Amount_Paid &&
                                cp.claimPayments.Payment_Source === tp.claimPayments.Payment_Source &&
                                cp.claimPayments.Sequence_No === Number(tp.claimPayments.Sequence_No)
                            );
                             
                            if (match) {
                                tp.claimPayments.T_payment_id = match.claimPayments.claim_payments_id;

                               
                            }
                        }
                        tp.claimPayments.Sequence_No=null;
                    });
                    this.PostPayment();
                }
                this.InsChild.PatientInsuranceResponse = data.Response.PatientInsuranceList;
                this.oldClaimInsuranceList = JSON.parse(JSON.stringify(data.Response.claimInusrance));
                this.oldClaimInsuranceListoriginal = this.oldClaimInsuranceList;
                this.amount=this.claimViewModel.ClaimModel.Amt_Due
                if(this.amount < 0){   
                    this.TotalPIblaance= false;
                }
                this.previousPatientStatus=this.claimViewModel.ClaimModel.Pat_Status;
                this.claimViewModel.claimPayments.forEach(person => {
                    
                    if(person!=null && person.claimPayments!=null &&  person.claimPayments.Charged_Proc_Code!=null)
                    {
                    person.claimPayments.Charged_Proc_Code = person.claimPayments.Charged_Proc_Code.split(':')[0];
                    }
                });
                  // Accessing the claim number from the response and passing it to another method
                  const fetchedClaimNo = this.claimViewModel.ClaimModel.Claim_No;
                  this.yourMethod(fetchedClaimNo)
                  if(fetchedClaimNo != null ||fetchedClaimNo != undefined){
                    this.showModalForSelectedClaim(fetchedClaimNo);
                  }
                this.claimViewModel.UbClaimDropdown;
                if(this.claimViewModel.ClaimModel.Claim_Type && this.claimViewModel.ClaimModel.Claim_Type!== undefined){
                    switch (this.claimViewModel.ClaimModel.Claim_Type) {
                        case "I" :
                            this.ClaimBillingType ='I';
                            if(this.claimViewModel.Admission_Details!=null){
                                this.Admissiondetails=this.claimViewModel.Admission_Details;
                            }
                            // Split the code into three different IDs
                            if(this.claimViewModel.Admission_Details.Type_of_Bill!=null){
                                const parts = this.claimViewModel.Admission_Details.Type_of_Bill.toString();
                                this.Type_of_Facility_Id = parts.charAt(0);
                                this.Type_of_Care_Id = parts.charAt(1);
                                this.Sequence_of_care_Id = parts.charAt(2);
                            }
                          break;
                        case "i" :
                            this.ClaimBillingType ='I'
                            if(this.claimViewModel.Admission_Details!=null){
                                this.Admissiondetails=this.claimViewModel.Admission_Details;
                            }
                            // Split the code into three different IDs
                            if(this.claimViewModel.Admission_Details.Type_of_Bill!=null){
                                const parts = this.claimViewModel.Admission_Details.Type_of_Bill.toString();
                                this.Type_of_Facility_Id = parts.charAt(0);
                                this.Type_of_Care_Id = parts.charAt(1);
                                this.Sequence_of_care_Id = parts.charAt(2);
                            }
                          break;
                          case "Institutional" :
                            this.ClaimBillingType ='I'
                            if(this.claimViewModel.Admission_Details!=null){
                                this.Admissiondetails=this.claimViewModel.Admission_Details;
                            }
                            // Split the code into three different IDs
                            if(this.claimViewModel.Admission_Details.Type_of_Bill!=null){
                                const parts = this.claimViewModel.Admission_Details.Type_of_Bill.toString();
                                this.Type_of_Facility_Id = parts.charAt(0);
                                this.Type_of_Care_Id = parts.charAt(1);
                                this.Sequence_of_care_Id = parts.charAt(2);
                            }
                          break;
                        case "institutional" :
                            this.ClaimBillingType ='I'
                            if(this.claimViewModel.Admission_Details!=null){
                                this.Admissiondetails=this.claimViewModel.Admission_Details;
        
                            }
                            // Split the code into three different IDs
                            if(this.claimViewModel.Admission_Details.Type_of_Bill!=null){
                                const parts = this.claimViewModel.Admission_Details.Type_of_Bill.toString();
                                this.Type_of_Facility_Id = parts.charAt(0);
                                this.Type_of_Care_Id = parts.charAt(1);
                                this.Sequence_of_care_Id = parts.charAt(2);
                            }
                          break;
                        case "p" :
                          this.ClaimBillingType ='P'
                          break;
                        case "P" :
                          this.ClaimBillingType ='P'
                          break;
                        case "Professional" :
                          this.ClaimBillingType ='P'
                          break;
                          case "professional" :
                          this.ClaimBillingType ='P'
                          break;
                      }
                   }
               if(this.claimViewModel.ClaimModel.Claim_Type=='I')
                {
                    this.claimType="Institutional"
                    if(this.claimViewModel.Admission_Details!=null){
                        this.Admissiondetails=this.claimViewModel.Admission_Details;
                    }
                    // Split the code into three different IDs
                    if(this.claimViewModel.Admission_Details.Type_of_Bill!=null){
                        const parts = this.claimViewModel.Admission_Details.Type_of_Bill.toString();
                        this.Type_of_Facility_Id = parts.charAt(0);
                        this.Type_of_Care_Id = parts.charAt(1);
                        this.Sequence_of_care_Id = parts.charAt(2);
                    }
                }
                else{
                    this.claimType="Professional"
                }
                     
                if (this.claimViewModel.ClaimModel != null) {

                    if (this.claimViewModel.AttendingPhysiciansList.length > 0) {
                        // let filteredAttendingPhy = this.claimViewModel.AttendingPhysiciansList.filter(x => x.Id === this.claimViewModel.ClaimModel.Attending_Physician && !x.Is_Active);
                        // if (filteredAttendingPhy.length > 0) {
                        //     this.claimViewModel.ClaimModel.Attending_Physician = -1;
                        // }

                        //       this.claimViewModel.ClaimModel.Attending_Physician = this.claimViewModel.AttendingPhysiciansList[0].Id;
                        //this.claimViewModel.ClaimModel.Attending_Physician = this.claimViewModel.AttendingPhysiciansList[0].Id;
                    }                                     
                    if (this.claimViewModel.BillingPhysiciansList.length > 0) {
                        // let filteredBillingPhy = this.claimViewModel.BillingPhysiciansList.filter(x => x.Id === this.claimViewModel.ClaimModel.Billing_Physician && !x.Is_Active);
                        // if (filteredBillingPhy.length > 0) {
                        //     this.claimViewModel.ClaimModel.Billing_Physician = -1;
                        // }
                        // this.claimViewModel.ClaimModel.Billing_Physician = this.claimViewModel.BillingPhysiciansList[0].Id;
                    }
                    // if (this.claimViewModel.ClaimModel.Supervising_Physician !== -1) {
                    //     this.claimViewModel.ClaimModel.Supervising_Physician = -1;
                    // }
                    this.ClaimNumber = this.claimViewModel.ClaimModel.Claim_No;
                    //#region Dates Setup
                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.DOS)) {
                        this.claimViewModel.ClaimModel.DOS = this.datepipe.transform(this.claimViewModel.ClaimModel.DOS, 'MM/dd/yyyy');
                        this.selDOS = this.setDate(this.claimViewModel.ClaimModel.DOS);
                        this.claimDos = this.claimViewModel.ClaimModel.DOS;
                    }
                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Scan_Date)) {
                        this.claimViewModel.ClaimModel.Scan_Date = this.datepipe.transform(this.claimViewModel.ClaimModel.Scan_Date, 'MM/dd/yyyy');
                        this.selScanDate = this.setDate(this.claimViewModel.ClaimModel.Scan_Date);
                    }                   

                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Injury_Date)) {
                        this.claimViewModel.ClaimModel.Injury_Date = this.datepipe.transform(this.claimViewModel.ClaimModel.Injury_Date, 'MM/dd/yyyy');
                        this.selDOI = this.setDate(this.claimViewModel.ClaimModel.Injury_Date);
                    }
                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Bill_Date)) {
                        this.claimViewModel.ClaimModel.Bill_Date = this.datepipe.transform(this.claimViewModel.ClaimModel.Bill_Date, 'MM/dd/yyyy');
                        this.selBillDate = this.setDate(this.claimViewModel.ClaimModel.Bill_Date);
                    }
                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Batch_Date)) {
                        this.claimViewModel.ClaimModel.Batch_Date = this.datepipe.transform(this.claimViewModel.ClaimModel.Batch_Date, 'MM/dd/yyyy');
                    }
                     //..below updated by Ubaid Ullah for Dischare date change 05/01/2024
                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Hospital_From)) {
                        
                        this.claimViewModel.ClaimModel.Hospital_From = this.datepipe.transform(this.claimViewModel.ClaimModel.Hospital_From, 'MM/dd/yyyy');
                        this.DateFrom = this.setDate(this.claimViewModel.ClaimModel.Hospital_From);
                    }
                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Hospital_To)) {
                        
                        this.claimViewModel.ClaimModel.Hospital_To = this.datepipe.transform(this.claimViewModel.ClaimModel.Hospital_To, 'MM/dd/yyyy');
                        this.DateTo = this.setDate(this.claimViewModel.ClaimModel.Hospital_To)
                    }
                     //..below updated by Ubaid Ullah for Dischare date change 05/01/2024

                    // if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Hospital_From) && !Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Hospital_To)) {
                        
                    //     this.setDateRange(this.claimViewModel.ClaimModel.Hospital_From, this.claimViewModel.ClaimModel.Hospital_To);

                    // }
                   
                    // if(this.claimViewModel.ClaimModel.Claim_Type!='I' )
                    // {
                    //     if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Hospital_From) && !Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Hospital_To)) {
                         
                    //           this.setDateRange(this.claimViewModel.ClaimModel.Hospital_From, this.claimViewModel.ClaimModel.Hospital_To);
                    //       }
                    // }
                    // else{

                    //     if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Hospital_From)) {
                         
                    //           this.setDateRange(this.claimViewModel.ClaimModel.Hospital_From, this.claimViewModel.ClaimModel.Hospital_To);
                    //       }
                    // }
                   
                    //#endregion
                    //#region Diagnosis Codes
                    if (this.claimViewModel.ClaimModel.DX_Code1 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code1;
                        cp.Diagnosis.Description = this.claimViewModel.DX1Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX1EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX1ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[0].Diagnosis.Diag_Expiry_Date !== null && this.Diag[0].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[0].Diagnosis.Diag_Effective_Date !== null && this.Diag[0].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[0].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code2 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code2;
                        cp.Diagnosis.Description = this.claimViewModel.DX2Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX2EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX2ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[1].Diagnosis.Diag_Expiry_Date !== null && this.Diag[1].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[1].Diagnosis.Diag_Effective_Date !== null && this.Diag[1].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[1].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code3 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code3;
                        cp.Diagnosis.Description = this.claimViewModel.DX3Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX3EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX3ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[2].Diagnosis.Diag_Expiry_Date !== null && this.Diag[2].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[2].Diagnosis.Diag_Effective_Date !== null && this.Diag[2].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[2].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code4 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code4;
                        cp.Diagnosis.Description = this.claimViewModel.DX4Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX4EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX4ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[3].Diagnosis.Diag_Expiry_Date !== null && this.Diag[3].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[3].Diagnosis.Diag_Effective_Date !== null && this.Diag[3].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[3].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code5 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code5;
                        cp.Diagnosis.Description = this.claimViewModel.DX5Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX5EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX5ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[4].Diagnosis.Diag_Expiry_Date !== null && this.Diag[4].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[4].Diagnosis.Diag_Effective_Date !== null && this.Diag[4].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[4].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code6 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code6;
                        cp.Diagnosis.Description = this.claimViewModel.DX6Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX6EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX6ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[5].Diagnosis.Diag_Expiry_Date !== null && this.Diag[5].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[5].Diagnosis.Diag_Effective_Date !== null && this.Diag[5].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[5].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code7 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code7;
                        cp.Diagnosis.Description = this.claimViewModel.DX7Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX7EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX7ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[6].Diagnosis.Diag_Expiry_Date !== null && this.Diag[6].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[6].Diagnosis.Diag_Effective_Date !== null && this.Diag[6].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[6].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code8 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code8;
                        cp.Diagnosis.Description = this.claimViewModel.DX8Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX8EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX8ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[7].Diagnosis.Diag_Expiry_Date !== null && this.Diag[7].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[7].Diagnosis.Diag_Effective_Date !== null && this.Diag[7].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[7].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code9 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code9;
                        cp.Diagnosis.Description = this.claimViewModel.DX9Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX9EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX9ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[8].Diagnosis.Diag_Expiry_Date !== null && this.Diag[8].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[8].Diagnosis.Diag_Effective_Date !== null && this.Diag[8].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[8].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code10 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code10;
                        cp.Diagnosis.Description = this.claimViewModel.DX10Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX10EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX10ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[9].Diagnosis.Diag_Expiry_Date !== null && this.Diag[9].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[9].Diagnosis.Diag_Effective_Date !== null && this.Diag[9].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[9].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code11 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code11;
                        cp.Diagnosis.Description = this.claimViewModel.DX11Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX11EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX11ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[10].Diagnosis.Diag_Expiry_Date !== null && this.Diag[10].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[10].Diagnosis.Diag_Effective_Date !== null && this.Diag[10].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[10].Diagnosis);
                        }
                    }
                    if (this.claimViewModel.ClaimModel.DX_Code12 != undefined) {
                        var cp: Diag;
                        cp = new Diag();
                        cp.Diagnosis.Code = this.claimViewModel.ClaimModel.DX_Code12;
                        cp.Diagnosis.Description = this.claimViewModel.DX12Description;
                        cp.Diagnosis.Diag_Effective_Date = this.claimViewModel.DX12EffectiveDate
                        cp.Diagnosis.Diag_Expiry_Date = this.claimViewModel.DX12ExpiryDate
                        this.Diag.push(cp)
                        if((this.Diag[11].Diagnosis.Diag_Expiry_Date !== null && this.Diag[11].Diagnosis.Diag_Expiry_Date !== undefined ) || (this.Diag[11].Diagnosis.Diag_Effective_Date !== null && this.Diag[11].Diagnosis.Diag_Effective_Date !== undefined)){
                            this.setDxListForPopup(this.Diag[11].Diagnosis);
                        }
                    }
                    this.ChildDiagnosis.Diag = this.Diag;
                    //#endregion
                    //#region Claim Charges
                    if (this.claimViewModel.claimCharges != null) {

                        this.claimCharges = this.claimViewModel.claimCharges;
                        for (var x = 0; x < this.claimCharges.length; x++) {

                            if (+this.claimCharges[x].claimCharges.Amount > 0 && +this.claimCharges[x].claimCharges.Units > 1)
                                this.claimCharges[x].amt = (+this.claimCharges[x].claimCharges.Amount / +this.claimCharges[x].claimCharges.Units) + "";
                            else
                                this.claimCharges[x].amt = this.claimCharges[x].claimCharges.Amount;

                            if (this.claimCharges[x].IsAnesthesiaCpt == true) {

                                //..For Anesthesia default units are coming from database procedure table where for remainig cpt's its calculated of front-end.
                                if (+this.claimCharges[x].claimCharges.Amount > 0 && +this.claimCharges[x].claimCharges.Units > 1)
                                    this.claimCharges[x].amt = ((+this.claimCharges[x].amt * 100) / 200) + "";
                            }
                            this.claimCharges[x].claimCharges.NDCList = this.claimViewModel.claimCharges[x].claimCharges.NDCCodeList;
                             // Handling new property Alternate_Code
                          //  this.claimCharges[x].claimCharges.Alternate_Code    =  this.claimViewModel.claimCharges[x].claimCharges.Alternate_Code;
                            this.claimViewModel.claimCharges[x].claimCharges.DOE = this.datepipe.transform(this.claimViewModel.claimCharges[x].claimCharges.DOE, 'MM/dd/yyyy');
                            if (this.claimViewModel.claimCharges[x].claimCharges.Dos_From != null) {
                                this.claimViewModel.claimCharges[x].claimCharges.Dos_From = this.datepipe.transform(this.claimViewModel.claimCharges[x].claimCharges.Dos_From, 'MM/dd/yyyy');
                            }
                            if (this.claimViewModel.claimCharges[x].claimCharges.Dos_To != null) {
                                this.claimViewModel.claimCharges[x].claimCharges.Dos_To = this.datepipe.transform(this.claimViewModel.claimCharges[x].claimCharges.Dos_To, 'MM/dd/yyyy');
                            }
                            if (this.claimViewModel.claimCharges[x].claimCharges.Start_Time != null) {
                                let start_time = this.claimViewModel.claimCharges[x].claimCharges.Start_Time.slice(11, 16)
                                this.claimViewModel.claimCharges[x].claimCharges.Start_Time = start_time
                            }
                            if (this.claimViewModel.claimCharges[x].claimCharges.Stop_Time != null) {
                                let stop_Time = this.claimViewModel.claimCharges[x].claimCharges.Stop_Time.slice(11, 16)
                                this.claimViewModel.claimCharges[x].claimCharges.Stop_Time = stop_Time
                            }
                            //...Below condition added by umer
                            if(this.claimViewModel.claimCharges[x].claimCharges.Revenue_Code!=null && this.claimViewModel.claimCharges[x].claimCharges.Revenue_Code!=""){
                                this.claimViewModel.claimCharges[x].claimCharges.isRevenue_CodeDisabled=true;
                            }                       
                        }
                        this.paymentChild.claimCharges = this.claimViewModel.claimCharges;
                    }
                    //#endregion
                    //#region added Hours 
                    this.currentDate = new Date();
                    this.claimViewModel.claimPayments.forEach((item) => {
                        let entryDate: any = new Date(item.claimPayments.Date_Entry)
                        item.claimPayments.hoursSinceAdded = Math.abs(this.currentDate.getTime() - entryDate.getTime()) / 3600000;
                    })

                    if (this.claimViewModel.claimInusrance.length > 0) {

                        if (this.claimViewModel.claimInusrance[0].InsurancePayerName.includes("Medicaid") || this.claimViewModel.claimInusrance[0].InsurancePayerName.includes("Medicaid MCO")) {
                            if (this.claimViewModel.BillingPhysiciansList.length > 0) {
                                if (this.claimViewModel.BillingPhysiciansList[0].SPECIALIZATION_CODE == '050' && this.claimViewModel.BillingPhysiciansList[0].provider_State == 'OH') {
                                    //  $("#Modifier_Code option[value=SA]").attr('selected', 'selected');

                                    this.claimCharges.forEach(x => {
                                        x.claimCharges.Modi_Code1 = "SA"
                                    })
                                }
                            }

                        }
                    }
                    this.claimViewModel.claimPayments.forEach((item) => {
                        // these below two lines are added to keep the original date as it is unless it is changed from frontend, to resolve date reversal issue
                        item.claimPayments.Date_Entry_Original = item.claimPayments.Date_Entry;
                        item.claimPayments.Date_Entry = moment.utc(item.claimPayments.Date_Entry).format('MM/DD/YYYY');
                        //  item.claimPayments.Date_Entry = this.datepipe.transform(item.claimPayments.Date_Entry, 'MM/dd/yyyy');

                        item.claimPayments.Date_Filing = this.datepipe.transform(item.claimPayments.Date_Filing, 'MM/dd/yyyy');
                        item.claimPayments.DepositDate = this.datepipe.transform(item.claimPayments.DepositDate, 'MM/dd/yyyy');
                        item.claimPayments.BATCH_DATE = this.datepipe.transform(item.claimPayments.BATCH_DATE, 'MM/dd/yyyy');
                    })
                    this.paymentChild.claimPaymentModel = this.claimViewModel.claimPayments;
                    if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Billing_Physician)) {
                        this.billingPhyforFee = this.claimViewModel.ClaimModel.Billing_Physician.toString();
                    }
                    //#endregion
                    //#region Claim Insurance
                    this.paymentChild.claimInusrance = this.claimViewModel.claimInusrance;
                    if (this.claimViewModel.claimInusrance.length > 1) {
                        this.claimViewModel.claimInusrance[0].claimInsurance.SubscriberName = this.claimViewModel.claimInusrance[0].SubscriberName;
                    }
                    this.InsChild.claimInsuranceModel = this.claimViewModel.claimInusrance;
                    if(this.claimViewModel!=null && this.claimViewModel.claimInusrance!=null
                        && this.claimViewModel.claimInusrance[0]!=null
                        && this.claimViewModel.claimInusrance[0].claimInsurance!=null)
                     {
                       this.InsChild.checkCSIStatus(this.Gv.currentUser.selectedPractice.PracticeCode,this.claimViewModel.claimInusrance[0].claimInsurance.Claim_No)
                     }
                    // this.InsChild.checkCSIStatus(this.Gv.currentUser.selectedPractice.PracticeCode,this.claimViewModel.claimInusrance[0].claimInsurance.Claim_No)
                    this.InsChild.getPatientInsurances();
                    this.dueRespSide = this.ResponsibleParty(this.claimViewModel.ClaimModel);
                    //#endregion
                    if (!this.claimViewModel.ClaimModel.PTL_Status)
                        this.alreadySaveOnce = true;
                    else
                        this.alreadySaveOnce = false;
                    this.refresh();
                }
                debugger
               
            });
            this.yourMethod(this.fetchedClaimNo);
          
            // this.getClaims();
           // this.yourMethod(fetchedClaimNo);
    }
    // showModalForSelectedClaim(claimNum : any): void {
    //     this.vfc.ClearSearchFields();
    //     //throw new Error('Method not implemented.');
    //     ;
    //     this.alertService.getAlert().subscribe((data) => {
    //       if (data.Status === 'Success' && data.Response && data.Response.length > 0) {
    //         this.firstAlert = data.Response[0];
    //         this.yourMethod(this.fetchedClaimNo);
    //         if (this.isAlertNotExpired()) {
    //           if (
    //             this.firstAlert.ApplicableFor == 'S' &&
    //             this.Gv.currentUser.userId == this.firstAlert.Created_By &&
    //             this.firstAlert.ClaimText === claimNum
    //           ) {
    //             this.show();
    //           } else if (this.firstAlert.ApplicableFor == 'A') {
    //             this.show();
    //           } else {
    //           }
    //         } else {
    //         }
    //       } else {
    //         ;
    //       }
    //     });
    //   }
      
    showModalForSelectedClaim(claimNum: any): void {
        this.vfc.ClearSearchFields();
        this.alertService.getAlert().subscribe((data) => {
            if (data.Status === 'Success' && data.Response && data.Response.length > 0) {
                this.firstAlert = data.Response[0];    
                // Check if claimNum exists within ClaimText
                if (this.firstAlert.ClaimText.includes(claimNum)) {
                    if (this.isAlertNotExpired()) {
                        if (
                            this.firstAlert.ApplicableFor == 'S' &&
                            this.Gv.currentUser.userId == this.firstAlert.Created_By
                        ) {
                            this.show();
                        } else if (this.firstAlert.ApplicableFor == 'A') {
                            this.show();
                        } else {
                        }
                    } else {
                    }
                } else {
                }
            
            } else {
            }
        });
    }
    // yourMethod(claimNo: string) {
    //     // Use claimNo as needed in yourMethod
    // }
    yourMethod(value :any) {
        // Use this.fetchedClaimNo here
        this.yourMethodValue=value
    }
    // getClaims() {
    //     this.claimForAlert = this.claimInfo.claimNo;
    // }
    getModifiers() {
        this.API.getData('/Demographic/GetModifiers').subscribe(
            data => {
                if (data.Status == 'Sucess') {

                    this.modifiers = data.Response;
                }
            })
    }
    getSates() {
        this.API.getData('/Demographic/GetstateList').subscribe(
            data => {

                if (data.Status == 'Sucess') {
                    this.states = data.Response;
                }
            })
    }
    addIns(data: any) {
        let count = 0;
        this.InsChild.claimInsuranceModel.forEach(
            x => {
                if (x.claimInsurance.Deleted == true) {
                    count++
                }
            }
        )
        if (this.InsChild.claimInsuranceModel[0].claimInsurance.Deleted == false) {
            count = 0;
        }
        if (this.InsChild.claimInsuranceModel.length > 0 && this.InsChild.claimInsuranceModel.length != count) {

            if (this.InsChild.claimInsuranceModel[count].InsurancePayerName.includes("Medicaid") || this.InsChild.claimInsuranceModel[count].InsurancePayerName.includes("Medicaid MCO")) {
                if (this.claimViewModel.BillingPhysiciansList.length > 0) {
                    if (this.claimViewModel.BillingPhysiciansList[0].SPECIALIZATION_CODE == '050' && this.claimViewModel.BillingPhysiciansList[0].provider_State == 'OH') {
                        //  $("#Modifier_Code option[value=SA]").attr('selected', 'selected');

                        this.claimCharges.forEach(x => {
                            x.claimCharges.Modi_Code1 = "SA"
                        })


                    }
                }

            } else {
                this.claimCharges.forEach(x => {
                    x.claimCharges.Modi_Code1 = x.claimCharges.Modi_Code1
                })
            }

        } else {
            this.claimCharges.forEach(x => {
                x.claimCharges.Modi_Code1 = x.claimCharges.Modi_Code1
            })
        }
        for(let c=0;this.InsChild.changeInsurenceItem.length>c;c++){
            if(["1", "2", "3"].includes(this.InsChild.changeInsurenceItem[c])){

            }else{
                let index=this.InsChild.changeInsurenceItem[c].index
                this.InsChild.changeInsurenceItem[index].claimIns=this.InsChild.claimInsuranceModel[index]
            }
        }
    }
    ResponsibleParty(claim: ClaimModel) {
        if (claim.Amt_Due > 0 && claim.Pri_Status && (claim.Pri_Status.toLowerCase() == 'n' || claim.Pri_Status.toLowerCase() == 'r' || claim.Pri_Status.toLowerCase() == 'b')) {
            return 'Primary Ins Due';
        }
        else if (claim.Amt_Due > 0 && claim.Sec_Status && (claim.Sec_Status.toLowerCase() == 'n' || claim.Sec_Status.toLowerCase() == 'r' || claim.Sec_Status.toLowerCase() == 'b')) {
            return 'Secondary Ins Due';
        }
        else if (+claim.Amt_Due > 0 && claim.Oth_Status && (claim.Oth_Status.toLowerCase() == 'n' || claim.Oth_Status.toLowerCase() == 'r' || claim.Oth_Status.toLowerCase() == 'b')) {
            return 'Other Ins Due';
        }
        else if (+claim.Amt_Due > 0 && claim.Pat_Status && (claim.Pat_Status.toLowerCase() == 'n' || claim.Pat_Status.toLowerCase() == 'r' || claim.Pat_Status.toLowerCase() == 'b')) {
            return 'Patient Due';
        }
        else {
            return 'Due Amount';
        }
    }

    setDate(dateParam: any) {
        let date = new Date(dateParam);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }

    removeINS() {
        if (this.claimViewModel.ClaimModel.Is_Self_Pay != true && !this.claimViewModel.ClaimModel.PTL_Status) {
            if(this.claimViewModel.claimInusrance && this.claimViewModel.claimInusrance.length > 0){
                for (var i = 0; i < this.claimViewModel.claimInusrance.length; i++) {
                    this.claimViewModel.claimInusrance[i].claimInsurance.Deleted = true;
                }
            } else{
                this.InsChild.claimInsuranceModel=[]
            }
        }
    }
    refresh() {
        this.cd.detectChanges();
    }

    EnableDisable(isRectify: boolean, EntryDate: string) {
        let enable;
        if (((new Date(EntryDate).getFullYear() < new Date().getFullYear()) && new Date(EntryDate).getMonth() <= new Date().getMonth() && isRectify) || ((new Date(EntryDate).getFullYear() < new Date().getFullYear()) && new Date(EntryDate).getMonth() <= new Date().getMonth() && !isRectify)) {
            enable =
            {
                'opacity': '0.5',
                'cursor': 'not-allowed',
            };
        }
        else if (new Date(EntryDate).getFullYear() <= new Date().getFullYear()) {
            if (new Date(EntryDate).getMonth() <= new Date().getMonth()) {
                if (isRectify) {
                    enable =
                    {
                        'opacity': '0.5',
                        'cursor': 'not-allowed',
                    };
                }
                else {
                    enable =
                    {
                        'opacity': 'none',
                    };
                }
            }
            else {
                enable =
                {
                    'opacity': 'none',
                };
            }
        }

        else {
            enable =
            {
                'opacity': 'none',
            };
        }
        return enable;
    }

    setCursorStyle(isRectified: boolean = false) {
        let styles;
        if (isRectified) {
            styles = {
                'cursor': 'not-allowed',
            };
        } else {
            styles = {
                'cursor': 'auto',
            };
        }
        return styles;
    }

//Added By Pir Ubaid (USER STORY : 205 Prior Authorization)
getPAByAccount(){
    this.API.getData('/Demographic/GetPAByAccount?aCCOUNT_NO= '+ this.claimInfo.Patient_Account).subscribe(
        data => {
            if (data.Status == 'Success') {
                this.PrirAuthorization = data.Response;
            }
        })
} 
    getEmptyClaim() {
        this.API.getData('/Demographic/GetClaimModel?PatientAccount=' + this.claimInfo.Patient_Account + '&ClaimNo=0').subscribe(
            data => {
                var curDate = new Date();
                this.claimViewModel = data.Response;
                this.claimViewModel.ClaimModel.Is_Draft = false;
                this.claimViewModel.ClaimModel.Bill_Date = this.datepipe.transform(curDate, 'MM/dd/yyyy');
                this.claimViewModel.ClaimModel.Scan_Date = this.datepipe.transform(curDate, 'MM/dd/yyyy');
                this.selBillDate = this.setDate(this.claimViewModel.ClaimModel.Bill_Date);
                this.selScanDate = this.setDate(this.claimViewModel.ClaimModel.Bill_Date);
                this.InsChild.PatientInsuranceResponse = data.Response.PatientInsuranceList;
                this.InsChild.getPatientInsurances();
                this.PatientInsuranceResponse = data.Response.PatientInsuranceList;
                // Select default values to select lists
                // Location

                if (this.claimViewModel.PracticeLocationsList.length > 0)
                    this.claimViewModel.ClaimModel.Location_Code = this.claimViewModel.PracticeLocationsList[0].Id;
                //  Rendering Phy
                // if (this.claimViewModel.AttendingPhysiciansList.length > 0)
                //     this.claimViewModel.ClaimModel.Attending_Physician = this.claimViewModel.AttendingPhysiciansList[0].Id;

                if (this.claimViewModel.AttendingPhysiciansList.length > 0) {
                    let filteredAttendingPhy = this.claimViewModel.AttendingPhysiciansList.filter(x => x.Id === this.claimViewModel.ClaimModel.Attending_Physician && !x.Is_Active);
                    if (filteredAttendingPhy.length > 0) {
                        this.claimViewModel.ClaimModel.Attending_Physician = -1;
                    }
                    //..below condition if for Resource Physician dropdown added by tamour 8/8/2024
                    let filteredResourcePhy = this.claimViewModel.AttendingPhysiciansList.filter(x => x.Id === this.claimViewModel.ClaimModel.Resource_Physician && !x.Is_Active);
                    if (filteredResourcePhy.length > 0) {
                        this.claimViewModel.ClaimModel.Resource_Physician = -1;
                    }

                }


                // Billing Phy
                if (this.claimViewModel.BillingPhysiciansList.length > 0)
                    this.claimViewModel.ClaimModel.Billing_Physician = this.claimViewModel.BillingPhysiciansList[0].Id;

                if (!Common.isNullOrEmpty(this.claimViewModel.ClaimModel.Billing_Physician)) {
                    this.billingPhyforFee = this.claimViewModel.ClaimModel.Billing_Physician.toString();
                }
                // // Referring Physician
                // if (this.claimViewModel.ReferralPhysiciansList.length > 0)
                //     this.claimViewModel.ClaimModel.Referring_Physician = this.claimViewModel.ReferralPhysiciansList[0].Id;
                // // Supervising Physician
                if (this.claimViewModel.AttendingPhysiciansList.length > 0)
                    // this.claimViewModel.ClaimModel.Supervising_Physician = this.claimViewModel.AttendingPhysiciansList[0].Id;
                    this.refresh();
            });
    }

    // This method is used to get the Values of All Insurances 
    FillInsurances() {
        //   this.claimViewModel.ClaimModel.PatientInsuranceResponse=[];
        //   this.claimViewModel.ClaimModel.PatientInsuranceResponse=this.InsChild.claimInsuranceModel.Response;
    }

    validateD(testdate) {
        var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)[0-9]{2}$/;
        return date_regex.test(testdate);
    }
    // DOS Checks
    onDateChanged(event: any, dateType: string) {
        if (dateType != undefined && dateType != "") {

            if (event.formatted != "" && !this.validateD(event.formatted)) {
                swal('Failed', "Invalid Date format", 'error');
            }
        }
        if (dateType == "DOS") {
            let dos = event.formatted == "" ? null : this.formatDate(event.formatted);
            this.claimViewModel.ClaimModel.DOS = this.claimDos = dos;
            this.Diag.map(d =>{
                if((d.Diagnosis.Diag_Expiry_Date !== null && d.Diagnosis.Diag_Expiry_Date !== undefined ) || (d.Diagnosis.Diag_Effective_Date !== null && d.Diagnosis.Diag_Effective_Date !== undefined)){
                    this.setDxListForPopup(d.Diagnosis); 
                }  
            });
            let currentDate = new Date();
            let dosToComp = new Date(dos);
            if (dosToComp > currentDate) {
                this.disableSave = true;
            } else {
                this.disableSave = false;
            }
        }
        //see
        if (dateType == "BillDate") {
            this.claimViewModel.ClaimModel.Bill_Date = event.formatted == "" ? null : event.formatted;
        }

        if (dateType == "ScanDate") {
            this.claimViewModel.ClaimModel.Scan_Date = event.formatted == "" ? null : event.formatted;
        }
        if (dateType == "injury_date") {
            this.claimViewModel.ClaimModel.Injury_Date = event.formatted == "" ? null : event.formatted;
        }
  
        // if (dateType == "DOS" && (this.claimViewModel.ClaimModel.Bill_Date != null && this.claimViewModel.ClaimModel.Bill_Date != "" && this.claimViewModel.ClaimModel.Bill_Date != undefined) && this.claimViewModel.ClaimModel.Bill_Date.length == 10) {
        //     this.claimViewModel.ClaimModel.DOS = event.formatted == "" ? null : this.formatDate(event.formatted);
        // }
    }
    checkDuplicateDOS(): Promise<boolean> {
        return new Promise((resolve) => {
        let dos = this.claimViewModel.ClaimModel.DOS;
          const patientAccount = this.claimInfo.Patient_Account;
          const formattedDate = dos.toString().split('T')[0];
          this.API.getData(`/demographic/CheckDuplicateDOS?patientAccount=${patientAccount}&dos=${formattedDate}`).subscribe(
            (response: any) => {
              if (response.Status === "Success") {
                if (response.Response === true) {
                  swal({
                    title: 'Confirmation',
                    text: "Claim with the same DOS already exists.\nAre you sure you want to proceed?", 
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes!',
                    cancelButtonText: 'No'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      resolve(true);
                    }
                  }).catch((dismiss) => 
        {
                    if (dismiss === 'cancel') {
                      this.claimViewModel.ClaimModel.DOS = null; // Reset the DOS field
                    //   dos = null
                //     //   this.claimForm.patchValue({
                //     //     DOS: ''
                //     //   });
                //    // Reset the DOS field
                      let resetDOS= this.setDate(this.claimViewModel.ClaimModel.DOS);
                      let formDos = this.claimForm.get('dos')
                      this.claimForm.get('main.dos').setValue(null)
                      formDos = this.claimForm.get('dos')
                //       formDos = null;
                //       this.claimForm.get('dos').setValue({ month: null, day: null ,year: null});
//                       this.claimForm.get('dos').setValue(null);
//                       this.claimForm.get('dos').updateValueAndValidity();
//                       this.claimForm.get('dos').setValue('');
// // or
// this.claimForm.get('dos').setValue({});
this.cdRef.detectChanges();
                      resolve(false);
                    }
                  });
                } else {
                  resolve(true); 
                }
              } else {
                console.error('API Error:', response.Status);
                resolve(false); 
              }
            },
            (error) => {
              console.error('API Error:', error);
              resolve(false); 
            }
          );
        });
      }
    onEmpChange(event: any) {

        if (event == '0') {
            this.claimViewModel.ClaimModel.Employment = false;
        } else {
            this.claimViewModel.ClaimModel.Employment = true;
        }



    }
    onChangeAccident(event: any, d: any) {
        if (d == 'auto') {
            this.claimViewModel.ClaimModel.Accident_Auto = true;
            this.claimViewModel.ClaimModel.Accident_Other = false;
        }
        if (d == 'noAuto') {
            this.claimViewModel.ClaimModel.Accident_Other = true;
            this.claimViewModel.ClaimModel.Accident_Auto = false;
        }


    }
    formatDate(date: string) {
        if (date == null)
            return;
        var day = parseInt(date.split('/')[1]) < 10 ? date.split('/')[1] : date.split('/')[1];
        var month = parseInt(date.split('/')[0]) < 10 ? date.split('/')[0] : date.split('/')[0];
        var year = date.split('/')[2];
        if (year != undefined && month != undefined && day != undefined)
            return month + "/" + day + "/" + year;
    }

    // changesInFields(a){
    //     this.showButton=false

    //     if(this.changeFieldName.includes(a)==false){
    //         this.changeFieldName.push(a)
    //     }
    // }

    addtoScrubber() {
        this.showButton = true
        if (this.showButton) {
            var modeValue = this.claimViewModel.ClaimModel;
            var myArray = [];
            myArray.push(modeValue.Pat_Status);
            myArray.push(modeValue.Pri_Status);
            myArray.push(modeValue.Sec_Status);
            myArray.push(modeValue.Oth_Status);
            if (myArray.includes('N') || myArray.includes('R')) {
                this.API.PostData('/Scrubber/AddTOScrubber', this.claimViewModel, (d) => {
                    // if (d.Status == "Sucess") {
                    //     if (this.claimViewModel.ClaimModel.Claim_No == undefined || this.claimViewModel.ClaimModel.Claim_No == null || this.claimViewModel.ClaimModel.Claim_No == 0) {
                    //         this.ClaimNumber = d.Response;
                    //         this.claimViewModel.ClaimModel.Claim_No = this.ClaimNumber;
                    //         this.claimInfo.claimNo = this.ClaimNumber;
                    //     }
                    //     this.ClaimNumber = this.claimViewModel.ClaimModel.Claim_No;
                    //     this.claimInfo.claimNo = this.ClaimNumber;
                    //     this.refresh();
                    //     if (this.claimInfo.claimNo > 0)
                    //         this.getClaimModel();
                    //     else
                    //         this.getEmptyClaim();
                    //     this.refresh();
                    //     swal('Claim', 'Patient Claim has been saved successfully.', 'success');
                    //     this.getSetStatus();
                    // }
                    // else {
                    //     swal('Failed', d.Status, 'error');
                    // }
                })

            }
            else {
                swal('Failed', 'Pleased checking the Patient Status: ' + this.claimViewModel.ClaimModel.Pat_Status + ' Primary Status : ' + this.claimViewModel.ClaimModel.Pri_Status + ' Secondary Status : ' + this.claimViewModel.ClaimModel.Sec_Status + ' Other Status : ' + this.claimViewModel.ClaimModel.Oth_Status, 'error');
            }
        } else {
            for (let i = 0; i < this.changeFieldName.length; i++) {
                this.fieldName = this.fieldName + ' ' + this.changeFieldName[i];
            }
            swal('Failed', 'Pleased checking  and Save that Changes ' + ' ' + this.fieldName, 'error');
        }



    }
    // Check by PIR UBAID  for NCT(Additional Claim Info) validation
    checkInputValue() {
        let inputValue: any;
        if(this.claimViewModel.ClaimModel.Additional_Claim_Info!==null)
        inputValue= this.claimViewModel.ClaimModel.Additional_Claim_Info.toUpperCase();
        // Define a regular expression pattern to match "CT" followed by one or more digits
        const ctPattern = /^CT\d+/;
        // for (let count = 0; count < this.claimCharges.length; count++) {
            for (let count = 0; count < this.claimViewModel.claimCharges.length; count++) {
            // Check if the inputValue matches the pattern
            // if ((this.claimCharges[count].claimCharges.Procedure_Code == '0275T' || this.claimCharges[count].claimCharges.Procedure_Code == '0275t') && !ctPattern.test(inputValue)) {
            if(this.claimViewModel.claimCharges[count].claimCharges.Deleted==null)
                this.claimViewModel.claimCharges[count].claimCharges.Deleted=false;
            if ((this.claimViewModel.claimCharges[count].claimCharges.Procedure_Code == '0275T' || this.claimViewModel.claimCharges[count].claimCharges.Procedure_Code == '0275t') && !ctPattern.test(inputValue) && this.claimViewModel.claimCharges[count].claimCharges.Deleted==false ) {
                swal('Failed', 'Additional Claim Info (NCT) must start with "CT" and should be at least 10 characters long.', 'error').then((result) => {
                    if (result) {
                        const additionalClaimInfoElement = document.getElementById("additionalClaimInfo");
                        if (additionalClaimInfoElement) {
                            additionalClaimInfoElement.focus();
                            window.scrollTo({
                                top: additionalClaimInfoElement.offsetTop,
                                behavior: 'smooth',
                            });
                        }
                    }
                });
                return false;
            }
        }
        // for (let count = 0; count < this.claimCharges.length; count++) {
        //     let startsWithCT = false;
        //     if (inputValue) {
        //         startsWithCT = ctPattern.test(inputValue);
        //     }
        //     this.CTValue = !startsWithCT;
        //     if (
        //         !startsWithCT &&
        //         (this.claimCharges[count].claimCharges.Procedure_Code == '0275T' || this.claimCharges[count].claimCharges.Procedure_Code == '0275t') &&
        //         (inputValue != null || inputValue !== '')
        //     ) {
        //         swal('Failed', 'Additional Claim Info (NCT) must start with "CT" and should be at least 10 characters long.', 'error').then((result) => {
        //             if (result) {
        //                 const additionalClaimInfoElement = document.getElementById("additionalClaimInfo");
        //                 if (additionalClaimInfoElement) {
        //                     additionalClaimInfoElement.focus();
        //                     window.scrollTo({
        //                         top: additionalClaimInfoElement.offsetTop,
        //                         behavior: 'smooth',
        //                     });
        //                 }
        //             }
                    
        //         })
        //     }
        // }
        // for (let count = 0; count < this.claimCharges.length; count++) {// Check if the inputValue is less than 10 characters
        //     if ((this.claimCharges[count].claimCharges.Procedure_Code == '0275T' || this.claimCharges[count].claimCharges.Procedure_Code == '0275t') && inputValue.length < 10) {
        //         swal('Failed', 'Additional Claim Info (NCT) should be at least 10 characters long.', 'error').then((result) => {
        //             if (result) {
        //                 const additionalClaimInfoElement = document.getElementById("additionalClaimInfo");
        //                 if (additionalClaimInfoElement) {
        //                     additionalClaimInfoElement.focus();
        //                     window.scrollTo({
        //                         top: additionalClaimInfoElement.offsetTop,
        //                         behavior: 'smooth',
        //                     });
        //                 }
        //             }
        //         });

        //     }
        // }
    }
    // added by Pir Ubaid User Story 181 
    getPatientStatementReport(practice_code: any) {
        return this.API.getData('/Report/DormantClaimsReports?Claim_no=' + practice_code);
    }
    // Added by Pir Ubaid (USER STORY 598 : Collection Status Addition )
    checkCollectionStatus(practice_code : any){
        return this.API.getData('/Demographic/CheckCollectionStatus?Claim_no='+ practice_code);
    }

    checkInsuranceReplication(){
        // for(let i=0;this.InsChild.changeInsurenceItem.length>i;i++){
        //     let item= this.InsChild.changeInsurenceItem[i]
        //     if(["1", "2", "3"].includes(item)){
        //     }else{
                
        //         if(!this.InsChild.changeInsuranceNumber.includes(item.index)){
        //             this.InsChild.changeInsuranceNumber.push(item.index);
        //         }
        //     }
           
        //    }
        let loopCompleted = true;

        for(let i=0;this.InsChild.changeInsurenceItem.length>i;i++)
        {
            let item= this.InsChild.changeInsurenceItem[i]
            if(this.InsChild.changeInsurenceItem.length<=3){
                this.scenario=5;
            }
            if(["1", "2", "3"].includes(item)){
            }else{
                if(this.InsChild.changeInsuranceNumber.includes(item.index)){
                    this.insuranceIndex=item.index
                if(!this.InsChild.PatientInsuranceResponse.some(items => items.Pri_Sec_Oth_Type === item.claimIns.claimInsurance.Pri_Sec_Oth_Type)){
                    this.insuranceMode=item.claimIns.claimInsurance.Pri_Sec_Oth_Type
                    this.addPatientIns=item.claimIns.claimInsurance
                    this.scenario=3
                    $('#Confirmation').modal('show');
                    loopCompleted = false;
                }else if(this.InsChild.PatientInsuranceResponse.some(items => items.Pri_Sec_Oth_Type === item.claimIns.claimInsurance.Pri_Sec_Oth_Type && items.Insurance_Id !=item.claimIns.claimInsurance.Insurance_Id)){
                    this.insuranceMode=item.claimIns.claimInsurance.Pri_Sec_Oth_Type
                    this.addPatientIns=item.claimIns.claimInsurance
                    for(let c=0;this.InsChild.PatientInsuranceResponse.length>c;c++){
                        if(this.InsChild.PatientInsuranceResponse[c].Pri_Sec_Oth_Type==item.claimIns.claimInsurance.Pri_Sec_Oth_Type && this.InsChild.PatientInsuranceResponse[c].Insurance_Id !=item.claimIns.claimInsurance.Insurance_Id){
                            this.updatePatientIns=this.InsChild.PatientInsuranceResponse[c];
                        }
                    }
                    this.scenario=1
                    $('#Confirmation').modal('show');
                    loopCompleted = false;
                }else if(this.InsChild.PatientInsuranceResponse.some(items => items.Pri_Sec_Oth_Type === item.claimIns.claimInsurance.Pri_Sec_Oth_Type && items.Insurance_Id == item.claimIns.claimInsurance.Insurance_Id && items.Policy_Number != item.claimIns.claimInsurance.Policy_Number)){
                    this.insuranceMode=item.claimIns.claimInsurance.Pri_Sec_Oth_Type
                    for(let c=0;this.InsChild.PatientInsuranceResponse.length>c;c++){
                        if(this.InsChild.PatientInsuranceResponse[c].Pri_Sec_Oth_Type==item.claimIns.claimInsurance.Pri_Sec_Oth_Type && this.InsChild.PatientInsuranceResponse[c].Insurance_Id ==item.claimIns.claimInsurance.Insurance_Id  && this.InsChild.PatientInsuranceResponse[c].Policy_Number !=item.claimIns.claimInsurance.Policy_Number){
                            this.updatePatientIns=this.InsChild.PatientInsuranceResponse[c];
                        }
                        this.updatePatientInsPolicyNumber=item.claimIns.claimInsurance.Policy_Number
                    }
                    this.scenario=2
                    $('#Confirmation').modal('show');
                    loopCompleted = false;
                    
                } else{
                    this.scenario=5
                    this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
                    if(this.InsChild.changeInsuranceNumber.length<=0){
                       this.saveClaimData()
                  
                    }else{
                   
                        this.saveClaim("Save");
                    }
                }
                break;
                }
            }
           
           }
      
   
    }

    addPatientInsurance(){
        this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
        let obj=this.addPatientIns;
        let patientobj= {
            Patient_Account: this.Gv.Patient_Account,
            Insurance_Id: (obj.Insurance_Id !== undefined) ? obj.Insurance_Id : null,
            Pri_Sec_Oth_Type: (obj.Pri_Sec_Oth_Type !== undefined) ? obj.Pri_Sec_Oth_Type : null,
            Co_Payment: (obj.Co_Payment !== undefined) ? obj.Co_Payment : null,
            Deductions: (obj.Deductions !== undefined) ? obj.Deductions : null,
            Policy_Number: (obj.Policy_Number !== undefined) ? obj.Policy_Number : null,
            Group_Number: (obj.Group_Number !== undefined) ? obj.Group_Number : null,
            Effective_Date: (obj.Effective_Date !== undefined) ? obj.Effective_Date : null,
            Termination_Date: (obj.Termination_Date !== undefined) ? obj.Termination_Date : null,
            Subscriber: (obj.Subscriber !== undefined) ? obj.Subscriber : null,
            Relationship: (obj.Relationship !== undefined) ? obj.Relationship : null,
            Eligibility_Status: (obj.Eligibility_Status !== undefined) ? obj.Eligibility_Status : null,
            Eligibility_S_No: (obj.Eligibility_S_No !== undefined) ? obj.Eligibility_S_No : null,
            Eligibility_Enquiry_Date: (obj.Eligibility_Enquiry_Date !== undefined) ? obj.Eligibility_Enquiry_Date : null,
            Access_Carolina_Number: (obj.Access_Carolina_Number !== undefined) ? obj.Access_Carolina_Number : null,
            Is_Capitated_Patient: (obj.Is_Capitated_Patient !== undefined) ? obj.Is_Capitated_Patient : null,
            Allowed_Visits: (obj.Allowed_Visits !== undefined) ? obj.Allowed_Visits : null,
            Remaining_Visits: (obj.Remaining_Visits !== undefined) ? obj.Remaining_Visits : null,
            Visits_Start_Date: (obj.Visits_Start_Date !== undefined) ? obj.Visits_Start_Date : null,
            Visits_End_Date: (obj.Visits_End_Date !== undefined) ? obj.Visits_End_Date : null,
            Created_By: (obj.Created_By !== undefined) ? obj.Created_By : null,
            Created_Date: (obj.Created_Date !== undefined) ? obj.Created_Date : null,
            Modified_By: (obj.Modified_By !== undefined) ? obj.Modified_By : null,
            Modified_Date: (obj.Modified_Date !== undefined) ? obj.Modified_Date : null,
            Deleted: (obj.Deleted !== undefined) ? obj.Deleted : null,
            CCN: (obj.CCN !== undefined) ? obj.CCN : null,
            Group_Name: (obj.Group_Name !== undefined) ? obj.Group_Name : null,
            Created_From: (obj.Created_From !== undefined) ? obj.Created_From : null,
            MCR_Sec_Payer: (obj.MCR_Sec_Payer !== undefined) ? obj.MCR_Sec_Payer : null,
            MCR_Sec_Payer_Code: (obj.MCR_Sec_Payer_Code !== undefined) ? obj.MCR_Sec_Payer_Code : null,
            Eligibility_Difference: (obj.Eligibility_Difference !== undefined) ? obj.Eligibility_Difference : null,
            Filing_Indicator_Code: (obj.Filing_Indicator_Code !== undefined) ? obj.Filing_Indicator_Code : null,
            Filing_Indicator: (obj.Filing_Indicator !== undefined) ? obj.Filing_Indicator : null,
            Plan_type: (obj.Plan_type !== undefined) ? obj.Plan_type : null,
            coverage_description: (obj.coverage_description !== undefined) ? obj.coverage_description : null,
            Co_Payment_Per: (obj.Co_Payment_Per !== undefined) ? obj.Co_Payment_Per : null,
            Plan_Name: (obj.Plan_Name !== undefined) ? obj.Plan_Name : null,
            Plan_Name_Type: (obj.Plan_Name_Type !== undefined) ? obj.Plan_Name_Type : null,
            PayerDescription: (obj.PayerDescription !== undefined) ? obj.PayerDescription : null,
            IS_Active: (obj.IS_Active !== undefined) ? obj.IS_Active : false,
            SubscriberName: (obj.SubscriberName !== undefined) ? obj.SubscriberName : null
        }
        
         this.API.PostData('/Demographic/SavePatientInsurance/', patientobj, (d) => {
        if (d.Status == "Sucess") {
            this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
            if(this.InsChild.changeInsuranceNumber.length<=0){
                this.saveClaimData()
              
            }else{
                this.saveClaim("Save");
            }
            // if (str == "") {
            //     swal('Patient Insurance has been saved.', '', 'success');
            //     // this.blnEditDemoChk = !this.blnEditDemoChk;
            // }
        }
        else {
            swal('Failed', d.Status, 'error');
        }
        })
    }

    editPatientInsurance(){
        this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
        this.API.PostData('/Demographic/SavePatientInsurance/', this.updatePatientIns, (d) => {
            if (d.Status == "Sucess") {
                if(this.scenario==1){
                    this.addPatientInsurance()
                }else{
                    if(this.InsChild.changeInsuranceNumber.length<=0){
                        this.saveClaimData()
                       
                    }else{
                        this.saveClaim("Save");
                    }
                }  
                // if (str == "") {
                //     swal('Patient Insurance has been saved.', '', 'success');
                //     // this.blnEditDemoChk = !this.blnEditDemoChk;
                // }
            }
            else {
                swal('Failed', d.Status, 'error');
            }
        })
    }
    saveClaimData(){
        this.API.PostData('/Demographic/SaveClaim', this.claimViewModel, (d) => {
                            if (d.Status == "Sucess") {
                                if (this.claimViewModel.ClaimModel.Claim_No == undefined || this.claimViewModel.ClaimModel.Claim_No == null || this.claimViewModel.ClaimModel.Claim_No == 0) {
                                    this.ClaimNumber = d.Response;
                                    this.claimViewModel.ClaimModel.Claim_No = this.ClaimNumber;
                                    this.claimInfo.claimNo = this.ClaimNumber;
                                }
                                this.ClaimNumber = this.claimViewModel.ClaimModel.Claim_No;
                                this.currentPatientStaus=this.claimViewModel.ClaimModel.Pat_Status;
                                this.claimInfo.claimNo = this.ClaimNumber;
                                if(this.CheckNewClaim==true)
                                 {
                                    this.AddAutoNotesForNewClaim();
                                }
                                if(this.CheckNewClaim == false && this.updatedNotes != null )
                                    {
                                       this. AddAutonNotesInDB();
                                   }

                                   if(this.SaveOverpayment==true &&this.TotaldueAmt < 0){
                                    this.API.PostData('/Demographic/AddClaimOverPayment', this.paymentresponsbility, (d) => {
                                        if (d.Status == "Success")
                                    {
                                          this.AddNotesForOverPayment(this.noteDetail);
                                          this.paymentResponsibilityForm.reset({ creditbalance: '', overpaid: '' });
                                          this.TotaldueAmt = ''; 
                       
                                   }
                                 
                                  });
                                   }
                                   if(this.TotaldueAmt>=0&&this.claimViewModel.ClaimModel.Claim_No!=null&&this.claimViewModel.ClaimModel.Claim_No!=0&&
                                    this.claimViewModel.ClaimModel.Claim_No!=undefined&&( this.insuranceoverpaid<0||
                                    this.patientcreditbalance<0)){
                                    this.UpdateCliamOverPayment();
                                   }
                                this.addClaimNotes( this.claimInfo.claimNo,this.currentPatientStaus,this.claimViewModel.ClaimModel.Amt_Due)
                                this.refresh();
                                if (this.claimInfo.claimNo > 0)
                                    this.getClaimModel();
                                else
                                    this.getEmptyClaim();
                                this.refresh();
                                swal('Claim', 'Patient Claim has been saved successfully.', 'success');
                                if(this.transfercrditbalPayment.length==0){
                                    this.getSetStatus();
                                }
                                
                             
                                
                            }
                            else {
                                swal('Failed', d.Status, 'error');
                            }
                        })
    }

    closeInsuranceModel(sen,de){
    
        $('#Confirmation').modal('hide');
        switch (sen) {
            case 1:
              {
                if(de=='Yes'){
                    this.updatePatientIns.Is_Active=true
                    this.editPatientInsurance();

                }else if(de=='No'){
                    this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
                    if(this.InsChild.changeInsuranceNumber.length<=0){
                        this.saveClaimData()
                      
                    }else{
                        this.saveClaim("Save");
                    }
                }else{
                    this.updatePatientIns.Pri_Sec_Oth_Type='O'
                    this.editPatientInsurance();
                }
              }
              break;
            case 2:
              {
                if(de=='Yes'){
                    this.updatePatientIns.Policy_Number=this.updatePatientInsPolicyNumber
                    this.editPatientInsurance()
                }else{
                    this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
                    if(this.InsChild.changeInsuranceNumber.length<=0){
                        this.saveClaimData()
                      
                    }else{
                        this.saveClaim("Save");
                    }
                }
              }
              break;
            case 3:
              {
                if(de=='Yes'){
                    this.addPatientInsurance()
                }else{
                    this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
                    if(this.InsChild.changeInsuranceNumber.length<=0){
                        this.saveClaimData()
                     
                    }else{
                        this.saveClaim("Save");
                    }
                }
              }
              break;
              case 5:
                {
                    alert("condition")
                    this.InsChild.changeInsuranceNumber = this.InsChild.changeInsuranceNumber.filter(item => item !== this.insuranceIndex);
                    if(this.InsChild.changeInsuranceNumber.length<=0){
                        alert("condition")
                        this.saveClaimData()
                       
                    }else{
                        this.saveClaim("Save");
                    }
                }
              break;
          }

    }




   
    checkIfAnyEraAdjustmentCodeMissing(): boolean {
        const excludedSources = ['P', 'Q', 'O', 'C', 'I'];

        for (const payment of this.claimViewModel.claimPayments) {
          const source = payment.claimPayments.Payment_Source;
          
          if (!excludedSources.includes(source)) {
            const amountAdjusted = payment.claimPayments.Amount_Adjusted;
            const adjCode = payment.claimPayments.ERA_ADJUSTMENT_CODE; // or use another field if needed
      if(payment.claimPayments.claim_payments_id==0)
        {
        if (amountAdjusted != null && parseFloat(amountAdjusted)  !== 0 && parseFloat(amountAdjusted)  !== 0.00 && amountAdjusted  !== '' && (!adjCode || adjCode.trim() === ''  || adjCode === null || adjCode == undefined)) 
          {
            return true; // invalid case found
          } 

      }
            // If adjustment amount is entered but code is missing
            
          }
        }
      
        return false; // all good
        // const validSources = [ 'P', 'Q', 'O', 'C', 'I'];
      
        // return this.claimViewModel.claimPayments.some(payment => {
        //   const source = payment.claimPayments.Payment_Source.trim();
        //   const isValidSource = validSources.includes(source);
      
        //   if (!isValidSource) return false;
      
        //   const amountAdjusted = payment.claimPayments.Amount_Adjusted;
        //   const hasAmount = amountAdjusted !== null && amountAdjusted !== undefined && parseFloat(amountAdjusted) > 0;
      
        //   const eraCode = payment.claimPayments.ERA_ADJUSTMENT_CODE;
        //   const isEraMissing = eraCode === null || eraCode.toString().trim() === '';
      
        //   return hasAmount && isEraMissing;
        // });
      }
  
    saveClaim(callType: string) {
      if(callType == "Draft"){
        this.ClaimDraftStatus=true
      }
      if(this.ClaimDraftStatus==true){
        callType="Draft"
      }
        if(this.claimViewModel.ClaimModel.Claim_No==0)
            {
                this.CheckNewClaim=true
            }
        this.saveclaimtype=callType;  
        this.dxList = [];
        this.ChildDiagnosis.Diag.map(d =>{
            if((d.Diagnosis.Diag_Expiry_Date !== null && d.Diagnosis.Diag_Expiry_Date !== undefined ) || (d.Diagnosis.Diag_Effective_Date !== null && d.Diagnosis.Diag_Effective_Date !== undefined)){
                this.setDxListForPopup(d.Diagnosis) 
            }    
        });
      
//Added by hamza akhlaq for negative handling
    if (this.ClaimBillingType=='I'){
    this.claimViewModel.ClaimModel.Claim_Type='I'
    this.concatenatedIds=`${this.Type_of_Facility_Id}${this.Type_of_Care_Id}${this.Sequence_of_care_Id}`;
    this.Admissiondetails.Type_of_Bill=this.concatenatedIds;
    this.claimViewModel.Admission_Details=this.Admissiondetails;
    if(this.ListCodes.CcOde!=null)
    this.claimViewModel.UbClaimDropdown.CcOde=this.ListCodes.CcOde;
    if(this.ListCodes.OccCode!=null)
    this.claimViewModel.UbClaimDropdown.OccCode=this.ListCodes.OccCode;
    if(this.ListCodes.OccSpanCode!=null)
    this.claimViewModel.UbClaimDropdown.OccSpanCode=this.ListCodes.OccSpanCode;
    if(this.ListCodes.ValueCode!=null)
    this.claimViewModel.UbClaimDropdown.ValueCode=this.ListCodes.ValueCode;
    
   
   
    // this.claimViewModel.UbClaimDropdown.CcOde=this.ListCodes.CcOde.slice();
    // this.claimViewModel.UbClaimDropdown.OccCode=this.ListCodes.OccCode.slice();
    // this.claimViewModel.UbClaimDropdown.OccSpanCode=this.ListCodes.OccSpanCode.slice();
    // this.claimViewModel.UbClaimDropdown.ValueCode=this.ListCodes.ValueCode.slice();

//     this.Codeslist.CcOde.forEach((item) => {
//         this.targetList.push(item);
//       });
//     this.Codeslist.CcOde.forEach => {
//            this.claimViewModel.UbClaimDropdown.CcOde[index]=code.CCOde 
//       });

//       this.Codeslist.Occcode.forEach((code, index) => {
//         this.claimViewModel.UbClaimDropdown.OccCode[index]=code.OccCode 
//    });



//    this.Codeslist.OccspanCode.forEach((code, index) => {
//     this.claimViewModel.UbClaimDropdown.OccSpanCode[index]=code.OccSpanCode 
// });

// this.Codeslist.ValueCode.forEach((code, index) => {
//  this.claimViewModel.UbClaimDropdown.ValueCode[index]=code.ValueCode 
// });
// 1



}
else if (this.ClaimBillingType=='P') {
    this.claimType='P'
    this.claimViewModel.ClaimModel.Claim_Type='P'
}
else{
    //..this is changed by abbas edi
    this.claimViewModel.ClaimModel.Claim_Type='P'
}
        this.claimViewModel.ClaimModel.Is_Draft = callType === 'Draft' ? true : false;
        if (callType == 'Draft') {
            if (this.claimViewModel.ClaimModel.Delay_Reason_Code == null || this.claimViewModel.ClaimModel.Delay_Reason_Code == undefined || this.claimViewModel.ClaimModel.Delay_Reason_Code == "") {
                this.claimForm.get('hospitalization.ptlStatus').setValue(false)
                $(document).scrollTop(60) // any value you need
                return
            }
            this.claimForm.get('hospitalization.ptlStatus').setValue(true)
            this.claimViewModel.ClaimModel.PTL_Status = true

        } else {
            this.claimViewModel.ClaimModel.Delay_Reason_Code = null
            this.claimViewModel.ClaimModel.PTL_Status = false
        }

        
        this.claimViewModel.ClaimModel.Patient_Account = this.claimInfo.Patient_Account;
        this.claimViewModel.PatientAccount = this.claimInfo.Patient_Account;
        this.claimViewModel.PracticeCode = this.Gv.currentUser.selectedPractice.PracticeCode;
        this.claimViewModel.claimCharges = this.claimCharges;
        this.claimViewModel.claimPayments = this.paymentChild.claimPaymentModel;

        // this.claimViewModel.PTLReasons = [];
        this.Diag = this.ChildDiagnosis.Diag;
      
        if (this.Diag[0] != undefined && this.Diag[0].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code1 = this.Diag[0].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code1 = null;
        if (this.Diag[1] != undefined && this.Diag[1].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code2 = this.Diag[1].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code2 = null;
        if (this.Diag[2] != undefined && this.Diag[2].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code3 = this.Diag[2].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code3 = null;
        if (this.Diag[3] != undefined && this.Diag[3].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code4 = this.Diag[3].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code4 = null;
        if (this.Diag[4] != undefined && this.Diag[4].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code5 = this.Diag[4].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code5 = null;
        if (this.Diag[5] != undefined && this.Diag[5].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code6 = this.Diag[5].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code6 = null;
        if (this.Diag[6] != undefined && this.Diag[6].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code7 = this.Diag[6].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code7 = null;
        if (this.Diag[7] != undefined && this.Diag[7].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code8 = this.Diag[7].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code8 = null;
        if (this.Diag[8] != undefined && this.Diag[8].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code9 = this.Diag[8].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code9 = null;
        if (this.Diag[9] != undefined && this.Diag[9].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code10 = this.Diag[9].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code10 = null;
        if (this.Diag[10] != undefined && this.Diag[10].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code11 = this.Diag[10].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code11 = null;
        if (this.Diag[12] != undefined && this.Diag[12].Diagnosis.Code != '')
            this.claimViewModel.ClaimModel.DX_Code12 = this.Diag[11].Diagnosis.Code;
        else
            this.claimViewModel.ClaimModel.DX_Code12 = null;
  
            if(this.dxList.length > 0){
                this.DXCodeExpriyModel();
                // swal('Error', 'The diagnosis code is not valid as it is outside the defined effective and expiration dates. Please select a valid code', 'error')

            }else{


        // this.claimViewModel.ClaimModel.DX_Code1 = (this.ChildDiagnosis.dx1.DiagnoseCode == undefined || this.ChildDiagnosis.dx1.DiagnoseCode == null) ? undefined : $.trim(this.ChildDiagnosis.dx1.DiagnoseCode);
        // this.claimViewModel.ClaimModel.DX_Code2 = (this.ChildDiagnosis.dx2.DiagnoseCode == undefined || this.ChildDiagnosis.dx2.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx2.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code3 = (this.ChildDiagnosis.dx3.DiagnoseCode == undefined || this.ChildDiagnosis.dx3.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx3.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code4 = (this.ChildDiagnosis.dx4.DiagnoseCode == undefined || this.ChildDiagnosis.dx4.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx4.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code5 = (this.ChildDiagnosis.dx5.DiagnoseCode == undefined || this.ChildDiagnosis.dx5.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx5.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code6 = (this.ChildDiagnosis.dx6.DiagnoseCode == undefined || this.ChildDiagnosis.dx6.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx6.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code7 = (this.ChildDiagnosis.dx7.DiagnoseCode == undefined || this.ChildDiagnosis.dx7.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx7.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code8 = (this.ChildDiagnosis.dx8.DiagnoseCode == undefined || this.ChildDiagnosis.dx8.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx8.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code9 = (this.ChildDiagnosis.dx9.DiagnoseCode == undefined || this.ChildDiagnosis.dx9.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx9.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code10 = (this.ChildDiagnosis.dx10.DiagnoseCode == undefined || this.ChildDiagnosis.dx10.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx10.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code11 = (this.ChildDiagnosis.dx11.DiagnoseCode == undefined || this.ChildDiagnosis.dx11.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx11.DiagnoseCode));
        // this.claimViewModel.ClaimModel.DX_Code12 = (this.ChildDiagnosis.dx12.DiagnoseCode == undefined || this.ChildDiagnosis.dx12.DiagnoseCode == null ? undefined : $.trim(this.ChildDiagnosis.dx12.DiagnoseCode));
        //   this.funDXCalculation();

        this.claimViewModel.claimInusrance = this.InsChild.claimInsuranceModel;
        if (!this.canSave()) {
            return;
        }
        if (this.isNewClaim())
            this.claimViewModel.ClaimModel.Is_Corrected = false;
            this.claimViewModel.claimCharges.forEach(x => {
            if (x.claimCharges.Start_Time != null && x.claimCharges.Start_Time != undefined) {
                //..below change done by tamour for start time conversion to datetime..
                let timeArr = x.claimCharges.Start_Time.split(":");
                if (timeArr.length === 2) {
                    let hours = parseInt(timeArr[0]);
                    let minutes = parseInt(timeArr[1]);

                    if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                        let dt = new Date();
                        dt.setHours(hours);
                        dt.setMinutes(minutes);
                        dt.setSeconds(0);
                        x.claimCharges.Start_Time = dt.toLocaleString('en-US');
                    }
                }
                //.....
            }
            if (x.claimCharges.Stop_Time != null && x.claimCharges.Stop_Time != undefined) {
                //..below change done by tamour for stop time conversion to datetime..
                let timeArr = x.claimCharges.Stop_Time.split(":");
                if (timeArr.length === 2) {
                    let hours = parseInt(timeArr[0]);
                    let minutes = parseInt(timeArr[1]);

                    if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                        let dt = new Date();
                        dt.setHours(hours);
                        dt.setMinutes(minutes);
                        dt.setSeconds(0);
                        x.claimCharges.Stop_Time = dt.toLocaleString('en-US');
                    }
                }
            }
        
        })

        this.dormantCheck().then(result => {
            if (result) {
                return false;
            }
             else {
                this.collectionCheck().then(collectionResult => {
                    if (collectionResult) {
                        swal('Failed', 'Max statement count is not met.', 'error');
                        return false;
                    }
                    if(this.UpdateDx!=null && this.UpdateDx !=""){
                        this.AutoNotesForDaigCode();
                    }
                    this.updatedNotes[0] = 
                    (this.combinedNoteString ? this.combinedNoteString + " | " : "") +
                    (this.updatemessageofdxafterdelete ? this.updatemessageofdxafterdelete + " | " : "") +
                    (this.deletedproceduremessage.length ? this.deletedproceduremessage.join("|") + " | " : "") +
                    (this.addproccodeuremessage.length ? this.addproccodeuremessage.join("|") + " | " : "") +
                    (this.adddaigcodemessage.length ? this.adddaigcodemessage.join("|") + " | " : "") +
                    (this.deletedaigcodemessage.length ? this.deletedaigcodemessage.join("|") + " | " : "") +
                    (this.notestringforprocedureupdate ? this.notestringforprocedureupdate + " | " : "") +
                    (this.updatedaigcodemessage.length ? this.updatedaigcodemessage.join("|") : "") +
                    (this.updatedraftmessage.length ? this.updatedraftmessage.join("|") : "");
                    
                
                // Remove trailing pipe if it exists
                this.updatedNotes[0] = this.updatedNotes[0].replace(/\|\s*$/, "");
                        this.claimViewModel.claimPayments.forEach(procedure => {
                            // if(procedure.claimPayments.Payment_Source!== ('P'&&'I'&&'C'&&''))
                            if ( procedure.claimPayments.Payment_Source !== 'I' && procedure.claimPayments.Payment_Source !== 'C') {
                                if (procedure.claimPayments.Paid_Proc_Code !== null && procedure.claimPayments.Charged_Proc_Code !== null && procedure.claimPayments.Charged_Proc_Code !== undefined) {
                                    procedure.claimPayments.Paid_Proc_Code = procedure.claimPayments.Paid_Proc_Code.substring(0, 5);
                                }
                                if (procedure.claimPayments.Charged_Proc_Code !== null && procedure.claimPayments.Charged_Proc_Code !== null && procedure.claimPayments.Charged_Proc_Code !== undefined) {
                                    procedure.claimPayments.Charged_Proc_Code = procedure.claimPayments.Charged_Proc_Code.substring(0, 5);
                                }
                            }
                            //..Here we will compare the original entry date and altered entry date to restrict from updating the wrong one
                        if((procedure.claimPayments.claim_payments_id!=0 && procedure.claimPayments.Date_Entry_Original != undefined)
                        &&  (moment.utc(procedure.claimPayments.Date_Entry).format('MM/DD/YYYY') == moment.utc(procedure.claimPayments.Date_Entry_Original).format('MM/DD/YYYY')))
                            {
                                procedure.claimPayments.Date_Entry=procedure.claimPayments.Date_Entry_Original;
                            }
      
                        });
                        if(this.claimViewModel.ClaimModel.Pat_Status=== 'D')
                        {
                            this.claimViewModel.ClaimModel.Pri_Status= 'P';
                            this.claimViewModel.ClaimModel.Sec_Status= 'P';
                            this.claimViewModel.ClaimModel.Oth_Status= 'P'  
                        }
                        if(this.claimViewModel.ClaimModel.Pat_Status=== 'C')
                        {
                            this.claimViewModel.ClaimModel.Pri_Status= 'P';
                            this.claimViewModel.ClaimModel.Sec_Status= 'P';
                            this.claimViewModel.ClaimModel.Oth_Status= 'P'  
                        }
                        if (this.claimViewModel.claimPayments != null) {

                            
                            if(this.checkIfAnyEraAdjustmentCodeMissing()){
                                swal('Failed', ' Please enter an Adjustment code', 'error')
                                return
                            }
                          
                           
                          } 

                        if(this.claimViewModel.ClaimModel.Claim_No==0){
                            this.generatePaymentNotes(this.claimViewModel.claimPayments,'newclaim')
                        }
                        else{
                            this.generatePaymentNotes(this.claimViewModel.claimPayments,'oldclaim')
                        }
                        if(this.claimViewModel.ClaimModel.Claim_No != 0)
                        {
                            this.generateInsuranceNotes(this.claimViewModel.claimInusrance)
                        }
                        if(this.scenario==undefined)
                        {
                            this.scenario=0;
                        }
                        this.transfercrditbalPayment=this.claimViewModel.claimPayments.filter(p=>p.claimPayments.Payment_Source=="T"&& p.claimPayments.claim_payments_id===0)
                        if(this.transfercrditbalPayment.length>0&&this.tcbModalShow==false){
                          this.showtcbmodel();
                                   if(this.updatedNotes.length == 0){
                            this.InsChild.changesofInsurance =false
                           }
                          return;
                        }
                        debugger
                        this.CalculateNegativeBalance();
                        debugger
                        if(this.TotaldueAmt<0&&this.showoverpayment==true){
                          this.showOverPaymentModel()
                          return
                        }
                        if(this.updatedNotes!=null && this.updatedNotes.length > 0 && this.updatedNotes[0] !=""  && this.Gv.currentUser.selectedPractice.ClaimNotePopUp==true && this.autonotemodelskip != true ){
                            this.notesPopUpData="";
                            this.notesPopUpData= this.updatedNotes[0];
                            this.updatedNotes=[];
                            this.showAutoNoteModel();
                            
                            return;
                        }
                        
                     
                            this.checkInsuranceReplication();
                          
                        
                            
                        if(this.InsChild.changesofInsurance !=true){
                            this.saveClaimData()
                            // this.API.PostData('/Demographic/SaveClaim', this.claimViewModel, (d) => {
                            //     if (d.Status == "Sucess") {
                            //         if (this.claimViewModel.ClaimModel.Claim_No == undefined || this.claimViewModel.ClaimModel.Claim_No == null || this.claimViewModel.ClaimModel.Claim_No == 0) {
                            //             this.ClaimNumber = d.Response;
                            //             this.claimViewModel.ClaimModel.Claim_No = this.ClaimNumber;
                            //             this.claimInfo.claimNo = this.ClaimNumber;
                            //         }
                            //         this.ClaimNumber = this.claimViewModel.ClaimModel.Claim_No;
                            //         this.currentPatientStaus=this.claimViewModel.ClaimModel.Pat_Status;
                            //         this.claimInfo.claimNo = this.ClaimNumber;
                            //         if(this.CheckNewClaim==true)
                            //             {
                            //                this.AddAutoNotesForNewClaim();
                            //             }   
                            //             debugger
                            //             debugger;
                            //             if(this.CheckNewClaim == false && this.updatedNotes.length > 0 && this.updatedNotes[0]!="")
                            //              {
                            //                 this. AddAutonNotesInDB();
                            //              }                                       
                            //         this.addClaimNotes( this.claimInfo.claimNo,this.currentPatientStaus,this.claimViewModel.ClaimModel.Amt_Due)
                            //         this.refresh();
                            //         if (this.claimInfo.claimNo > 0)
                            //             this.getClaimModel();
                            //         else
                            //             this.getEmptyClaim();
                            //         this.refresh();
                            //         swal('Claim', 'Patient Claim has been saved successfully.', 'success');
                            //         this.getSetStatus();
                            //     }
                            //     else {
                            //         swal('Failed', d.Status, 'error');
                            //     }
                            // })
                        }
                    
                });
            }
        });
    }
        
    }

    // hasIssues(): boolean => {
    //     this.dxList.some((code) => {
    //         if(code.afterExpiry)
    //             this.codeHasIssue ='Expiry'
    //         else               
    //          this.codeHasIssue ='Effective'
    //         return
    //     })
           

    // }
    setDxListForPopup(itemAtIndex:any){
      const claimDate = new Date( this.claimDos); 
        const expiryDate = new Date(itemAtIndex.Diag_Expiry_Date);
        const effectiveDate = new Date(itemAtIndex.Diag_Effective_Date);
        if(claimDate < effectiveDate && (itemAtIndex.Diag_Effective_Date !== null && itemAtIndex.Diag_Effective_Date !== undefined)){
            const data ={
                name:  itemAtIndex.Code,
                description : itemAtIndex.Description,
                beforeEffective :  true,
                afterExpiry : false,
            }
            
            this.dxList.push(data);
            this.codeHasIssue = 'Effective';
        
        }else if(claimDate > expiryDate && (itemAtIndex.Diag_Expiry_Date !== null && itemAtIndex.Diag_Expiry_Date !== undefined)){
            const data ={
                name:  itemAtIndex.Code,
                description : itemAtIndex.Description,
                beforeEffective :  false,
                afterExpiry : true,
            }
            this.dxList.push(data);
            this.codeHasIssue = 'Expiry';

        }
    }

    updateClaimChargesSequenceNumbers() {
        //this.DeleteCpt=this.claimCharges[this.deletedindex].claimCharges.Procedure_Code
        let deletedClaimCharges = this.claimCharges.filter(c => c.claimCharges.Deleted === true);
        this.claimCharges = this.claimCharges.filter(c => c.claimCharges.Deleted === false || c.claimCharges.Deleted === null).map((cc, index) => ({
            ...cc,
            claimCharges: {
                ...cc.claimCharges,
                Sequence_No: index + 1
            }
        }));
        this.claimCharges = [...this.claimCharges, ...deletedClaimCharges];
        // const deletedSequenceNumbers = deletedClaimCharges.map(charge => charge.claimCharges.Sequence_No);
        // this.deletedcptseq = deletedSequenceNumbers;
        // this.deletedindex=this.deletedcptseq-1
    
        if (this.claimCharges.length > 0) {
            let lastindex=this.claimCharges.length-1;
            if (this.claimCharges[lastindex].Description == null || this.claimCharges[lastindex].Description == "") 
            {
               this.Cptsequenceno=this.claimCharges[lastindex].claimCharges.Sequence_No;
            }
        } 
        this.AutoNotesForProc(this.deletedindex);

    }

    DeleteCPT(ndx: number) {
        if (this.claimCharges[ndx].claimCharges.claim_charges_id == undefined || this.claimCharges[ndx].claimCharges.claim_charges_id == null || this.claimCharges[ndx].claimCharges.claim_charges_id == 0) {
            this.DeleteCpt=this.claimCharges[ndx].claimCharges.Procedure_Code;
            this.DeleteCptSeq=this.claimCharges[ndx].claimCharges.Sequence_No;
            this.claimCharges.splice(ndx, 1);
            this.Deletedcpt= true;
            this.deletedindex= ndx;         
            this.updateClaimChargesSequenceNumbers();
            return;
        }
        // By Sohail Ahmed as per Instructions of Ibrahim Bahi : Dated 02/25/2019
        this.claimViewModel.claimPayments = this.paymentChild.claimPaymentModel;
        for (var i = 0; i < this.claimViewModel.claimPayments.length; i++) {
            if (this.claimViewModel.claimPayments[i].claimPayments.Deleted == false)
                if (this.claimCharges[ndx].claimCharges.Procedure_Code == this.claimViewModel.claimPayments[i].claimPayments.Charged_Proc_Code) {
                    swal('Failed', "Can't delete entry because charges are used in payments.", 'error');
                    return;
                }
        }
        if (this.alreadySaveOnce) {
            if ((new Date(this.claimCharges[ndx].claimCharges.Created_Date).getMonth() == new Date().getMonth())
                &&
                (new Date(this.claimCharges[ndx].claimCharges.Created_Date).getFullYear() == new Date().getFullYear())) {
                this.claimCharges[ndx].claimCharges.Deleted = true;
                this.Deletedcpt= true;
                this.DeleteCpt=this.claimCharges[ndx].claimCharges.Procedure_Code;
                this.DeleteCptSeq=this.claimCharges[ndx].claimCharges.Sequence_No;
                this.deletedindex= ndx;
                this.updateClaimChargesSequenceNumbers();
            }
            else if (isNaN(new Date(this.claimCharges[ndx].claimCharges.Created_Date).getMonth())) {
                this.claimCharges[ndx].claimCharges.Deleted = true;
                this.Deletedcpt= true;
                this.DeleteCpt=this.claimCharges[ndx].claimCharges.Procedure_Code;
                this.DeleteCptSeq=this.claimCharges[ndx].claimCharges.Sequence_No;
                this.deletedindex= ndx;
                this.updateClaimChargesSequenceNumbers();
            }
            else {
                swal('Failed', "Cannot delete entry of previous month(s).", 'error');
            }
        }
        else {
            this.claimCharges[ndx].claimCharges.Deleted = true;
            this.Deletedcpt= true;
            this.deletedindex= ndx;
            this.DeleteCpt=this.claimCharges[ndx].claimCharges.Procedure_Code;
            this.DeleteCptSeq=this.claimCharges[ndx].claimCharges.Sequence_No;
            this.updateClaimChargesSequenceNumbers();
        }
    }
    dateMask(event: any) {
        var v = event.target.value;
        if (v.match(/^\d{2}$/) !== null) {
            event.target.value = v + '/';
        } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
            event.target.value = v + '/';
        }
    }

    AddNewCPT() {
        //this.showOverPaymentModel();
        let AddRow = false;
        let allDeleted = 0;
        let chargesLength = 0;
        if (this.claimCharges != undefined) {
            chargesLength = this.claimCharges.length;
            if (chargesLength > 0) {
                for (var count = 0; count <= chargesLength - 1; count++)
                    if (this.claimCharges[count].claimCharges.Deleted == true)
                        allDeleted++;
            }
        }
        if (chargesLength > 0) {
            if (allDeleted == chargesLength)
                AddRow = true;
        }
        if (chargesLength >= 1) {
            let index = 1;
            for (var chkDel = 1; chkDel <= chargesLength; chkDel++) {
                if (this.claimCharges[chargesLength - chkDel].claimCharges.Deleted && (this.claimCharges[chargesLength - 1].claimCharges.Procedure_Code == undefined || this.claimCharges[chargesLength - 1].claimCharges.Procedure_Code == null)) {
                    index++;
                }
                else
                    chkDel = chargesLength;
            }
            if (index <= chargesLength) {
                if (this.claimCharges[chargesLength - index].claimCharges.Procedure_Code != undefined && this.claimCharges[chargesLength - index].claimCharges.Procedure_Code != "" && this.claimCharges[chargesLength - index].claimCharges.Procedure_Code != null && this.claimCharges[chargesLength - index].claimCharges.Sequence_No != null && this.claimCharges[chargesLength - index].claimCharges.Sequence_No != undefined)
                    AddRow = true;
            }
            else
                AddRow = true;
        }
        else
            AddRow = true;
        if (AddRow) {
            var cc = new ClaimCharges();
            
        }
        cc.claimCharges.IsRectify = false;
        this.Addedcpt=true;
        cc.claimCharges.Include_In_Edi = false;
        cc.claimCharges.Deleted = false;
       
        cc.claimCharges.POS = 20;
        if (this.Diag[0] && this.Diag[0].Diagnosis && !Common.isNullOrEmpty(this.Diag[0].Diagnosis.Code))
            cc.claimCharges.DX_Pointer1 = 1;
        if (this.Diag[1] && this.Diag[1].Diagnosis && !Common.isNullOrEmpty(this.Diag[1].Diagnosis.Code))
            cc.claimCharges.DX_Pointer2 = 2;
        if (this.Diag[2] && this.Diag[2].Diagnosis && !Common.isNullOrEmpty(this.Diag[2].Diagnosis.Code))
            cc.claimCharges.DX_Pointer3 = 3;
        if (this.Diag[3] && this.Diag[3].Diagnosis && !Common.isNullOrEmpty(this.Diag[3].Diagnosis.Code))
            cc.claimCharges.DX_Pointer4 = 4;

        cc.claimCharges.DOE = moment(new Date()).format("MM/DD/YYYY");
        cc.claimCharges.Dos_From = this.claimDos;
        cc.claimCharges.Dos_To = this.claimDos;
        // as we know that, if we delete any saved claim charges, it will deleted locally.
        // and after deleting any saved claim charges, if user add the new claim charges before saving the deleted in database.
        // in get CPT charges we will get the wrong index of adding new CPT charges.
        // to fix this issue, while adding any new claim charges, we will move the deleted claim charges at the end of array.
        let deletedCharges = this.claimCharges.filter(c => c.claimCharges.Deleted === true);
        let notDeletedCharges = this.claimCharges.filter(c => c.claimCharges.Deleted !== true);
        this.claimCharges = [...notDeletedCharges, cc, ...deletedCharges];


        this.updateClaimChargesSequenceNumbers();
         // Force Angular to detect changes
         this.cd.detectChanges();
        let count2 = 0;
        this.InsChild.claimInsuranceModel.forEach(
            x => {
                if (x.claimInsurance.Deleted == true) {
                    count2++
                }
            }
        )
        if (this.InsChild.claimInsuranceModel[0].claimInsurance.Deleted == false) {
            count2 = 0;
        }

        if (this.InsChild.claimInsuranceModel.length > 0 && this.InsChild.claimInsuranceModel.length != count2) {

            if (this.InsChild.claimInsuranceModel[count2].InsurancePayerName.includes("Medicaid") || this.InsChild.claimInsuranceModel[count2].InsurancePayerName.includes("Medicaid MCO")) {
                if (this.claimViewModel.BillingPhysiciansList.length > 0) {
                    if (this.claimViewModel.BillingPhysiciansList[0].SPECIALIZATION_CODE == '050' && this.claimViewModel.BillingPhysiciansList[0].provider_State == 'OH') {
                        //  $("#Modifier_Code option[value=SA]").attr('selected', 'selected');

                        this.claimCharges.forEach(x => {
                            x.claimCharges.Modi_Code1 = "SA"
                        })


                    }
                }

            }

        }
    }

    AddNewCPTPanelCode() {
        let AddRow = false;
        let allDeleted = 0;
        let chargesLength = 0;
        if (this.claimCharges != undefined) {
            chargesLength = this.claimCharges.length;
            if (chargesLength > 0) {
                for (var count = 0; count <= chargesLength - 1; count++)
                    if (this.claimCharges[count].claimCharges.Deleted == true)
                        allDeleted++;
            }
        }
        if (chargesLength > 0) {
            if (allDeleted == chargesLength)
                AddRow = true;
        }
        if (chargesLength >= 1) {
            let index = 1;
            for (var chkDel = 1; chkDel <= chargesLength; chkDel++) {
                if (this.claimCharges[chargesLength - chkDel].claimCharges.Deleted && (this.claimCharges[chargesLength - 1].claimCharges.Procedure_Code == undefined || this.claimCharges[chargesLength - 1].claimCharges.Procedure_Code == null)) {
                    index++;
                }
                else
                    chkDel = chargesLength;
            }
            if (index <= chargesLength) {
                if (this.claimCharges[chargesLength - index].claimCharges.Procedure_Code != undefined && this.claimCharges[chargesLength - index].claimCharges.Procedure_Code != "" && this.claimCharges[chargesLength - index].claimCharges.Procedure_Code != null && this.claimCharges[chargesLength - index].claimCharges.Sequence_No != null && this.claimCharges[chargesLength - index].claimCharges.Sequence_No != undefined)
                    AddRow = true;
            }
            else
                AddRow = true;
        }
        else
            AddRow = true;
        if (AddRow) {
            var cc = new ClaimCharges();  
        }
        
        cc.claimCharges.IsRectify = false;
        cc.claimCharges.Include_In_Edi = false;
        cc.claimCharges.Deleted = false;
        cc.claimCharges.POS = 20;
        if (this.response && this.response.length > 0) {
            this.response.forEach(cptData=>{
                const newClaimCharge = this.mapCPTDataToClaimCharge(cptData);
                const newClaimChargesWrapper = new ClaimCharges();
               // newClaimChargesWrapper.claimCharges = newClaimCharge;
              //  newClaimChargesWrapper.Description = cptData.Cpt_Description;
                this.claimCharges.push(newClaimCharge);
                
               // let cptData = this.response[0];  // Using the first element of the response for the CPT data
                
                 // Map the CPT data to the new claim charge object
                //  cc.claimCharges.Procedure_Code = cptData.Cpt_Code;
                //  // cc.claimCharges.Procedure_Description = cptData.Cpt_Description;
                //  cc.claimCharges.Alternate_Code = cptData.Alternate_Code;
                //  cc.claimCharges.Modi_Code1 = cptData.M_1;
                //  cc.claimCharges.Modi_Code2 = cptData.M_2;
                //  cc.claimCharges.Modi_Code3 = cptData.M_3;
                //  cc.claimCharges.Modi_Code4 = cptData.M_4;
                //  cc.claimCharges.POS = cptData.Pos_From_Services;
                //  cc.claimCharges.Units = cptData.Units;
                //   cc.claimCharges.Amount = cptData.Charges;
                //   cc.Description = cptData.Cpt_Description;  
                //   cc.claimCharges.Include_In_Edi = true;
                //  this.claimCharges.push(cc);
            });

        }
        // if (this.Diag[0] && this.Diag[0].Diagnosis && !Common.isNullOrEmpty(this.Diag[0].Diagnosis.Code))
        //     cc.claimCharges.DX_Pointer1 = 1;
        // if (this.Diag[1] && this.Diag[1].Diagnosis && !Common.isNullOrEmpty(this.Diag[1].Diagnosis.Code))
        //     cc.claimCharges.DX_Pointer2 = 2;
        // if (this.Diag[2] && this.Diag[2].Diagnosis && !Common.isNullOrEmpty(this.Diag[2].Diagnosis.Code))
        //     cc.claimCharges.DX_Pointer3 = 3;
        // if (this.Diag[3] && this.Diag[3].Diagnosis && !Common.isNullOrEmpty(this.Diag[3].Diagnosis.Code))
        //     cc.claimCharges.DX_Pointer4 = 4;

        // cc.claimCharges.DOE = moment(new Date()).format("MM/DD/YYYY");
        // cc.claimCharges.Dos_From = this.claimDos;
        // cc.claimCharges.Dos_To = this.claimDos;
        // // as we know that, if we delete any saved claim charges, it will deleted locally.
        // // and after deleting any saved claim charges, if user add the new claim charges before saving the deleted in database.
        // // in get CPT charges we will get the wrong index of adding new CPT charges.
        // // to fix this issue, while adding any new claim charges, we will move the deleted claim charges at the end of array.
        // let deletedCharges = this.claimCharges.filter(c => c.claimCharges.Deleted === true);
        // let notDeletedCharges = this.claimCharges.filter(c => c.claimCharges.Deleted !== true);
        // this.claimCharges = [...notDeletedCharges, cc, ...deletedCharges];


        this.updateClaimChargesSequenceNumbers();
         // Force Angular to detect changes
         this.cd.detectChanges();
        let count2 = 0;
        this.InsChild.claimInsuranceModel.forEach(
            x => {
                if (x.claimInsurance.Deleted == true) {
                    count2++
                }
            }
        )
        if (this.InsChild.claimInsuranceModel[0].claimInsurance.Deleted == false) {
            count2 = 0;
        }

        if (this.InsChild.claimInsuranceModel.length > 0 && this.InsChild.claimInsuranceModel.length != count2) {

            if (this.InsChild.claimInsuranceModel[count2].InsurancePayerName.includes("Medicaid") || this.InsChild.claimInsuranceModel[count2].InsurancePayerName.includes("Medicaid MCO")) {
                if (this.claimViewModel.BillingPhysiciansList.length > 0) {
                    if (this.claimViewModel.BillingPhysiciansList[0].SPECIALIZATION_CODE == '050' && this.claimViewModel.BillingPhysiciansList[0].provider_State == 'OH') {
                        //  $("#Modifier_Code option[value=SA]").attr('selected', 'selected');

                        this.claimCharges.forEach(x => {
                            x.claimCharges.Modi_Code1 = "SA"
                        })


                    }
                }

            }

        }
       

    }
    private mapCPTDataToClaimCharge(cptData): ClaimCharges {
    const cc = new claimCharges();
    cc.claimCharges.Procedure_Code = cptData.Cpt_Code;
    cc.claimCharges.Alternate_Code = cptData.Alternate_Code;
    cc.claimCharges.Modi_Code1 = cptData.M_1;
    cc.claimCharges.Modi_Code2 = cptData.M_2;
    cc.claimCharges.Modi_Code3 = cptData.M_3;
    cc.claimCharges.Modi_Code4 = cptData.M_4;
    cc.claimCharges.POS = cptData.Pos_From_Services || 20;
    cc.claimCharges.Units = cptData.Units;
    cc.claimCharges.Amount = cptData.Charges;
    cc.claimCharges.Include_In_Edi = true;
    cc.claimCharges.Deleted = false;
    cc.Description = cptData.Cpt_Description;
    cc.claimCharges.Dos_From = this.claimDos;
    cc.claimCharges.Dos_To = this.claimDos;
    cc.claimCharges.isRevenue_CodeDisabled = false;
   cc.claimCharges.DOE = moment(new Date()).format("MM/DD/YYYY");
   if (this.Diag[0] && this.Diag[0].Diagnosis && !Common.isNullOrEmpty(this.Diag[0].Diagnosis.Code))
   cc.claimCharges.DX_Pointer1 = 1;
if (this.Diag[1] && this.Diag[1].Diagnosis && !Common.isNullOrEmpty(this.Diag[1].Diagnosis.Code))
   cc.claimCharges.DX_Pointer2 = 2;
if (this.Diag[2] && this.Diag[2].Diagnosis && !Common.isNullOrEmpty(this.Diag[2].Diagnosis.Code))
   cc.claimCharges.DX_Pointer3 = 3;
if (this.Diag[3] && this.Diag[3].Diagnosis && !Common.isNullOrEmpty(this.Diag[3].Diagnosis.Code))
   cc.claimCharges.DX_Pointer4 = 4;
    return cc;
}

    NewRowCharges(event: KeyboardEvent, ndx: number) {
        let claimChargesLength = 0;
        if (event.keyCode == 40) {//down key
            for (var notDel = 0; notDel < this.claimCharges.length; notDel++) {
                if (!this.claimCharges[notDel].claimCharges.Deleted)
                    claimChargesLength++;
            }
            let rowFlag: number = -1;
            var element = $("#procedure-section table tbody tr:visible");
            let p = 0;
            $($(element)[ndx]).find("input").each(function () {
                p++;
                if ($(this).is(":focus")) {
                    return false;
                }
            });
            if (claimChargesLength - 1 > ndx) {
                var input = $($(element)[ndx]).find(":focus").is("input");
                if (input) {
                    $($($(element[ndx + 1]).find("input"))[p - 1]).focus();
                    return;
                }
            }

            for (var i = 0; i < element.length - 1; i++) {
                var hasfocus = $($(element)[i]).find(":focus").length;
                var isInput = $($(element)[i]).find(":focus").is("input");
                if (hasfocus > 0 && isInput) {
                    if (claimChargesLength <= ndx + 1 && (this.claimCharges[ndx].claimCharges.Procedure_Code != null && this.claimCharges[ndx].claimCharges.Procedure_Code != "" && this.claimCharges[ndx].claimCharges.Procedure_Code != undefined && this.claimCharges[ndx].claimCharges.Sequence_No != null && this.claimCharges[ndx].claimCharges.Sequence_No != undefined)) {
                        this.AddNewCPT();
                        this.AddNewCPTPanelCode();
                        rowFlag = i;
                    }
                    else
                        $($($(element[i + 1]).find("input"))[4]).focus();
                }
            }
            if (rowFlag > -1) {
                setTimeout(function () {
                    $($($($("#procedure-section table tbody tr:visible")[rowFlag + 1]).find("input"))[4]).focus();
                }, 200);
            }
        }
        if (event.keyCode == 38) {// up key
            for (var notDel = 0; notDel < this.claimCharges.length; notDel++) {
                if (!this.claimCharges[notDel].claimCharges.Deleted)
                    claimChargesLength++;
            }
            var element = $("#procedure-section table tbody tr:visible");
            let p = 0;
            $($(element)[ndx]).find("input").each(function () {
                p++;
                if ($(this).is(":focus")) {
                    return false;
                }
            });
            if (ndx > 0) {
                var input = $($(element)[ndx]).find(":focus").is("input");
                if (input) {
                    $($($(element[ndx - 1]).find("input"))[p - 1]).focus();
                    return;
                }
            }
            for (var i = 0; i < element.length - 1; i++) {
                var hasfocus = $($(element)[i]).find(":focus").length;
                var isInput = $($(element)[i]).find(":focus").is("input");
                if (hasfocus > 0 && isInput) {
                    $($($(element[i - 1]).find("input"))[4]).focus();
                }
            }
        }
    }


    
    onKeypressRevenue(event: KeyboardEvent, value: any, index: number){
         
        if (value) {

            if (event.shiftKey == false && (event.key == "Enter" || event.key == "Tab")) {
            this.API.getData('/Setup/GetRevenueCodes?Code=' + value).subscribe(
              d => {
                if (d.Status == "Success") {
                   
                    this.claimCharges[index].claimCharges.Revenue_Code=d.Response.revcode;
                    if(this.claimCharges[index].claimCharges.Revenue_Code){
                        this.claimCharges[index].claimCharges.isRevenue_CodeDisabled=true;
                    }
                }
                else {
                    swal('Failed', 'Enter a Valid Revenue Code.', 'error');
                    
                 
                }
              }
            )
          }
        }}
    // Function to check the code is cpt or alternate code
    allowAlphanumericOnly(event: KeyboardEvent): boolean {
        const charCode = event.charCode;
        if ((charCode >= 48 && charCode <= 57) || // 0-9
          (charCode >= 65 && charCode <= 90) || // A-Z
          (charCode >= 97 && charCode <= 122)) { // a-z
          return true; // Allow alphanumeric characters
        }
        event.preventDefault(); // Prevent non-alphanumeric characters
        return false;
      }
    

    checkCPTCode(code: string): Promise<any> {
    return this.API.getData(`/Setup/CheckCode?Code=${code}`).toPromise();
  }
    CPTKeyPressEvent(event: KeyboardEvent, value: any, index: number) {
        if (value) {
            if (event.shiftKey == false && (event.key == "Enter" || event.key == "Tab")) {
                //to avoid auto fill drug code
                if (this.claimCharges[index].claimCharges.NDCList.length > 0) {
                    this.claimCharges[index].claimCharges.NDCList = [];
                }              
                this.checkCPTCode(value).then(async response => {
                        if (response.Status === 'Success') {
            // this.claimCharges[index].claimCharges.Procedure_Code = value;
            this.claimCharges[index].claimCharges.Procedure_Code = response.Response.Procedure_Code;
            this.claimCharges[index].claimCharges.Alternate_Code = response.Response.Alternate_Code;
        //   if(  await this.AlternateCodeDuplicate(response.Response.Alternate_Code, index) == false)  {
        //      
        //     return ;
        //   }else{
            this.getCPTCharges(index).then(() => { 
                if (this.claimCharges[index].claimCharges.NDCList && this.claimCharges[index].claimCharges.NDCList.length > 0) {
                    // this.claimCharges[index].claimCharges.Drug_Code = this.claimCharges[index].claimCharges.NDCList[0].Id;
                    // this.claimCharges[index].Drug_Code = this.claimCharges[index].claimCharges.NDCList[0].Id;
                  

                    this.onChangeDrugCode(index);
                    this.refresh();
                }
                if (this.claimCharges[index].claimCharges.NDCList && this.claimCharges[index].claimCharges.NDCList.length <= 0) {
                    // this.claimCharges[index].claimCharges.Drug_Code = this.claimCharges[index].claimCharges.NDCList[0].Id;
                    // this.claimCharges[index].Drug_Code = this.claimCharges[index].claimCharges.NDCList[0].Id;
                    this.claimCharges[index].Drug_Code=null;
                    this.claimCharges[index].claimCharges.NDC_Qualifier=null;
                    this.refresh();
                }
                // this.claimCharges[index].ClaimCharges.DosFrom = this.claimViewModel.ClaimModel.DOS;
                // this.claimCharges[index].ClaimCharges.DosTo = this.claimViewModel.ClaimModel.DOS;
                // //}
                this.AutoNotesForProc(index);
                if (this.Diag[0] && this.Diag[0].Diagnosis && !Common.isNullOrEmpty(this.Diag[0].Diagnosis.Code))
                    this.claimCharges[index].claimCharges.DX_Pointer1 = 1;
                if (this.Diag[1] && this.Diag[1].Diagnosis && !Common.isNullOrEmpty(this.Diag[1].Diagnosis.Code))
                    this.claimCharges[index].claimCharges.DX_Pointer2 = 2;
                if (this.Diag[2] && this.Diag[2].Diagnosis && !Common.isNullOrEmpty(this.Diag[2].Diagnosis.Code))
                    this.claimCharges[index].claimCharges.DX_Pointer3 = 3;
                if (this.Diag[3] && this.Diag[3].Diagnosis && !Common.isNullOrEmpty(this.Diag[3].Diagnosis.Code))
                    this.claimCharges[index].claimCharges.DX_Pointer4 = 4;
                // this.claimCharges[index].ClaimCharges.Unit = this.daysDiff(this.claimCharges[index].ClaimCharges.DosFrom, this.claimCharges[index].ClaimCharges.DosTo, -1).toString();
                // this.getCPTCharges(index);
                // this.getNDC(index);
            }).catch((error) => {
            });
       //   }
                // this.getCPTCharges(index).then(() => {
                //     if (this.claimCharges[index].claimCharges.NDCList && this.claimCharges[index].claimCharges.NDCList.length > 0) {
                //         // this.claimCharges[index].claimCharges.Drug_Code = this.claimCharges[index].claimCharges.NDCList[0].Id;
                //         // this.claimCharges[index].Drug_Code = this.claimCharges[index].claimCharges.NDCList[0].Id;
                //         this.onChangeDrugCode(index);
                //         this.refresh();
                //     }
                //     // this.claimCharges[index].ClaimCharges.DosFrom = this.claimViewModel.ClaimModel.DOS;
                //     // this.claimCharges[index].ClaimCharges.DosTo = this.claimViewModel.ClaimModel.DOS;
                //     // //}

                //     if (this.Diag[0] && this.Diag[0].Diagnosis && !Common.isNullOrEmpty(this.Diag[0].Diagnosis.Code))
                //         this.claimCharges[index].claimCharges.DX_Pointer1 = 1;
                //     if (this.Diag[1] && this.Diag[1].Diagnosis && !Common.isNullOrEmpty(this.Diag[1].Diagnosis.Code))
                //         this.claimCharges[index].claimCharges.DX_Pointer2 = 2;
                //     if (this.Diag[2] && this.Diag[2].Diagnosis && !Common.isNullOrEmpty(this.Diag[2].Diagnosis.Code))
                //         this.claimCharges[index].claimCharges.DX_Pointer3 = 3;
                //     if (this.Diag[3] && this.Diag[3].Diagnosis && !Common.isNullOrEmpty(this.Diag[3].Diagnosis.Code))
                //         this.claimCharges[index].claimCharges.DX_Pointer4 = 4;
                //     // this.claimCharges[index].ClaimCharges.Unit = this.daysDiff(this.claimCharges[index].ClaimCharges.DosFrom, this.claimCharges[index].ClaimCharges.DosTo, -1).toString();
                //     // this.getCPTCharges(index);
                //     // this.getNDC(index);
                // }).catch((error) => {
                // });
            } else {
                this.claimCharges[index].claimCharges.Procedure_Code = "";
                this.claimCharges[index].claimCharges.Alternate_Code = "";
                this.claimCharges[index].Description = "";
                //..below conditions are for Anesthesia Case added by tamour
                this.claimCharges[index].IsAnesthesiaCpt = false;
                this.claimCharges[index].claimCharges.Units = 0;
                this.claimCharges[index].claimCharges.Start_Time = null;
                this.claimCharges[index].claimCharges.Stop_Time = null;
                this.claimCharges[index].claimCharges.Physical_Modifier = "";
                this.claimCharges[index].claimCharges.Amount = '0';
                this.claimCharges[index].amt = '0';
               //..above conditions are for Anesthesia Case added by tamour
                swal('Failed', "Invalid CPT/Alternate Code", 'error');
                return;
              }
                }).catch(error => 
                  {
                      this.claimCharges[index].claimCharges.Procedure_Code = "";
                      this.claimCharges[index].claimCharges.Alternate_Code = "";
                      this.claimCharges[index].Description = "";
                      //..below conditions are for Anesthesia Case added by tamour
                      this.claimCharges[index].IsAnesthesiaCpt = false;
                      this.claimCharges[index].claimCharges.Units = 0;
                      this.claimCharges[index].claimCharges.Start_Time = null;
                      this.claimCharges[index].claimCharges.Stop_Time = null;
                      this.claimCharges[index].claimCharges.Physical_Modifier = "";
                      this.claimCharges[index].claimCharges.Amount = '0';
                      this.claimCharges[index].amt = '0';
                      //..above conditions are for Anesthesia Case added by tamour
                      swal('Failed', "Invalid Code Catch error", 'error');
                  return
                  }); 

                
                  this.cd.detectChanges();
            }
            else if (event.shiftKey && event.key == "Tab") {
                return;
            }
            else if (event.code != "Arrowleft" && event.code != "ArrowUp" && event.code != "ArrowDown" && event.code != "ArrowRight" && event.key != "Shift" && event.code != "Control" && event.code != "Alt" && event.code != "Pause" && event.code != "CapsLock" && event.code != "MetaLeft" && event.code != "MetaRight" && event.code != "NumLock" && event.code != "ScrollLock") {
                //this.claimCharges[index].ClaimCharges.Description = "";
                this.claimCharges[index].Description = "";
                this.claimCharges[index].claimCharges.POS = 0;
                this.claimCharges[index].claimCharges.Modi_Code1 = "";
                this.claimCharges[index].claimCharges.Modi_Code2 = "";
                this.claimCharges[index].claimCharges.Modi_Code3 = "";
                this.claimCharges[index].claimCharges.Modi_Code4 = "";
                this.claimCharges[index].claimCharges.Units = null;
                this.claimCharges[index].claimCharges.Actual_amount = null;
                this.claimCharges[index].claimCharges.Contractual_Amt = null;
                this.claimCharges[index].claimCharges.Include_In_Edi = false;
                this.claimCharges[index].claimCharges.Include_In_Sdf = false;
                this.claimCharges[index].claimCharges.NDC_Qualifier = "";
                this.claimCharges[index].claimCharges.Amount = null;
                this.claimCharges[index].claimCharges.NDCCodeList.length = 0;
                //..below changes done by tamour for Anesthesia Task on 24/08/2023
                this.claimCharges[index].IsAnesthesiaCpt = false;
                this.claimCharges[index].claimCharges.Physical_Modifier = "";
                this.updateClaimChargesProperty(index, 'Start_Time', '');
                this.updateClaimChargesProperty(index, 'Stop_Time', '');
                //..above changes done by tamour for Anesthesia Task on 24/08/2023
            }
            
        }
    }




    getCPTCharges(index: number) {
        return new Promise((resolve, reject) => {
            this.cPTRequest.InsuranceID=''
            this.claimViewModel.claimInusrance = this.InsChild.claimInsuranceModel;
            // Implemented as per saad requirment.     // Now commented in August build as discussed with Ibrahim Fazal
            // if (this.claimViewModel.ClaimModel.Is_Self_Pay) {
            //     if (this.claimViewModel.claimInusrance == undefined) {
            //         setTimeout(function () {
            //             swal('Failed', "Select Insurance Payer.", 'error');
            //         }, 100);

            //         return;
            //     }
            //     else if (this.claimViewModel.claimInusrance.length == 0) { 
            //         setTimeout(function () {
            //             swal('Failed', "Select Insurance Payer.", 'error');
            //         }, 100);

            //         return;
            //     }
            // }
            this.cPTRequest.IsSelfPay = this.claimViewModel.ClaimModel.Is_Self_Pay == true ? "True" : "False";
            this.cPTRequest.FacilityCode = (this.claimViewModel.ClaimModel.Facility_Code == null || this.claimViewModel.ClaimModel.Facility_Code == undefined).toString() ? "0" : this.claimViewModel.ClaimModel.Facility_Code.toString();
            var insfoundFlag = false;
            this.claimViewModel.claimInusrance = this.InsChild.claimInsuranceModel;
              //Added BY Hamza AKhlaq For Fee Schedule Enhancement
            for (var i = 0; i < this.claimViewModel.claimInusrance.length; i++) {
                if (this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "P" && this.claimViewModel.claimInusrance[i].claimInsurance.Deleted == false) {
                    this.cPTRequest.InsuranceID = this.claimViewModel.claimInusrance[i].claimInsurance.Insurance_Id.toString();
                    insfoundFlag = true;
                    break;
                }
            }
            if (!insfoundFlag) {
                for (var i = 0; i < this.claimViewModel.claimInusrance.length; i++) {
                    if (this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "S") {
                        this.cPTRequest.InsuranceID = this.claimViewModel.claimInusrance[i].claimInsurance.Insurance_Id.toString();
                        insfoundFlag = true;
                        break;
                    }
                }
                if (!insfoundFlag) {
                    for (var i = 0; i < this.claimViewModel.claimInusrance.length; i++) {
                        if (this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "O") {
                            this.cPTRequest.InsuranceID = this.claimViewModel.claimInusrance[i].claimInsurance.Insurance_Id.toString();
                            insfoundFlag = true;
                            break;
                        }
                    }
                }
            }
            this.cPTRequest.ProviderCode = this.billingPhyforFee;
            this.cPTRequest.ProcedureCode = this.claimCharges[index].claimCharges.Procedure_Code;
            //added By hamza akhlaq for fee schedule effective and expiry date
            this.cPTRequest.Dos_From = moment(this.claimCharges[index].claimCharges.Dos_From).format('YYYY/MM/DD')
            let count2 = 0;
        this.InsChild.claimInsuranceModel.forEach(
            x => {
                if (x.claimInsurance.Deleted == true) {
                    count2++
                }
            }
        )
        if(this.InsChild.claimInsuranceModel.length>0)
            {
                if (this.InsChild.claimInsuranceModel[0].claimInsurance.Deleted == false) {
                    count2 = 0;
                }
            }
            if(this.cPTRequest.IsSelfPay == "False")
                {
                    if (this.InsChild.claimInsuranceModel[count2].InsurancePayerName.includes("Medicaid") || this.InsChild.claimInsuranceModel[count2].InsurancePayerName.includes("Medicaid MCO")) {
                        if (this.claimViewModel.BillingPhysiciansList.length > 0) {
                            if (this.claimViewModel.BillingPhysiciansList[0].SPECIALIZATION_CODE == '050' && this.claimViewModel.BillingPhysiciansList[0].provider_State == 'OH') {
                                //  $("#Modifier_Code option[value=SA]").attr('selected', 'selected');
       
                                this.claimCharges.forEach(x => {
                                    x.claimCharges.Modi_Code1 = "SA"
                                })
       
       
                            }
                        }
       
                    }
                }
            if(this.claimCharges[index].claimCharges.Alternate_Code!=null && this.claimCharges[index].claimCharges.Alternate_Code!="")
            {
                this.cPTRequest.Alternate_Code=this.claimCharges[index].claimCharges.Alternate_Code;
            }else
            {
                this.cPTRequest.Alternate_Code=null;
            }
            if (this.claimViewModel.ClaimModel.Location_Code == undefined || this.claimViewModel.ClaimModel.Location_Code == 0) {
                setTimeout(function () {
                    swal('Failed', "Select Location Code.", 'error');
                }, 100);

                return;
            }
            this.cPTRequest.LocationCode = this.claimViewModel.ClaimModel.Location_Code.toString();
            //..below condition is updated by tamour to resolve the null case check on ModifierCode on api level...
            this.cPTRequest.ModifierCode = this.claimCharges[index].claimCharges.Modi_Code1 == null ? "" : this.claimCharges[index].claimCharges.Modi_Code1;
            this.cPTRequest.FacilityCode = "0";
            this.cPTRequest.PracticeState = "AZ";
            this.cPTRequest.PracticeCode = this.Gv.currentUser.selectedPractice.PracticeCode.toString();
            this.claimCharges[index].Description = "";  
            // this.cPTRequest.PracticeState = "";
            // this.cPTRequest.ModifierCode = this.claimCharges[index].ClaimCharges.Mod1 == null ? "" : this.claimCharges[index].ClaimCharges.Mod1;
            // this.
            // this.claimCharges[index].ClaimCharges.ProcedureCode=  "";
            // Chee
            return this.API.PostData('/Demographic/GetProcedureCharges/', this.cPTRequest, (d) => {

                

                if (d.Response.NDCCodeList.length == 0 && d.Status == "Error") {
                    this.claimCharges[index].claimCharges.Procedure_Code = "";
                    this.claimCharges[index].Description = "";
                  
                    //..below conditions are for Anesthesia Case added by umer
                    this.claimCharges[index].claimCharges.Revenue_Code="";
                      //..above conditions are for Anesthesia Case added by umer 
                    //..below conditions are for Anesthesia Case added by tamour
                    this.claimCharges[index].IsAnesthesiaCpt = false;
                    this.claimCharges[index].claimCharges.Units = 0;
                    this.claimCharges[index].claimCharges.Start_Time = null;
                    this.claimCharges[index].claimCharges.Stop_Time = null;
                    this.claimCharges[index].claimCharges.Physical_Modifier = "";
                    this.claimCharges[index].claimCharges.Amount = '0';
                    this.claimCharges[index].amt = '0';
                    //..above conditions are for Anesthesia Case added by tamour
                    swal('Failed', "Invalid/Deleted CPT.", 'error');
                    return; 
                }
 
                this.chargesList = d;
                this.claimCharges[index].claimCharges.NDCList = this.chargesList.Response.NDCCodeList;
                this.claimCharges[index].claimCharges.Amount = this.chargesList.Response.Charges;
                
                this.claimCharges[index].claimCharges.Revenue_Code=this.chargesList.Response.Revenue_Code;
                
               if(this.chargesList.Response.Revenue_Code!=null && this.chargesList.Response.Revenue_Code!=""){
                this.claimCharges[index].claimCharges.isRevenue_CodeDisabled=true;
               }
               else{
                this.claimCharges[index].claimCharges.isRevenue_CodeDisabled=false;

            }
              
             
                this.claimCharges[index].amt = this.claimCharges[index].claimCharges.Amount;
                //this.claimCharges[index].amt =this.chargesList.Response.Charges;
                this.claimCharges[index].Description = this.chargesList.Response.Description
                if (this.claimCharges[index].claimCharges.POS == undefined || this.claimCharges[index].claimCharges.POS == null || this.claimCharges[index].claimCharges.POS == 0) {
                    this.claimCharges[index].claimCharges.POS = this.chargesList.Response.POS;
                }
                if (this.claimCharges[index].claimCharges.Amount != "0.00")
                    this.claimCharges[index].claimCharges.Include_In_Edi = true;
                else
                    this.claimCharges[index].claimCharges.Include_In_Edi = false;
                let IsRectified;
                for (var x = 0; x < this.claimCharges.length; x++) {
                    if (this.claimCharges[x].claimCharges.IsRectify) {
                        IsRectified++;
                        let amt = this.claimCharges[x].claimCharges.Actual_amount;
                        for (var y = x + 1; y < this.claimCharges.length; y++) {
                            if (this.claimCharges[y].claimCharges.Actual_amount.toString() == "-" + amt)
                                this.claimCharges[y].claimCharges.Sequence_No = this.claimCharges[x].claimCharges.Sequence_No;
                        }
                    }
                }
   

                //..This condition is added by Tamour Ali on 14/08/2023, to check if CPT is of Anesthesia Practice., else case old logic will work for other CPTs.
                if (this.chargesList.Response.IsAnesthesiaCpt == true) {
                    //..For Anesthesia default units are coming from database procedure table where for remainig cpt's its calculated of front-end.
                    this.claimCharges[index].IsAnesthesiaCpt = true; //..this is trial condition                   
                    this.claimCharges[index].claimCharges.Units = this.chargesList.Response.DefaultUnits;
                    this.claimCharges[index].claimCharges.Start_Time = null;
                    this.claimCharges[index].claimCharges.Stop_Time = null;
                    this.claimCharges[index].claimCharges.Physical_Modifier = "";

                    this.CPTKeyPressEventUnit(null, this.claimCharges[index].claimCharges.Units.toString(), index, "Anesthesia");
                } else {
                    this.claimCharges[index].IsAnesthesiaCpt = false; //..this is trial condition
                    this.claimCharges[index].claimCharges.Start_Time = null;
                    this.claimCharges[index].claimCharges.Stop_Time = null;
                    this.claimCharges[index].claimCharges.Physical_Modifier = "";
                    this.daysDiff(this.claimCharges[index].claimCharges.Dos_From, this.claimCharges[index].claimCharges.Dos_To, index);
                }

                let max = 0;
                for (var c = 0; c < this.claimCharges.length - 1; c++) {
                    if (!this.claimCharges[c].claimCharges.Deleted)
                        if (this.claimCharges[c].claimCharges.Sequence_No > max)
                            max = this.claimCharges[c].claimCharges.Sequence_No;
                }
                this.refresh();
                if (!this.claimCharges[this.claimCharges.length - 1].claimCharges.IsRectify && !this.claimCharges[this.claimCharges.length - 1].claimCharges.Deleted)
                    this.claimCharges[this.claimCharges.length - 1].claimCharges.Sequence_No = max + 1;

                this.refresh();
                // USER STORY 16 : commented by HAMZA & Date: 08/02/2023
                //      this.checkDuplicateCPT(index);
                return resolve(true);
            });
        })
       
    }
    addItem(data: any) {
        if (data.claimInsurance.Pri_Sec_Oth_Type == 'P') {
            this.claimForm.get('main.patientStatus').setValue(null);
            this.claimForm.get('main.priStatus').setValue(null);
            this.claimForm.get('main.secStatus').setValue(null);
            this.claimForm.get('main.othStatus').setValue(null);
            if (!data.InsurancePayerName.includes("Medicaid") || !data.InsurancePayerName.includes("Medicaid MCO")) {
                this.claimCharges.forEach(x => {
                    x.claimCharges.Modi_Code1 = x.claimCharges.Modi_Code1
                })
            }

        }



    }
    changeEvent(data: any) {
        this.billingPhyforFee = data
    }
    verifyDate(date: string): boolean {
        var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
        if (!match)
            return false;
        else
            return true;
    }
    CheckPreviousDX(from: number) {
        let hasReturn = false;
        for (var start = from; start > 1; start--) {
            if (!$("#DX0" + start).val()) {
                this.dxNumber = "#DX0" + start;
                return false;
            }
        }
        if (!hasReturn) {
            this.dxNumber = "";
            return true;
        }
    }
    // ValidateDXSequence(): boolean {
    //     this.dxNumber = "";
    //     if ($("#DX012").val())
    //         this.CheckPreviousDX(11);
    //     else if ($("#DX011").val())
    //         this.CheckPreviousDX(10);
    //     else if ($("#DX010").val())
    //         this.CheckPreviousDX(9);
    //     else if ($("#DX09").val())
    //         this.CheckPreviousDX(8);
    //     else if ($("#DX08").val())
    //         this.CheckPreviousDX(7);
    //     else if ($("#DX07").val())
    //         this.CheckPreviousDX(6);
    //     else if ($("#DX06").val())
    //         this.CheckPreviousDX(5);
    //     else if ($("#DX05").val())
    //         this.CheckPreviousDX(4);
    //     else if ($("#DX04").val())
    //         this.CheckPreviousDX(3);
    //     else if ($("#DX03").val())
    //         this.CheckPreviousDX(2);
    //     else if ($("#DX02").val()) {
    //         if (!$("#DX01").val()) {
    //             this.dxNumber = "#DX01";
    //             return false;
    //         }
    //         else
    //             return true;
    //     }
    //     else if (!$("#DX01").val()) {
    //         this.dxNumber = "At least one DX is required";
    //         return false;
    //     }
    //     else {
    //         this.dxNumber = "";
    //         return true;
    //     }

    // }
// on new claim handle the patient status on C
handlePatientStatusC(event) {
    this.updatedvalue=event.target.value;
    
    if(event.target.value == 'C'){

        if 
        ((this.claimViewModel.ClaimModel.Pri_Status == 'N' || this.claimViewModel.ClaimModel.Pri_Status == 'B' || this.claimViewModel.ClaimModel.Pri_Status == 'R' ) ||
        (this.claimViewModel.ClaimModel.Sec_Status == 'N' || this.claimViewModel.ClaimModel.Sec_Status == 'B' || this.claimViewModel.ClaimModel.Sec_Status == 'R') ||
        (this.claimViewModel.ClaimModel.Oth_Status == 'N' || this.claimViewModel.ClaimModel.Oth_Status == 'B' || this.claimViewModel.ClaimModel.Oth_Status == 'R'))
    {
            swal('Failed', 'Pending Insurance Due, Please Check Status.', 'error');
           // this.claimViewModel.ClaimModel.Pat_Status = 'W';
            return ;   
        }

        else if (this.claimViewModel.ClaimModel.Claim_No === null || this.claimViewModel.ClaimModel.Claim_No === undefined || this.claimViewModel.ClaimModel.Claim_No === 0) {
            swal('Failed','Max statement count is not met.', 'error');
            //this.claimViewModel.ClaimModel.Pat_Status = '';
            return ;
        }
        else
        {
            return true;
        }
    }
   
}  
    // Added by Pir Ubaid (USER STORY 598 : Collection Status Addition )
    collectionCheck(): Promise<boolean> {
        ;
        return new Promise<boolean>((resolve, reject) => {
            const practice_code = this.Gv.currentUser.selectedPractice.PracticeCode;
             const claim_no = this.claimViewModel.ClaimModel.Claim_No;

            this.checkCollectionStatus(claim_no).subscribe(
                (d: any) => {
                ;
                    if (d && d.Response && d.Response.length > 0) {
                        const specificData = d.Response.filter(item => item.PRACTICE_CODE === practice_code);
                        if (specificData.length > 0) {
                            const statementData = specificData.find(item => item.CLAIM_NO === claim_no);
                            if (statementData) {
                                const statement_count = statementData.COUNT_STATEMENT;
                                
                                if (this.claimViewModel.ClaimModel.Pat_Status === 'C' && this.claimViewModel.ClaimModel.Amt_Due > 0) {
                                   
                                    //Skip statement_count check for practice_code 35510275 Hetal Patel
                                    if (this.Gv.currentUser.selectedPractice.PracticeCode === 35510275) {
                                        resolve(false); // Consider as a successful condition
                                    } else {
                                        const statement_count = statementData.COUNT_STATEMENT;

                                        if (statement_count < 3) {
                                            resolve(true);
                                        } else {
                                            resolve(false);
                                        }
                                    }

                                } else {
                                    resolve(false);
                                }
                            }
                        }
                    }
                    else if( this.claimViewModel.ClaimModel.Pat_Status=='C' && this.claimViewModel.ClaimModel.Amt_Due === 0) {
                        
                        //  resolve(false);
                        swal('Failed', 'Due amount is zero, so claim cannot be sent to collection.', 'error');
                        return false;
                      }
                    else if(d.Response.length==0)
                    {
                        if( this.claimViewModel.ClaimModel.Pat_Status=='C')
                        {
                        resolve(true);
                        return false;
                    }
                    }
                    
                    resolve(false);
                },
                error => {
                    console.error("Error fetching data:", error);
                    resolve(false);
                }
            );
        });
    }

    checkDuplicateCPT(index: number) {
        
        

        if (!this.claimCharges[index].claimCharges.Procedure_Code) {
            if (!this.claimCharges[index].Description) {
                return;
            }
            return;
        }
        else {
            // USER STORY 16 : Updated by HAMZA & Date: 08/02/2023
            // if(this.Gv.currentUser.selectedPractice.PracticeCode != 35510227  ){

            //     let notDeletedCharges = this.claimCharges.filter(c => c.claimCharges.Deleted !== true);
            //     for (var i = 0; i < notDeletedCharges.length; i++) {
            //           
            //        ;



            //         if (notDeletedCharges[i].claimCharges.Dos_From == notDeletedCharges[index].claimCharges.Dos_From
            //             && notDeletedCharges[i].claimCharges.Dos_To == notDeletedCharges[index].claimCharges.Dos_To
            //             && notDeletedCharges[i].claimCharges.Units == notDeletedCharges[index].claimCharges.Units
            //             && notDeletedCharges[i].claimCharges.Procedure_Code == notDeletedCharges[index].claimCharges.Procedure_Code
            //             && notDeletedCharges[i].claimCharges.Modi_Code1 == notDeletedCharges[index].claimCharges.Modi_Code1
            //             && notDeletedCharges[i].claimCharges.Modi_Code2 == notDeletedCharges[index].claimCharges.Modi_Code2
            //             && notDeletedCharges[i].claimCharges.Modi_Code3 == notDeletedCharges[index].claimCharges.Modi_Code3
            //             && notDeletedCharges[i].claimCharges.Modi_Code4 == notDeletedCharges[index].claimCharges.Modi_Code4
            //             && i != index) {
            //             swal('Failed', "Duplicate CPT.", 'error');
            //             // notDeletedCharges[index].claimCharges.Procedure_Code = null;
            //             // notDeletedCharges[index].claimCharges.Units = 0;
            //             // notDeletedCharges[index].claimCharges.Amount = "";
            //             // notDeletedCharges[index].amt = "0";
            //             // notDeletedCharges[index].claimCharges.Modi_Code1 = null;
            //             return true;
            //         }
            //     return ;
            // }



            let notDeletedCharges = this.claimCharges.filter(c => c.claimCharges.Deleted !== true);
            for (let i = 0; i < notDeletedCharges.length; i++) {
                for (let index = i + 1; index < notDeletedCharges.length; index++) {
                    
                    
                    if (areClaimChargesEqual(notDeletedCharges[i].claimCharges, notDeletedCharges[index].claimCharges)) {
                        let alternateCode = notDeletedCharges[index].claimCharges.Alternate_Code;
                        if (!alternateCode || alternateCode.trim() === '') {
                        
                            swal('Failed', 'Duplicate CPT.', 'error');                           
                            return false;                       
                        }
                        else
                        {
                            swal('Failed', 'Duplicate Alternate Code.', 'error');                            
                            return false;
                        }
                        // if(isEqual(notDeletedCharges[i].claimCharges.Alternate_Code, notDeletedCharges[index].claimCharges.Alternate_Code))
                        // {
                        //     swal('Failed', 'Duplicate Alternate Code.', 'error');                            
                        //     return false;
                        // }
                     
                        // swal('Failed', 'Duplicate CPT.checkDuplicateCPT', 'error');
                        // Perform any additional actions you need for handling duplicates.
                       
                    }
                 
                       
                }
            }

            // Helper function to check if two values are equal, considering null and empty string as equal
            function isEqual(value1, value2) {
                return (value1 === null || value1 === '') && (value2 === null || value2 === '') || value1 === value2;
            }
            // Helper function to check if two claimCharges objects are equal
            function areClaimChargesEqual(claimCharge1, claimCharge2) {
                return isEqual(claimCharge1.Dos_From, claimCharge2.Dos_From)
                    && isEqual(claimCharge1.Dos_To, claimCharge2.Dos_To)
                    && isEqual(claimCharge1.Units, claimCharge2.Units)
                    && isEqual(claimCharge1.Procedure_Code, claimCharge2.Procedure_Code)
                    && isEqual(claimCharge1.Modi_Code1, claimCharge2.Modi_Code1)
                    && isEqual(claimCharge1.Modi_Code2, claimCharge2.Modi_Code2)
                    && isEqual(claimCharge1.Modi_Code3, claimCharge2.Modi_Code3)
                    && isEqual(claimCharge1.Modi_Code4, claimCharge2.Modi_Code4)
                    && isEqual(claimCharge1.Alternate_Code, claimCharge2.Alternate_Code);
                    
            }
            //}
        }
        return;
    }

    //  Added below function by HAMZA & Date: 08/02/2023 & USER STORY 16 : CPT Duplication issue
    checkCPTlines(): boolean {
        
        let notDeletedCharges = this.claimCharges.filter(c => c.claimCharges.Deleted !== true);
        if (notDeletedCharges.length > 1) {
            for (var index = 0; index < notDeletedCharges.length; index++) {
                // if (this.checkDuplicateCPT(index)) {
                //     swal('Failed', "Duplicate CPT.checkCPTlines", 'error');
                //     return false;
                // }
                var result = this.checkDuplicateCPT(index);
                
                return result;
            }

        }
         ;
    }
//.. added by pir ubaid - multiple cpt check
   //check duplicte alternate code in claim charges
   AlternateCodeDuplicate(AlternateCode: string, index : number): Promise<boolean> {
    return new Promise((resolve) => {
      if (AlternateCode && AlternateCode.trim() !== '') {
        this.API.getData('/Setup/DuplicateAlternateCodeClaimCharges?AlternateCode=' + AlternateCode).subscribe(
          d => {
            if (d.Status === "Duplicate") {
              swal('Validation', 'Duplicate Alternate Code exists', 'warning').then(() => {
                  this.claimCharges[index].claimCharges.Procedure_Code = "";
                this.claimCharges[index].claimCharges.Alternate_Code = '';  // Clear the duplicate Alternate_Code
                    //  this.claimCharges[index].claimCharges.Alternate_Code = "";
                      this.claimCharges[index].Description = "";
                      //..below conditions are for Anesthesia Case added by tamour
                      this.claimCharges[index].IsAnesthesiaCpt = false;
                      this.claimCharges[index].claimCharges.Units = 0;
                      this.claimCharges[index].claimCharges.Start_Time = null;
                      this.claimCharges[index].claimCharges.Stop_Time = null;
                      this.claimCharges[index].claimCharges.Physical_Modifier = "";
                      this.claimCharges[index].claimCharges.Amount = '';
                      this.claimCharges[index].amt = '0';
                      this.claimCharges[index].claimCharges.POS = 0;


                resolve(false);  // Duplicate found, validation failed
                return;
              });
            } else {
              resolve(true);  // No duplicate found, validation passed
            }
          },
          error => {
            console.error('Error checking Alternate Code duplicate:', error);
            resolve(false);  // Handle error case, prevent submission
          }
        );
      } else {
        // If AlternateCode is empty or null, resolve as valid
        resolve(true);  // Assumes empty code is valid for now
      }
    });
  }
  
//


// on new claim handle the patient status on D
    handlePatientStatusD(event) {
        this.updatedvalue=event.target.value;
         
        if(event.target.value == 'D'){

            if 
            ((this.claimViewModel.ClaimModel.Pri_Status == 'N' || this.claimViewModel.ClaimModel.Pri_Status == 'B' || this.claimViewModel.ClaimModel.Pri_Status == 'R' ) ||
            (this.claimViewModel.ClaimModel.Sec_Status == 'N' || this.claimViewModel.ClaimModel.Sec_Status == 'B' || this.claimViewModel.ClaimModel.Sec_Status == 'R') ||
            (this.claimViewModel.ClaimModel.Oth_Status == 'N' || this.claimViewModel.ClaimModel.Oth_Status == 'B' || this.claimViewModel.ClaimModel.Oth_Status == 'R'))
        {
                swal('Failed', 'Pending Insurance Due, Please Check Status.', 'error');
               // this.claimViewModel.ClaimModel.Pat_Status = 'W';
                return ;  
            }

            else if (this.claimViewModel.ClaimModel.Claim_No === null || this.claimViewModel.ClaimModel.Claim_No === undefined || this.claimViewModel.ClaimModel.Claim_No === 0) {
                swal('Failed','Max statement count is not met.', 'error');
                //this.claimViewModel.ClaimModel.Pat_Status = '';
                return ;
            }
            else
            {
                return true;
            }
        }
        // Continue with other logic for Patient Status "D" if needed
    }  

    dormantCheck(): Promise<boolean> {
         ;
        return new Promise<boolean>((resolve, reject) => {
            const practice_code = this.Gv.currentUser.selectedPractice.PracticeCode;
            // const practice_code = this.claimViewModel.ClaimModel.practice_code;
            const claim_no = this.claimViewModel.ClaimModel.Claim_No;

            this.getPatientStatementReport(claim_no).subscribe(
                (d: any) => {

                    // if(d.Response.length==0)
                    // {
                    //     if(this.claimViewModel.ClaimModel.Pat_Status=='D')
                    //     {
                    //     resolve(true);
                    //     return false;
                    // }
                    // }
                     ;
                    if (d && d.Response && d.Response.length > 0) {
                        const specificData = d.Response.filter(item => item.PRACTICE_CODE === practice_code);
                        if (specificData.length > 0) {
                            const statementData = specificData.find(item => item.CLAIM_NO === claim_no);
                            if (statementData) {
                                const statement_count = statementData.COUNT_STATEMENT;
                                
                                if (this.claimViewModel.ClaimModel.Pat_Status === 'D' && this.claimViewModel.ClaimModel.Amt_Due > 0) {
                                   
                                   // Skip statement_count check for practice_code 35510275 Hetal Patel
                                    if (this.Gv.currentUser.selectedPractice.PracticeCode === 35510275) {
                                        resolve(false);  //Consider as a successful condition
                                    } else {
                                        const statement_count = statementData.COUNT_STATEMENT;
                                   
                                    if (statement_count < 3) {
                                        swal('Failed', 'Max statement count is not met.', 'error');
                                        resolve(true); // Return true to indicate a failure condition
                                    } else {
                                        resolve(false); // Return false to indicate a successful condition
                                    }
                                }

                                } else {
                                    resolve(false); // Return false for other conditions
                                }
                            }
                        }
                    }
                    else if(d.Response.length==0)
                    {
                        //Added By Sami For Dormant Handling Zero Balancing
                        if( this.claimViewModel.ClaimModel.Pat_Status=='D' && this.claimViewModel.ClaimModel.Amt_Due === 0) {
                             resolve(true);
                            swal('Failed', 'Due amount is zero, so claim cannot be sent to dormant.', 'error');
                           // return false;
                          }
                    }
                    // Handle other cases and return accordingly
                    resolve(false);
                },
                error => {
                    console.error("Error fetching data:", error);
                    resolve(false); // Handle the error and return false
                }
            );
        });
    }
    canSave(): boolean {
        if(this.checkInputValue()==false)
        {
            return false;
        }
        //  
        // this.dormantCheck().then(result => {
        //     if (result) {
        //         swal('Failed', 'Max statement count is not met.', 'error');
        //         return false;
        //     }
        // });
        // if (this.dormantCheck()) {
        //      
        //     swal('Failed', 'Max statement count is not met.', 'error');
        //     return false;
        // }

        if(this.updatedvalue=='D')
        {
        const event = { target: { value: this.updatedvalue } };
        if(!this.handlePatientStatusD(event))
        {
        return false;
        }
    }
    if(this.updatedvalue == 'C')
    {
        const event = { target: { value: this.updatedvalue } };
        if(!this.handlePatientStatusC(event))
        {
        return false;
        }
    }
 

        //  Added below code by HAMZA & Date: 08/02/2023 & USER STORY 16 : CPT Duplication issue
        if (this.checkCPTlines() == false) {
        
            return;
        }

        // for (let count = 0; count < this.claimCharges.length; count++) {
            for (let count = 0; count < this.claimViewModel.claimCharges.length; count++) {
 ;
            this.claimCharges[count].claimCharges.Procedure_Code=this.claimCharges[count].claimCharges.Procedure_Code.toUpperCase();
          //  this.procedureCode = this.claimViewModel.claimCharges[count].claimCharges.Procedure_Code == '0275T' 
            if ((this.claimCharges[count].claimCharges.Procedure_Code == '0275T' || this.claimCharges[count].claimCharges.Procedure_Code == '0275t') && this.claimViewModel.claimCharges[count].claimCharges.Deleted==false &&
                (this.claimViewModel.ClaimModel.Additional_Claim_Info == null ||
                    this.claimViewModel.ClaimModel.Additional_Claim_Info.trim() === '')) {
                this.isValidationError = true;
                break;
            }
        }
        // for (let count = 0; count < this.claimCharges.length; count++) {
            for (let count = 0; count < this.claimViewModel.claimCharges.length; count++) {
 ;
            if (this.isValidationError = true && this.claimViewModel.claimCharges[count].claimCharges.Procedure_Code == '0275T' && this.claimViewModel.claimCharges[count].claimCharges.Deleted==false &&
                (this.claimViewModel.ClaimModel.Additional_Claim_Info == null ||
                    this.claimViewModel.ClaimModel.Additional_Claim_Info.trim() === '')) {
                swal('Failed', 'Additional Claim info cannot be empty when CPT code is 0275T, please enter additional info (NCT).', 'error')
                    .then((result) => {
                        if (result) {
                            const additionalClaimInfoElement = document.getElementById("additionalClaimInfo");
                            if (additionalClaimInfoElement) {
                                additionalClaimInfoElement.focus();
                                window.scrollTo({
                                    top: additionalClaimInfoElement.offsetTop,
                                    behavior: 'smooth',
                                });
                            }
                        }
                    });
                return;
            }
        }
        if (this.claimViewModel.ClaimModel.Is_Draft == true) {
            this.AddAutoNotesforDraft()
            return true;
        }
        if (this.claimViewModel.ClaimModel.Is_Draft == false) {
            this.updatedraftmessage=[];
        }
        let hasCPT = false;
        let hasDescripction = true;
        let validFromDate = false;
        let validToDate = false;
        let deletedInsurance = 0;
        let chargesLength = this.claimViewModel.claimInusrance.length;
        if (chargesLength > 0) {
            for (var count = 0; count < chargesLength; count++) {
                if (this.claimViewModel.claimInusrance[count].claimInsurance.Deleted) {
                    deletedInsurance++;
                }
            }
        }
        for (let count = 0; count < this.claimViewModel.claimPayments.length; count++) {

            if(
                !(this.claimViewModel.claimPayments[count].claimPayments.Payment_Source=='I') &&
                !(this.claimViewModel.claimPayments[count].claimPayments.Payment_Source=='Q') &&
                !(this.claimViewModel.claimPayments[count].claimPayments.Payment_Source=='P') &&
                !(this.claimViewModel.claimPayments[count].claimPayments.Payment_Source=='C') &&
                !(this.claimViewModel.claimPayments[count].claimPayments.Payment_Source=='T')
                )
            {
                 
                if (this.claimViewModel.claimPayments[count].claimPayments.Paid_Proc_Code==null ||
                    this.claimViewModel.claimPayments[count].claimPayments.ENTERED_FROM==""
                    ) {
                    swal('Failed', "Claim can not be saved without the mandatory payment information, please fill the 	required fields", 'error');
                    return false;
                }

            }
            if (!this.claimViewModel.claimPayments[count].claimPayments.Payment_Type 
                &&
                !(this.claimViewModel.claimPayments[count].claimPayments.Payment_Source=='T')
            ) {
                swal('Failed', "Claim can not be saved without the mandatory payment information, please fill the 	required fields", 'error');
                return false;
            }


        }
        if (!this.claimViewModel.ClaimModel.PTL_Status) {
            // if (this.claimViewModel.ClaimModel.Delay_Reason_Code == null || this.claimViewModel.ClaimModel.Delay_Reason_Code == undefined || this.claimViewModel.ClaimModel.Delay_Reason_Code == "") {
            //     swal('Failed', "Select PTL Reasons.", 'error');
            //     return false;
            // }


            if (!this.verifyDate(this.claimViewModel.ClaimModel.DOS)) {
                swal('Failed', "Invalid DOS (MM/DD/YYYY).", 'error');
                return false;
            }
            if (!this.verifyDate(this.claimViewModel.ClaimModel.Scan_Date)) {
                swal('Failed', "Invalid Scan Date  (MM/DD/YYYY).", 'error');
                return false;
            }
            if (this.claimViewModel.ClaimModel.DOS == undefined || this.claimViewModel.ClaimModel.DOS == null || this.claimViewModel.ClaimModel.DOS == "") {
                swal('Failed', "Enter DOS.", 'error');
                return false;
            }
            var bit = false
            let counttheins: number = 0;
            this.claimViewModel.claimInusrance.forEach(x => {
                if (x.claimInsurance.Deleted == true) {
                    counttheins++
                }
            })
            if (this.InsChild.claimInsuranceModel.length == counttheins) {
                bit = true;
            }

            if (this.claimViewModel.ClaimModel.Is_Self_Pay != true && (bit) && !this.claimViewModel.ClaimModel.PTL_Status) {
                swal('Failed', "Either selfpay should be checked or there should be atleast one insurance.", 'error');
                return false;
            }
            if (this.claimViewModel.ClaimModel.Location_Code == undefined || this.claimViewModel.ClaimModel.Location_Code == null || this.claimViewModel.ClaimModel.Location_Code.toString() == "" || this.claimViewModel.ClaimModel.Location_Code == 0) {
                swal('Failed', "Select Location.", 'error');
                return false;
            }
            if (this.claimViewModel.ClaimModel.Billing_Physician == undefined || this.claimViewModel.ClaimModel.Billing_Physician == null || this.claimViewModel.ClaimModel.Billing_Physician.toString() == "" || this.claimViewModel.ClaimModel.Billing_Physician == 0) {
                swal('Failed', "Select Billing Physician.", 'error');
                return false;
            }
            if (this.claimViewModel.ClaimModel.Attending_Physician == undefined || this.claimViewModel.ClaimModel.Attending_Physician == null || this.claimViewModel.ClaimModel.Attending_Physician.toString() == "" || this.claimViewModel.ClaimModel.Attending_Physician == 0) {
                swal('Failed', "Select Rendering Physician.", 'error');
                return false;
            }
            if (!this.claimViewModel.ClaimModel.Hospital_From == null && !this.verifyDate(this.claimViewModel.ClaimModel.Hospital_From)) {
                swal('Failed', "Invalid From Date (MM/DD/YYYY).", 'error');
                return false;
            }
            if (!this.claimViewModel.ClaimModel.Hospital_To == null && !this.verifyDate(this.claimViewModel.ClaimModel.Hospital_To)) {
                swal('Failed', "Invalid To Date (MM/DD/YYYY).", 'error');
                return false;
            }

            
            if (this.claimViewModel.ClaimModel.Facility_Code != undefined || this.claimViewModel.ClaimModel.Facility_Code != null || this.claimViewModel.ClaimModel.Facility_Code > 0) {
                
               
                 
                if(this.ClaimBillingType=='I')
                { 
                    //check here
                    if (this.claimViewModel.ClaimModel.Hospital_From == null || this.claimViewModel.ClaimModel.Hospital_From == '') {
                        swal('Failed', "In case of Facility selected enter From Date", 'error');
                        return false;
                    }

                    if (this.claimViewModel.ClaimModel.Hospital_To == null || this.claimViewModel.ClaimModel.Hospital_To == '') {
                        swal('Failed', "In case of Facility selected enter To Date", 'error');
                        return false;
                    }
                    if (new Date(this.claimViewModel.ClaimModel.Hospital_To) < new Date(this.claimViewModel.ClaimModel.Hospital_From)) {
                        swal('Failed', "From Date Should Be Less Than To Date.", 'error');
                        return false;
                    }


                    if(this.Sequence_of_care_Id == 1 || this.Sequence_of_care_Id == 4 ){
                        

                        if (this.claimViewModel.Admission_Details.Discharge_status_Id== null) {
                            swal('Failed', "Discharge Status cannot be empty", 'error');
                            return false;
                        }
                        if (this.claimViewModel.Admission_Details.Dischargehour== null) {
                            swal('Failed', "Discharge hour cannot be empty", 'error');
                            return false;
                        }
                        if (this.claimViewModel.ClaimModel.Hospital_To == null) {
                            swal('Failed', "In case of Facility selected enter To Date", 'error');
                            return false;
                        }
                        if (new Date(this.claimViewModel.ClaimModel.Hospital_To) < new Date(this.claimViewModel.ClaimModel.Hospital_From)) {
                            swal('Failed', "From Date Should Be Less Than To Date.", 'error');
                            return false;
                        }
        
                    }
                    
                  
                }
                else{ 
                
                    if (this.claimViewModel.ClaimModel.Hospital_From == null ||this.claimViewModel.ClaimModel.Hospital_From == "" ) {
                    swal('Failed', "In case of Facility selected enter From Date", 'error');
                    return false;
                }
           
                // if (this.claimViewModel.ClaimModel.Hospital_To == null) {
                //     swal('Failed', "In case of Facility selected enter To Date", 'error');
                //     return false;
                // }
            
                if (this.claimViewModel.ClaimModel.Hospital_To && new Date(this.claimViewModel.ClaimModel.Hospital_To) < new Date(this.claimViewModel.ClaimModel.Hospital_From)) {
                    swal('Failed', "From Date Should Be Less Than To Date.", 'error');
                    return false;
                }
            }
               
            }
           
            // if ($("#hfrom input").val() && !$("#hto input").val()) {
            //     this.showErrorPopup('Enter To Date.', 'Hospital Information');
            //     return false;
            // }
            // if (!$("#hfrom input").val() && $("#hto input").val()) {
            //     this.showErrorPopup('Enter From Date.', 'Hospital Information');
            //     return false;
            // }

            //this.ValidateDXSequence();
            this.dxValidation();
            if (this.dxNumber == "At least one DX is required") {
                swal('Failed', "Atleast one DX is required.", 'error');
                return false;
            }
            else if (this.dxNumber != "" && this.dxNumber != undefined) {
                swal('Failed', "Enter the Diagnosis Code serial wise.", 'error');
                this.dxNumber = "";
                return false;
            }

            let claimIns = 0;
            let flagPri = 0;
            let flagSec = 0;
            let flagOth = 0;
            claimIns = this.claimViewModel.claimInusrance.length;
            if (claimIns > 0) {
                let isPri = "false";
                let allDeleted = 0;
                for (var v = 0; v < claimIns; v++) {
                    if (!this.claimViewModel.claimInusrance[v].claimInsurance.Deleted) {
                        if (this.claimViewModel.claimInusrance[v].claimInsurance.Pri_Sec_Oth_Type == "P")
                            flagPri++;
                        else if (this.claimViewModel.claimInusrance[v].claimInsurance.Pri_Sec_Oth_Type == "S")
                            flagSec++;
                        else
                            flagOth++;
                    }
                    if (this.claimViewModel.claimInusrance[v].claimInsurance.Pri_Sec_Oth_Type == "P" && !this.claimViewModel.claimInusrance[v].claimInsurance.Deleted) {
                        isPri = "true";
                        //    this.claim.PatientStatus = "W";
                    }
                }
                for (var v = 0; v < claimIns; v++) {
                    if (this.claimViewModel.claimInusrance[v].claimInsurance.Deleted)
                        allDeleted++;
                }
                if (isPri == "false" && allDeleted != claimIns) {
                    swal('Failed', "Select a Primary Insurance before selecting Secondary or Other Insurance", 'error');
                    return false;
                }
                if (flagPri > 1 || flagSec > 1 || flagOth > 1) {
                    swal('Failed', "Primary, Secondary or Other Insurance is selected more than once.", 'error');
                    return false;
                }
            }
            for (var i = 0; i < claimIns; i++) {
                if (this.claimViewModel.claimInusrance[i].claimInsurance.Deleted)
                    continue;
                if (this.claimViewModel.claimInusrance[i].InsurancePayerName == null || this.claimViewModel.claimInusrance[i].InsurancePayerName == "" || this.claimViewModel.claimInusrance[i].InsurancePayerName == undefined) {
                    swal('Failed', "Select Payer.", 'error');
                    return false;
                }
                if (this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == null || this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "" || this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == undefined) {
                    swal('Failed', "Select Ins.Mode for Insurance.", 'error');
                    return false;
                }
                if (this.claimViewModel.claimInusrance[i].claimInsurance.Policy_Number == null || this.claimViewModel.claimInusrance[i].claimInsurance.Policy_Number == "" || this.claimViewModel.claimInusrance[i].claimInsurance.Policy_Number == undefined) {
                    swal('Failed', "Enter Policy # for Insurance " + this.claimViewModel.claimInusrance[i].InsurancePayerName + "", 'error');
                    return false;
                }
                if (!Common.isNullOrEmpty(this.claimViewModel.claimInusrance[i].claimInsurance.Relationship)) {
                    if ((this.claimViewModel.claimInusrance[i].claimInsurance.Relationship != "7" && Common.isNullOrEmpty(this.claimViewModel.claimInusrance[i].claimInsurance.Subscriber))) {
                        swal('Failed', "Select Subscriber for insurance " + this.claimViewModel.claimInusrance[i].InsurancePayerName + " .", 'error');
                        return false;
                    }
                } else {
                    swal('Failed', "Select Relationship for insurance " + this.claimViewModel.claimInusrance[i].InsurancePayerName + " .", 'error');
                    return false;
                }
                if (this.claimViewModel.claimInusrance[i].claimInsurance.Corrected_Claim == true && (this.claimViewModel.claimInusrance[i].claimInsurance.ICN == undefined || this.claimViewModel.claimInusrance[i].claimInsurance.ICN == null || this.claimViewModel.claimInusrance[i].claimInsurance.ICN.length < 4)) {
                    swal('Failed', "Enter ICN code for Insurance " + this.claimViewModel.claimInusrance[i].InsurancePayerName + "", 'error');
                    return false;
                }
            }
            if (this.claimViewModel.claimCharges.length == 0) {
                swal('Failed', "Atleast one CPT is required.", 'error');
                return false;
            }
            if (this.claimCharges.length > 0) {
                for (var count = 0; count < this.claimCharges.length; count++) {
                    if (this.claimCharges[count].claimCharges.Deleted != true) {
                        hasCPT = true
                        let dos = new Date(this.claimViewModel.ClaimModel.DOS);
                        let dosFrom = new Date(this.claimCharges[count].claimCharges.Dos_From);
                        let dosTo = new Date(this.claimCharges[count].claimCharges.Dos_From);
                        if ((this.claimCharges[count].claimCharges.Dos_From) && (dosFrom >= dos))
                            validFromDate = true;
                        else {
                            validFromDate = false;
                            swal('Validation', 'From Date cannot be empty or less than DOS', 'warning');
                            return false;
                        }
                        if ((this.claimCharges[count].claimCharges.Dos_To) && (dosTo >= dosFrom))
                            validToDate = true;
                        else {
                            validToDate = false;
                            swal('Validation', 'To Date cannot be empty or less than From Date', 'warning');
                            return false;
                        }
                        
                        var dxPointer1:any = this.claimCharges[count].claimCharges.DX_Pointer1;
                        var dxPointer2:any = this.claimCharges[count].claimCharges.DX_Pointer2;
                        var dxPointer3:any = this.claimCharges[count].claimCharges.DX_Pointer3;
                        var dxPointer4:any = this.claimCharges[count].claimCharges.DX_Pointer4;

                        if(dxPointer1==null || dxPointer1 ===''){
                            swal('Failed', 'Primary diagnosis cannot be empty', 'error');
                            return false;
                        }

                        // Helper function to check if a pointer is valid (not null, undefined, or empty)
                        function isValidPointer(value) {
                            return value != null && value !== '' && value !== undefined;
                        }
                        
                        if (
                            (isValidPointer(this.claimCharges[count].claimCharges.DX_Pointer1) && String(this.claimCharges[count].claimCharges.DX_Pointer1) === String(this.claimCharges[count].claimCharges.DX_Pointer2)) ||
                            (isValidPointer(this.claimCharges[count].claimCharges.DX_Pointer1) && String(this.claimCharges[count].claimCharges.DX_Pointer1) === String(this.claimCharges[count].claimCharges.DX_Pointer3)) ||
                            (isValidPointer(this.claimCharges[count].claimCharges.DX_Pointer1) && String(this.claimCharges[count].claimCharges.DX_Pointer1) === String(this.claimCharges[count].claimCharges.DX_Pointer4)) ||
                            (isValidPointer(this.claimCharges[count].claimCharges.DX_Pointer2) && String(this.claimCharges[count].claimCharges.DX_Pointer2) === String(this.claimCharges[count].claimCharges.DX_Pointer3)) ||
                            (isValidPointer(this.claimCharges[count].claimCharges.DX_Pointer2) && String(this.claimCharges[count].claimCharges.DX_Pointer2) === String(this.claimCharges[count].claimCharges.DX_Pointer4)) ||
                            (isValidPointer(this.claimCharges[count].claimCharges.DX_Pointer3) && String(this.claimCharges[count].claimCharges.DX_Pointer3) === String(this.claimCharges[count].claimCharges.DX_Pointer4))
                        ) {
                            swal('Failed', 'Diagnosis cannot be reported twice with one procedure', 'error');
                            return false;
                        }
                                                

                        // Check conditions in the correct order
                        if ((dxPointer4 != null && dxPointer4 != '') && ((dxPointer3 == null || dxPointer3 === '') || (dxPointer2 == null || dxPointer2 === '') || (dxPointer1 == null || dxPointer1 === ''))) {
                            swal('Failed', 'ICD pointers cannot remain empty in the middle; please fill in the gaps', 'error');
                            return false;
                        } else if ((dxPointer3 != null && dxPointer3 != '') && ((dxPointer2 == null || dxPointer2 === '') || (dxPointer1 == null || dxPointer1 === ''))) {
                            swal('Failed', 'ICD pointers cannot remain empty in the middle; please fill in the gaps', 'error');
                            return false;
                        } else if ((dxPointer2 != null && dxPointer2 != '') && (dxPointer1 == null || dxPointer1 === '')) {
                            swal('Failed', 'ICD pointers cannot remain empty in the middle; please fill in the gaps', 'error');
                            return false;
                        } else if ((dxPointer1 == null || dxPointer1 === '') && ((dxPointer2 != null && dxPointer2 != '') || (dxPointer3 != null && dxPointer3 != '') || (dxPointer4 != null && dxPointer4 != ''))) {
                            swal('Failed', 'ICD pointers cannot remain empty in the middle; please fill in the gaps', 'error');
                            return false;
                        } else {

                        }
                        //  if (this.claimCharges[count].ClaimCharges.Description == undefined || this.claimCharges[count].ClaimCharges.Description == "" || this.claimCharges[count].ClaimCharges.Description == null) {
                        //  hasDescripction = false;
                        // }
                        if (this.claimCharges[count].Description == undefined || this.claimCharges[count].Description == "" || this.claimCharges[count].Description == null) {
                            hasDescripction = false;
                        }

                    }
                    if (this.claimCharges[count].claimCharges.Deleted == false && (this.claimCharges[count].claimCharges.Procedure_Code == undefined || this.claimCharges[count].claimCharges.Procedure_Code == "" || this.claimCharges[count].claimCharges.Procedure_Code == null)) {
                        swal('Failed', "Enter CPT code.", 'error');
                        return false;
                    }
                    
                    if(this.ClaimBillingType=='I'&& this.claimCharges[count].claimCharges.Deleted==false && (this.claimCharges[count].claimCharges.Revenue_Code == undefined || this.claimCharges[count].claimCharges.Revenue_Code == "" || this.claimCharges[count].claimCharges.Revenue_Code == null))
                        {
                            swal('Failed', "Enter Revenue code.", 'error');
                            return false;

                        }
                    if (this.claimCharges[count].claimCharges.Deleted == false && (this.claimCharges[count].claimCharges.POS == undefined || this.claimCharges[count].claimCharges.POS == null)) {
                        swal('Failed', "Select Place of Service.", 'error');
                        return false;
                    }

                    if (this.claimCharges[count].IsAnesthesiaCpt == true) {
                        //..This validation is added by Tamour Ali on 14/08/2023 for Physica Modifier and Start/Stop Time fields if Cpt is Anesthesia based.
                        if (this.claimCharges[count].claimCharges.Physical_Modifier === null || this.claimCharges[count].claimCharges.Physical_Modifier === "") {
                            swal('Required', 'Physical Status Modifier for CPT "' + this.claimCharges[count].claimCharges.Procedure_Code + '" Charges is required!', 'error');
                            return false;
                        }
                        if (this.claimCharges[count].claimCharges.Start_Time === null || this.claimCharges[count].claimCharges.Start_Time === "") {
                            swal('Required', 'Start Time for CPT "' + this.claimCharges[count].claimCharges.Procedure_Code + '" Charges is required!', 'error');
                            return false;
                        }
                        if (this.claimCharges[count].claimCharges.Stop_Time === null || this.claimCharges[count].claimCharges.Stop_Time === "") {
                            swal('Required', 'Stop Time for CPT "' + this.claimCharges[count].claimCharges.Procedure_Code + '" Charges is required!', 'error');
                            return false;
                        }
                    }
                    // if((this.claimCharges[count].claimCharges.Deleted == false || this.claimCharges[count].claimCharges.Deleted == null) && (this.claimCharges[count].claimCharges.Start_Time != undefined || this.claimCharges[count].claimCharges.Start_Time !=null) ){

                    //      let timies = this.claimCharges[count].claimCharges.Start_Time.split("");
                    //      let newTime=timies[0] + timies[1] + ":"+timies[2]+ timies[3]
                    //     var timeArr:any =newTime.split(":");

                    //     let dt = new Date();
                    //     dt.setHours(timeArr[0])
                    //     dt.setMinutes(timeArr[1])
                    //     dt.setSeconds(0);
                    //     this.claimCharges[count].claimCharges.Start_Time=dt.toLocaleString('en-US');
                    // }
                    // if((this.claimCharges[count].claimCharges.Deleted == false || this.claimCharges[count].claimCharges.Deleted == null) && (this.claimCharges[count].claimCharges.Stop_Time != undefined || this.claimCharges[count].claimCharges.Stop_Time !=null) ){
                    //     let timies = this.claimCharges[count].claimCharges.Stop_Time.split("");
                    //      let newTime=timies[0] + timies[1] + ":"+timies[2]+ timies[3]
                    //     var timeArr:any =newTime.split(":");

                    //     let dt = new Date();
                    //     dt.setHours(timeArr[0])
                    //     dt.setMinutes(timeArr[1])
                    //     dt.setSeconds(0);
                    //     this.claimCharges[count].claimCharges.Stop_Time=dt.toLocaleString('en-US');
                    // }

                }
                if (!hasCPT) {
                    swal('Failed', "Atleast one CPT is required.", 'error');
                    return false;
                }
                if (!validFromDate) {
                    swal('Failed', "From Date must be equal or greater than DOS.", 'error');
                    return false;
                }
                if (!validToDate) {
                    swal('Failed', "To Date must be equal or greater than From Date.", 'error');
                    return false;
                }
                if (!hasDescripction) {
                    swal('Failed', "Invalid CPT.", 'error');
                    return false;
                }

                if (this.claimViewModel.ClaimModel.Is_Self_Pay != true) {
                    for (var i = 0; i < this.claimViewModel.claimInusrance.length; i++) {

                        if (this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "P") {
                            if (this.claimViewModel.ClaimModel.Pri_Status == undefined || this.claimViewModel.ClaimModel.Pri_Status == "" || this.claimViewModel.ClaimModel.Pri_Status == null) {
                                swal('Failed', "Please set Pri. Insurance Status.", 'error');
                                return false;

                            }

                        } else if (this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "S") {
                            if (this.claimViewModel.ClaimModel.Sec_Status == undefined || this.claimViewModel.ClaimModel.Sec_Status == "" || this.claimViewModel.ClaimModel.Sec_Status == null) {
                                swal('Failed', "Please set Sec. Insurance Status.", 'error');
                                return false;

                            }

                        } else if (this.claimViewModel.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "O") {
                            if (this.claimViewModel.ClaimModel.Oth_Status == undefined || this.claimViewModel.ClaimModel.Oth_Status == "" || this.claimViewModel.ClaimModel.Oth_Status == null) {
                                swal('Failed', "Please set Oth. Insurance Status.", 'error');
                                return false;

                            }

                        }
                    }
                }

                if (this.claimViewModel.claimPayments != undefined) {
                    for (var i = 0; i < this.claimViewModel.claimPayments.length; i++) {

                        // if (this.claimViewModel.claimPayments[i].claimPayments.Sequence_No) {
                        //     if ((!this.claimViewModel.claimPayments[i].claimPayments.Amount_Paid) || (!this.claimViewModel.claimPayments[i].claimPayments.Amount_Approved)) {
                        //         swal('Failed', "Amount paid and Amount Approved can't be null", 'error');
                        //         return false;
                        //     }
                        // }
                        //Added bY Hamza Akhlaq For CareVoyant
                        if(this.claimViewModel.claimPayments[i].claimPayments.Date_Entry == null ||
                            this.claimViewModel.claimPayments[i].claimPayments.Date_Entry == "" 
                         )
                        {
                            swal('Failed', "Please Enter Entry Date.", 'error');
                                    return false;

                        }
                        if( this.claimViewModel.claimPayments[i].claimPayments.ENTERED_FROM != "60")
                        {
                            if (this.claimViewModel.claimPayments[i].claimPayments.Reject_Amount > 0) 
                                {
                                if ((this.claimViewModel.claimPayments[i].claimPayments.Reject_Type == undefined || this.claimViewModel.claimPayments[i].claimPayments.Reject_Type == null || this.claimViewModel.claimPayments[i].claimPayments.Reject_Type == "") && (this.claimViewModel.claimPayments[i].claimPayments.ERA_Rejection_CATEGORY_CODE == '' || this.claimViewModel.claimPayments[i].claimPayments.ERA_Rejection_CATEGORY_CODE == null || this.claimViewModel.claimPayments[i].claimPayments.ERA_Rejection_CATEGORY_CODE == undefined)) {
                                    swal('Failed', "Please enter Payment Rejection Type.", 'error');
                                    return false;
                                }
                            }
                        }
                        if (this.claimViewModel.claimPayments[i].claimPayments.Payment_Source == "1" && this.claimViewModel.claimPayments[i].claimPayments.Reject_Amount > 0) {
                            if (this.claimViewModel.ClaimModel.Pri_Status == "N") {
                                swal('Failed', "Please set Pri. Insurance Status.", 'error');
                                return false;
                            }

                        }
                        else if (this.claimViewModel.claimPayments[i].claimPayments.Payment_Source == "2" && this.claimViewModel.claimPayments[i].claimPayments.Reject_Amount > 0) {
                            if (this.claimViewModel.ClaimModel.Sec_Status == "N") {
                                swal('Failed', "Please set Sec. Insurance Status.", 'error');
                                return false;
                            }

                        }
                        else if (this.claimViewModel.claimPayments[i].claimPayments.Payment_Source == "3" && this.claimViewModel.claimPayments[i].claimPayments.Reject_Amount > 0) {
                            if (this.claimViewModel.ClaimModel.Oth_Status == "N") {
                                swal('Failed', "Please set Other. Insurance Status.", 'error');
                                return false;
                            }

                        }
                        else if (this.claimViewModel.claimPayments[i].claimPayments.Payment_Source == "P") {
                            if (this.claimViewModel.ClaimModel.Pat_Status == "N") {
                                swal('Failed', "Please set Patient Status.", 'error');
                                return false;
                            }

                        }
                        // Bug: ID=466

                        if (this.claimViewModel.claimPayments[i].claimPayments.Amount_Approved == null&&this.claimViewModel.claimPayments[i].claimPayments.Payment_Source!="T") {
                            this.claimViewModel.claimPayments[i].claimPayments.Amount_Approved = 0;
                        }
                        if (this.claimViewModel.claimPayments[i].claimPayments.Amount_Paid == null) {
                            this.claimViewModel.claimPayments[i].claimPayments.Amount_Paid = 0;
                            if(this.claimViewModel.claimPayments[i].claimPayments.Amount_Paid >-1 &&this.claimViewModel.claimPayments[i].claimPayments.Payment_Source=="T"){
                                swal('Failed', "Amt. Paid is required. Please Enter a negative amount", 'error');
                                this.claimViewModel.claimPayments[i].claimPayments.Amount_Paid = null;
                                return false;
                            }
                            
                        }
                        if (this.claimViewModel.claimPayments[i].claimPayments.Amount_Adjusted == "0.00"&&this.claimViewModel.claimPayments[i].claimPayments.Payment_Source!="T") {
                            this.claimViewModel.claimPayments[i].claimPayments.Amount_Adjusted = "0";
                        }

                        let matchwithpervious: boolean = false;
                        this.claimviewmodel_default.claimPayments.forEach(x => {

                            if ((x.claimPayments.claim_payments_id == this.claimViewModel.claimPayments[i].claimPayments.claim_payments_id)) {
                                if ((x.claimPayments.Amount_Paid == this.claimViewModel.claimPayments[i].claimPayments.Amount_Paid) && (x.claimPayments.Amount_Approved == this.claimViewModel.claimPayments[i].claimPayments.Amount_Approved) && (x.claimPayments.Amount_Adjusted == this.claimViewModel.claimPayments[i].claimPayments.Amount_Adjusted)) {
                                    matchwithpervious = true;
                                }
                            }
                        })
                        //Added bY Hamza Akhlaq For CareVoyant
                        if( this.claimViewModel.claimPayments[i].claimPayments.ENTERED_FROM != "60")
                        {
                            if (this.claimViewModel.claimPayments[i].claimPayments.Amount_Adjusted == "" || this.claimViewModel.claimPayments[i].claimPayments.Amount_Adjusted == null && this.claimViewModel.claimPayments[i].claimPayments.Amount_Adjusted == "0"
                                && this.claimViewModel.claimPayments[i].claimPayments.Amount_Approved == 0
                                && this.claimViewModel.claimPayments[i].claimPayments.Amount_Paid == 0
                            ) 
                            {
                                 if(this.claimViewModel.claimPayments[i].claimPayments.Payment_Source!="T"){
                                    swal('Failed', "Amount Paid / Amount Adjusted / Amount Approved can't be null.", 'error');
                                    return false;
                                 }
                               
                            }


                        }
                       


                    }

                }
            }
        }
        if(this.ClaimBillingType=='I')
        {
            
            const parts = this.claimViewModel.Admission_Details.Type_of_Bill.toString();
                    if(parts == "111")
                    {
                        if (this.claimViewModel.Admission_Details.Dischargehour== null || this.claimViewModel.Admission_Details.Dischargehour== "") {
                            swal('Failed', "Discharge hour is mandatory for selected type of bill", 'error');
                            return false;
                        }
                    }
                    if(parts == "111")
                        {
                            if (this.claimViewModel.ClaimModel.Hospital_From == null || this.claimViewModel.ClaimModel.Hospital_From == '') {
                                swal('Failed', "Facility is mandatory for selected Type of bill", 'error');
                                return false;
                            }
                        }
                        if (this.Admissiondetails.Type_Of_Admission_Id == null || this.Admissiondetails.Type_Of_Admission_Id == 0)
                        {
                            swal('Failed', "Admission Type is Mandatory for Institutional Claims", 'error');
                                return false;
                        }
                        if (
                            this.Type_of_Facility_Id === null || this.Type_of_Facility_Id === undefined || this.Type_of_Facility_Id === '' ||
                            this.Type_of_Care_Id === null || this.Type_of_Care_Id === undefined || this.Type_of_Care_Id === '' ||
                            this.Sequence_of_care_Id === null || this.Sequence_of_care_Id === undefined || this.Sequence_of_care_Id === ''
                          )
                        {
                            swal('Failed', "Please select type of bill fields", 'error');
                                return false;
                        }
                        
                        if (this.Gv.CCrowAdded == true && this.claimViewModel.UbClaimDropdown.CcOde.length == 0) {
                            swal('Failed', 'Condition Code is Required.', 'error');
                                    return false;
                        }
                        if (this.claimViewModel.UbClaimDropdown.CcOde.length > 0) {
                            
                            for (let item of this.claimViewModel.UbClaimDropdown.CcOde) {
                                
                                    if(!item.ConditionCode && item.ConditionCode == 0)
                                    {
                                        swal('Failed', 'Condition code is Required.', 'error');
                                        return false;
                                    }
                                }
                            
                        }
                        if (this.Gv.OCrowAdded == true && this.claimViewModel.UbClaimDropdown.OccCode.length == 0) {
                            swal('Failed', 'Occurrence Code is Required.', 'error');
                                    return false;
                        }
                        if (this.claimViewModel.UbClaimDropdown.OccCode.length > 0) {
                            for (let item of this.claimViewModel.UbClaimDropdown.OccCode) {
                                if (!item.OccCode) {
                                    swal('Failed', 'Occurrence Code is Required.', 'error');
                                    return false;
                                }
                                if (!item.Date2) {
                                    swal('Failed', 'Occurrence Code Date is Required.', 'error');
                                    return false;
                                }
                            }
                        }
                        if (this.Gv.OSCrowAdded == true && this.claimViewModel.UbClaimDropdown.OccSpanCode.length == 0) {
                            swal('Failed', 'Occurrence span Code is Required.', 'error');
                                    return false;
                        }
                        if (this.claimViewModel.UbClaimDropdown.OccSpanCode.length > 0) {
                            for (let item of this.claimViewModel.UbClaimDropdown.OccSpanCode) {
                                if (!item.OccSpanCode) {
                                    swal('Failed', 'Occurrence span Code is Required.', 'error');
                                    return false;
                                }
                                if (!item.DateFrom ) {
                                    swal('Failed', 'Occurrence Span From Date is Required.', 'error');
                                    return false;
                                }
                                if (!item.DateThrough) {
                                    swal('Failed', 'Occurrence Span Through Date is Required.', 'error');
                                    return false;
                                }
                            }
                        }
                        if (this.Gv.VCrowAdded == true && this.claimViewModel.UbClaimDropdown.ValueCode.length == 0) {
                            swal('Failed', 'Value Code is Required.', 'error');
                                    return false;
                        }
                        if (this.claimViewModel.UbClaimDropdown.ValueCode.length > 0) {
                            for (let item of this.claimViewModel.UbClaimDropdown.ValueCode) {
                                if (!item.Value_Codes_Id) {
                                    swal('Failed', 'Value code is Required.', 'error');
                                    return false;
                                }
                                if (item.Amount === "" || item.Amount === null || item.Amount === undefined) {
                                    swal('Failed', 'Invalid Value code amount.', 'error');
                                    return false;
                                }
                            }
                        }
                        if (this.Admissiondetails.Type_Of_Admission_Id == "4")
                        {
                            
                            //this.GetAdmissionType();
                            if(this.alreadyExists == false)
                            {
                                swal('Failed', "Admission type 4 can not be billed twice for a patient", 'error');
                                return false;
                            }
                            else 
                            {
                                return true
                            }
                        }
        }
        
        return true;
    
    }
    async GetAdmissionType() {
        
        this.API.getData('/Demographic/GetAdmissionType?PatientAccount= ' + this.claimInfo.Patient_Account + '&ClaimNo=' + this.claimInfo.claimNo).subscribe(
            data => {
                if (data.Status == 'Success') {
                    
                    //this.states = data.Response;
                    if(data.Response == true)
                    {
                        this.alreadyExists = true
                    }
                    else
                    this.alreadyExists = false;
                }

            });
            //return true;
    }

    validateDate(fromDate: string, toDate: string, index: number) {
        if (fromDate) {
            if (this.validateD(fromDate)) {
                if (new Date(fromDate) > new Date(toDate)) {
                    swal('Validation', 'From Date cannot be greater than To Date', 'warning');
                    this.claimCharges[index].claimCharges.Dos_From = '';
                    return
                }
            }
            else {
                swal('Failed', "Invalid Date format.", 'error');
                this.claimCharges[index].claimCharges.Dos_From = '';
                return;
            }
        }
   
    }

    checkToDate(fromDate: string, toDate: string, index: number) {
        if (toDate) {
            if (this.validateD(toDate)) {
                this.daysDiff(fromDate, toDate, index);
                if (new Date(fromDate) > new Date(toDate)) {
                    swal('Validation', 'To Date cannot be less than From Date', 'warning');
                    this.claimCharges[index].claimCharges.Dos_To = '';
                }
            }
            else {
                swal('Failed', "Invalid Date format.", 'error');
                this.claimCharges[index].claimCharges.Dos_To = '';
            }
        }
    }

    validateDateFormat(dt: string, Type: string, ndx: number, event: KeyboardEvent = null) {
        if (event.code == "Backspace" || event.code == "Delete")
            return;
        if (dt == undefined || dt == null)
            return;

        if (dt.length == 2 || dt.length == 5) {
            if (Type == "FromDate")
                this.claimCharges[ndx].claimCharges.Dos_From = dt + "/";

            if (Type == "ToDate")
                this.claimCharges[ndx].claimCharges.Dos_To = dt + "/";

        }
    }

    daysDiff(fromDate: string, toDate: string, index: number, Type: string = "", event?: KeyboardEvent) {
        if (event == undefined || event.key != "Tab") {
            if (Type == "FromDate")
                this.validateDateFormat(fromDate, Type, index, event);
            else if (Type == "ToDate")
                this.validateDateFormat(toDate, Type, index, event);
            // this.checkDuplicateCPT(index);
            if ((fromDate == null || fromDate == undefined || fromDate == "") ||
                (toDate == null || toDate == undefined || toDate == "")) {
                if (index > -1) {
                    this.claimCharges[index].claimCharges.Units = 0;
                } else {
                    return 0;
                }
            } else {
                if (this.validateD(fromDate) && this.validateD(toDate) && (new Date(toDate) >= new Date(fromDate))) {
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var firstDate = new Date(fromDate);
                    var secondDate = new Date(toDate);
                    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    if (index > -1) {
                        this.claimCharges[index].claimCharges.Units = (diffDays + 1);
                        this.AutoNotesForProc(index)
                        this.CPTKeyPressEventUnit(null, this.claimCharges[index].claimCharges.Units.toString(), index);

                    } else {
                        return diffDays + 1;
                    }
                } else {
                    if (index > -1) {
                        this.claimCharges[index].claimCharges.Units = 0;
                    } else {
                        return 0;
                    }
                }
            }
        }
    }


    CPTKeyPressEventUnit(event = null, u: string, index: number, cptType: string = "") {
        // Default unit value
        let unit = "1";
        if (event === null || event.keycode !== 9) {
            // Determine unit value
            unit = u === "" || u === "0" ? "1" : u;
            // Default the `amt` field if it is null, undefined, or empty
            if (!this.claimCharges[index].amt) {
                this.claimCharges[index].amt = this.response[0].Charges || "0"; // Fallback to `this.response[0].Charges`
            }
            // Calculate Amount using the determined `amt` and `unit`
            this.claimCharges[index].claimCharges.Amount = (
                parseFloat(this.claimCharges[index].amt) * parseFloat(unit)
            ).toString();
            this.cd.detectChanges();
            // Check for Anesthesia CPT Type
            if (cptType !== "" && cptType === "Anesthesia") {
                // If CPT is Anesthesia, increase the charges by 200%
                this.claimCharges[index].claimCharges.Amount = (
                    Math.round((parseFloat(this.claimCharges[index].claimCharges.Amount) * 200) / 100)
                ).toString();
            }
        }
    }
       

    // CPTKeyPressEventUnit(event = null, u: string, index: number, cptType: string = "") {
    //     let unit = "1";
    //     if (event === null || event.keycode !== 9) {
    //         unit = u == "" || u == "0" ? "1" : u;
    //         if (this.claimCharges[index].amt == "" || this.claimCharges[index].amt == null || this.claimCharges[index].amt == undefined)
    //             this.claimCharges[index].amt = "0";
    //         this.claimCharges[index].claimCharges.Amount = (parseFloat(this.claimCharges[index].amt) * parseFloat(unit)).toString();
    //     //   this.response[0].Charges = this.claimCharges[index].claimCharges.Amount
    //         //..Below condition is Added by Tamour Ali on 14/08/2023, to check if the Cpt belongs to Anesthesia Practice.

    //         if (cptType != "" && cptType === "Anesthesia") {
    //             //.. If CPT belongs to Anesthesia then the total Charges amount will be increased by 200% to calculat the final charges for CPT.
    //             //.. As its Nobility own criteria to charge 200% of total amount in case on Anesthesia Cpt's, also the cptType optional parameter is added for this implementation.
    //             this.claimCharges[index].claimCharges.Amount = (Math.round((parseFloat(this.claimCharges[index].claimCharges.Amount) * 200) / 100)).toString();

    //         }
    //         // USER STORY 16 : commented by HAMZA & Date: 08/02/2023
    //         //   this.checkDuplicateCPT(index);
    //     }
    // }


    onBlurUnit(index: number) {
        if (Common.isNullOrEmpty(this.claimCharges[index].claimCharges.Units)) {
          if(this.claimCharges[index].claimCharges.Procedure_Code != "")
          {
            this.claimCharges[index].claimCharges.Units = 1;
          }
        }
        this.AutoNotesForProc(index)
    }

    getNotificationFacility() {
        this.claimViewModel.ClaimModel.Facility_Code = this.Gv.FacilityCode;
        this.claimViewModel.ClaimModel.Facility_Name = this.Gv.FacilityName;
        document.getElementById("facilityClose").click();
    }
    selectedFacilityName: string = 'Sample Facility';
    showFacility() {
this.selectedFacilityName = 'Claim';
        document.getElementById("Facilities").click();
    }
    showAttachments() {
        document.getElementById("Attachments").click();
    }

    getSetStatus() {
        this.claimService.claimTabActive.next('claimsSummary');
        this.router.navigate(['/Patient/Demographics/ClaimSummary',
            Common.encodeBase64(JSON.stringify({
                Patient_Account: this.claimInfo.Patient_Account,
                PatientFirstName: this.claimInfo.PatientFirstName,
                PatientLastName: this.claimInfo.PatientLastName,
                claimNo: this.ClaimNumber,
                disableForm: false
            }))
        ]);
    }

    resetNotes() {
        this.ChildNotes.resetFields();
    }

    claimStatus_Changed(status: string) {

         ;

        if (status == "P") {
            var bit = false
            let counttheins: number = 0;
            this.InsChild.claimInsuranceModel.forEach(x => {

                if (x.claimInsurance.Pri_Sec_Oth_Type == 'P' && x.claimInsurance.Deleted == true) {
                    counttheins++
                }
            })
            if (this.InsChild.claimInsuranceModel.length == counttheins) {
                bit = true;
            }
            if (this.emptyOrNullstring(this.claimViewModel.ClaimModel.Pri_Status))
                return;
            if (this.InsChild.claimInsuranceModel == undefined || this.InsChild.claimInsuranceModel == null
                || this.InsChild.claimInsuranceModel.filter(x => x.claimInsurance.Pri_Sec_Oth_Type == "P").length == 0 || bit) {
                this.toast.info("Please enter Primary Insurance.", 'No Primary Insurance');
                $("#ddlPriStatus").val("");
                this.claimViewModel.ClaimModel.Pri_Status = "";
                return;
            }
            if (this.claimViewModel.ClaimModel.Pri_Status == "N") {
                this.claimViewModel.ClaimModel.Is_Self_Pay = false;
                this.claimViewModel.ClaimModel.Pat_Status = "W";
                for (var x = 0; x < this.InsChild.claimInsuranceModel.length; x++) {
                    if (this.InsChild.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "S")
                        this.claimViewModel.ClaimModel.Sec_Status = "W";
                    if (this.InsChild.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "O")
                        this.claimViewModel.ClaimModel.Oth_Status = "W";
                }
            }
        } //-- ---------------------------------------ENd Primary Status Primary insruance
        else if (status == "S") {
            if (this.emptyOrNullstring(this.claimViewModel.ClaimModel.Sec_Status))
                return;
            if (this.InsChild.claimInsuranceModel == undefined || this.InsChild.claimInsuranceModel == null
                || this.InsChild.claimInsuranceModel.filter(x => x.claimInsurance.Pri_Sec_Oth_Type == "S").length == 0) {
                this.toast.info("Please enter Secondary Insurance.", 'No Secondary Insurance');
                this.claimViewModel.ClaimModel.Sec_Status = "";
                $("#ddlSecStatus").val("");
                return;
            }
            this.claimViewModel.ClaimModel.Is_Self_Pay = false;
            if (this.claimViewModel.ClaimModel.Sec_Status == "N") {
                this.claimViewModel.ClaimModel.Pat_Status = "W";
                for (var x = 0; x < this.InsChild.claimInsuranceModel.length; x++) {
                    if (this.InsChild.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "P")
                        this.claimViewModel.ClaimModel.Pri_Status = "W";
                    if (this.InsChild.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "O")
                        this.claimViewModel.ClaimModel.Oth_Status = "W";
                }
            }
        } //-- ENd Secondary insurance Status

        else if (status == "O") {
            if (this.emptyOrNullstring(this.claimViewModel.ClaimModel.Oth_Status))
                return;
            if (this.InsChild.claimInsuranceModel == undefined || this.InsChild.claimInsuranceModel == null
                || this.InsChild.claimInsuranceModel.filter(x => x.claimInsurance.Pri_Sec_Oth_Type == "O").length == 0) {
                this.toast.info("Please Enter Other Insurance.", 'No Other Insurance');
                this.claimViewModel.ClaimModel.Oth_Status = "";
                $("#ddlOthStatus").val("");
                return;
            }
            this.claimViewModel.ClaimModel.Is_Self_Pay = false;
            if (this.claimViewModel.ClaimModel.Oth_Status == "N") {
                this.claimViewModel.ClaimModel.Pat_Status = "W";

                for (var x = 0; x < this.InsChild.claimInsuranceModel.length; x++) {
                    if (this.InsChild.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "P")
                        this.claimViewModel.ClaimModel.Pri_Status = "W";
                    if (this.InsChild.claimInsuranceModel[x].claimInsurance.Pri_Sec_Oth_Type == "S")
                        this.claimViewModel.ClaimModel.Sec_Status = "W";
                }
            }
        } //-- ENd Other Insurance Status 
    }

    emptyOrNullstring(str: string) {
        if (str == undefined || str == null || $.trim(str) == "")
            return true;
        else return false;
    }

    chExp() {
        this.isChargesExpand = !this.isChargesExpand;
    }

    ClosePage() {
        this.API.confirmFun('Do you want to close this Patient Form?', '', () => {
            this.router.navigate(['/PatientSearch'])
        });
    }


    checkChange(event: KeyboardEvent, str: string) {
        if (event.keyCode == 9) {
            if (str == "DOS") {
                $('#dosScanD').focus();
                setTimeout(function () {
                    $('#inpReferal').focus();
                }, 500);
                setTimeout(function () {
                    $('#dosScanD').focus();
                }, 3300);
            }
        }
    }


    isnullOrEmpty(str: any): any {
        if (str == undefined || str == null || $.trim(str) == "") {
            return true;
        }
        else return false;
    }

    clearClaimAmount() {
        this.claimViewModel.ClaimModel.Pri_Ins_Payment = 0.00;
        this.claimViewModel.ClaimModel.Sec_Ins_Payment = 0.00;
        this.claimViewModel.ClaimModel.Oth_Ins_Payment = 0.00;
        this.claimViewModel.ClaimModel.Patient_Payment = 0.00;
        this.claimViewModel.ClaimModel.Adjustment = 0.00;
        this.claimViewModel.ClaimModel.Amt_Due = 0.00;
        this.claimViewModel.ClaimModel.Amt_Paid = 0.00;
        this.claimViewModel.ClaimModel.Claim_Total = 0.00;
        this.claimViewModel.ClaimModel.Hospital_From = "";
        this.claimViewModel.ClaimModel.Hospital_To = "";
        this.claimViewModel.ClaimModel.Bill_Date = "";
        this.claimViewModel.ClaimModel.DOS = "";


    }

    funDXCalculation() {
        var dxArray = $("#container td").map(function () {
            return $(this).text();
        });
        this.claimViewModel.ClaimModel.DX_Code1 = this.isEmptyofNull($('#' + this.getdxID(dxArray[0])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code2 = this.isEmptyofNull($('#' + this.getdxID(dxArray[1])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code3 = this.isEmptyofNull($('#' + this.getdxID(dxArray[2])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code4 = this.isEmptyofNull($('#' + this.getdxID(dxArray[3])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code5 = this.isEmptyofNull($('#' + this.getdxID(dxArray[4])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code6 = this.isEmptyofNull($('#' + this.getdxID(dxArray[5])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code7 = this.isEmptyofNull($('#' + this.getdxID(dxArray[6])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code8 = this.isEmptyofNull($('#' + this.getdxID(dxArray[7])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code9 = this.isEmptyofNull($('#' + this.getdxID(dxArray[8])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code10 = this.isEmptyofNull($('#' + this.getdxID(dxArray[9])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code11 = this.isEmptyofNull($('#' + this.getdxID(dxArray[10])).val().toString());
        this.claimViewModel.ClaimModel.DX_Code12 = this.isEmptyofNull($('#' + this.getdxID(dxArray[11])).val().toString());
    }

    getdxID(dx: string): string {
        if (dx == 'DX 10' || dx == 'DX 11' || dx == 'DX 12')
            return dx.replace(' ', '0');
        else
            return dx.replace(' ', '');

    }

    dxValidation() {
        let check = 0;
        this.dxNumber = '';
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code12) != '') check = 1;
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code11) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code10) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code9) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code8) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code7) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code6) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code5) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code4) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code3) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }
        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code2) != '') check = 1;
        else if (check == 1) { this.dxNumber = "InvalidSeq"; return; }

        if (this.isEmptyofNull(this.claimViewModel.ClaimModel.DX_Code1) == '') {
            this.dxNumber = "At least one DX is required";
            return;
        }
    }
    isEmptyofNull(str: string) {
        if (str == undefined || str == null)
            return '';
        else
            return $.trim(str);
    }

    SetDiagnosis(e: any) {
        this.setE = e;
        this.Diag.splice(e.index, 1, e.Diag);
        this.claimCharges.forEach(c => {
            if (e.index === 0)
                if (Common.isNullOrEmpty(c.claimCharges.DX_Pointer1)) {
                    c.claimCharges.DX_Pointer1 = 1;
                }
            if (e.index === 1)
                if (Common.isNullOrEmpty(c.claimCharges.DX_Pointer2)) {
                    c.claimCharges.DX_Pointer2 = 2;
                }
            if (e.index === 2)
                if (Common.isNullOrEmpty(c.claimCharges.DX_Pointer3)) {
                    c.claimCharges.DX_Pointer3 = 3;
                }
            if (e.index === 3)
                if (Common.isNullOrEmpty(c.claimCharges.DX_Pointer4)) {
                    c.claimCharges.DX_Pointer4 = 4;
                }

        })
        if(this.claimViewModel.ClaimModel.Claim_No==0)
            {
                this.CheckNewClaim=true
            }
         if(e.Diag.Diagnosis.AddorUpdate == true && this.CheckNewClaim != true)
            {
               this.getLastAddedDiagCode(e.index);
            }
          if(e.Diag.Diagnosis.AddorUpdate == false && this.CheckNewClaim != true)
            {
                if(e.olddxcode !=null)
                    {
                      this.oldDX= e.olddxcode;
                    }
              this.getUpdatedDiagCode(e.index);
            }
       
            
         //this.getLastAddedDiagCode();
        //this.getnewaddeddx(Diag_Code,this.lastIndex);
        //this.AddAutoNotesForUpdateClaim();
    }

    RemoveDiagnosis(ndx: number) {
        var diagLength = this.Diag.length; // length before deletion
        this.dxcodearraylength=Number(this.Diag.length);
        this.claimCharges.forEach(c => {
            if (ndx === 3 && !Common.isNullOrEmpty(c.claimCharges.DX_Pointer4)) {
                c.claimCharges.DX_Pointer4 = null;
            }
            if (ndx === 2 && !Common.isNullOrEmpty(c.claimCharges.DX_Pointer3)) {
                c.claimCharges.DX_Pointer3 = c.claimCharges.DX_Pointer4;
                c.claimCharges.DX_Pointer4 = null;
            }
            if (ndx === 1 && !Common.isNullOrEmpty(c.claimCharges.DX_Pointer2)) {
                c.claimCharges.DX_Pointer2 = c.claimCharges.DX_Pointer3;
                c.claimCharges.DX_Pointer3 = c.claimCharges.DX_Pointer4;
                c.claimCharges.DX_Pointer4 = null;
            }
            if (ndx === 0 && !Common.isNullOrEmpty(c.claimCharges.DX_Pointer1)) {
                c.claimCharges.DX_Pointer1 = c.claimCharges.DX_Pointer2;
                c.claimCharges.DX_Pointer2 = c.claimCharges.DX_Pointer3;
                c.claimCharges.DX_Pointer3 = c.claimCharges.DX_Pointer4;
                c.claimCharges.DX_Pointer4 = null;
            }
        });
        if (diagLength > 4) {
             
            this.claimCharges.forEach(c => {
                c.claimCharges.DX_Pointer1 = 1;
                c.claimCharges.DX_Pointer2 = 2;
                c.claimCharges.DX_Pointer3 = 3;
                c.claimCharges.DX_Pointer4 = 4;
            });
        }

        else {
             
            if (diagLength > 3) {

                this.claimCharges.forEach(c => {
                    c.claimCharges.DX_Pointer1 = 1;
                    c.claimCharges.DX_Pointer2 = 2;
                    c.claimCharges.DX_Pointer3 = 3;
                    c.claimCharges.DX_Pointer4 = null;
                });
            }
            else if (diagLength > 2) {

                this.claimCharges.forEach(c => {
                    c.claimCharges.DX_Pointer1 = 1;
                    c.claimCharges.DX_Pointer2 = 2;
                    c.claimCharges.DX_Pointer3 = null;
                    c.claimCharges.DX_Pointer4 = null;
                });
            }
            else if (diagLength > 1) {

                this.claimCharges.forEach(c => {
                    c.claimCharges.DX_Pointer1 = 1;
                    c.claimCharges.DX_Pointer2 = null;
                    c.claimCharges.DX_Pointer3 = null;
                    c.claimCharges.DX_Pointer4 = null;
                });
            }
            else if (diagLength > 0) {
                    this.claimCharges.forEach(c => {
                    c.claimCharges.DX_Pointer1 = null;
                    c.claimCharges.DX_Pointer2 = null;
                    c.claimCharges.DX_Pointer3 = null;
                    c.claimCharges.DX_Pointer4 = null;
                });
            }
        }
        this.getDeletedDXCode(ndx);
    }


    setDateRange(beginDateStr: string, endDateStr: string): void {
         
        let beginDate = new Date(beginDateStr);
        let endDate = new Date(endDateStr);
        this.formControls['hospitalization'].patchValue({
            facilityDates: {
                beginDate: {
                    year: beginDate.getFullYear(),
                    month: beginDate.getMonth() + 1,
                    day: beginDate.getDate()
                },
                endDate: {
                    year: endDate.getFullYear(),
                    month: endDate.getMonth() + 1,
                    day: endDate.getDate()
                }
            }
        });
    }

    clearDateRange(): void {
        // Clear the date range using the patchValue function
        this.formControls['hospitalization'].get('facilityDates').patchValue({ myDateRange: '' });
    }

    isNewClaim() {
        return !(this.claimViewModel.ClaimModel.Claim_No !== null && this.claimViewModel.ClaimModel.Claim_No !== 0 && this.claimViewModel.ClaimModel.Claim_No !== undefined)
    }

    onChangeCorrectedClaim() {
        if (this.claimViewModel.ClaimModel.Is_Corrected) {
            this.formControls['correctedClaimGroup'].get('ICN_Number').setValidators([Validators.required]);
            this.formControls['correctedClaimGroup'].get('ICN_Number').updateValueAndValidity({ onlySelf: true, emitEvent: true });
            this.formControls['correctedClaimGroup'].get('RSCode').setValidators([Validators.required]);
            this.formControls['correctedClaimGroup'].get('RSCode').updateValueAndValidity({ onlySelf: true, emitEvent: true });
            if (this.isnullOrEmpty(this.claimViewModel.ClaimModel.RSCode))
                this.claimViewModel.ClaimModel.RSCode = this.claimViewModel.ResubmissionCodes[0].Id;
        } else {
            this.formControls['correctedClaimGroup'].get('ICN_Number').clearValidators();
            this.formControls['correctedClaimGroup'].get('ICN_Number').updateValueAndValidity({ onlySelf: true, emitEvent: true });
            this.formControls['correctedClaimGroup'].get('RSCode').clearValidators();
            this.formControls['correctedClaimGroup'].get('RSCode').updateValueAndValidity({ onlySelf: true, emitEvent: true });
        }
    }


    onChangeDrugCode(cptIndex) {
        this.claimCharges[cptIndex].claimCharges.NDC_Qualifier = this.claimCharges[cptIndex].claimCharges.NDCList.find(dc => dc.Name == this.claimCharges[cptIndex].Drug_Code).Meta.Qualifier;
        this. AutoNotesForProc(cptIndex);
    }
    setTimeStart(ndx: number, data: any) {
        if (data != null) {
            var timeArr = data.split(":");
            if ((Number(timeArr[0]) >= 0) && (Number(timeArr[0]) < 24) && (Number(timeArr[1]) >= 0) && (Number(timeArr[1]) < 60)) {
                this.claimCharges[ndx].claimCharges.Start_Time = data;
                return
            } else {
                this.claimCharges[ndx].claimCharges.Start_Time = null;
            }
        }
    }
    
    setTimeStop(ndx: number, data: any) {
        if (data != null) {
            var timeArr = data.split(":");
            if ((Number(timeArr[0]) >= 0) && (Number(timeArr[0]) < 24) && (Number(timeArr[1]) >= 0) && (Number(timeArr[1]) < 60)) {
                this.claimCharges[ndx].claimCharges.Stop_Time = data;
                return
            } else {
                this.claimCharges[ndx].claimCharges.Stop_Time = null;
            }
        }
    }
    onGenerateHcfa(isPrintable: boolean = false, insuranceType : string) {
        // isPrintable=this.HCFA;
        // insuranceType=this.HCFAType;
        if (this.ClaimNumber) {
            this.API.downloadFile(`/hcfa/GenerateHcfa?claimNo=${this.ClaimNumber}&isPrintable=${isPrintable}&insuranceType=${insuranceType}`).subscribe(response => {
                if (response.type === 'application/json')
                    this.toast.warning("No record found");
                else {

                    if (isPrintable) {
                        let blob = new Blob([response], { type: 'application/pdf' });
                        // const blobUrl = URL.createObjectURL(blob);
                        // const iframe = document.createElement('iframe');
                        // iframe.style.display = 'none';
                        // iframe.src = blobUrl;
                        // document.body.appendChild(iframe);
                        // iframe.contentWindow.print();
                        saveAs(blob, this.ClaimNumber + '.pdf');
                        this.AddAutonNotesforHCFA(isPrintable,insuranceType);
                    }
                    else {
                        if (response.type === 'application/pdf') {
                            let blob = new Blob([response], { type: 'application/pdf' });
                            saveAs(blob, this.ClaimNumber + '.pdf');
                            this.AddAutonNotesforHCFA(isPrintable,insuranceType);
                        } else if (response.type === 'application/zip') {
                            let blob = new Blob([response], { type: 'application/zip' });
                            saveAs(blob, this.ClaimNumber + '.zip');
                            this.AddAutonNotesforHCFA(isPrintable,insuranceType);
                        }
                    }
                }
            });

        }
    }

    onGenerateUbForm(isPrintable: boolean = false){

        if (this.ClaimNumber) {
            this.API.downloadFile(`/hcfa/GenerateUB?claimNo=${this.ClaimNumber}&isPrintable=${isPrintable}`).subscribe(response => {
                if (response.type === 'application/json')
                    this.toast.warning("No record found");
                else {
                    if (isPrintable) {
                        let blob = new Blob([response], { type: 'application/pdf' });
                        const blobUrl = URL.createObjectURL(blob);
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        iframe.src = blobUrl;
                        document.body.appendChild(iframe);
                        iframe.contentWindow.print();
                    }
                    else {
                        if (response.type === 'application/pdf') {
                            let blob = new Blob([response], { type: 'application/pdf' });
                            saveAs(blob, this.ClaimNumber + '.pdf');
                        } else if (response.type === 'application/zip') {
                            let blob = new Blob([response], { type: 'application/zip' });
                            saveAs(blob, this.ClaimNumber + '.zip');
                        }
                    }
                }
            });

        }



    }

    /* Below are the changes done by Tamour Ali on 08/Aug/2023 */
    /* Below methods are regarding Anesthesia Task for CPT Charges & Units calculations  */

    onPhysicalModifierChange(physicalModifier: any, cptIndex: number) {
        if (!this.claimCharges[cptIndex].amt) {
            this.claimCharges[cptIndex].amt = "0";
        }

        let unitCount = this.claimCharges[cptIndex].claimCharges.Units;

        const oldPhysicalModifier = this.claimCharges[cptIndex].claimCharges.Physical_Modifier;
        this.claimCharges[cptIndex].claimCharges.Physical_Modifier = physicalModifier;

        unitCount = this.adjustUnitsForPhysicalModifier(oldPhysicalModifier, physicalModifier, unitCount);

        this.claimCharges[cptIndex].claimCharges.Units = unitCount;
        this.CPTKeyPressEventUnit(null, unitCount.toString(), cptIndex, "Anesthesia");
    }

    adjustUnitsForPhysicalModifier(oldModifier: any, newModifier: any, unitCount: number): number {
        unitCount = this.removeUnitsForPhysicalModifier(oldModifier, unitCount);
        switch (newModifier) {
            case "P3":
                unitCount += 1;
                break;
            case "P4":
                unitCount += 2;
                break;
            case "P5":
                unitCount += 3;
                break;
            default:
                break;
        }
        return unitCount;
    }

    removeUnitsForPhysicalModifier(physicalModifier: any, unitCount: number): number {
        switch (physicalModifier) {
            case "P3":
                unitCount -= 1;
                break;
            case "P4":
                unitCount -= 2;
                break;
            case "P5":
                unitCount -= 3;
                break;
            default:
                break;
        }
        return unitCount;
    }


    calculateTimeDifference(ndx: number, time: any, type: any) {

        let startTimeOld: string = '';
        let stopTimeOld: string = '';
        let timeDifference: number | null = null;
        if (this.claimCharges[ndx].claimCharges.Start_Time != null && this.claimCharges[ndx].claimCharges.Start_Time != '') {
            startTimeOld = this.claimCharges[ndx].claimCharges.Start_Time;
        }
        if (this.claimCharges[ndx].claimCharges.Stop_Time != null && this.claimCharges[ndx].claimCharges.Stop_Time != '') {
            stopTimeOld = this.claimCharges[ndx].claimCharges.Stop_Time;
        }
        const propertyToUpdate = type === 'start' ? 'Start_Time' : 'Stop_Time';
        if (time === null || time === '') {
            this.calculateAndResetTimeDifference(ndx, startTimeOld, stopTimeOld);
            this.updateClaimChargesProperty(ndx, propertyToUpdate, time);
            return;
        }
        this.updateClaimChargesProperty(ndx, propertyToUpdate, time);
        let start = this.parseTime(this.claimCharges[ndx].claimCharges.Start_Time);
        let end = this.parseTime(this.claimCharges[ndx].claimCharges.Stop_Time);

        // Check if the start time is in PM and stop time is in AM
        if (start.getHours() >= 12 && end.getHours() < 12) {
            // Adjust the date for the stop time to the next day
            end.setDate(end.getDate() + 1);

        }
        if (start > end) {
            timeDifference = null;
            type == 'start' ? this.updateClaimChargesProperty(ndx, propertyToUpdate, startTimeOld) : null;
            type == 'stop' ? this.updateClaimChargesProperty(ndx, propertyToUpdate, stopTimeOld) : null;
            this.cd.detectChanges();

            this.showSwalError('Invalid input', 'Start time must be less than Stop time.', 'error');
            return;
        } else {
            this.calculateAndResetTimeDifference(ndx, startTimeOld, stopTimeOld);

            const timeDifference = this.calculateMinutesDifference(start, end);
            this.timeChargesCalculation(ndx, timeDifference);
        }
    }

    private parseTime(time: string): Date {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }

    private calculateMinutesDifference(start: Date, end: Date): number {
        let diffInMilliseconds = end.getTime() - start.getTime();
        if (diffInMilliseconds < 0) {
            diffInMilliseconds = Math.abs(diffInMilliseconds);
        }
        return Math.floor(diffInMilliseconds / (1000 * 60)); // converting milliseconds to minutes
    }

    private showSwalError(title: string, text: string, alertType: string) {
        swal({
            type: alertType,
            title: title,
            text: text,
        });
    }

    oldTimeIndexReset(ndx: number, totalMinDifference: number) {
        if (totalMinDifference < 0) {
            totalMinDifference = Math.abs(totalMinDifference);
        }
        let unitCount = this.claimCharges[ndx].claimCharges.Units;
        let newUnitCount = (totalMinDifference / 15);
        const decimalDigits = (newUnitCount % 1).toFixed(1).substr(2);// Extracting the digits after the decimal point        
        const decimalPart = parseFloat(decimalDigits);// Converting the decimal digits to a number
        if (decimalPart >= 6) { newUnitCount += 1; }
        newUnitCount = Math.trunc(newUnitCount);
        unitCount = unitCount - newUnitCount;
        unitCount = Math.trunc(unitCount);
        this.claimCharges[ndx].claimCharges.Units = unitCount;
        this.CPTKeyPressEventUnit(null, unitCount.toString(), ndx, "Anesthesia"); //..this is added for remove feature testing
    }

    timeChargesCalculation(cptIndex: number, totalMinutes: any) {
        if (this.claimCharges[cptIndex].amt == "" || this.claimCharges[cptIndex].amt == null || this.claimCharges[cptIndex].amt == undefined)
            this.claimCharges[cptIndex].amt = "0";
        let unitCount = this.claimCharges[cptIndex].claimCharges.Units;
        unitCount = unitCount + (totalMinutes / 15);
        const decimalDigits = (unitCount % 1).toFixed(1).substr(2); // Extracting the digits after the decimal point
        const decimalPart = parseFloat(decimalDigits);        // Converting the decimal digits to a number
        if (decimalPart >= 6) { unitCount += 1; }
        unitCount = Math.trunc(unitCount);
        this.claimCharges[cptIndex].claimCharges.Units = unitCount;
        this.CPTKeyPressEventUnit(null, unitCount.toString(), cptIndex, "Anesthesia");
    }

    updateClaimChargesProperty(ndx: number, property: string, value: any) {
        this.claimCharges[ndx].claimCharges = {
            ...this.claimCharges[ndx].claimCharges,
            [property]: value || null,
        };
        this.cd.detectChanges();
    }

    calculateAndResetTimeDifference(ndx: number, startTimeOld: string, stopTimeOld: string) {
        if (startTimeOld !== '' && startTimeOld !== null && stopTimeOld !== '' && stopTimeOld !== null) {
            // Check if the start time is in PM and stop time is in AM
            let start = this.parseTime(startTimeOld);
            let end = this.parseTime(stopTimeOld);
            if (start.getHours() >= 12 && end.getHours() < 12) {
                // Adjust the date for the stop time to the next day
                end.setDate(end.getDate() + 1);
            }
            const oldTimeDifference = this.calculateMinutesDifference(start, end);
            // const oldTimeDifference = this.calculateMinutesDifference(this.parseTime(startTimeOld), this.parseTime(stopTimeOld));
            this.oldTimeIndexReset(ndx, oldTimeDifference);
        }
    }

    clearTime(ndx: number, property: string, value: any) {
        let startTimeOld: string = '';
        let stopTimeOld: string = '';
        if (this.claimCharges[ndx].claimCharges.Start_Time != null && this.claimCharges[ndx].claimCharges.Start_Time != '') {
            startTimeOld = this.claimCharges[ndx].claimCharges.Start_Time;
        }
        if (this.claimCharges[ndx].claimCharges.Stop_Time != null && this.claimCharges[ndx].claimCharges.Stop_Time != '') {
            stopTimeOld = this.claimCharges[ndx].claimCharges.Stop_Time;
        }
        swal({
            title: 'Are you sure?',
            text: "You want to remove the selected time!.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result) {
                this.calculateAndResetTimeDifference(ndx, startTimeOld, stopTimeOld);
                this.updateClaimChargesProperty(ndx, property, value);
            }
        }).catch((error) => {

        });
    }
    resetValues() {
        this.claimViewModel.ClaimModel.Facility_Name = "";
        this.DateFrom= "";
        this.DateTo =null ; 
      }
    IsButtonDisable(){       
         this.isDisabled= this.Gv.IsbuttonDisable();
        }
        HandleNegativeBalance(){
             this.CalculateNegativeBalance();
            //  if(this.TotaldueAmt > 0) {
            //     this.saveClaim("Save");
            // }
            // else{
            //     this.showOverPaymentModel();
            // }    
            if(this.TotaldueAmt < 0) {
                 this.showOverPaymentModel();
             }
             else{
                this.saveClaim("Save");
             }           
        }
        showOverPaymentModel() {
            this.selectedResponsibleParty;
            this.paymentResponsibilityForm.reset({
                creditbalance: '-', // Reset to initial value '-'
                overpaid: '-'       // Reset to initial value '-'
            });
            setTimeout(() => {
                this.opModal.show();

            setTimeout(() => {
                const modalElement = document.querySelector('.modal.show');
                if (modalElement) {
                  (modalElement as HTMLElement).focus();
                }
              }, 100);
            }, 300);
        //     const modalOptions: ModalOptions = {
        //       backdrop: 'static'
        //     };
        //     this.opModal.config = modalOptions;
        //   this.opModal.show(); 
        //    return;
          }
        showOverPaymentUpdateModel(value:string) {
            this.paymentResponsibilityForm.reset({
                creditbalance: '-', // Reset to initial value '-'
                overpaid: '-'       // Reset to initial value '-'
            });
            const modalOptions: ModalOptions = {
              backdrop: 'static'
            };
            this.upModal.config = modalOptions; 
          this.upModal.show(); 
           return;
          }

          onHidden() {
            this.paymentResponsibilityForm.reset({ creditbalance: '', overpaid: '' });
            this.TotaldueAmt = '';
            this.showoverpayment=false;
            setTimeout(() => {
                this.opModal.hide();
        
                setTimeout(() => {
                    this.saveClaim("Save");
                }, 300); // Delay of 300ms before calling saveClaim
            }, 300); // Delay of 300ms before hiding the modal
        }
        

        UpdatePaymentModelHidden(){
            this.paymentResponsibilityForm.reset({ creditbalance: '', overpaid: '' });
            this.TotaldueAmt='';
            this.upModal.hide();
        }
        onClose(){
            this.selectedResponsibleParty = 'Select Responsible';
            this.paymentResponsibilityForm.reset({
                creditbalance: '-', // Reset to initial value '-'
                overpaid: '-'       // Reset to initial value '-'
            });
            this.TotaldueAmt=0
            this.opModal.hide();
            this.GetOverPaymentModel();
        }

        UpdatePaymentModelClose(){
            this.selectedResponsibleParty = 'Select Responsible';
            this.TotaldueAmt=0;
            this.paymentResponsibilityForm.reset({
                creditbalance: '-', // Reset to initial value '-'
                overpaid: '-'       // Reset to initial value '-'
            });
            this.GetOverPaymentModel();
            this.upModal.hide();
        }
        CalculateNegativeBalance()
          {
            debugger
                    this.TotaldueAmt=0;
                    this.TotalCharges=0;
                    this.TotalPaidAmt=0;
                    this.TotalAdjamt=0;
                    this.Totalamtadj=0;
                    if (this.claimCharges.length > 0) {
                        this.claimCharges.forEach(charge => {
                         const paidcharges = charge.claimCharges.Amount != null && !isNaN(parseFloat(charge.claimCharges.Amount))
                         ? parseFloat(charge.claimCharges.Amount)
                         : 0
                        this.TotalCharges += paidcharges;
                            });
                         }
                  this.TotalPaidAmt = 0;
                  this.TotalAdjamt = 0;
                  this.paymentChild.claimPaymentModel.forEach(payment => {
                   
                  let paidAmount = (payment.claimPayments.Amount_Paid != null  && !isNaN(parseFloat(payment.claimPayments.Amount_Paid)) && (payment.claimPayments.Deleted ==null || payment.claimPayments.Deleted === false))? parseFloat(payment.claimPayments.Amount_Paid)
                : 0;
                    this.TotalPaidAmt += paidAmount;
                    let adjustedAmount = (payment.claimPayments.Amount_Adjusted != null && !isNaN(parseFloat(payment.claimPayments.Amount_Adjusted)) && (payment.claimPayments.Deleted ==null || payment.claimPayments.Deleted === false))? parseFloat(payment.claimPayments.Amount_Adjusted): 0;
                           this.TotalAdjamt += adjustedAmount;
                         });
        
                                 this.Totalamtadj = this.TotalPaidAmt + this.TotalAdjamt;
                                 if(this.Totalamtadj > this.TotalCharges ){
                                    let calculatedAmount = this.TotalCharges - this.Totalamtadj;
                                    this.TotaldueAmt = calculatedAmount < 0 ? calculatedAmount : -calculatedAmount;
                                    this.TotaldueAmt = parseFloat(this.TotaldueAmt.toFixed(2));
        
                                 }
                              
                                  
                                                    
          }
        UpdateCliamOverPayment()
          {
             this.paymentresponsbility.Claim_No = this.claimViewModel.ClaimModel.Claim_No;
             this.paymentresponsbility.Insurance_over_paid = '0';
             this.paymentresponsbility.Patient_credit_balance = '0';
             this.paymentresponsbility.Total_Responsibility = '0';
             this.API.PostData('/Demographic/AddClaimOverPayment', this.paymentresponsbility, (d) => {
                 if (d.Status == "Success") {
                 return;         
                 } else
                  {
                 }
             });
           
          }
        SelectedResponsibleParty(value: string)
          {
            this.selectedResponsibleParty = value;
          }
        initializeForm(): void
          {
            this.paymentResponsibilityForm = this.fb.group({
              creditbalance: ['-', [Validators.required, this.negativeValueValidator]],
              overpaid: ['-', [Validators.required, this.negativeValueValidator]],
            });
          }
        negativeValueValidator(control: AbstractControl): ValidationErrors | null 
          {
            const value = control.value;
            // Check if value is exactly "-", which is a valid input in progress
            if (value === '-') {
              return null;
            }          
            // Check if value is a valid negative number pattern
            if (value && !/^-\d+(\.\d+)?$/.test(value)) {
              return { invalidValue: true }; // Add error if value isn't a valid negative number
            }           
            return null; // No error if valid
          }
        onInputChange(controlName: string): void
         {
            const control = this.paymentResponsibilityForm.get(controlName);
            if (control) {
                control.updateValueAndValidity();
              if (control.invalid) {
    
              } 
              else {
              }
            }
          }
        SaveResponsbility(value: string)
         {
                     this.paymentresponsbility.Claim_No = null;
                     this.paymentresponsbility.Insurance_over_paid = null;
                     this.paymentresponsbility.Patient_credit_balance = null;
                     this.paymentresponsbility.Total_Responsibility = null;
                     if (value !== "bothpatientinsurance") {
                       this.paymentResponsibilityForm.reset(); 
                     }
                   
                     const userid = this.Gv.currentUser.RolesAndRights[0].UserId;
                     const username=this.Gv.currentUser.RolesAndRights[0].UserName;
                     if (!value || value === 'Select Responsible') {
                       this.toast.error('Please select an overpayment responsible option before saving');
                       return;
                     }
                     if (value === "creditbalance") {
                       this.paymentResponsibilityForm.get('creditbalance').setValue(this.TotaldueAmt);
                       this.noteDetail = `Claim moved to patient credit balance bucket $${this.TotaldueAmt} By User ${userid},${username}`;
                     } else if (value === "overpaid") {
                       this.paymentResponsibilityForm.get('overpaid').setValue(this.TotaldueAmt);
                       this.noteDetail = `Claim moved to insurance overpaid bucket $${this.TotaldueAmt} By User ${userid},${username}`;
                     } else if (value === "bothpatientinsurance") {
                       const overpaidValue = Number(this.paymentResponsibilityForm.get('overpaid').value) || 0;
                       const creditBalanceValue = Number(this.paymentResponsibilityForm.get('creditbalance').value) || 0;
                       const totalResponsibilityAmount = overpaidValue + creditBalanceValue;
                       this.noteDetail = `Claim moved to insurance overpaid bucket $${overpaidValue}, patient credit balance bucket ${creditBalanceValue} By User ${userid},${username}`;
         
                       if (overpaidValue == null || creditBalanceValue == null){
                         this.toast.error('credit balance & overpaid can not be null.');
                         return;
                     }
                       if (overpaidValue === 0 || creditBalanceValue === 0) {
                         this.toast.error('Both overpaid and credit balance must be greater than 0.');
                         return;
                       }
                       if (totalResponsibilityAmount !== this.TotaldueAmt) {
                         this.toast.error('The amounts entered do not match the total due amount. Please review and adjust accordingly');
                         return;
                       }
                      
                     }
                     this.paymentresponsbility.Claim_No = this.claimViewModel.ClaimModel.Claim_No;
                     this.paymentresponsbility.Insurance_over_paid = this.paymentResponsibilityForm.get('overpaid').value;
                     this.paymentresponsbility.Patient_credit_balance = this.paymentResponsibilityForm.get('creditbalance').value;
                     this.paymentresponsbility.Total_Responsibility = this.TotaldueAmt;
                      this.showoverpayment=false;
                      this.SaveOverpayment=true;
                      this.opModal.hide();
                      this.saveClaim('Save')
                      
          }   
        AddNotesForOverPayment(value:string)
         {
             this.claimNotesModel.Response.Note_Detail=value;
             this.claimNotesModel.Response.Claim_No =  this.claimViewModel.ClaimModel.Claim_No;
             this.claimNotesModel.Response.IsAuto_Note=true;
             this.API.PostData('/Demographic/SaveClaimNotes/', this.claimNotesModel.Response, (d) => {
             if (d.Status == "Sucess")
             {
             }
             })
          }
        UpdateResponseBility(value:string)
          {
              if (value === '' || value === undefined || value === 'Select Responsible')
                {
                  this.toast.error('Please select an overpayment responsible option before saving');
                  return;
                }
                let noteDetail = "";
                const userid = this.Gv.currentUser.RolesAndRights[0].UserId;
                const username=this.Gv.currentUser.RolesAndRights[0].UserName;
              if (value === "creditbalance")
                 {
                   this.paymentResponsibilityForm.get('creditbalance').setValue(this.TotaldueAmt);
                   this.paymentResponsibilityForm.get('overpaid').setValue('')
                   noteDetail = `Claim moved to patient credit balance bucket $${this.TotaldueAmt} By User ${userid},${username}`;
                 } 
              if (value === "overpaid")
                 {
                   this.paymentResponsibilityForm.get('overpaid').setValue(this.TotaldueAmt)
                   this.paymentResponsibilityForm.get('creditbalance').setValue('');
                   noteDetail = `Claim moved to insurance overpaid bucket $${this.claimViewModel.ClaimModel.Amt_Due} By User ${userid},${username}`;
                }
              if (value === "bothpatientinsurance")
                {
                     const overpaidValue = Number(this.paymentResponsibilityForm.get('overpaid').value) || 0;
                     const creditBalanceValue = Number(this.paymentResponsibilityForm.get('creditbalance').value) || 0;
                     const totalResponsibilityAmount = overpaidValue + creditBalanceValue;
                     noteDetail = `Claim moved to insurance overpaid bucket $${overpaidValue}, patient credit balance bucket ${creditBalanceValue} By User ${userid},${username}`;
                    if (overpaidValue == null || creditBalanceValue == null)
                     {
                    this.toast.error('credit balance & overpaid can not be null.');
                    return;
                     }
                   if (overpaidValue == 0 || creditBalanceValue == 0) 
                    {
                    this.toast.error('Both overpaid and credit balance must be greater than 0.');
                    return;
                    }
                   if(totalResponsibilityAmount != this.claimViewModel.ClaimModel.Amt_Due)
                    {
                        this.toast.error('The amounts you entered do not match the total due amount al claim level. Please review and adjust accordingly');
                        return;
                    }
                }
                 this.paymentresponsbility.Claim_No = this.claimViewModel.ClaimModel.Claim_No;
                 this.paymentresponsbility.Insurance_over_paid = this.paymentResponsibilityForm.get('overpaid').value;
                 this.paymentresponsbility.Patient_credit_balance = this.paymentResponsibilityForm.get('creditbalance').value;
                 this.paymentresponsbility.Total_Responsibility = this.TotaldueAmt;
                 this.API.PostData('/Demographic/AddClaimOverPayment', this.paymentresponsbility, (d) =>
                {
                   if (d.Status == "Success")
                    {
                       this.AddNotesForOverPayment(noteDetail);
                       this.UpdatePaymentModelHidden();
                       swal('Payment', 'Overpayment Updated Successfully.', 'success');
                       this.getSetStatus();
                       this.TotaldueAmt=''
                   } 
                  else
                   {
                        swal({
                        title: 'Error',
                        text: "Failed to update payment.",
                        icon: 'error',
                        button: 'OK' 
                       });
                       this.getClaimModel();
                       this.refresh();
                   }
                });
   
          }
        GetOverPaymentModel()
          {
                 this.API.getData('/Demographic/GetClaimOverPayment?claimNo=' + this.claimInfo.claimNo).subscribe(
                 data => {
                     if (data.Status === "Success")
                     {
                         let creditBalance = data.Response[0].Patient_credit_balance;
                         let overpaid=data.Response[0].Insurance_over_paid         
                         if (creditBalance == null ) {
                             creditBalance = 0.00;
                         }
                         if (overpaid == null) {
                             overpaid = 0.00;
                         }
                         this.insuranceoverpaid=overpaid
                         this.patientcreditbalance=creditBalance              
                         this.paymentResponsibilityForm.get('overpaid').setValue(overpaid);
                         this.paymentResponsibilityForm.get('creditbalance').setValue(creditBalance);
                     }           
                     else
                     {
                         let creditBalance = 0.00;
                         let overpaid= 0.00;
                         this.insuranceoverpaid=overpaid
                         this.patientcreditbalance=creditBalance
                         this.paymentResponsibilityForm.get('overpaid').setValue(overpaid);
                         this.paymentResponsibilityForm.get('creditbalance').setValue(creditBalance);
                     }           
                 });
          }
        EditPaymentResponsibility(value:string)
          {
            if(this.claimViewModel.ClaimModel.Amt_Due != 0)
               {
                  this.TotaldueAmt=this.claimViewModel.ClaimModel.Amt_Due;
                 this.showOverPaymentUpdateModel(value)
               }
          }
        //added by Samiullah
       addClaimNotes(claimNo:number,status:string,amount:number)
       {
            var noteDetail=""
            var statusvalue=""
            if (this.previousPatientStatus===status){
                return;
            } else if(status==='C'||status==='D'){
             if(status==='C'){
                statusvalue="collection";
              
             }
             else if(status==='D'){
                statusvalue="dormant";
               }
                noteDetail=`Claim is moved to ${statusvalue} with due amount: $${amount}`
               this.claimNotesModel.Response.Note_Detail=noteDetail;
               this.claimNotesModel.Response.Claim_No = claimNo;
               this.claimNotesModel.Response.IsAuto_Note=true;
               this.claimNotesModel.Status = "OK";
               this.API.PostData('/Demographic/SaveClaimNotes/', this.claimNotesModel.Response, (d) => {
                 if (d.Status == "Sucess") {
                  // swal('', 'Notes has been saved', 'success');
                 }
                //  else {
                //    this.retPostData = d;
                //    swal({
                //      type: 'error',
                //      title: 'Error',
                //      text: this.retPostData,
                //      footer: ''
                //    })
                //  }
               })
            }
          }
        //panel billing - Pir Ubaid: get panel code list for the practice and location , billing physican selected in the claim 

// getPanelCodeListClaim(){
//     this.API.getData(`/demographic/getPanelCodeCptClaim?practiceCode=${this.loggedInUser.selectedPractice.PracticeCode}&locationCode=${this.claimViewModel.ClaimModel.Location_Code}`).subscribe(
//         data => {
//             if (data.Status == 'Success') {
//         //
//             }
//         })
//     }   


//.. panel code - commencting this beacause using next
// getPanelCodeListClaim() {
//      // Validation: Check if at least one diagnosis exists
//      if (!this.Diag || this.Diag.length === 0 || this.Diag.every(d => Common.isNullOrEmpty(d))) {
//         this.toast.error('At least one diagnosis is required.', 'Error');
//         return; // Exit if no diagnosis is found
//     }
//    // const practiceCode = this.loggedInUser.selectedPractice.PracticeCode;
//     const locationCode = this.claimViewModel.ClaimModel.Location_Code;
//     const providerCode = this.claimViewModel.ClaimModel.Billing_Physician; // Add providerCode if required
//     const dos = this.claimViewModel.ClaimModel.DOS;
//     if (!locationCode) {
//         this.toast.error('Location selection is required.', 'Error');
//         return; // Exit the method if validation fails
//     }

//     if (!providerCode) {
//         this.toast.error('Provider selection is required.', 'Error');
//         return; // Exit the method if validation fails
//     }
//     if(!dos){
//         this.toast.error('DOS selection is required.', 'Error');
//         return;
//     }
//     // Construct API endpoint with query parameters
//     const apiUrl = `/demographic/getPanelCodeCptClaim?practiceCode=${this.Gv.currentUser.selectedPractice.PracticeCode}&locationCode=${locationCode}&providerCode=${providerCode}&panelCode=${this.panelCodeInput}`;

//     this.API.getData(apiUrl).subscribe({
//         next: (data: any) => {
//             if (data.Status === 'Success') {
//                 // Handle success: Assign data to a variable or perform actions
//                 this.panelCodeInput = '';
//                 this.PanelCodeModal.hide();

//               //  this.panelCodeCptData = data.Response; // Example: bind the data to a variable for display
//             } else if (data.Status === 'No Data Found') {
//                 this.toast.error('Invalid Panel Code.', 'Error');
//                 this.panelCodeInput = '';
//                 this.PanelCodeModal.hide();
//                 // Handle case where no data is found
//                 console.warn('No data found for the provided criteria.');
//                // this.panelCodeCptData = []; // Clear any existing data
//             } else {
//                 this.panelCodeInput = '';
//                 this.PanelCodeModal.hide();
//                 // Handle other statuses
//                 console.error('Unexpected status received:', data.Status);
//             }
//         },
//         error: (error: any) => {
//             // Handle errors
//             console.error('Error fetching Panel Code CPT data:', error);
//         },
//         complete: () => {
//         }
//     });
// }
//..
        getPanelCodeListClaim() 
          {
               // Validation: Check if at least one diagnosis exists
               if (!this.Diag || this.Diag.length === 0 || this.Diag.every(d => Common.isNullOrEmpty(d))) {
                   this.toast.error('At least one diagnosis is required.', 'Error');
                   return; // Exit if no diagnosis is found
               }
               const locationCode = this.claimViewModel.ClaimModel.Location_Code;
               const providerCode = this.claimViewModel.ClaimModel.Billing_Physician; // Add providerCode if required
               const dos = this.claimViewModel.ClaimModel.DOS;
               
               if (!locationCode) {
                   this.toast.error('Location selection is required.', 'Error');
                   return; // Exit the method if validation fails
               }
           
               if (!providerCode) {
                   this.toast.error('Provider selection is required.', 'Error');
                   return; // Exit the method if validation fails
               }
               
               if (!dos) {
                   this.toast.error('DOS selection is required.', 'Error');
                   return;
               }
               // Construct API endpoint with query parameters
               const apiUrl = `/demographic/getPanelCodeCptClaim?practiceCode=${this.Gv.currentUser.selectedPractice.PracticeCode}&locationCode=${locationCode}&providerCode=${providerCode}&panelCode=${this.panelCodeInput}`;
               this.API.getData(apiUrl).subscribe({
                   next: (data: any) => {
                       if (data.Status === 'Sucess') {
                           this.response = data.Response;
                           // This is where data is assigned
                           if (data.Response && data.Response.length < 1) {
                               // If no data is found, show the error toast
                               this.toast.error('Invalid Panel Code.', 'Error');
                               this.panelCodeInput = '';
                               //this.PanelCodeModal.hide();
                               console.warn('No data found for the provided criteria.');
                           } else {
                            //Added By Hamza Akhlaq Add note for panel code
                            this.panelcodenote = `Panel Code Added: [${this.panelCodeInput}]`;
                            this.AddAutoNotesForUpdateClaim();
                               // If data is valid, proceed with handling it
                               this.response = data.Response; // This is where data is assigned
                               this.panelCodeInput = '';
                               this.PanelCodeModal.hide();
                               this.cd.detectChanges();
               
                               // Call AddNewCPT to automatically add the CPT data to claim charges
                               this.AddNewCPTPanelCode();
                           }
                           //     // Handle success: Assign data to a variable or perform actions
                       //     this.panelCodeInput = '';
                       //     this.PanelCodeModal.hide();
                       //        // Call AddNewCPT to automatically add the CPT data to claim charges
                       //        this.AddNewCPTPanelCode();
           
                       //     // Process the fetched data and automatically add it to claimCharges
                       //     // this.addFetchedCPTDataToClaimCharges(data.Response);
                       // } else if (data.Status === 'No Data Found') {
                       //     this.toast.error('Invalid Panel Code.', 'Error');
                       //     this.panelCodeInput = '';
                       //     this.PanelCodeModal.hide();
                       //     // Handle case where no data is found
                       //     console.warn('No data found for the provided criteria.');
                       // } else {
                           // this.panelCodeInput = '';
                           // this.PanelCodeModal.hide();
                           // // Handle other statuses
                           // console.error('Unexpected status received:', data.Status);
                       }
                   },
                   error: (error: any) => {
                       // Handle errors
                       this.panelCodeInput = '';
                       this.PanelCodeModal.hide();
                       console.error('Error fetching Panel Code CPT data:', error);
                   },
                   // complete: () => {
                   //     this.panelCodeInput = '';
                   //     this.PanelCodeModal.hide();
                   // }
                   complete: () => {
                       // Ensure modal is not hidden if data.Response.length < 1
                       if (this.response && this.response.length > 0) {
                           this.panelCodeInput = ''; // Reset the input field only for valid cases
                           this.PanelCodeModal.hide();
                           this.cd.detectChanges();
                       }
                   }
               });
          }
       // New function to handle adding fetched CPT data to claimCharges
        addFetchedCPTDataToClaimCharges(fetchedCPTData: any)
         {
              // Iterate through the fetched CPT data and create claimCharges objects
              fetchedCPTData.forEach(cptData => {
                  let cc = new ClaimCharges();
                  cc.claimCharges.Procedure_Code = cptData.Cpt_Code;
                //  cc.claimCharges.Procedure_Description = cptData.Cpt_Description;
                  cc.claimCharges.Alternate_Code = cptData.Alternate_Code;
                  cc.claimCharges.Modi_Code1 = cptData.M_1;
                  cc.claimCharges.Modi_Code2 = cptData.M_2;
                  cc.claimCharges.Modi_Code3 = cptData.M_3;
                  cc.claimCharges.Modi_Code4 = cptData.M_4;
                  cc.claimCharges.POS = cptData.POS;
                  cc.claimCharges.Units = cptData.Units;
                  cc.Description = cptData.Cpt_Description;
          
                  // Set the IsRectify and Include_In_Edi flags to false by default
                  cc.claimCharges.IsRectify = false;
                  cc.claimCharges.Include_In_Edi = false;
          
                  // Set the Deleted flag to false as this row is not deleted
                  cc.claimCharges.Deleted = false;
          
                  // Add the new charge to the claimCharges array
                  this.claimCharges.push(cc);
              });
              // Update the claimCharges sequence numbers after adding the rows
              this.updateClaimChargesSequenceNumbers();
          }
        IsAutoFillEnableForPractice() 
         {
               // Get the 'sp' object from localStorage and parse it to JSON
               const practice = JSON.parse(localStorage.getItem('sp') || '{}');
               const practiceCode = practice.PracticeCode;
           
               // Check if practiceCode is valid before making the API call
               if (practiceCode) {
                   this.API.getData(`/PracticeSetup/IsAutoFillEnableForPractice?practiceCode=${practiceCode}`).subscribe(
                       (data: any) => {
                           // Check if the response status is "Success"
                           if (data.Status === "Success") {
                               this.IsAutoFillEnable = data.Response;
                           } else {
                               swal('Failed', "No data found or auto-fill is not enabled.", 'error');
                           }
                       },
                       (error) => {
                           swal('Failed', "Error fetching auto-fill status:", 'error');
                           
                       }
                   );
               } else {
                   swal('Failed', "Selected Practice code is not available ", 'error');
                   
               }
          }
        autofillchecked(event: Event)
         {
               // Prevent the checkbox from toggling immediately
               const practice = JSON.parse(localStorage.getItem('sp') || '{}');
               const practiceCode = practice.PracticeCode;
               const patientAccount = this.claimInfo.Patient_Account;
               const claimType = this.ClaimBillingType;
           
               if (this.autofill) {
                   if (practiceCode && patientAccount && claimType) {
                       this.API.getData(`/PracticeSetup/GetRecentClaimDetails?patientAccount=${patientAccount}&practiceCode=${practiceCode}&claimType=${claimType}`).subscribe(
                           (data: any) => {
                               if (data.Status == "Success") {
                                   this.recentClaimDetails = data.Response;
                                   this.claimViewModel.ClaimModel.Billing_Physician = this.recentClaimDetails.Billing_Physician;
                                   this.claimViewModel.ClaimModel.Attending_Physician = this.recentClaimDetails.Attending_Physician;
                                   this.claimViewModel.ClaimModel.Location_Code = this.recentClaimDetails.Location_Code;
                                   this.claimForm.get('main.location').setValue(this.recentClaimDetails.Location_Code);
                                   this.claimForm.get('main.rendPhy').setValue(this.recentClaimDetails.Attending_Physician);
                                   this.claimForm.get('main.billPhy').setValue(this.recentClaimDetails.Billing_Physician);
                                   this.populateDiagnoses(this.recentClaimDetails);
                                   this.refresh();
                               } else {
                                   this.autofill = false;
                                   swal('Failed', "No Previous Claim Found", 'error');
                               }
                           },
                           (error) => {
                               swal('Failed', "Error fetching Recent Claim Detail:", 'error');
                           }
                       );
                   } else {
                       swal('Failed', "Selected Practice OR Patient Account OR Claim Type is not available ", 'error');
                   }
               } else {
                   // Ask for confirmation to reset auto-filled details
                   swal({
                       title: "Reset Confirmation",
                       text: "Are you sure you want to reset auto-filled fields?",
                       icon: "warning",
                       type: 'warning',
                       showCancelButton: true,
                       confirmButtonText:"Yes!",
                     
                     cancelButtonText: "No",
                     allowOutsideClick:false,
                     allowEscapeKey:false,
                     dangerMode: true,
                   }).then((willClear) => {
                       if (willClear) {
                           this.Diag = [];
                           this.ChildDiagnosis.Diag = this.Diag;
                           this.getEmptyClaim();
                       } 
                   }).catch((error) => {
                       // Handles both dismiss (clicking outside or pressing Escape)
                       this.claimForm.get('main.autofill').setValue(true);
                       this.autofill = true;
                     });;
               }
          }
        populateDiagnoses(data: any): void {
            // Create an array to hold the diagnoses
            let diagnosisList: Diag[] = [];
            // Iterate through the diagnoses
            for (let i = 1; i <= 12; i++) {
              const code = data[`DX_Code${i}`];
              const description = data[`DX_Code${i}_Desc`];
              if (code) {
                // Create a new instance for each diagnosis
                let cp = new Diag();
                cp.Diagnosis.Code = code;
                cp.Diagnosis.Description = description; 
                cp.Diagnosis.Diag_Effective_Date =  data[`DX_Code${i}_Effective_Date`];     
                cp.Diagnosis.Diag_Expiry_Date =  data[`DX_Code${i}_Expiry_Date`];  
                // Push the new Diag instance into the diagnosis list
                diagnosisList.push(cp);
              }
            }
            // Assign the list of diagnoses to the ChildDiagnosis.Diag property
            this.ChildDiagnosis.Diag = diagnosisList;
            this.Diag=diagnosisList;
          }
       //Added By Hamza Akhlaq For Add Auto Notes when user create New Claim
        AddAutoNotesForNewClaim()
          {
             let Autonote = "New Claim:"; 
             this.claimViewModel.claimInusrance.forEach((claimInsurance) => {
               if (claimInsurance.claimInsurance.Pri_Sec_Oth_Type === "P" &&  claimInsurance.claimInsurance.Deleted!=true ) {
                 Autonote += `[Primary Insurance, ${claimInsurance.InsurancePayerName}] |`;
               }
             });
             var paymentautonote=this.generatePaymentNotes(this.claimViewModel.claimPayments, 'newclaim')
             Autonote+=paymentautonote
             const autonotearray = [
               {
                 condition: this.claimViewModel.ClaimModel.Is_Self_Pay == true,
                 message: "[Self Pay Checked]",
               },
               {
                 condition: this.saveclaimtype == "Draft",
                 message: "[Moved to Draft]",
               },
              
             ];
             autonotearray.forEach((caseItem) =>
             {
               if (caseItem.condition)
                {
                    Autonote += ` ${caseItem.message} |`;
                }
             });
             Autonote = Autonote.trim().replace(/\|$/, "");
             this.claimNotesModel.Response.Note_Detail=Autonote;
             this.claimNotesModel.Response.Claim_No=this.claimViewModel.ClaimModel.Claim_No;
             this.claimNotesModel.Response.IsAuto_Note=true;
             this.API.PostData('/Demographic/SaveClaimNotes/', this.claimNotesModel.Response, (d) => {
                 if (d.Status == "Sucess")
                 {
                 }
                 })
          }
       //Added By Hamza Akhlaq For Add Auto Notes when user create Update Claim
        AddAutoNotesForUpdateClaim()
        
            {
                let Autonots: string[] = [];
                let DXDeletedAutonotes:string[]=[]; // Explicitly declare Autonots as a string array
                let DOS = "", ScanDate = "", Hospitalfrom = "", Hospitalto="";
                // Retrieve the current DX codes
                if(this.oldClaimType != null && this.oldClaimType != undefined)
                {
                    
                if (this.oldClaimType.DOS != null) {
                    DOS = moment.utc(this.oldClaimType.DOS).format('MM/DD/YYYY');
                }
                if (this.oldClaimType.Scan_Date != null) {
                    ScanDate = moment.utc(this.oldClaimType.Scan_Date).format('MM/DD/YYYY');
                }
                if (this.oldClaimType.Hospital_From != null) {
                    Hospitalfrom = moment.utc(this.oldClaimType.Hospital_From).format('MM/DD/YYYY');
                }
                if (this.oldClaimType.Hospital_To != null) {
                    Hospitalto = moment.utc(this.oldClaimType.Hospital_To).format('MM/DD/YYYY');
                }
                if(this.claimViewModel.ClaimModel.Supervising_Physician!=null){
                    this.claimViewModel.ClaimModel.Supervising_Physician = Number(this.claimViewModel.ClaimModel.Supervising_Physician);
                }
                if(this.claimViewModel.ClaimModel.Referring_Physician!=null){
                    this.claimViewModel.ClaimModel.Referring_Physician = Number(this.claimViewModel.ClaimModel.Referring_Physician);
                }
                if(this.claimViewModel.ClaimModel.Referral_Number==""){
                    this.claimViewModel.ClaimModel.Referral_Number = null;
                }
                if(this.claimViewModel.ClaimModel.PA_Number==null){
                    this.oldClaimType.PA_Number = null;
                }
                if(this.claimViewModel.ClaimModel.PA_Number==""){
                    this.claimViewModel.ClaimModel.PA_Number = null;
                }
                if(this.claimViewModel.ClaimModel.Resource_Physician!=null){
                    this.claimViewModel.ClaimModel.Resource_Physician = Number(this.claimViewModel.ClaimModel.Resource_Physician);
                }
                if(this.claimViewModel.ClaimModel.Additional_Claim_Info ==""){
                    this.claimViewModel.ClaimModel.Additional_Claim_Info = null;
                }
                if(this.claimViewModel.ClaimModel.Facility_Name == ""){
                    this.claimViewModel.ClaimModel.Facility_Name = null;
                }
                if(this.claimViewModel.ClaimModel.ICN_Number==""){
                    this.claimViewModel.ClaimModel.ICN_Number = null;
                }
                const autonotearray = [
                    {
                        condition: this.claimViewModel.ClaimModel.Is_Self_Pay==true,
                        Autonote: 'Self Pay:Checkbox Checked',
                        revertCondition:this.oldClaimType.Is_Self_Pay==this.claimViewModel.ClaimModel.Is_Self_Pay,
                        
                    },
                    {
                        condition: this.claimViewModel.ClaimModel.Is_Self_Pay==false,
                        Autonote: 'Self Pay:Checkbox Unchecked',
                        revertCondition:this.oldClaimType.Is_Self_Pay==this.claimViewModel.ClaimModel.Is_Self_Pay
                    },
                    {
                        condition: DOS !== this.claimViewModel.ClaimModel.DOS,
                        Autonote: `DOS:[${DOS || ""}] to [${this.claimViewModel.ClaimModel.DOS || ""}]`,
                        revertCondition: DOS == this.claimViewModel.ClaimModel.DOS // Check for revert
                    },
                    {
                        condition: ScanDate !== this.claimViewModel.ClaimModel.Scan_Date,
                        Autonote: `Scan Date: [${ScanDate || ""}] to [${this.claimViewModel.ClaimModel.Scan_Date || ""}]`,
                        revertCondition: ScanDate == this.claimViewModel.ClaimModel.Scan_Date
                    },
                    {
                        condition: this.oldClaimType.Location_Code !== Number(this.claimViewModel.ClaimModel.Location_Code),
                        Autonote: `Location: [${this.getNameFromList(this.claimViewModel.PracticeLocationsList, this.oldClaimType.Location_Code, "Id", "Name")}] 
                                   to [${this.getNameFromList(this.claimViewModel.PracticeLocationsList, Number(this.claimViewModel.ClaimModel.Location_Code), "Id", "Name")}]`,
                        revertCondition: this.oldClaimType.Location_Code == Number(this.claimViewModel.ClaimModel.Location_Code)
                    },
                    {
                        condition: this.oldClaimType.Attending_Physician !== Number(this.claimViewModel.ClaimModel.Attending_Physician),
                        Autonote: `Rendering Phy: [${this.getNameFromList(this.claimViewModel.AttendingPhysiciansList, this.oldClaimType.Attending_Physician, "Id", "Name")}] 
                                   to [${this.getNameFromList(this.claimViewModel.AttendingPhysiciansList, Number(this.claimViewModel.ClaimModel.Attending_Physician), "Id", "Name")}]`,
                        revertCondition: this.oldClaimType.Attending_Physician == Number(this.claimViewModel.ClaimModel.Attending_Physician)
                    },
                    {
                        condition: this.oldClaimType.Billing_Physician !== Number(this.claimViewModel.ClaimModel.Billing_Physician),
                        Autonote: `Billing Phy: [${this.getNameFromList(this.claimViewModel.BillingPhysiciansList, this.oldClaimType.Billing_Physician, "Id", "Name")}] 
                                   to [${this.getNameFromList(this.claimViewModel.BillingPhysiciansList, Number(this.claimViewModel.ClaimModel.Billing_Physician), "Id", "Name")}]`,
                        revertCondition: this.oldClaimType.Billing_Physician == Number(this.claimViewModel.ClaimModel.Billing_Physician)
                    },
                    {
                        condition: this.oldClaimType.Referring_Physician !== Number(this.claimViewModel.ClaimModel.Referring_Physician),
                        Autonote: `Referring Physician: [${this.getNameFromList(this.claimViewModel.ReferralPhysiciansList, this.oldClaimType.Referring_Physician, "Id", "Name")}] 
                                   to [${this.getNameFromList(this.claimViewModel.ReferralPhysiciansList, Number(this.claimViewModel.ClaimModel.Referring_Physician), "Id", "Name")}]`,
                        revertCondition: this.oldClaimType.Referring_Physician == this.claimViewModel.ClaimModel.Referring_Physician
                    },
                    {
                        condition: this.oldClaimType.Supervising_Physician !== Number(this.claimViewModel.ClaimModel.Supervising_Physician),
                        Autonote: `Supervising Physician: [${this.getNameFromList(this.claimViewModel.AttendingPhysiciansList, this.oldClaimType.Supervising_Physician, "Id", "Name")}] 
                                   to [${this.getNameFromList(this.claimViewModel.AttendingPhysiciansList, Number(this.claimViewModel.ClaimModel.Supervising_Physician), "Id", "Name")}]`,
                        revertCondition: this.oldClaimType.Supervising_Physician == this.claimViewModel.ClaimModel.Supervising_Physician
                    },
                    {
                        condition: this.oldClaimType.Referral_Number !== this.claimViewModel.ClaimModel.Referral_Number,
                        Autonote: `Referral #: [${this.oldClaimType.Referral_Number || ""}] to [${this.claimViewModel.ClaimModel.Referral_Number || ""}]`,
                        revertCondition: this.oldClaimType.Referral_Number == this.claimViewModel.ClaimModel.Referral_Number
                    },
                    {
                        condition: this.oldClaimType.PA_Number !== this.claimViewModel.ClaimModel.PA_Number,
                        Autonote: `PA #: [${this.oldClaimType.PA_Number || ""}] to [${this.claimViewModel.ClaimModel.PA_Number || ""}]`,
                        revertCondition: this.oldClaimType.PA_Number == this.claimViewModel.ClaimModel.PA_Number
                    },
                    {
                        condition: this.oldClaimType.Additional_Claim_Info !== this.claimViewModel.ClaimModel.Additional_Claim_Info,
                        Autonote: `Additional Claim Info.(NCT) : [${this.oldClaimType.Additional_Claim_Info || ""}] to [${this.claimViewModel.ClaimModel.Additional_Claim_Info || ""}]`,
                        revertCondition: this.oldClaimType.Additional_Claim_Info == this.claimViewModel.ClaimModel.Additional_Claim_Info
                    },
                    {
                        condition: this.oldClaimType.Resource_Physician !== Number(this.claimViewModel.ClaimModel.Resource_Physician),
                        Autonote: `Resource Phy: [${this.getNameFromList(this.claimViewModel.AttendingPhysiciansList, this.oldClaimType.Resource_Physician, "Id", "Name")}] 
                                   to [${this.getNameFromList(this.claimViewModel.AttendingPhysiciansList, Number(this.claimViewModel.ClaimModel.Resource_Physician), "Id", "Name")}]`,
                        revertCondition: this.oldClaimType.Resource_Physician == this.claimViewModel.ClaimModel.Resource_Physician
                    },
                    {
                        condition: this.oldClaimType.Pat_Status!== this.claimViewModel.ClaimModel.Pat_Status,
                        Autonote: `Patient Status : [${this.oldClaimType.Pat_Status || ""}] to [${this.claimViewModel.ClaimModel.Pat_Status || ""}]`,
                        revertCondition: this.oldClaimType.Pat_Status == this.claimViewModel.ClaimModel.Pat_Status
                    },
                    {
                        condition: this.oldClaimType.Pri_Status!== this.claimViewModel.ClaimModel.Pri_Status,
                        Autonote: `Primary Status : [${this.oldClaimType.Pri_Status || ""}] to [${this.claimViewModel.ClaimModel.Pri_Status || ""}]`,
                        revertCondition: this.oldClaimType.Pri_Status== this.claimViewModel.ClaimModel.Pri_Status
                    },
                    {
                        condition: this.oldClaimType.Sec_Status!== this.claimViewModel.ClaimModel.Sec_Status,
                        Autonote: `Secondary Status : [${this.oldClaimType.Sec_Status || ""}] to [${this.claimViewModel.ClaimModel.Sec_Status || ""}]`,
                        revertCondition: this.oldClaimType.Sec_Status== this.claimViewModel.ClaimModel.Sec_Status
                    },
                    {
                        condition: this.oldClaimType.Oth_Status!== this.claimViewModel.ClaimModel.Oth_Status,
                        Autonote: `Other Status : [${this.oldClaimType.Oth_Status || ""}] to [${this.claimViewModel.ClaimModel.Oth_Status || ""}]`,
                        revertCondition: this.oldClaimType.Oth_Status== this.claimViewModel.ClaimModel.Oth_Status
                    },
                    {
                        condition: this.claimViewModel.ClaimModel.Is_Corrected == false,
                        Autonote: `Corrected Claim : [Checkbox UnChecked]`,
                        revertCondition: this.oldClaimType.Is_Corrected == this.claimViewModel.ClaimModel.Is_Corrected
                    },
                    {
                        condition: this.claimViewModel.ClaimModel.Is_Corrected == true,
                        Autonote: `Corrected Claim : [Checkbox Checked]`,
                        revertCondition: this.oldClaimType.Is_Corrected == this.claimViewModel.ClaimModel.Is_Corrected
                    },
                    {
                        condition: this.oldClaimType.ICN_Number !== this.claimViewModel.ClaimModel.ICN_Number,
                        Autonote: `ICN Number : [${this.oldClaimType.ICN_Number || ""}] to [${this.claimViewModel.ClaimModel.ICN_Number || ""}]`,
                        revertCondition: this.oldClaimType.ICN_Number == this.claimViewModel.ClaimModel.ICN_Number
                    },
                    {
                        condition: this.oldClaimType.RSCode !== Number(this.claimViewModel.ClaimModel.RSCode),
                        Autonote: `Resubmission Code : [${this.getNameFromList(this.claimViewModel.ResubmissionCodes, this.oldClaimType.RSCode, "Id", "Name")}] 
                                   to [${this.getNameFromList(this.claimViewModel.ResubmissionCodes, Number(this.claimViewModel.ClaimModel.RSCode), "Id", "Name")}]`,
                        revertCondition: this.oldClaimType.RSCode == this.claimViewModel.ClaimModel.RSCode
                    },
                    {
                        condition: this.oldClaimType.Facility_Name == null && this.claimViewModel.ClaimModel.Facility_Name != null,
                        Autonote: `Facility Added: [${this.claimViewModel.ClaimModel.Facility_Name}]`,
                        revertCondition: this.oldClaimType.Facility_Name === this.claimViewModel.ClaimModel.Facility_Name
                    },
                    {
                        condition: this.oldClaimType.Facility_Name != null && this.claimViewModel.ClaimModel.Facility_Name == null,
                        Autonote: `Facility Deleted : [${this.oldClaimType.Facility_Name}]`,
                        revertCondition: this.oldClaimType.Facility_Name === this.claimViewModel.ClaimModel.Facility_Name
                    },
                    {
                        condition: Hospitalfrom != null && this.claimViewModel.ClaimModel.Hospital_From != null,
                        Autonote: `Hospital From_Date : [${Hospitalfrom}] to [${this.claimViewModel.ClaimModel.Hospital_From}]`,
                        revertCondition: Hospitalfrom === this.claimViewModel.ClaimModel.Hospital_From
                    },
                    {
                        condition: Hospitalto != null && this.claimViewModel.ClaimModel.Hospital_To != null,
                        Autonote: `Hospital To_Date : [${Hospitalto}] to [${this.claimViewModel.ClaimModel.Hospital_To}]`,
                        revertCondition: Hospitalto === this.claimViewModel.ClaimModel.Hospital_To
                    },
                    {
                        condition: this.oldClaimType.Facility_Name !=  this.claimViewModel.ClaimModel.Facility_Name && this.oldClaimType.Facility_Name !=null && this.oldClaimType.Facility_Name != "" && this.claimViewModel.ClaimModel.Facility_Name !=null,
                        Autonote: `Facility Updated : [${this.oldClaimType.Facility_Name  || ""}] to [${this.claimViewModel.ClaimModel.Facility_Name || ""}]`,
                        revertCondition: this.oldClaimType.Facility_Name === this.claimViewModel.ClaimModel.Facility_Name
                    },
                    {
                        condition: this.oldClaimType.PTL_Status == true && this.claimViewModel.ClaimModel.PTL_Status == false,
                        Autonote: `Draft: [Draft Checkbox Unchecked]`,
                        revertCondition: this.oldClaimType.PTL_Status == this.claimViewModel.ClaimModel.PTL_Status,
                    },
				
                ];
                autonotearray.forEach((caseItem) => {
                    const cleanedString = caseItem.Autonote.replace(/\r?\n|\r/g, '');
                    const note = cleanedString.replace(/\s+/g, ' ').trim();

                    if (caseItem.condition && !caseItem.revertCondition) {
                        if (!Autonots.includes(note.trim())) {
                            Autonots.push(note.trim());
                        }
                    }
                    if (caseItem.revertCondition) {
                        const index = Autonots.indexOf(note);
                        if (index !== -1) {
                            Autonots.splice(index, 1);
                        }
                    }
                });
                
                let noteString = Autonots.length > 0 ? Autonots.join(" | ") : ""; // Ensure empty if no notes exist
                this.notestringforprocedure = [noteString].filter(Boolean).join(' | ');
                // Split the string into segments
                const segments = this.notestringforprocedure.split(" | ");
                // Create a Set to remove duplicates
                const uniqueSegments = [...new Set(segments)];
                // Join the unique segments back into a string
                this.notestringforprocedure = uniqueSegments.join(" | ");
                if( this.panelcodenote!=null && this.panelcodenote != "" && this.panelcodenote != undefined)
                {
                    let panelcodenote=this.panelcodenote
                    const segments = panelcodenote.split(" | ");
                    const uniqueSegments = [...new Set(segments)];
                    panelcodenote=uniqueSegments.join(" | ");

                    this.combinedNoteString=[this.notestringforprocedure, this.notestringfordeleteddx,panelcodenote].filter(Boolean) .join(' | ');
                    
                }
                else
                {
                    this.combinedNoteString=[this.notestringforprocedure, this.notestringfordeleteddx].filter(Boolean) .join(' | ');

                }
                 
                 //this.combinedNoteString = [noteString, this.notestringfordeleteddx].filter(Boolean) .join(' | '); // Remove any empty strings
                 if (this.combinedNoteString) {
                    let cleanedNotes: string[] = this.combinedNoteString.split(" | ");
                    // Find and extract the first occurrence of "Proc Changes:"
                    let procChangesIndex = cleanedNotes.findIndex(note => note.startsWith("Proc Changes:"));
                    let procChangesNote = procChangesIndex !== -1 ? cleanedNotes.splice(procChangesIndex, 1)[0] : "";
                    // Use a Set to remove duplicates while preserving order
                    let uniqueNotes: string[] = [...new Set(cleanedNotes)];
                    // Re-add "Proc Changes:" at the start if it was found
                    if (procChangesNote) {
                        uniqueNotes.unshift(procChangesNote);
                    }
                    // Join and store the cleaned notes
                    this.combinedNoteString = [uniqueNotes.join(" | ")];
                
                    this.Deletedindex = null;
                } else {
                    this.updatedNotes = []; // Clear the array when empty
                }
                this.panelcodenote="";
            }
          }
          AddAutoNotesforDraft()
          {
            let Autonotsfordraft: string[] = [];
            if( this.oldClaimType!=null && this.oldClaimType!=undefined )
            {
                if(this.oldClaimType.PTLReasonDoctorFeedback == undefined){
                    this.oldClaimType.PTLReasonDoctorFeedback=""
                }
                if(this.oldClaimType.PTLReasonDetail == undefined){
                    this.oldClaimType.PTLReasonDetail=""
                }
                if(this.claimViewModel.PTLReasonDetail == null){
                    this.claimViewModel.PTLReasonDetail=""
                }
                if(this.claimViewModel.PTLReasonDoctorFeedback == null){
                    this.claimViewModel.PTLReasonDoctorFeedback=""
                }
                 const autonotesfordraft= [
                    {
                        condition: this.claimViewModel.ClaimModel.Is_Draft == true,
                        Autonote: `Draft Checkbox : [Checked]`,
                        revertCondition: false
                    },
                    {
                        condition: this.oldClaimType.Delay_Reason_Code !== this.claimViewModel.ClaimModel.Delay_Reason_Code,
                        Autonote: `Draft Reason : [${this.getNameFromList(this.PTLReasons, this.oldClaimType.Delay_Reason_Code, "id", "name") || ""}] 
                                   to [${this.getNameFromList(this.PTLReasons, this.claimViewModel.ClaimModel.Delay_Reason_Code, "id", "name") || ""}]`,
                        revertCondition: this.oldClaimType.Delay_Reason_Code === this.claimViewModel.ClaimModel.Delay_Reason_Code
                    },
                    {
                        condition: this.oldClaimType.PTLReasonDetail !=  this.claimViewModel.PTLReasonDetail ,
                        Autonote: `Draft Detail : [${this.oldClaimType.PTLReasonDetail || ""}] to [${this.claimViewModel.PTLReasonDetail || ""}]`,
                        revertCondition: this.oldClaimType.PTLReasonDetail ==  this.claimViewModel.PTLReasonDetail
                    },
                    {
                        condition: this.oldClaimType.PTLReasonDoctorFeedback !=  this.claimViewModel.PTLReasonDoctorFeedback ,
                        Autonote: `Draft Feedback : [${this.oldClaimType.PTLReasonDoctorFeedback || ""}] to [${this.claimViewModel.PTLReasonDoctorFeedback || ""}]`,
                        revertCondition: this.oldClaimType.PTLReasonDoctorFeedback ==  this.claimViewModel.PTLReasonDoctorFeedback
                    },
    
                 ];
                 autonotesfordraft.forEach((caseItem) => {
                    if (caseItem.condition && !caseItem.revertCondition) {
                        if (!Autonotsfordraft.includes(caseItem.Autonote)) {
                            Autonotsfordraft.push(caseItem.Autonote);
                        }
                    }
                    if (caseItem.revertCondition) {
                        const index = Autonotsfordraft.indexOf(caseItem.Autonote);
                        if (index !== -1) {
                            Autonotsfordraft.splice(index, 1); 
                        }
                    }
                });
                let noteString = Autonotsfordraft.length > 0 ? Autonotsfordraft.join(" | ") : ""; // Ensure empty if no notes exist
    
                    if (noteString) {
                        this.updatedraftmessage = [noteString]; // Assign only if there's content
                    } 
                    else {
                        this.updatedraftmessage = []; // Clear the array when all conditions revert
                    }
            }
            

          }
        AddAutonNotesInDB()
          {
                this.claimNotesModel.Response.Note_Detail= this.updatedNotes.join(", ");
                this.claimNotesModel.Response.Claim_No=this.claimViewModel.ClaimModel.Claim_No;
                this.claimNotesModel.Response.IsAuto_Note=true;
                this.API.PostData('/Demographic/SaveClaimNotes/', this.claimNotesModel.Response, (d) => {
                    if (d.Status == "Sucess")
                    {       
                    }
                    })
          }
        AddAutonNotesforHCFA(hcfa:boolean , hcfatype:any)
          {
            var note ='';
              if(hcfa==false && hcfatype=='P' )
                {
                    note="Primary Red HCFA: [Downloaded]"
                }
              if(hcfa==true && hcfatype=='P' )
                {
                    note="Primary White HCFA: [Downloaded]"
                }
              if(hcfa==false && hcfatype=='S' )
                {
                    note="Secondary Red HCFA: [Downloaded]"
                }
              if(hcfa==true && hcfatype=='S' )
                {
                    note="Secondary White HCFA: [Downloaded]"
                }
                this.claimNotesModel.Response.Note_Detail= note;
                this.claimNotesModel.Response.Claim_No=this.claimViewModel.ClaimModel.Claim_No;
                this.claimNotesModel.Response.IsAuto_Note=true;
                this.API.PostData('/Demographic/SaveClaimNotes/', this.claimNotesModel.Response, (d) => {
                    if (d.Status == "Sucess")
                    {
                       
                    }
                    })
          }
        showAutoNoteModel()
          {
            if (this.NoteModal) {
                this.NoteModal.hide();
            
           
                setTimeout(() => {
                  document.body.classList.remove('modal-open'); // Remove the modal-open class
                  const backdrop = document.querySelector('.modal-backdrop');
                  if (backdrop) {
                    backdrop.remove(); // Remove any existing modal backdrops
                  }
                  this.NoteModal.show();
                }, 500);
              }
          }
        ConfirmAutoNoteChanges()
          {
            this.autonotemodelskip=true
            this.NoteModal.hide();
            setTimeout(() => {
                 this.saveClaim("Save");
              }, 300); // Delay of 300ms to all 
          }   
        DXCodeExpriyModel()
         {
            if (this.bsModal) {
              this.bsModal.hide();
              setTimeout(() => {
                document.body.classList.remove('modal-open'); // Remove the modal-open class
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                  backdrop.remove(); // Remove any existing modal backdrops
                }
                this.bsModal.show();
              }, 300);
            }
          }
        getNameFromList<T>(list: T[], id: any, idKey: keyof T, nameKey: keyof T): string 
          {
             const item = list.find(entry => entry[idKey] === id);
             return item ? String(item[nameKey]) : ""; // Explicitly convert to string
          }     

        getLastAddedDiagCode(i)
        {
            if ( i >= 0) {
                this.AddDx= this.Diag[i].Diagnosis.Code;
                this.Addoriginaldx= i
                this.addnewindex= i+1;
            }
            this.AutoNotesForDaigCode();
        }
        getUpdatedDiagCode(i){
            if( i>=0 )
            {
                this.UpdateDx=this.Diag[i].Diagnosis.Code;
                this.updateoriginalindex=i;
                this.updatenewindex=i+1;
            }
        }
        getDeletedDXCode(i){

            if (i >= 0) {
                if(i==0)
                {
                    this.DeletedDX= this.Diag[i].Diagnosis.Code;
                }
                this.DeletedDX= this.Diag[i].Diagnosis.Code;
                this.Deletedoriginalindex=i;
                this.Deletedindex=i+1;
            } 
            this.AutoNotesForDaigCode();
        }
        AutoNotesForProc(i) {
            let Auto: string[] = [];   
            let ProAuto: string[] = []; 
            let DelPro:string[]=[];
            let oldDosFrom = "";
            let newDosFrom = null;
            let oldDosTo = "";
            let newDosTo = null;
            let oldproccode = null;
            let newproccode = null;
            let oldunits = null;
            let newunits=null;
            let oldcharges = null;
            let newcharges=null;
            let oldPOS=null;
            let newPOS = null;
            let olddrugcode=null;
            let newdrugcode=null;
            let oldndcquantity=null;
            let newndcquantity=null;
            let oldndcqualifier=null;
            let newndcqualifier=null;
            let oldModicode1=null;
            let newModicode1= null;
            let oldModicode2=null;
            let newModicode2=null;
            let oldModicode3=null;
            let newModicode3=  null;
            let oldModicode4=null;
            let newModicode4=null;
            let oldPointer1=null;
            let newPointer1=null;
            let oldPointer2=null;
            let newPointer2=null;
            let oldPointer3=null;
            let newPointer3=null;
            let oldPointer4=null;
            let newPointer4=null;
            let oldphymod=null;
            let newphymod=null;
            let oldedicheck=null;
            let newedicheck=null
            let oldnotes=null;
            let newnotes=null;
            let oldstarttime=null;
            let newstarttime=null;
            let oldstoptime=null;
            let newstoptime=null
            let seq=null;
            let Proc=null;
            let deletedproc=null;
            let addproccodemessage=""
            let deletedprocmessage=""
            if(this.oldClaimChargesoriginal != null && this.oldClaimChargesoriginal!= undefined && this.oldClaimCharges != null && this.oldClaimCharges != undefined)
        {
          if(this.Deletedcpt == true){
            for ( let j = this.oldClaimChargesoriginal.length; j <= this.claimCharges.length; j++)
                {
                        deletedproc=this.DeleteCpt;
                        seq=this.DeleteCptSeq;
                       var indexToRemove=null;
                if(seq != null)
                {
                    indexToRemove = this.addproccodeuremessage.findIndex(x => x.includes(seq));
                }
                if(indexToRemove!=null && indexToRemove !=-1)
                {
                    if (indexToRemove !== -1) {
                        this.addproccodeuremessage.splice(indexToRemove, 1);
                    }
                }else
                {

                    const AddDeletedProcedure=
                    [
                        {
                            condition:  this.Deletedcpt == true,
                            Autonotesdel: `Procedure Code Deleted:[${seq}][${deletedproc || ""}]`,
                            revertCondition: false,
                        },
                    ]
                    AddDeletedProcedure.forEach((dx) => {
                        if (dx.condition && !dx.revertCondition) {
                            if (!DelPro.includes(dx.Autonotesdel.trim())) {
                                DelPro.push(dx.Autonotesdel.trim());
                            }
                        }
                        if (dx.revertCondition) {
                            const index = DelPro.indexOf(dx.Autonotesdel.trim());
                            if (index !== -1) {
                                DelPro.splice(index, 1);
                            }
                        }
                       });
                       deletedprocmessage= DelPro.length > 0 ? DelPro.join(" | ") : ""
                       deletedprocmessage = deletedprocmessage.replace(/\s+/g, ' ').trim();
                       if (!this.deletedproceduremessage.includes(deletedprocmessage)) {
                        this.deletedproceduremessage.push(deletedprocmessage);
                      }
                 
                }
            }
          }
           if(this.Addedcpt==true){
            for ( let j = this.oldClaimChargesoriginal.length; j < this.claimCharges.length; j++)
                {
                    if(this.Deletedcpt==false)
                    {
                        newproccode=this.claimCharges[i].claimCharges.Procedure_Code;
                        seq = this.claimCharges[i].claimCharges.Sequence_No;
                        const AddNewProcedure=
                        [
                            {
                                condition: newproccode != null,
                                Autonotes: `Procedure Code Added:[${seq}][${newproccode || ""}]`,
                                revertCondition: false,
                            },
                        ]
                        AddNewProcedure.forEach((dx) => {
                            if (dx.condition && !dx.revertCondition) {
                                if (!ProAuto.includes(dx.Autonotes.trim())) {
                                    ProAuto.push(dx.Autonotes.trim());
                                }
                            }
                            if (dx.revertCondition) {
                                const index = ProAuto.indexOf(dx.Autonotes.trim());
                                if (index !== -1) {
                                    ProAuto.splice(index, 1);
                                }
                            }
                           });
                            addproccodemessage= ProAuto.length > 0 ? ProAuto.join(" | ") : ""
                            addproccodemessage = addproccodemessage.replace(/\s+/g, ' ').trim();
                            if (!this.addproccodeuremessage.includes(addproccodemessage)) {
                                this.addproccodeuremessage.push(addproccodemessage);
                              }
                    }
                   
                }
           }
            if(i < this.oldClaimChargesoriginal.length && this.Deletedcpt == false)
            {
                for(let j=0 ; j < this.oldClaimChargesoriginal.length; j++)
    {
                    oldDosFrom = this.oldClaimChargesoriginal[j].claimCharges.Dos_From;
                    newDosFrom = this.claimCharges[j].claimCharges.Dos_From;
                    oldDosTo = this.oldClaimChargesoriginal[j].claimCharges.Dos_To;
                    newDosTo = this.claimCharges[j].claimCharges.Dos_To;
                    oldproccode = this.oldClaimChargesoriginal[j].claimCharges.Procedure_Code;
                    newproccode = this.claimCharges[j].claimCharges.Procedure_Code;
                    oldunits = this.oldClaimChargesoriginal[j].claimCharges.Units;
                    newunits = Number(this.claimCharges[j].claimCharges.Units);
                    oldcharges = this.oldClaimChargesoriginal[j].claimCharges.Amount;
                    newcharges = this.claimCharges[j].claimCharges.Amount;
                    oldPOS = this.oldClaimChargesoriginal[j].claimCharges.POS;
                    newPOS = this.claimCharges[j].claimCharges.POS;
                    olddrugcode = this.oldClaimCharges[j].Drug_Code;
                    newdrugcode = this.claimCharges[j].Drug_Code;
                    oldndcquantity = this.oldClaimCharges[j].claimCharges.NDC_Quantity;
                    newndcquantity = this.claimCharges[j].claimCharges.NDC_Quantity;
                    oldndcqualifier = this.oldClaimCharges[j].claimCharges.NDC_Qualifier;
                    newndcqualifier = this.claimCharges[j].claimCharges.NDC_Qualifier;
                    oldModicode1 = this.oldClaimCharges[j].claimCharges.Modi_Code1;
                    newModicode1 = this.claimCharges[j].claimCharges.Modi_Code1;
                    oldModicode2 = this.oldClaimCharges[j].claimCharges.Modi_Code2;
                    newModicode2 = this.claimCharges[j].claimCharges.Modi_Code2;
                    oldModicode3 = this.oldClaimCharges[j].claimCharges.Modi_Code3;
                    newModicode3 = this.claimCharges[j].claimCharges.Modi_Code3;
                    oldModicode4 = this.oldClaimCharges[j].claimCharges.Modi_Code4;
                    newModicode4 = this.claimCharges[j].claimCharges.Modi_Code4;
                    seq = this.oldClaimCharges[j].claimCharges.Sequence_No;
                    Proc = this.claimCharges[j].claimCharges.Procedure_Code;
                    oldPointer1 = this.oldClaimCharges[j].claimCharges.DX_Pointer1;
                    newPointer1 = this.claimCharges[j].claimCharges.DX_Pointer1;
                    oldPointer2 = this.oldClaimCharges[j].claimCharges.DX_Pointer2;
                    newPointer2 = this.claimCharges[j].claimCharges.DX_Pointer2;
                    oldPointer3 = this.oldClaimCharges[j].claimCharges.DX_Pointer3;
                    newPointer3 = this.claimCharges[j].claimCharges.DX_Pointer3;
                    oldPointer4 = this.oldClaimCharges[j].claimCharges.DX_Pointer4;
                    newPointer4 = this.claimCharges[j].claimCharges.DX_Pointer4;
                    oldphymod = this.oldClaimCharges[j].claimCharges.Physical_Modifier;
                    newphymod = this.claimCharges[j].claimCharges.Physical_Modifier;
                    oldedicheck = this.oldClaimCharges[j].claimCharges.Include_In_Edi;
                    newedicheck = this.claimCharges[j].claimCharges.Include_In_Edi;
                    oldnotes = this.oldClaimCharges[j].claimCharges.Notes;
                    newnotes = this.claimCharges[j].claimCharges.Notes;
                    oldstarttime = this.oldClaimCharges[j].claimCharges.Start_Time;
                    newstarttime = this.claimCharges[j].claimCharges.Start_Time;
                    oldstoptime = this.oldClaimCharges[j].claimCharges.Stop_Time;
                    newstoptime = this.claimCharges[j].claimCharges.Stop_Time;
                    
            // let getindexforaddcpt= this.Cptsequenceno-1
            // let getaddcpt= this.claimCharges[getindexforaddcpt].claimCharges.Procedure_Code;
            if (oldDosFrom !== null && oldDosFrom !== "") {
                const DosFrom = moment.utc(oldDosFrom).format('MM/DD/YYYY');
                oldDosFrom = DosFrom;
              }
              if (oldDosTo !== null && oldDosTo !== "") {
                const DosTo = moment.utc(oldDosTo).format('MM/DD/YYYY');
                oldDosTo = DosTo;
              }
              if (oldstarttime !== null && oldstarttime !== "") {
                const dateObj = new Date(oldstarttime);
                const hours = dateObj.getHours().toString().padStart(2, '0');
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}`; // "17:04"
                oldstarttime=formattedTime
              }
              if (oldstoptime !== null && oldstoptime !== "") {
                const dateObj = new Date(oldstoptime);
                const hours = dateObj.getHours().toString().padStart(2, '0');
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}`; // "17:04"
                oldstoptime=formattedTime
              }
             if(newndcqualifier==""){
                newndcqualifier=null;
                oldndcqualifier=null;
             }
             if(newModicode1==""){
                newModicode1=null;
                oldModicode1=null;
             }
             if(newModicode2==""){
                newModicode2=null;
                oldModicode2=null;
             }
             if(newModicode3==""){
                newModicode3=null;
                oldModicode3=null;
             }
             if(newModicode4==""){
                newModicode4=null;
                oldModicode4=null;
             }
             if(newphymod==""){
                newphymod=null;
                oldphymod=null;
             }
            const ProcedureCodes = [
                {
                    condition: oldDosFrom != newDosFrom,
                    Autonote: `[${seq || ""}][${Proc || ""}],From Date[${oldDosFrom || ""}] to [${newDosFrom || ""}]`,
                    revertCondition: oldDosFrom == newDosFrom,
                },
                {
                    condition: oldDosTo != newDosTo,
                    Autonote: `[${seq || ""}][${Proc || ""}],To Date[${oldDosTo || ""}] to [${newDosTo || ""}]`,
                    revertCondition: oldDosTo == newDosTo,
                },
                {
                    condition: oldproccode != newproccode,
                    Autonote: `[${seq || ""}],Proc Code[${oldproccode || ""}] to [${newproccode || ""}]`,
                    revertCondition: false
                    //oldproccode == newproccode && this.claimCharges[i].claimCharges.Deleted==false,
                },
                {
                    condition: oldunits != newunits,
                    Autonote: `[${seq || ""}][${Proc || ""}],Units[${oldunits || ""}] to [${newunits || ""}]`,
                    revertCondition:  oldunits == newunits,
                },
                {
                    condition: oldcharges != newcharges,
                    Autonote: `[${seq|| ""}][${Proc || ""}],Charges[${oldcharges || ""}] to [${newcharges || ""}]`,
                    revertCondition:  oldcharges == newcharges,
                },
                {
                    condition: oldPOS != newPOS,
                    Autonote: `[${seq || ""}][${Proc || ""}],POS[${oldPOS || ""}] to [${newPOS || ""}]`,
                    revertCondition:  oldPOS == newPOS,
                },
                {
                    condition: olddrugcode != newdrugcode,
                    Autonote: `[${seq || ""}][${Proc || ""}],Drug Code[${olddrugcode || ""}] to [${newdrugcode || ""}]`,
                    revertCondition:  olddrugcode == newdrugcode,
                },
                {
                    condition: oldndcquantity != newndcquantity,
                    Autonote: `[${seq || ""}][${Proc || ""}],Quantity[${oldndcquantity || ""}] to [${newndcquantity || ""}]`,
                    revertCondition:  oldndcquantity == newndcquantity,
                },
                {
                    condition: oldndcqualifier != newndcqualifier,
                    Autonote: `[${seq || ""}][${Proc || ""}],Qualifier[${oldndcqualifier || ""}] to [${newndcqualifier || ""}]`,
                    revertCondition:  oldndcqualifier == newndcqualifier,
                },
                {
                    condition: oldModicode1 != newModicode1,
                    Autonote: `[${seq || ""}][${Proc || ""}],M1[${oldModicode1 || ""}] to [${newModicode1 || ""}]`,
                    revertCondition:  oldModicode1 == newModicode1,
                },
                {
                    condition: oldModicode2 != newModicode2,
                    Autonote: `[${seq || ""}][${Proc || ""}],M2[${oldModicode2 || ""}] to [${newModicode2 || ""}]`,
                    revertCondition:  oldModicode2 == newModicode2,
                },
                {
                    condition: oldModicode3 != newModicode3,
                    Autonote: `[${seq || ""}][${Proc || ""}],M3[${oldModicode3 || ""}] to [${newModicode3 || ""}]`,
                    revertCondition:  oldModicode3 == newModicode3,
                },
                {
                    condition: oldModicode4 != newModicode4,
                    Autonote: `[${seq || ""}][${Proc || ""}],M4[${oldModicode4 || ""}] to [${newModicode4 || ""}]`,
                    revertCondition:  oldModicode4 == newModicode4,
                },
                {
                    condition: oldPointer1 != newPointer1,
                    Autonote: `[${seq || ""}][${Proc || ""}],ICD Pointer1 :[${oldPointer1 || ""}] to [${newPointer1 || ""}] `,
                    revertCondition: oldPointer1 == newPointer1,
                },
                {
                    condition: oldPointer2 != newPointer2,
                    Autonote: `[${seq || ""}][${Proc || ""}],ICD Pointer2:[${oldPointer2 || ""}] to [${newPointer2 || ""}] `,
                    revertCondition: oldPointer2 == newPointer2,
                },
                {
                    condition: oldPointer3 != newPointer3,
                    Autonote: `[${seq || ""}][${Proc || ""}],ICD Pointer3:[${oldPointer3 || ""}] to [${newPointer3 || ""}] `,
                    revertCondition: oldPointer3 == newPointer3,
                },
                {
                    condition: oldPointer4 != newPointer4,
                    Autonote: `[${seq || ""}][${Proc || ""}],ICD Pointer4:[${oldPointer4 || ""}] to [${newPointer4 || ""}] `,
                    revertCondition: oldPointer4 == newPointer4,
                },
                {
                    condition: oldphymod != newphymod,
                    Autonote: `[${seq || ""}][${Proc || ""}],Physical Modifier:[${oldphymod || ""}] to [${newphymod || ""}] `,
                    revertCondition: oldphymod == newphymod,
                },
                {
                    condition: oldedicheck != newedicheck && newedicheck == true,
                    Autonote: `[${seq || ""}][${Proc || ""}],Include EDI:[checked] `,
                    revertCondition: oldedicheck == newedicheck,
                },
                {
                    condition: oldedicheck != newedicheck && newedicheck == false,
                    Autonote: `[${seq || ""}][${Proc || ""}],Include EDI:[unchecked] `,
                    revertCondition: oldedicheck == newedicheck,
                },
                {
                    condition: oldnotes != newnotes,
                    Autonote: `[${seq || ""}][${Proc || ""}],Notes:[${oldnotes || ""}] to [${newnotes || ""}]`,
                    revertCondition: oldnotes == newnotes,
                },
                {
                    condition: oldstarttime != newstarttime,
                    Autonote: `[${seq || ""}][${Proc || ""}],Start Time:[${oldstarttime || ""}] to [${newstarttime || ""}]`,
                    revertCondition: oldstarttime == newstarttime,
                },
                {
                    condition: oldstoptime != newstoptime,
                    Autonote: `[${seq || ""}][${Proc || ""}],Stop Time:[${oldstoptime || ""}] to [${newstoptime || ""}]`,
                    revertCondition: oldstoptime == newstoptime,
                },
            ];
            ProcedureCodes.forEach((dx) => {
       
                if (dx.condition && !dx.revertCondition) {
                 
                    if (!Auto.includes(dx.Autonote.trim())) {
                    
                        Auto.push(dx.Autonote.trim());
                    }
                }
                if (dx.revertCondition) {
               
                    const index = Auto.indexOf(dx.Autonote.trim());
                    if (index !== -1) {
                        Auto.splice(index, 1);
                    }
                }
               });
               let noteString = Auto.length > 0 ? Auto.join(" | ") : "";
               const segments = noteString.split(" | ");
                // Remove 'Procedure :' from each segment first
                const cleanedSegments = segments.map(s => s.replace(/^Procedure\s*:\s*/i, '').trim());
                // Remove duplicates
                const uniqueSegments = [...new Set(cleanedSegments)];
                // Final string
                this.notestringforprocedureupdate = uniqueSegments.length > 0
                  ? `Procedure: [ ${uniqueSegments.join(" | ")} ]`
                  : "";
     }
                 
            }
            this.Deletedcpt=false;
            this.Addedcpt=false;
        }
    
    }
        AutoNotesForDaigCode()
        {
          let Autonotedx: string[] = [];
          let addmessagefordx=""
          let deletemessagefrodx=""
          let updatemessagefordx=""
          this.updatedaigcodemessage=[]
          let DXDeletedAutonotes:string[]=[];
          if(this.AddDx != null && this.AddDx != "")
          {
            const Adddxcode=
            [
               {
                      condition: this.AddDx != null ,
                      Autonotedx: `DX-${this.addnewindex} : [] to [${this.AddDx || ""}]`,
                      revertCondition: false
                }, 
            ];
            Adddxcode.forEach((dx) => {
                if (dx.condition && !dx.revertCondition) {
                    if (!Autonotedx.includes(dx.Autonotedx.trim())) {
                        Autonotedx.push(dx.Autonotedx.trim());
                    }
                }
                if (dx.revertCondition) {
                    const index = Autonotedx.indexOf(dx.Autonotedx.trim());
                    if (index !== -1) {
                        Autonotedx.splice(index, 1);
                    }
                }
               });
                  addmessagefordx= Autonotedx.length > 0 ? Autonotedx.join(" | ") : ""
                  addmessagefordx = addmessagefordx.replace(/\s+/g, ' ').trim();
                    if (!this.adddaigcodemessage.includes(addmessagefordx))
                         {
                            this.adddaigcodemessage.push(addmessagefordx);
                         }
                         this.AddDx=null;

           
          }
         Autonotedx=[]
          if(this.DeletedDX != null && this.DeletedDX != "")
            {
                var indexToRemove=null;
                if(this.Deletedindex != null)
                {
                    var dxCode=`DX-${this.Deletedindex}`;
                    indexToRemove = this.adddaigcodemessage.findIndex(x => x.includes(dxCode));
                }
                if(indexToRemove!=null && indexToRemove != -1)
                {
                    if (indexToRemove !== -1) {
                        this.adddaigcodemessage.splice(indexToRemove, 1);
                    }

                     // Assuming this.Deletedindex is defined and represents the index of the deleted diagnosis
                     if (this.Deletedindex !== undefined && this.Deletedindex !== null)
                        {
                             const totalLength =  this.dxcodearraylength;
                            // Iterate over the elements in reverse order, starting from the last index
                            for (let i = this.Deletedindex + 1; i <= totalLength; i++) {
                                const originalIndex = i; // Original index before deletion (1-based)
                                const newIndex = i-1; // New index after deletion (1-based)
                                const message = `[Dx-${originalIndex} has moved to Dx-${newIndex}]`;
                              // Add the message to Autonots if it's not already present
                                 if (!DXDeletedAutonotes.includes(message)) 
                                    {
                                        DXDeletedAutonotes.push(message);
                                    }
                                   }
                        }
                         this.updatemessageofdxafterdelete= DXDeletedAutonotes.length > 0 ? DXDeletedAutonotes.join(" | ") : "";
                }
                else
                {
                    const Deldxcode=
                    [
                      {
                              condition: this.DeletedDX != null ,
                              Autonote: `DX-${this.Deletedindex} : [${this.DeletedDX || ""}] to []`,
                              revertCondition: false
                      }
                    ];
                    Deldxcode.forEach((dx) => {
                        if (dx.condition && !dx.revertCondition) {
                            if (!Autonotedx.includes(dx.Autonote.trim())) {
                                Autonotedx.push(dx.Autonote.trim());
                            }
                        }
                        if (dx.revertCondition) {
                            const index = Autonotedx.indexOf(dx.Autonote.trim());
                            if (index !== -1) {
                                Autonotedx.splice(index, 1);
                            }
                        }
                         // Assuming this.Deletedindex is defined and represents the index of the deleted diagnosis
                         if (this.Deletedindex !== undefined && this.Deletedindex !== null)
                          {
                               const totalLength =  this.dxcodearraylength;
                              // Iterate over the elements in reverse order, starting from the last index
                              for (let i = this.Deletedindex + 1; i <= totalLength; i++) {
                                  const originalIndex = i; // Original index before deletion (1-based)
                                  const newIndex = i-1; // New index after deletion (1-based)
                                  const message = `[Dx-${originalIndex} has moved to Dx-${newIndex}]`;
                                // Add the message to Autonots if it's not already present
                                   if (!DXDeletedAutonotes.includes(message)) 
                                      {
                                          DXDeletedAutonotes.push(message);
                                      }
                                     }
                          }
                           this.updatemessageofdxafterdelete= DXDeletedAutonotes.length > 0 ? DXDeletedAutonotes.join(" | ") : "";
                       });
                       deletemessagefrodx= Autonotedx.length > 0 ? Autonotedx.join(" | ") : ""
                       deletemessagefrodx = deletemessagefrodx.replace(/\s+/g, ' ').trim();
                            if (!this.deletedaigcodemessage.includes(deletemessagefrodx))
                                 {
                                    this.deletedaigcodemessage.push(deletemessagefrodx);
                                 }
                                 this.DeletedDX=null;

                }
             
            }
            Autonotedx=[]
        if(this.oldClaimType != null && this.oldClaimType != undefined){
           if(this.UpdateDx!=null && this.UpdateDx !="")
           {
            let DX_1=1
            let DX_2=2
            let DX_3=3
            let DX_4=4
            let DX_5=5
            let DX_6=6
            let DX_7=7
            let DX_8=8
            let DX_9=9
            let DX_10=10
            let DX_11=11
            let DX_12=12
         
               
              const Updatedxcode=
              [
                {
                        condition: this.oldClaimType.DX_Code1 !== this.claimViewModel.ClaimModel.DX_Code1 && DX_1 == this.updatenewindex ,
                        Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code1 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code1 || ""}]`,
                        revertCondition: this.oldClaimType.DX_Code1 == this.claimViewModel.ClaimModel.DX_Code1
                },
                {
                        condition: this.oldClaimType.DX_Code2 !== this.claimViewModel.ClaimModel.DX_Code2 && DX_2 == this.updatenewindex,
                        Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code2 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code2 || ""}]`,
                        revertCondition: this.oldClaimType.DX_Code2 == this.claimViewModel.ClaimModel.DX_Code2
                },
                {
                        condition: this.oldClaimType.DX_Code3 !== this.claimViewModel.ClaimModel.DX_Code3 && DX_3 == this.updatenewindex,
                        Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code3 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code3 || ""}]`,
                        revertCondition: this.oldClaimType.DX_Code3 == this.claimViewModel.ClaimModel.DX_Code3
                },
                {
                        condition: this.oldClaimType.DX_Code4 !== this.claimViewModel.ClaimModel.DX_Code4 && DX_4 == this.updatenewindex,
                        Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code4 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code4 || ""}]`,
                        revertCondition: this.oldClaimType.DX_Code4 == this.claimViewModel.ClaimModel.DX_Code4
                },
                {
                    condition: this.oldClaimType.DX_Code5 !== this.claimViewModel.ClaimModel.DX_Code5 && DX_5 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code5 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code5 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code5 == this.claimViewModel.ClaimModel.DX_Code5
                },
                {
                    condition: this.oldClaimType.DX_Code6 !== this.claimViewModel.ClaimModel.DX_Code6 && DX_6 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code6 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code6 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code6 == this.claimViewModel.ClaimModel.DX_Code6
                },
                {
                    condition: this.oldClaimType.DX_Code7 !== this.claimViewModel.ClaimModel.DX_Code7 && DX_7 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code7 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code7 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code7 == this.claimViewModel.ClaimModel.DX_Code7
                },
                {
                    condition: this.oldClaimType.DX_Code8 !== this.claimViewModel.ClaimModel.DX_Code8 && DX_8 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code8 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code8 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code8 == this.claimViewModel.ClaimModel.DX_Code8
                },
                {
                    condition: this.oldClaimType.DX_Code9 !== this.claimViewModel.ClaimModel.DX_Code9 && DX_8 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code9 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code9 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code9 == this.claimViewModel.ClaimModel.DX_Code9
                },
                {
                    condition: this.oldClaimType.DX_Code10 !== this.claimViewModel.ClaimModel.DX_Code10 && DX_10 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code10 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code10 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code10 == this.claimViewModel.ClaimModel.DX_Code10
                },
                {
                    condition: this.oldClaimType.DX_Code11 !== this.claimViewModel.ClaimModel.DX_Code10 && DX_11 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code11 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code11 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code11 == this.claimViewModel.ClaimModel.DX_Code11
                },
                {
                    condition: this.oldClaimType.DX_Code12 !== this.claimViewModel.ClaimModel.DX_Code12 && DX_11 == this.updatenewindex,
                    Autonote: `DX-${this.updatenewindex} : [${this.oldClaimType.DX_Code12 || ""}] to [${this.claimViewModel.ClaimModel.DX_Code12 || ""}]`,
                    revertCondition: this.oldClaimType.DX_Code12 == this.claimViewModel.ClaimModel.DX_Code12
                },
              ];
              Updatedxcode.forEach((dx) => {
                if (dx.condition && !dx.revertCondition) {
                    if (!Autonotedx.includes(dx.Autonote.trim())) {
                        Autonotedx.push(dx.Autonote.trim());
                    }
                }
                if (dx.revertCondition) {
                    const index = Autonotedx.indexOf(dx.Autonote.trim());
                    if (index !== -1) {
                        Autonotedx.splice(index, 1);
                    }
                }
               });

               updatemessagefordx= Autonotedx.length > 0 ? Autonotedx.join(" | ") : ""
               updatemessagefordx = updatemessagefordx.replace(/\s+/g, ' ').trim();
                      if (!this.updatedaigcodemessage.includes(updatemessagefordx))
                           {
                              this.updatedaigcodemessage.push(updatemessagefordx);
                           }
                           this.UpdateDx=null;
           }
        }
           Autonotedx=[]
        }

        generateInsuranceNotes(claimInsuranceArray: claimInusrance[]) : string{ 
                const start = performance.now();
                let result: string ;
                                 result = claimInsuranceArray
                                .filter(insurance => insurance.claimInsurance.Claim_Insurance_Id === 0 || insurance.claimInsurance.Deleted === true)
                                .map(insurance => {
                                    return insurance.claimInsurance.Claim_Insurance_Id === 0
                                        ? `Insurance Added : [${insurance.claimInsurance.Pri_Sec_Oth_Type}][${insurance.InsurancePayerName}]`
                                        : `Insurance Deleted : [${insurance.claimInsurance.Pri_Sec_Oth_Type}][${insurance.InsurancePayerName}]`;
                                })
                                .join("|");
                    
                           var updatedarray=claimInsuranceArray
                                    .filter(payment => payment.claimInsurance.Claim_Insurance_Id >0 );
                                    let paymentupdatenotes
                              
                                        const changeNotes =  this.compareSpecificFieldsForInsurance(this.oldClaimInsuranceList,updatedarray)
                                        paymentupdatenotes=changeNotes.join("|")
                                    
                            // Ensure updatedNotes is initialized as an array
                            if (!this.updatedNotes) {
                                this.updatedNotes = [];
                            }
                            // Remove any existing "Payment Added" or "Payment Deleted" entries
                            this.updatedNotes = this.updatedNotes.map(note =>
                                note.replace(/\|?Insurance: (Added|Deleted) \[[^\]]*\] insurance \[[^\]]*\]/g, "").trim()
                            ).filter(note => note !== ""); // Remove empty strings if needed
                           
                            if (result) {
                                if(this.updatedNotes.length==0){
                                    this.updatedNotes=[result]
                                }
                                else{
                                    this.updatedNotes = [
                                        `${this.updatedNotes}|${result}`
                                        ];
                                }
                               
                            }
                            if(paymentupdatenotes){
                                if(this.updatedNotes.length==0){
                                    this.updatedNotes=[paymentupdatenotes]
                                }
                                else{
                                    this.updatedNotes = [
                                        `${this.updatedNotes}|${paymentupdatenotes}`
                                        ];
                                }
                               
                            }
                            return result;
            }

        compareSpecificFieldsForInsurance(insurance1: any[], insurance2: any[]): string[] {
                const fieldsToCompare = ["Pri_Sec_Oth_Type","Policy_Number","Relationship","SubscriberName","InsurancePayerName",
                    "Group_Number","Group_Name","Effective_Date","Termination_Date"];
                    const numberfields=["Relationship"];
                let notes: string[] = [];
            // Iterate through payments and compare only the specified fields
                for (let i = 0; i < Math.min(insurance1.length, insurance2.length); i++) {
                    const p1 = insurance1[i];
                    const p2 = insurance2[i];
                   
                    let changes: string[] = []; // Store changes for this line
               
                    for (let field of fieldsToCompare) {
                        let value1 ;
                        let value2 ;
                        var insurancename=p1["InsurancePayerName"]
                        var insurancetype=p1.claimInsurance["Pri_Sec_Oth_Type"]
                        if(field=="SubscriberName" || field == "InsurancePayerName"){
                            value1 = p1[field];
                            value2 = p2[field];
                            if (value1.trim() == "" && value2.trim() == "") {
                                value1 = null;
                                value2 = null;
                            }  
                        }
                        else{
                            value1 = p1.claimInsurance[field];
                            value2 = p2.claimInsurance[field];                
                        }
                        if(field == "Effective_Date"){
                            if (value1 == null &&  value2 == "") {
                                value1 = null;
                                value2 = null;
                            }  
                            if(value1!==null&&value1!==undefined){
                                value1 = new Date(value1);
                                if (!isNaN(value1.getTime())) { // Ensure it's a valid date
                                 value1= new Intl.DateTimeFormat("en-US", {
                                     year: "numeric",
                                     month: "2-digit",
                                     day: "2-digit"
                                 }).format(value1);
                         }
                             }
                            
                        }
                        if(field == "Termination_Date"){
                            if (value1 == null &&  value2 == "") {
                                value1 = null;
                                value2 = null;
                            }   
                            if(value1!==null&&value1!==undefined){
                                value1 = new Date(value1);
                                if (!isNaN(value1.getTime())) { // Ensure it's a valid date
                                 value1= new Intl.DateTimeFormat("en-US", {
                                     year: "numeric",
                                     month: "2-digit",
                                     day: "2-digit"
                                 }).format(value1);
                         }
                             }
                            
                        }
                        if(field == "Group_Number"){
                            if (value1 == null &&  value2 == "") {
                                value1 = null;
                                value2 = null;
                            } }
                        if (numberfields.includes(field)) {
                            value1 = Number(value1);
                            value2 = Number(value2);
                        }
                        if (value1 !== value2) {
                            if (field === "Relationship") {
                                value1 = this.relationsList.find(x=>x.Id==value1).Name;
                                value2 = this.relationsList.find(x=>x.Id==value2).Name;
                            }
                            if(field==="InsurancePayerName"){
                               field="Payer_Description"
                            }
                            if(field==="Effective_Date"){
                                field="Start_Date"
                             }
                             if(field==="Termination_Date"){
                                field="End_Date"
                             }
                             if(field==="Pri_Sec_Oth_Type"){
                                field="Type"
                             }
                            // Check for null, undefined, or 0 and replace with empty brackets []
                            const formattedValue1 = (value1 === null || value1 === undefined || value1 === 0) ? "[ ]" : `[${value1}]`;
                            const formattedValue2 = (value2 === null || value2 === undefined || value2 === 0) ? "[ ]" : `[${value2}]`;
                   
                            // Format field name: Remove underscores and capitalize each word
                            const formattedField = field
                                .split("_") // Split by underscore
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
                                .join(" "); // Join words with space
                            // Store changes
                            changes.push(`[${formattedField} : ${formattedValue1} to ${formattedValue2}]`);
                        }
                    }
                    // Add the note only if there are changes
                    if (changes.length > 0) {
                        notes.push(`Payer Description [${insurancename}][${insurancetype}] : ${changes.join(" | ")}`);
                    }
                }
               
                return notes;
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
        
        

   
          //#region  Auto Notes For Payment
           paymentMap: { [key: string]: string } = {
            "1": "Pri Pay",
            "2": "Sec Pay",
            "3": "Oth Pay",
            "P": "Patient Pay",
            "I": "Inbox Patient Pay",
            "L": "Coll Adj",
            "K": "Collection Pay",
            "A": "Insurance Adj.",
            "W": "Write Off/Adj.",
            "C": "Copay",
            "Z": "Other Adjustment",
            "D": "Dormant Adj.",
            "Q": "Patient Refund",
            "O": "Refund Requested From Office",
            "T": "Transfer Credit Balance"
        };
        paymentTypeMap:{[key:string]:string} ={
            "":"",
            "C":"Cash",
            "K":"Check",
            "R":"Credit",
            "O":"Other"
        }
        rejectionTypeMap: { [key: string]: string } = {
            "": "",
            "1": "Deductible",
            "2": "Coinsurance Amount",
            "3": "Copay",
            "8": "CPT Inconsistent with ICD",
            "9": "Invalid Modifier",
            "6": "Hospice admit same day",
            "A": "Deductible",
            "B": "Bank Charges",
            "C": "Copay",
            "D": "Duplicate",
            "E": "Ins need info from Patient",
            "F": "Finance Charges",
            "L": "Late Filing Adj",
            "M": "Pt responsibility has not been met",
            "O": "Other Charges",
            "P": "Insurance paid benefits to patient",
            "R": "Refund",
            "T": "Transferred From Other Claim",
            "V": "VFC Programme MCD",
            "01": "Benefits Exhausted",
            "02": "Non covered Benefits",
            "03": "Insurance Coverage lapsed/did not exist",
            "04": "Disallowed Cost Containment",
            "06": "Coinsurance Amount",
            "07": "Disallowed Other Amount",
            "10": "Invalid POS",
            "11": "Inconsistent with Patient Age",
            "12": "Inclusive in other procedure",
            "13": "Required Medical Notes",
            "14": "Inconsistent with Patient Gender",
            "15": "Pre-existing Condition",
            "16": "Covered by another payer",
            "17": "Duplicate/previously paid",
            "18": "Adjustment",
            "19": "Insurance needs COB information from patient",
            "20": "Lack of info",
            "21": "Not eligible charges",
            "22": "Services not authorized by Medipass PCP",
            "23": "Referring provider number not on file",
            "24": "NDC missing or invalid",
            "25": "Invalid/Missing Referral No.",
            "26": "Psychiatric Reduction",
            "27": "Patient Deceased",
            "28": "CPT Coding error",
            "29": "DX Coding Error",
            "30": "Bad Debt",
            "60": "SERVICE PERFORMED BY ANOTHER PCP WITHIN 60 DAYS",
            "AR": "Account Receivable",
            "B9": "Patient enrolled in a Hospice",
            "BC": "Bounce Check fee",
            "CA": "Patient responsibility towards collection agency",
            "CO": "Copay due",
            "GF": "Global Fee",
            "IA": "Invalid/Missing Authorization No",
            "IR": "Insurance reversal",
            "LF": "Late Filing",
            "NP": "Non-participating provider",
            "OA": "Other Amount Paid",
            "OP": "Out of network provider",
            "PE": "Provider was not eligible on DOS",
            "PP": "Provider is not patient's PCP",
            "PR": "Patient responsibility after insurance payment",
            "RI": "Refund to insurance",
            "RP": "Refund to the Patient",
            "120": "Missing/incomplete/invalid CLIA certification number",
            "145": "Premium Payment withholding",
            "160": "Injury/illness was the result of an activity that is benefit exclusion",
            "177": "Patient has not met the required eligibility requirements",
            "ARA": "Account Receivable applied to",
            "CAP": "Covered under Capitation",
            "NOF": "NOT ON FILE",
            "RSS": "Rectification for Secondary Submission",
            "N362": "The number of units exceeds the maximum allowed limit",
            "SBA": "Small Balance Adjustments",
            "D21": "NOHCARD21"
        };
        enteredFromMap: { [key: string]: string } = {
            "1": "IOU CASH REGISTER",
            "2": "SUPER BILL",
            "ERA": "ERA  PAYMENT",
            "4": "EOB",
            "5": "ERA  PAYMENT",
            "6": "ERA - REJECTED",
            "7": "ERA - UNMATCHED",
            "9": "ALL RESULT",
            "13": "NCO",
            "14": "PTL FEEDBACK",
            "15": "SPECIAL INSTRUCTION",
            "16": "REAL TIME CLAIM STATUS",
            "17": "PATIENT CALL",
            "18": "PATIENT PAYMENT",
            "40": "PATIENT PAID IN OFFICE",
            "43": "PATIENT PAID AT THE TIME OF VISIT",
            "44": "PATIENT PAID AFTER GETTING STATEMENT",
            "50": "Patient Refund",
            "60": "CareVoyant"
        };
        
          generatePaymentNotes(claimPaymentsArray: claimPayments[], type: string): string {
            const start = performance.now();
            let result: string ;
            if (type === 'newclaim') {
                result = claimPaymentsArray.map(payment => {
                    const paymentType = this.paymentMap[payment.claimPayments.Payment_Source] || "Unknown";
                    return `Payment: [Source ${paymentType}, Amt. Paid $${payment.claimPayments.Amount_Paid}]`;
                }).join("|");
                this.autonotemodelskip=true;
            }
            else if (type === 'oldclaim') {  
                result = claimPaymentsArray
                .filter(payment => payment.claimPayments.claim_payments_id === 0 || payment.claimPayments.Deleted === true)
                .map(payment => {
                    const paymentType = this.paymentMap[payment.claimPayments.Payment_Source] ;
                    let cptCode = payment.claimPayments.Charged_Proc_Code;
            
                    if (cptCode) {
                        cptCode = cptCode.substring(0, 5);
                    }
            
                    return payment.claimPayments.claim_payments_id === 0
                        ? `Payment Added: Source [${paymentType}]${cptCode ? `, CPT [${cptCode}]` : ""}`
                        : `Payment Deleted: Source [${paymentType}]${cptCode ? `, CPT [${cptCode}]` : ""}`;
                })
                .join("|");
            
            }
           console.log('Claim old payments',this.oldclaimpayments)
           console.log('claim new payments',claimPaymentsArray)
           var updatedarray=claimPaymentsArray
                    .filter(payment => payment.claimPayments.claim_payments_id >0 );
                    let paymentupdatenotes
                    if (type === 'oldclaim') {
                        const changeNotes =  this.compareSpecificFields(this.oldclaimpayments,updatedarray)
                        paymentupdatenotes=changeNotes.join("|")
                    }
           
          
             
            // Ensure updatedNotes is initialized as an array
            if (!this.updatedNotes) {
                this.updatedNotes = [];
            }
            // Remove any existing "Payment Added" or "Payment Deleted" entries
            this.updatedNotes = this.updatedNotes.map(note => 
                note.replace(/(\|?Payment (Added|Deleted): Source \[[^\]]*\](?:, CPT \[[^\]]*\])?)|(\|?Payment: \[Source Patient Pay, Amt\. Paid \$\d+(\.\d{1,2})?\])/g, "").trim()
            ).filter(note => note !== ""); // Remove empty strings if needed
            
            if (result) {
                if(this.updatedNotes.length==0){
                    this.updatedNotes=[result]
                }
                else{
                    this.updatedNotes = [
                        `${this.updatedNotes}|${result}` 
                        ]; 
                }
               
            }
            if(paymentupdatenotes){
                if(this.updatedNotes.length==0){
                    this.updatedNotes=[paymentupdatenotes]
                }
                else{
                    this.updatedNotes = [
                        `${this.updatedNotes}|${paymentupdatenotes}` 
                        ]; 
                }
                
            }
            const end = performance.now();
        console.log(`Execution time: ${(end - start).toFixed(2)} ms`);
            return result;
        }
        compareSpecificFields(payments1: any[], payments2: any[]): string[] {
            const fieldsToCompare = ["Payment_Source","Payment_Type","Date_Entry","ENTERED_FROM",
                "Charged_Proc_Code","Paid_Proc_Code","Units","Amount_Approved","Amount_Paid","Amount_Adjusted",
                "Contractual_Amt","DEPOSITSLIP_ID","BATCH_NO","BATCH_DATE","Check_No","Date_Filing","DepositDate",
            "Reject_Type","Reject_Amount","ERA_ADJUSTMENT_CODE","ERA_Rejection_CATEGORY_CODE","Details"];
                const numberfields=["Units","Amount_Approved","Amount_Paid","Amount_Adjusted","Contractual_Amt"];
            let notes: string[] = [];
            if (Array.isArray(this.updatedNotes) && this.updatedNotes.length > 0) {
                this.updatedNotes[0] = this.updatedNotes[0]
                    .split("|") // Split the string at index 0
                    .filter(part => 
                        !part.trim().startsWith("Payment [Line") // Remove parts containing fieldsToCompare
                    )
                    .join("|") // Join back to a string
                    .trim(); // Remove extra spaces
            }
            
            // Iterate through payments and compare only the specified fields
            for (let i = 0; i < Math.min(payments1.length, payments2.length); i++) {
                const p1 = payments1[i];
                const p2 = payments2[i];
                let charge_proc = p2.claimPayments.Charged_Proc_Code;
                let changes: string[] = []; // Store changes for this line
            
                for (let field of fieldsToCompare) {
                    let value1 = p1.claimPayments[field];
                    let value2 = p2.claimPayments[field];
                
                    if (numberfields.includes(field)) {
                        value1 = Number(value1);
                        value2 = Number(value2);
                    }
                    if(field==="BATCH_DATE"||field==="Date_Filing"||field==="DepositDate"||field==="Date_Entry"){

                        if(value1!==null&&value1!==undefined){
                           value1 = new Date(value1);
                           if (!isNaN(value1.getTime())) { // Ensure it's a valid date
                            value1= new Intl.DateTimeFormat("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit"
                            }).format(value1);
                    }
                        }
                        if(value2!==null&&value2!==undefined&&field==="Date_Entry"){
                            value2 = new Date(value2);
                            if (!isNaN(value2.getTime())) { // Ensure it's a valid date
                                value2= new Intl.DateTimeFormat("en-US", {
                                 year: "numeric",
                                 month: "2-digit",
                                 day: "2-digit"
                             }).format(value2);
                     }
                         }
                       
                }

                    if (value1 !== value2) {
                        if (field === "Payment_Source") {
                            value1 = this.paymentMap[value1];
                            value2 = this.paymentMap[value2];
                        }
                        if (field === "Payment_Type") {
                            value1 = this.paymentTypeMap[value1];
                            value2 = this.paymentTypeMap[value2];
                        }
                        if (field === "Reject_Type") {
                            value1 = this.rejectionTypeMap[value1];
                            value2 = this.rejectionTypeMap[value2];
                        }
                        if (field === "ENTERED_FROM") {
                            value1 = this.enteredFromMap[value1];
                            value2 = this.enteredFromMap[value2];
                        }
                        if(field==="ERA_ADJUSTMENT_CODE"){
                           field="Adjustment_Code"
                        }
                        if(field==="ERA_Rejection_CATEGORY_CODE"){
                            field="Rejection_Code"
                         }
                         if(field==="Date_Filing"){
                            field="Check Date"
                         }
                        // Check for null, undefined, or 0 and replace with empty brackets []
                        const formattedValue1 = (value1 === null || value1 === undefined || value1 === 0) ? "[ ]" : `[${value1}]`;
                        const formattedValue2 = (value2 === null || value2 === undefined || value2 === 0) ? "[ ]" : `[${value2}]`;
                
                        // Format field name: Remove underscores and capitalize each word
                        const formattedField = field
                            .split("_") // Split by underscore
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
                            .join(" "); // Join words with space
                        // Store changes
                        changes.push(`[${formattedField} ${formattedValue1} to ${formattedValue2}]`);
                    }
                }
                // Add the note only if there are changes
                if (changes.length > 0) {
                    let note ;
                    if(charge_proc){
                       note=` Payment [Line ${i + 1}][${charge_proc}]: ${changes.join(" , ")}`
                    }else{
                       note=` Payment [Line ${i + 1}]: ${changes.join(" , ")}`
                    }
                    notes.push(note);
                }
            }
            
            return notes;
        }
        //#endregion
        
        //#region Transfer Credit Balance
        showtcbmodel(){
            const modalOptions: ModalOptions = {
                backdrop: 'static'
              };
              this.tcbModal.config = modalOptions; 
            this.tcbModal.show();
            
          }
         claimswithPatientDue:any;
          getClaimsWithPatientDue(){
            debugger
            const practice = JSON.parse(localStorage.getItem('sp') || '{}');
            const practiceCode = practice.PracticeCode;
            const patientAccount = this.claimInfo.Patient_Account;
            this.API.getData(`/Demographic/GetClaimsWithPatientDue?practicecode=${practiceCode}&patientaccount=${patientAccount}`).subscribe(
                (data: any) => {
                    if (data.Status == "Success") {
                        this.claimswithPatientDue=data.Response;
                        this.claimswithPatientDue = this.claimswithPatientDue.map(c => {
                            const dos = new Date(c.Dos);
                            const formattedDos = `${(dos.getMonth() + 1).toString().padStart(2, '0')}/${dos.getDate().toString().padStart(2, '0')}/${dos.getFullYear()}`;
                            return {
                              ...c,
                              displayText: `${c.Claim_No} | ${formattedDos} | PT Due $${c.Amt_Due}`
                            };
                          });
                          
                        console.log("claimswithPatientDue",this.claimswithPatientDue)
                    }

                }
            )
          }
          onClaimChange(payment: any, event: any) {
            debugger
            if (event.length ==0) {
              // Cleared
              if (payment.claimPayments) {
                payment.claimPayments.Claim_No = 355139;
              }
            } else {
              // Selected
              if (payment.claimPayments) {
                payment.claimPayments.Claim_No = event[0].data.Claim_No;
             
                
              }
            }
          }
          
         
          
          validateAndPost() {
            const selectedClaims: number[] = [];
            this.tcbModalShow=true;
            let hasValidationError = false;
          
            for (let p of this.transfercrditbalPayment) {
              const selectedClaimNo = p.claimPayments.Claim_No;
              const amtPaid = Math.abs(p.claimPayments.Amount_Paid);
          
              //  1. No claim selected (355139 = unselected default)
              if (!selectedClaimNo || selectedClaimNo === 355139) {
                this.toast.error(
                  'Please select a Claim number before posting.',
                  'Error'
                );
                hasValidationError = true;
                return;
              }
          
              //  2. Duplicate claim selected (ignore default 355139)
              if (selectedClaimNo !== 355139 && selectedClaims.includes(selectedClaimNo)) {
                this.toast.error(
                  'You cannot select the same claim number multiple times.',
                  'Error'
                );
                hasValidationError = true;
                return;
              } else {
                selectedClaims.push(selectedClaimNo);
              }
          
              //  3. Amount paid exceeds patient due
              const selectedClaim = this.claimswithPatientDue.find(c => c.Claim_No === selectedClaimNo);
              if (selectedClaim && amtPaid > selectedClaim.Amt_Due) {
                this.toast.error(
                  'The credit amount you\'re trying to transfer (From Amt.paid) exceeds Patient Due of the selected claim. Please Adjust.',
                  'Error'
                );
                hasValidationError = true;
                return;
              }
             
  
            }
            if(!hasValidationError){
                debugger
                this.tcbModal.hide();
                this.saveClaim('Save')
              }
           
          }
          PostPayment(){
            debugger
                const paymentList = this.transfercrditbalPayment.map(p => p.claimPayments);

                this.API.PostData('/Demographic/InsertOrUpdateClaimPayments', paymentList, (res) => {
                  if (res.Status === 'Success') {
                    this.toast.success('Claim payments posted successfully.', 'Success');
                    this.refresh(); 
                    this.getSetStatus();// Optional: Refresh or close modal
                  } else {
                    this.toast.error(res.Status || 'Failed to post payments.', 'Error');
                  }
                }); 
          }
          //#endregion
        
        
}




