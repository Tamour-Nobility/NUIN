import { Component, OnInit, TemplateRef, ViewChild,ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { InsuranceSearchComponent } from '../../../shared/insurance-search/insurance-search.component';
import { PatientSearchComponent } from '../../../patient/search/patient-search.component';
import { FacilitiesComponent } from '../../../setups/Facility/facilities.component';
import { ModalWindow } from '../../../shared/modal-window/modal-window.component';
import { APIService } from '../../../components/services/api.service';
import { PaymentSearchRequest,patientBasedClaim,insBasedClaim,PostedClaims} from '../../models/payment-search-request.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatatableService } from '../../../services/data/datatable.service';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { Common } from '../../../services/common/common';
declare var $: any;


@Component({
  selector: 'app-payment-posting',
  templateUrl: './payment-posting.component.html',
  styleUrls: ['./payment-posting.component.css']
})
export class PaymentPostingComponent implements OnInit {
  patientBasedClaimForm: FormGroup;
  insuranceBasedClaimForm: FormGroup;
  patientBasedclaim:patientBasedClaim
  insBasedclaim:insBasedClaim
  postedClaims:PostedClaims[]
  @Input() hideModal: any;
  patientSearchModalRef: BsModalRef;
  checkStatus:string='Pat';
  @Output() sendDatato: EventEmitter<any> = new EventEmitter();
  checkAll: boolean = false;
  dataTable: any;
  datatable: any;
  dataClaims: any[];
  dataInsClaims: any[];
  public placeholder: string = 'MM/DD/YYYY';
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '100%',
  };
  @ViewChild('facilitySearch') facilityModal: ModalWindow;
  @ViewChild('patientSearchModalTemplate') patientModal: ModalWindow;
  @ViewChild('InsuranceSearchModalTemplate') insModal: ModalWindow;
  @ViewChild(PatientSearchComponent) pat: PatientSearchComponent;
  @ViewChild(InsuranceSearchComponent) ins: InsuranceSearchComponent;
  @ViewChild(FacilitiesComponent) vfc: FacilitiesComponent;
  isSearchInitiated: boolean = true; //to be changed
  patientPaymentModalRef: any;
  constructor(private modalService: BsModalService,private Gv: GvarsService,private API: APIService,private chRef: ChangeDetectorRef,private datatableService: DatatableService) {
    this.patientBasedclaim =new patientBasedClaim();
    this.insBasedclaim =new insBasedClaim();
   }

  get f() {
    return this.patientBasedClaimForm.controls;
  }

  get ibf() {
    return this.insuranceBasedClaimForm.controls;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.patientBasedClaimForm = new FormGroup({
      PatientName: new FormControl(''),
      Facility: new FormControl(''),
      Balance: new FormControl('')
    });
    this.insuranceBasedClaimForm = new FormGroup({
      InsuranceName: new FormControl(''),
      Facility: new FormControl(''),
      Balance: new FormControl(''),
      FromDate: new FormControl(''),
      ToDate: new FormControl('')
    });
  }

  onDateChanged(event, controlName) {
    if (controlName == "FromDate"){
      this.ibf.FromDate.setValue(event.formatted);
      this.insBasedclaim.dateFrom=event.formatted
    }
     
    else if (controlName == "ToDate"){
      this.ibf.ToDate.setValue(event.formatted);
      this.insBasedclaim.dateTo=event.formatted
    }
     
  }


isValid(){
  if(this.checkStatus == 'Pat'){
    if(Common.isNullOrEmpty(this.patientBasedclaim.PatientAccount) ){

    }
    
  }

}

  onSearch() {
  
    if (this.checkStatus == 'Pat'){
      this.patientBasedclaim.practiceCode= this.Gv.currentUser.selectedPractice.PracticeCode
      if(this.patientBasedClaimForm.value.Balance !=null || this.patientBasedClaimForm.value.Balance != undefined || this.patientBasedClaimForm.value.Balance != ""){
        this.patientBasedclaim.Balance=Number(this.patientBasedClaimForm.value.Balance)
      }
       
       if(this.patientBasedclaim.PatientAccount !=null ||this.patientBasedclaim.FacilityCode !=null || this.patientBasedclaim.Balance !=0)
       {
        this.API.PostData('/Payments/GetClaimBypatient',this.patientBasedclaim ,
        (response) => {
          
          this.postedClaims=[]
          if (response.Status == "Sucess") {  
            this.dataClaims=[] 
           
            if (this.dataTable) {
              this.dataTable.destroy();
              this.chRef.detectChanges();
            }
            this.dataClaims=response.Response;
            this.chRef.detectChanges();
            const table = $('.dtClaims');
            this.dataTable = table.DataTable({
              columnDefs: [{
                orderable: false,
                className: 'select-checkbox',
                targets: 0
              },
              {
                orderable: false,
                targets: 2
              }],
              select: {
                style: 'multi',
                selector: 'td:first-child'
              },
              
              order: [0, 'asc'],
              language: {
                emptyTable: "No data available"
              }

              
            });
           this.dataTable.on('select', (e, dt, type, indexes) => this.onRowSelect(indexes));
          this.dataTable.on('deselect', (e, dt, type, indexes) => this.onRowDeselect(indexes));
          console.log(this.dataClaims)
          }
        });
    
    
    
       }
    }

    else if (this.checkStatus == 'Ins'){
      this.insBasedclaim.practiceCode= this.Gv.currentUser.selectedPractice.PracticeCode
      if(this.insuranceBasedClaimForm.value.Balance !=null || this.insuranceBasedClaimForm.value.Balance != undefined || this.insuranceBasedClaimForm.value.Balance != ""){
        this.insBasedclaim.Balance=Number(this.insuranceBasedClaimForm.value.Balance)
      }
      if(this.insuranceBasedClaimForm.value.FromDate !=null || this.insuranceBasedClaimForm.value.FromDate != undefined || this.insuranceBasedClaimForm.value.FromDate != ""){
        this.insBasedclaim.dateFrom=null
      }

      if(this.insuranceBasedClaimForm.value.ToDate !=null || this.insuranceBasedClaimForm.value.ToDate != undefined || this.insuranceBasedClaimForm.value.ToDate != ""){
        this.insBasedclaim.dateTo=null
      }
      if(this.insBasedclaim.InsId!=null ||this.insBasedclaim.FacilityCode !=null)
       {
        this.API.PostData('/Payments/GetClaimByins',this.insBasedclaim ,
        (response) => {
          
          
          if (response.Status == "Sucess") {   
            this.dataInsClaims=[]
            this.dataInsClaims=response.Response
              
            if (this.dataTable) {
              this.dataTable.destroy();
              this.chRef.detectChanges();
            }
            this.dataInsClaims=response.Response;
            this.chRef.detectChanges();
            const table = $('.dtInsClaims');
            this.dataTable = table.DataTable({
              columnDefs: [{
                orderable: false,
                className: 'select-checkbox',
                targets: 0
              },
              {
                orderable: false,
                targets: 2
              }],
              select: {
                style: 'multi',
                selector: 'td:first-child'
              },
              
              order: [0, 'asc'],
              language: {
                emptyTable: "No data available"
              }

              
            });
           this.dataTable.on('select', (e, dt, type, indexes) => this.onRowSelect(indexes));
          this.dataTable.on('deselect', (e, dt, type, indexes) => this.onRowDeselect(indexes));
            
          }
        });
    
    
    
       }
    }

  

  }
  sendData(){

    if(this.postedClaims.length > 0){
      if(this.checkStatus == 'Pat'){
        this.sendDatato.emit(this.postedClaims)
      }
      else if(this.checkStatus == 'Ins'){
        this.sendDatato.emit(this.postedClaims)
      }

     
    }else{
      swal('Failed', "No claim Added.", 'error');
    }
   
    
    
  }
  onRowDeselect(indexes: any) {
    this.checkAll = false;
    let ndx = this.postedClaims.findIndex(p => p.claimId == this.dataTable.cell(indexes, 2).data());
    if (ndx > -1) {
      this.postedClaims.splice(ndx, 1);
    }
    console.log(this.postedClaims)
  }

  onRowSelect(indexes: any) {
    if (this.postedClaims.findIndex(p => p.claimId == this.dataTable.cell(indexes, 2).data()) < 0) {
      this.postedClaims.push(new PostedClaims(this.dataTable.cell(indexes, 2).data()));
    }
    var count = this.dataTable.rows().count();
    if (count === this.postedClaims.length) {
      this.checkAll = true;
    }

    console.log(this.postedClaims)
  }
  onSelectInsurance({ Insurance_Id, Inspayer_Description }) {
    
      this.insModal.hide();
     // this.f.InsuranceId.setValue(Insurance_Id);
     this.insBasedclaim.InsId=Insurance_Id;
      this.ibf.InsuranceName.setValue(Inspayer_Description);
  
   
    
  }

  showFacility() {
    this.facilityModal.show();
  }

  onToggleCheckAll(checked: boolean) {
    if (checked) {
      this.dataTable.rows().select();
      var count = this.dataTable.rows({ selected: true }).count();
      var rows = this.dataTable.rows({ selected: true }).data();
      this.postedClaims= [];
      for (let index = 0; index < count; index++) {
        this.postedClaims.push(new PostedClaims(rows[index][2]));
      }
    } else {
      this.dataTable.rows().deselect();
      this.postedClaims = [];
    }
    console.log(this.postedClaims)
  }

  getFacilityName(event: any) {
    if(this.checkStatus == 'Pat'){
      this.patientBasedclaim.FacilityCode=event.ID;
      this.f.Facility.setValue(event.name);
      this.facilityModal.hide();
    }
    else if(this.checkStatus == 'Ins'){
      this.insBasedclaim.FacilityCode=event.ID
      this.ibf.Facility.setValue(event.name)
      this.facilityModal.hide();
    }
  }

  onCloseFacSearch() {
    this.vfc.ClearFields();
  }
  onCloseinsSearch(){
    this.ins.clearForm();
  }
  onClosePatSearch(){
    this.pat.resetFields()
  }

  showPatientSearch() {
  this.patientModal.show()
  }
  showInsSearch(){
    this.insModal.show()
  }
  getPatientName(event: any) {
    this.patientModal.hide();
    this.patientBasedclaim.PatientAccount=event.Patient_Account
    this.f.PatientName.setValue(event.First_Name + ' ' + event.Last_Name);
    
   
  }
  toggleStatusForPat(){
    this.patientBasedClaimForm.reset()
    this.dataClaims=[]
    this.postedClaims=[]
    this.checkStatus='Pat'
    this.dataTable.clear().draw();

             
  }
  toggleStatusForIns(){
    this.insuranceBasedClaimForm.reset()
    this.dataInsClaims=[]
    this.postedClaims=[]
    this.checkStatus='Ins'
    this.dataTable.clear().draw();

  }

}