import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDate, IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { InsuranceSearchComponent } from '../../../shared/insurance-search/insurance-search.component';
import { APIService } from '../../../components/services/api.service';
import { FacilitiesComponent } from '../../../setups/Facility/facilities.component';
import { PatientSearchComponent } from '../../../patient/search/patient-search.component';
import { PaymentAdvisoryComponent } from '../../../payment/payment-advisory/payment-advisory/payment-advisory.component';
import { PaymentSearchRequest, PatientPayment, InsurancePayment, PaymentData } from '../../models/payment-search-request.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { Common } from '../../../services/common/common';
import { GvarsService } from '../../../services/G_vars/gvars.service';

@Component({
  selector: 'app-payment-search',
  templateUrl: './payment-search.component.html',
  styleUrls: ['./payment-search.component.css']
})
export class PaymentSearchComponent implements OnInit  {
  PaymentsSearchForm: FormGroup;
  insurancePaymentForm: FormGroup;
  patientPaymentForm: FormGroup;
  patientPayment: PatientPayment;
  PaymentsDatatable: any
  insurancePayment: InsurancePayment;
  listInsurances: any[];
  listPaymentFrom: any[];
  listPostedby: any[];
  listStatus: any[];
  listPaymentTypes: any[];
  listPatientPaymentType: any[];
  listInsurancePaymentType: any[];
  isSearchInitiated: boolean = false;
  dataPayments: PaymentData[]
  ShowPayBtn: boolean = true
  showInsBtn: boolean = true
  showClose: boolean = false
  showAdv:boolean=false
  payType: any
  paymentdetail: any
  dtPayments: any;
  public placeholder: string = 'MM/DD/YYYY';
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '100%',
  };
  selDateDOB: IMyDate = {
    day: 0,
    month: 0,
    year: 0
  };

  facOpendFrom: string;
  patOpenFrom: string;

  advisoryOpendFrom: string;
  insOpendFrom: string;
  insurancePaymentModalRef: BsModalRef;
  patientPaymentModalRef: BsModalRef;
  insuranceSearchModalRef: BsModalRef;
  paymentAdvisoryModalRef: BsModalRef;
  patientSearchModalRef: BsModalRef;
  facilitySearchModalRef: BsModalRef;

  @ViewChild(InsuranceSearchComponent) ins: InsuranceSearchComponent;
  @ViewChild(FacilitiesComponent) vfc: FacilitiesComponent;
  @ViewChild(PatientSearchComponent) pat: PatientSearchComponent;
  @ViewChild('PAC')  PAC: PaymentAdvisoryComponent;
  PaymentsSearchRequest: PaymentSearchRequest;
  constructor(private API: APIService,
    public toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    public Gv:GvarsService ,
    private modalService: BsModalService) {
    this.PaymentsSearchRequest = new PaymentSearchRequest()
    this.patientPayment = new PatientPayment();
    this.insurancePayment = new InsurancePayment();
    this.dataPayments = []
    this.listInsurances = [
      { name: 'A', value: '1' },
      { name: 'B', value: '2' },
      { name: 'C', value: '3' },
      { name: 'D', value: '4' },
    ];
    this.listPaymentFrom = [
      { name: 'Patient', value: 'Patient' },
      { name: 'Provider', value: 'insurance' }
    ];
    this.listPostedby = [
      { name: 'User', value: 'User' },
      { name: 'Insurance', value: 'Insurance' }
    ];
    this.listPaymentTypes = [];
    this.listPatientPaymentType = [];
    this.listInsurancePaymentType = [];
    this.listStatus = [
      { name: 'All Payments,', value: '1' },
      { name: 'All payments with Deposit Date ', value: '2' },
      { name: 'All Posted Payments', value: '3' },
      { name: 'All Unposted Payments', value: '4' }
    ];
  }

  ngOnInit() {
    this.getPaymentList();
    this.initForm();

    this.f.PaymentStatus.setValue('1')


  }
 
  get f() {
    return this.PaymentsSearchForm.controls;
  }

  get ipf() {
    return this.insurancePaymentForm.controls;
  }

  get ppf() {
    return this.patientPaymentForm.controls;
  }

  initForm() {
    this.PaymentsSearchForm = new FormGroup({
      PaymentFrom: new FormControl(''),
      CheckNo: new FormControl('', Validators.pattern(/^[0-9]+$/)),
      FacilityId: new FormControl(''),
      Facility: new FormControl(''),
      PostedBy: new FormControl(''),
      BatchNo: new FormControl(''),
      PaymentId: new FormControl(''),
      PatientAccount: new FormControl(''),
      PatientName: new FormControl('', Validators.pattern('[a-zA-Z ]*')),
      InsuranceId: new FormControl(''),
      InsuranceName: new FormControl(''),
      PaymentType: new FormControl(''),
      PaymentStatus: new FormControl(''),
      PaymentDateFrom: new FormControl(''),
      PaymentDateTo: new FormControl(''),
    });
    this.insurancePaymentForm = new FormGroup({
      InsuranceId: new FormControl(''),
      Insurance: new FormControl(''),
      PaymentType: new FormControl(''),
      CheckNo: new FormControl('', Validators.pattern(/^[0-9]+$/)),
      BatchNo: new FormControl(''),
      Amount: new FormControl(''),
      FacilityId: new FormControl(''),
      Facility: new FormControl(''),
      EOBDate: new FormControl(''),
      CheckDate: new FormControl(''),
      DepositDate: new FormControl(''),
      ReceivedDate: new FormControl(''),
      Note: new FormControl(''),
    });
    this.patientPaymentForm = new FormGroup({
      PatientAccount: new FormControl(''),
      PatientName: new FormControl(''),
      FacilityId: new FormControl(''),
      Facility: new FormControl(''),
      DepositDate: new FormControl(''),
      Amount: new FormControl(''),
      PaymentType: new FormControl(''),
      CheckDate: new FormControl(''),
      CheckNo: new FormControl('', Validators.pattern(/^[0-9]+$/)),
    });
  }
  closeData(){
    this.API.confirmFun('Confirmation', 'Closing this window will reset all data. Are you sure?', () => {

      this.paymentAdvisoryModalRef.hide();
    })

  }

  
   onPaymentPost(event: any){

    if(event.value== 'pay'){
      this.showClose=true;
    }else if(event.value == 'post'){
this.paymentAdvisoryModalRef.hide();
this.patientPaymentModalRef.hide();
this.onClear();
this.showClose=false;

    }


}

  onDateChanged(event, controlName) {
    if (controlName == "PaymentDateFrom")
      this.PaymentsSearchRequest.PaymentDateFrom = event.formatted;
    else if (controlName == "PaymentDateTo")
      this.PaymentsSearchRequest.PaymentDateTo = event.formatted;
    //
    else if (controlName == "EOBDate")
      this.ipf.EOBDate.setValue(event.formatted);
    else if (controlName == "ipfDepositDate")
      this.ipf.DepositDate.setValue(event.formatted);
    else if (controlName == "ReceivedDate")
      this.ipf.ReceivedDate.setValue(event.formatted);
    //
    else if (controlName == "DepositDate")
      this.ppf.DepositDate.setValue(event.formatted);
    else if (controlName == "CheckDate")
      this.ppf.CheckDate.setValue(event.formatted);
  }
  onDateRangeChanged(event: IMyDateRangeModel) {
    this.PaymentsSearchRequest.PaymentDateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
    this.PaymentsSearchRequest.PaymentDateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
  }

  onLookUp() {

    // this.f.PaymentDateFrom.setValue(this.PaymentsSearchForm.value.PaymentDateFrom.formatted);
    // this.f.PaymentDateTo.setValue(this.PaymentsSearchForm.value.PaymentDateTo.formatted);

    if (this.PaymentsSearchForm.value.BatchNo != null || this.PaymentsSearchForm.value.BatchNo != undefined || this.PaymentsSearchForm.value.BatchNo != '') {
      this.PaymentsSearchRequest.BatchNo = this.PaymentsSearchForm.value.BatchNo;
    }
    if (this.PaymentsSearchForm.value.PaymentFrom != null || this.PaymentsSearchForm.value.PaymentFrom != undefined || this.PaymentsSearchForm.value.PaymentFrom != '') {
      this.PaymentsSearchRequest.PaymentFrom = this.PaymentsSearchForm.value.PaymentFrom;
    }
    if (this.PaymentsSearchForm.value.CheckNo != null || this.PaymentsSearchForm.value.CheckNo != undefined || this.PaymentsSearchForm.value.CheckNo != '') {
      this.PaymentsSearchRequest.CheckNo = this.PaymentsSearchForm.value.CheckNo;
    }
    if (this.PaymentsSearchForm.value.PaymentStatus != null || this.PaymentsSearchForm.value.PaymentStatus != undefined || this.PaymentsSearchForm.value.PaymentStatus != '') {
      this.PaymentsSearchRequest.PaymentStatus = this.PaymentsSearchForm.value.PaymentStatus;
    }
    if (this.PaymentsSearchForm.value.Facility != null || this.PaymentsSearchForm.value.Facility != undefined || this.PaymentsSearchForm.value.Facility != '') {
      this.PaymentsSearchRequest.FacilityId = this.PaymentsSearchForm.value.FacilityId;
    }
    if (this.PaymentsSearchForm.value.PatientName != null || this.PaymentsSearchForm.value.PatientName != undefined || this.PaymentsSearchForm.value.PatientName != '') {
      this.PaymentsSearchRequest.PatientName = this.PaymentsSearchForm.value.PatientName;
    }
    if (this.PaymentsSearchForm.value.InsuranceName != null || this.PaymentsSearchForm.value.InsuranceName != undefined || this.PaymentsSearchForm.value.InsuranceName != '') {
      this.PaymentsSearchRequest.InsuranceId = this.PaymentsSearchForm.value.InsuranceId;
    }
    if (this.PaymentsSearchForm.value.PaymentType != null || this.PaymentsSearchForm.value.PaymentType != undefined || this.PaymentsSearchForm.value.PaymentType != '') {
      this.PaymentsSearchRequest.PaymentType = this.PaymentsSearchForm.value.PaymentType;
    }

   this.PaymentsSearchRequest.practice_code=this.Gv.currentUser.selectedPractice.PracticeCode.toString()
    if ((!Common.isNullOrEmpty(this.PaymentsSearchRequest.PaymentFrom)) || (!Common.isNullOrEmpty(this.PaymentsSearchRequest.BatchNo)) || (!Common.isNullOrEmpty(this.PaymentsSearchRequest.CheckNo)) ||
      (!Common.isNullOrEmpty(this.PaymentsSearchRequest.PaymentStatus)) || (!Common.isNullOrEmpty(this.PaymentsSearchRequest.FacilityId))
      || (!Common.isNullOrEmpty(this.PaymentsSearchRequest.PatientName)) || (!Common.isNullOrEmpty(this.PaymentsSearchRequest.InsuranceId))
      || (!Common.isNullOrEmpty(this.PaymentsSearchRequest.PaymentType))       || (!Common.isNullOrEmpty(this.PaymentsSearchRequest.practice_code))
    ) { 
      this.isSearchInitiated = true;
      console.log(this.PaymentsSearchRequest)
      this.API.PostData('/Payments/SearchPayment', this.PaymentsSearchRequest,
        (response) => {


          if (response.Status == "Sucess") {
            this.dataPayments = response.Response;



            if (this.PaymentsDatatable) {
              this.PaymentsDatatable.destroy();
              this.chRef.detectChanges();

            }
            this.chRef.detectChanges();
            this.PaymentsDatatable = $('.dtPayments').DataTable({
              responsive: true,
              language: {
                emptyTable: "No data available"
              }
            });
          }
          // this.isSearchInitiated = false;
        });
    } else {
      this.toaster.warning('Please provide search criteria', 'Invalid Search Criteria');
    }

  }

  onClear() {
    this.isSearchInitiated = false;
    this.chRef.detectChanges();
    if (this.PaymentsDatatable) {
      this.PaymentsDatatable.destroy();
    }
    this.PaymentsSearchForm.reset();
    this.dataPayments=[];

  }
  Number(value:any){
    return Number(value)
  }
  onAddInsurancePayment(template: TemplateRef<any>) {
    this.showInsBtn = true
    this.insurancePaymentModalRef = this.modalService.show(template, { class: 'modal-lg',  backdrop : 'static',
    keyboard : false });
  }

  onAddPatientPayment(template: TemplateRef<any>) {
    this.ShowPayBtn = true
    this.showAdv=false
    this.patientPaymentModalRef = this.modalService.show(template, { class: 'modal-lg' ,  backdrop : 'static',
    keyboard : false });
  }

  openInsuranceSearchModal(template: TemplateRef<any>, from: string) {
    this.insuranceSearchModalRef = this.modalService.show(template, { class: 'modal-lg' , backdrop : 'static',
    keyboard : false });
    this.insOpendFrom = from;
  }

  openPaymentAdvisoryModal(template: TemplateRef<any>, from: string) {
    this.paymentAdvisoryModalRef = this.modalService.show(template, { class: 'modal-lg' ,  backdrop : 'static',
    keyboard : false});
    this.advisoryOpendFrom = from;
  }

  openSearchPatientModal(template: TemplateRef<any>, from: string) {
    this.patientSearchModalRef = this.modalService.show(template, { class: 'modal-lg',  backdrop : 'static',
    keyboard : false });
    this.patOpenFrom = from;
  }

  openSearchFacilityModal(template: TemplateRef<any>, from: string) {
    this.facilitySearchModalRef = this.modalService.show(template, { class: 'modal-lg' ,  backdrop : 'static',
    keyboard : false});
    this.facOpendFrom = from;
  }

  onSelectInsurance({ Insurance_Id, Inspayer_Description }) {
    this.insuranceSearchModalRef.hide();
    if (this.insOpendFrom == "Payment Search") {
      this.f.InsuranceId.setValue(Insurance_Id);
      this.f.InsuranceName.setValue(Inspayer_Description);
    }
    else if (this.insOpendFrom == "Insurance Payment") {
      this.ipf.InsuranceId.setValue(Insurance_Id);
      this.ipf.Insurance.setValue(Inspayer_Description);
    }
  }

  onCloseInsSearch() {
    this.ins.clearForm();
  }

  getFacilityName(event: any) {
    this.facilitySearchModalRef.hide();
    if (this.facOpendFrom == "Payment Search") {
      this.f.FacilityId.setValue(event.ID);
      this.f.Facility.setValue(event.name);
    }
    else if (this.facOpendFrom == "Insurance Payment") {
      this.ipf.FacilityId.setValue(event.ID);
      this.ipf.Facility.setValue(event.name);
    }
    else if (this.facOpendFrom == "Patient Payment") {
      this.ppf.FacilityId.setValue(event.ID);
      this.ppf.Facility.setValue(event.name);
    }
  }

  onCloseFacSearch() {
    this.vfc.ClearFields();
  }

  getPatientName(event: any) {
    this.patientSearchModalRef.hide();
    if (this.patOpenFrom == "Payment Search") {
      this.f.PatientAccount.setValue(event.Patient_Account);
      this.f.PatientName.setValue(event.First_Name + ' ' + event.Last_Name);
    }
    else if (this.patOpenFrom == "Patient Payment") {
      this.ppf.PatientAccount.setValue(event.Patient_Account);
      this.ppf.PatientName.setValue(event.First_Name + ' ' + event.Last_Name);
    }
  }

  onClosePatcSearch() {
    this.pat.resetFields();
  }

  onToggleCheckAll(checked) {
    if (checked) {
      this.dtPayments.rows().select();
      var count = this.dtPayments.rows({ selected: true }).count();
      var rows = this.dtPayments.rows({ selected: true }).data();
      //   this.PaymentsSearchRequest ;
      //   for (let index = 0; index < count; index++) {
      //     this.dataPayments.push(new  PaymentData(rows[index][1]));
      //   }
      // } else {
      //   this.dtPayments.rows().deselect();
      //   this.dataPayments = [];
      // }
    }
  }


  onOkInsPayment() {
    this.insurancePayment.InsuranceID = this.insurancePaymentForm.value.InsuranceId;
    this.insurancePayment.PaymentTypeID = Number(this.insurancePaymentForm.value.PaymentType);
    this.insurancePayment.checkNo = this.insurancePaymentForm.value.CheckNo;
    this.insurancePayment.amount = Number(this.insurancePaymentForm.value.Amount);
    this.insurancePayment.facilityID = this.insurancePaymentForm.value.FacilityId;
    this.insurancePayment.EOBDate = this.insurancePaymentForm.value.EOBDate.formatted;
    this.insurancePayment.depositDate = this.insurancePaymentForm.value.DepositDate.formatted;
    this.insurancePayment.checkDate = this.insurancePaymentForm.value.CheckDate.formatted;
    this.insurancePayment.NOtes = this.insurancePaymentForm.value.Note;
    this.insurancePayment.ReceivedDate = this.insurancePaymentForm.value.ReceivedDate.formatted;
    this.insurancePayment.prac_code=this.Gv.currentUser.selectedPractice.PracticeCode.toString()

    console.log(this.insurancePayment)
    if (this.insurancePaymentForm.valid)
      this.API.PostData('/Payments/AddInsurancePayment', this.insurancePayment, (response) => {
        if (response.Status == "Success") {
          this.toaster.success("Payment Added Successfuly", "Success");
          this.insurancePaymentModalRef.hide();
          this.insurancePaymentForm.reset();
        }
        else
          this.toaster.error(response.Response, response.Status)
      });
    else
      return;
  }

  onOkPatPayment() {
    this.patientPayment.paymentTypeID = Number(this.patientPaymentForm.value.PaymentType);
    this.patientPayment.patientName = this.patientPaymentForm.value.PatientName;
    this.patientPayment.facilityID = this.patientPaymentForm.value.FacilityId;
    this.patientPayment.depositDate = this.patientPaymentForm.value.DepositDate.formatted;
    this.patientPayment.amount = Number(this.patientPaymentForm.value.Amount);
    this.patientPayment.patientAccount = this.patientPaymentForm.value.PatientAccount;
    this.patientPayment.checkDate = this.patientPaymentForm.value.CheckDate.formatted;
    this.patientPayment.checkNo = this.patientPaymentForm.value.CheckNo;
    this.patientPayment.prac_code=this.Gv.currentUser.selectedPractice.PracticeCode.toString()
    console.log(this.patientPayment)
    if (this.patientPaymentForm.valid)
      this.API.PostData('/Payments/AddPatientPayment', this.patientPayment, (response) => {
        if (response.Status == "Success") {
          this.toaster.success("Payment Added Successfuly", "Success");
          this.patientPaymentModalRef.hide();
          this.patientPaymentForm.reset();
        }
        else
          this.toaster.error(response.Response, response.Status)
      });
    else
      return;
  }
  getPaymentList() {
    this.API.getData(`/Payments/GetPaymentList`).subscribe(
      data => {
        this.listPaymentTypes = data
        console.log(this.listPaymentTypes)
        this.listPatientPaymentType = this.listPaymentTypes.filter(paymenttype => paymenttype.Meta == "Patient")
        this.listInsurancePaymentType = this.listPaymentTypes.filter(paymenttype => paymenttype.Meta == "Insurance")
        console.log("Insurance", this.listInsurancePaymentType)
        console.log("Patients", this.listPatientPaymentType)
      });
  }

  PaymentType(id: any) {
    let Name: any
    const paymentTypeID = Number(id)
    this.payType = this.listPaymentTypes.filter(k => {
      if (k.Id == paymentTypeID) {
        Name = k.Name
      }
    }
    )
    return Name
  }

  getPatientPayement(payment: any, template: TemplateRef<any>) {
    this.ShowPayBtn = false
    this.showAdv=true
    console.log(payment)
    this.paymentdetail = payment
    this.patientPaymentModalRef = this.modalService.show(template, { class: 'modal-lg',  backdrop : 'static',
    keyboard : false });
    $("#Patient_Name").prop('disabled', true);
    $("#Amount").prop('disabled', true);
    $("#CheckNo").prop('disabled', true);
    $("#PaymentType").prop('disabled', true);
    $("#Facility").prop('disabled', true);


    this.ppf.PatientName.setValue(payment.PatientName)
    this.ppf.Amount.setValue(payment.Amount)
    this.ppf.CheckDate.setValue(this.setDate(payment.CheckDate))
    this.ppf.DepositDate.setValue(this.setDate(payment.DepositDate))
    this.ppf.CheckNo.setValue(payment.CheckNo)
    this.ppf.PaymentType.setValue(payment.PaymentTypeID)
    this.ppf.Facility.setValue(payment.Facility_Name)
  }
  getInsPayement(payment: any, template: TemplateRef<any>) {
    this.showInsBtn = false
    this.showAdv=true
    this.paymentdetail = payment
    console.log(payment)
    this.insurancePaymentModalRef = this.modalService.show(template, { class: 'modal-lg',  backdrop : 'static',
    keyboard : false });
    this.ipf.CheckNo.setValue(payment.CheckNo)
    this.ipf.BatchNo.setValue(payment.BatchNo)
    this.ipf.Amount.setValue(payment.Amount)
    this.ipf.Facility.setValue(payment.Facility_Name)
    this.ipf.PaymentType.setValue(payment.PaymentTypeID)
    this.ipf.Insurance.setValue(payment.Ins_name)
    this.ipf.Note.setValue(payment.Notes)
    this.ipf.DepositDate.setValue(this.setDate(payment.DepositDate))
    this.ipf.CheckDate.setValue(this.setDate(payment.CheckDate))
    this.ipf.EOBDate.setValue(this.setDate(payment.EOBDate))
    this.ipf.ReceivedDate.setValue(this.setDate(payment.ReceivedDate))


  }
  setDate(date: string) {
    if (!Common.isNullOrEmpty(date)) {
      let dDate = new Date(date);
      this.selDateDOB = {
        year: dDate.getFullYear(),
        month: dDate.getMonth() + 1,
        day: dDate.getDate()
      };
    }
  }

}
