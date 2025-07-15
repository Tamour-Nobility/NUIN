import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { claimPayment, EnteredFrom,AutoNotePayment } from '../Classes/claimPayments'
import { IMyDpOptions } from 'mydatepicker';
import { ClaimCharges } from '../Classes/ClaimCharges'
import { PaymentServiceService } from '../../services/payment-service.service';
import { claimInusrance, claimNotes } from '../Classes/ClaimsModel'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { DatePipe } from '@angular/common';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { AlertService } from '../../services/data/Alert.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { APIService } from '../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { EraSummaryDetailsResponse } from '../../../app/era/models/era-claim-details-response.model';
import { Common } from '../../../app/services/common/common';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
    isPayExpand: boolean = false;
    @Input() Amount;
    @Input() paymentDetails
    @Input() chargeDetails;
    @Input() insDetails;
    @Input() PatientCredit;
    @ViewChild(ModalDirective) modalWindow: ModalDirective;
    enteredFromListInsurane: any[];
    isData: boolean = false;
    enteredFromListPatient: EnteredFrom[];
    enteredFromInboxpay: EnteredFrom[];
    tempVariable_P: string = "";
    claimCharges: ClaimCharges[];
    claimInusrance: claimInusrance[];
    chargesUnits: string;
    notGreaterThan: number;
    chargesAmt: any = [];
    isFromposting: boolean;
    data: EraSummaryDetailsResponse;
    eraId: number;
    claimPaymentModel: claimPayment[];
    Dateoptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    isViewMode: boolean;
    enteredFromRefund: EnteredFrom[];
    firstAlert: any;
    isEshaDivision: boolean = false;
    checkhere: boolean = false;
    filteredEnteredFromListPatient: any[] = [];
    filteredEnteredFromListInsurance: any[] = [];
    filteredEnteredFromListRefund: any[] = [];
    isPaymentAvailable: boolean = false;
    careVoyantdisablecheck: boolean = false;
    public claimNotesModel: claimNotes;
    claim_no: number;

  
    constructor(public PC: PaymentServiceService, public datepipe: DatePipe, private alertService: AlertService, public Gv: GvarsService,
        public API: APIService,private toastService: ToastrService,private spinner: NgxSpinnerService
    ) {
        this.claimPaymentModel = [];
        this.claimCharges = [];
        this.claimInusrance = [];
        this.enteredFromListInsurane = [
            { EfId: 1, EfName: "IOU CASH REGISTER" },
            { EfId: 2, EfName: "SUPER BILL" },
            //{ EfId: 3, EfName: "MAZING CHARTS" },
            { EfId: 'ERA', EfName: "ERA – PAYMENT" },
            { EfId: 4, EfName: "EOB" },
            { EfId: 5, EfName: "ERA – PAYMENT" },
            { EfId: 6, EfName: "ERA - REJECTED" },
            { EfId: 7, EfName: "ERA - UNMATCHED" },
            //{ EfId: 8, EfName: "EBCASE" },
            { EfId: 9, EfName: "ALL RESULT" },
            //{ EfId: 10, EfName: "WEBSITE" },
            //{ EfId: 11, EfName: "ARU" },
            //{ EfId: 12, EfName: "RECTIFICATION" },
            { EfId: 13, EfName: "NCO" },
            { EfId: 14, EfName: "PTL FEEDBACK" },
            { EfId: 15, EfName: "SPECIAL INSTRUCTION" },
            { EfId: 16, EfName: "REAL TIME CLAIM STATUS" },
            { EfId: 17, EfName: "PATIENT CALL" },
            { EfId: 18, EfName: "PATIENT PAYMENT" },
            { EfId: 60, EfName: "CareVoyant" }
            //{ EfId: 19, EfName: "MEDICAID SECONDARY" },
            //{ EfId: 20, EfName: "IOU POLICY" },
            //{ EfId: 21, EfName: "FAX" },
            //{ EfId: 22, EfName: "CCI Edits" },
            //{ EfId: 23, EfName: "PROVIDER INSTRUCTIONS ON SSC" },
            //{ EfId: 24, EfName: "PATIENT CREDIT" },
            //{ EfId: 25, EfName: "ESTIMATED CAPITATION" },
            //{ EfId: 26, EfName: "E-MAIL" },
            //{ EfId: 27, EfName: "WEBPT" },
            //{ EfId: 28, EfName: "EMR NOTES" },
            //{ EfId: 29, EfName: "SIGN IN SHEET" },
            //{ EfId: 30, EfName: "PHREESIA" },
            //{ EfId: 31, EfName: "INSURANCE LETTER" },
            //{ EfId: 32, EfName: "STERN ASSOCIATES" },
            //{ EfId: 33, EfName: "EOB FROM WEBSITE" },
            //{ EfId: 34, EfName: "State Law" },
            //{ EfId: 35, EfName: "KPI REJECTION" },
            //{ EfId: 36, EfName: "CRITERION" },
            //{ EfId: 37, EfName: "PROVIDER REMARKS" },
            //{ EfId: 38, EfName: "REAL TIME ELIGIBILITY" },
            //{ EfId: 39, EfName: "CAPITATION" },
            //{ EfId: 40, EfName: "PATIENT PAID IN OFFICE" },
            //{ EfId: 41, EfName: "THEOS" },
            //{ EfId: 42, EfName: "DECEASED PATIENT" },
            //{ EfId: 43, EfName: "PATIENT PAID AT THE TIME OF VISIT" },
            //{ EfId: 44, EfName: "PATIENT PAID AFTER GETTING STATEMENT" },
            //{ EfId: 45, EfName: "PROVIDER ADJUSTMENT" }
            //{ EfId: 46, EfName: "PRIVATE PAY" }
        ];
        this.enteredFromListPatient = [
            { EfId: 40, EfName: "PATIENT PAID IN OFFICE" },
            { EfId: 43, EfName: "PATIENT PAID AT THE TIME OF VISIT" },
            { EfId: 44, EfName: "PATIENT PAID AFTER GETTING STATEMENT" },
            { EfId: 60, EfName: "CareVoyant" }
        ];

        this.enteredFromInboxpay = [
            { EfId: 40, EfName: "Inbox interface Payment" },

        ];
        this.enteredFromRefund = [
            {
                EfId: 50, EfName: "Patient Refund"
            },
            { EfId: 60, EfName: "CareVoyant" }
        ];
        this.claimNotesModel = new claimNotes;
    }

    ngOnInit() {
        debugger
        this.getpaymentmodule();
        this.carevoyantstatusfordivision();
        this.updateFilteredList();
        this.updateFilteredListinsurance();
        this.updateFilteredListRefund();

        if (this.paymentDetails != null || this.paymentDetails !== undefined) {
            this.claimPaymentModel = this.paymentDetails;
        }
        if (this.chargeDetails != null || this.chargeDetails != undefined) {
            this.claimCharges = this.chargeDetails;

        }
        if (this.insDetails != null || this.insDetails != undefined) {
            this.claimInusrance = this.insDetails;

        }
        if (this.insDetails != null || this.insDetails != undefined) {
            if (this.Amount == 'edit') {
                this.isFromposting = true
            } else {
                this.isFromposting = false
            }
        }



        this.PC.message.subscribe(
            mess => {
                if (mess == 'sentdata') {
                    this.PC.sendData(this.claimPaymentModel)
                }
            }
        )
    }
    updateFilteredList() {
        if (this.isEshaDivision) {
            this.filteredEnteredFromListPatient = this.enteredFromListPatient;
        }
        else {
            this.filteredEnteredFromListPatient = this.enteredFromListPatient.filter(item => item.EfId !== 60);
        }
    }

    updateFilteredListinsurance() {
        debugger
        if (this.isEshaDivision) {
            this.filteredEnteredFromListInsurance = this.enteredFromListInsurane;
        }
        else {
            this.filteredEnteredFromListInsurance = this.enteredFromListInsurane.filter(item => item.EfId !== 60);
        }
    }
    updateFilteredListRefund() {
        if (this.isEshaDivision) {
            this.filteredEnteredFromListRefund = this.enteredFromRefund;
        }
        else {
            this.filteredEnteredFromListRefund = this.enteredFromRefund.filter(item => item.EfId !== 60);
        }
    }
    callShow() {
        this.alertService.getAlert().subscribe((data) => {
            if (data.Status === 'Success' && data.Response && data.Response.length > 0) {
                this.firstAlert = data.Response[0];
                console.log('Received alert data:', this.firstAlert);
                console.log('this.firstAlert.AddNewPayment', this.firstAlert.AddNewPayment);
                if (this.isAlertNotExpired()) {
                    if (
                        this.firstAlert.ApplicableFor == 'S' &&
                        this.Gv.currentUser.userId == this.firstAlert.Created_By &&
                        this.firstAlert.AddNewPayment === true
                    ) {
                        this.show();
                    } else if (this.firstAlert.ApplicableFor == 'A' && this.firstAlert.AddNewPayment === true) {
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




    public myDatePicker: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy',
        height: '25px',
        width: '93%',
    };
    NewRowPayments(event: KeyboardEvent, ndx: number) {
        debugger;
        if (event.keyCode == 40) {
            let claimPaymentLength = 0;
            for (var notDel = 0; notDel < this.claimPaymentModel.length; notDel++) {
                if (!this.claimPaymentModel[notDel].claimPayments.Deleted)
                    claimPaymentLength++;
            }
            let rowFlag: number = -1;
            var element = $("#payments-section table tbody tr:visible");
            if (claimPaymentLength - 1 > ndx) {
                var input = $($(element)[ndx]).find(":focus").is("input");
                if (input) {
                    $($($(element[ndx + 1]).find("select"))[0]).focus();
                    return;
                }
            }
            for (var i = 0; i < element.length - 1; i++) {
                var hasfocus = $($(element)[i]).find(":focus").length;
                var isInput = $($(element)[i]).find(":focus").is("input");
                if (hasfocus > 0 && isInput) {
                    if (claimPaymentLength <= ndx + 1 && (this.claimPaymentModel[ndx] != null && this.claimPaymentModel[ndx].claimPayments.Payment_Source != "" && this.claimPaymentModel[ndx].claimPayments.Payment_Source != undefined && this.claimPaymentModel[ndx].claimPayments.Payment_Source != null && this.claimPaymentModel[ndx].claimPayments.Payment_Source != undefined)) {
                        this.AddNewPayment();
                        rowFlag = i;
                    }
                    else
                        $($($(element[i + 1]).find("select"))[0]).focus();
                }
            }
            if (rowFlag > -1) {
                setTimeout(function () {
                    $($($($("#payments-section table tbody tr:visible")[rowFlag + 1]).find("select"))[0]).focus();
                }, 200);
            }
        }
    }
    // Added by Pir Ubaid (USER STORY 204 : NPM ALERT )
    show() {
        //set the modal body static.will close on click OK or Cross
        const modalOptions: ModalOptions = {
            backdrop: 'static'
        };
        this.modalWindow.config = modalOptions;
        this.modalWindow.show();
    }

    hide() {
        this.modalWindow.hide();
    }

    AddNewPayment() {
        debugger;
        let canCreateRow = false;
        if (this.claimPaymentModel.length <= 0)
            canCreateRow = true;
        let deleted = 0;
        if (this.claimPaymentModel.filter(del => del.claimPayments.Deleted == false).length > 0) {
            if (this.claimPaymentModel.length > 0) {
                for (var check = this.claimPaymentModel.length; check > 0; check--) {
                    if (!this.claimPaymentModel[check - 1].claimPayments.Deleted && (this.claimPaymentModel[check - 1].claimPayments.Payment_Source != null && this.claimPaymentModel[check - 1].claimPayments.Payment_Source != undefined && this.claimPaymentModel[check - 1].claimPayments.Payment_Source != "")) {
                        canCreateRow = true;
                        break;
                    }
                    else {
                        if (!this.claimPaymentModel[check - 1].claimPayments.Deleted && (this.claimPaymentModel[check - 1].claimPayments.Payment_Source != null || this.claimPaymentModel[check - 1].claimPayments.Payment_Source != undefined || this.claimPaymentModel[check - 1].claimPayments.Payment_Source != "")) {
                            canCreateRow = false;
                            break;
                        }
                    }
                }
            }
        }
        else
            canCreateRow = true;
        if (canCreateRow) {
            var cp = new claimPayment();
            //cp.canDelete = true;
            cp.claimPayments.Deleted = false;
            cp.claimPayments.claim_payments_id = 0;
            cp.claimPayments.Claim_No = 355139;
            cp.claimPayments.Payment_No = 0;
            cp.claimPayments.Deleted = false;
            cp.claimPayments.T_payment_id=null;
            cp.claimPayments.Date_Entry = (new Date()).toLocaleDateString('en-US');
            if (this.paymentDetails != null || this.paymentDetails !== undefined) {
                this.isFromposting = true
            } else {
                this.isFromposting = false
            }
            // if (GlobalVariables.DepositSlipIDGlobal != null && GlobalVariables.DepositSlipIDGlobal != undefined) {
            //     cp.DEPOSITSLIP_ID = GlobalVariables.DepositSlipIDGlobal.toString();
            //     cp.PaymentType = GlobalVariables.PaymentMethodGlobal;
            //     cp.EnteredFrom = GlobalVariables.PaySourceGlobal;
            //     cp.FillingDate = GlobalVariables.PaymentDateGlobal;
            //     cp.Batch_No = GlobalVariables.BatchNoGlobal;
            //     cp.Batch_date = GlobalVariables.BatchDateGlobal;
            //     cp.ChequeNo = GlobalVariables.CheckNoGlobal;
            // }
            this.claimPaymentModel.push(cp);
            //alert(this.claimPayments.length);
            let setIndex = -1;
            if (this.claimPaymentModel.length > 1) {
                for (var k = 0; k < this.claimPaymentModel.length; k++) {
                    if (this.claimPaymentModel[k].claimPayments.Deleted != true) {
                        setIndex++;
                    }
                }
            }
            else
                setIndex = 0;
            //this.claimPayments[k].SerialNo = setIndex + 1;
            cp.claimPayments.Sequence_No = (setIndex + 1).toString();// (this.claimPayments.length).toString();


        }
    }
    calculateAdjustedAmount(ndx: number, event: any) {
        let selectedValues = event.split(" ");
        let selectedProcedureCode = selectedValues[0];
        let selectedchargeId= selectedValues[1]
        let selectedDosFrom = selectedValues[2];
        let selectedDosTo = selectedValues[3];

        if (selectedProcedureCode != undefined && selectedProcedureCode != null) {
            debugger
            const listCharges = this.claimCharges.filter(x => x.claimCharges.Procedure_Code == selectedProcedureCode&& x.claimCharges.claim_charges_id==selectedchargeId);
            if (listCharges.length > 0) {
                listCharges.forEach(element => {
                    if (element.claimCharges.Dos_From == selectedDosFrom && element.claimCharges.Dos_To == selectedDosTo && element.claimCharges.Procedure_Code == selectedProcedureCode) {
                        console.log("listCharges", element)
                        //condition 1 
                        this.chargesAmt[ndx] = element.claimCharges.Amount;
                        console.log("this.chargesAmt[ndx] = listCharges[0].claimCharges.Amount; ", this.chargesAmt[ndx])
                        this.claimPaymentModel[ndx].claimPayments.Units = element.claimCharges.Units.toString();
                        this.claimPaymentModel[ndx].claimPayments.Paid_Proc_Code = element.claimCharges.Procedure_Code;

                        this.claimPaymentModel[ndx].claimPayments.DOS_From = this.datepipe.transform(element.claimCharges.Dos_From, 'MM/dd/yyyy');
                       this.claimPaymentModel[ndx].claimPayments.MODI_CODE1=element.claimCharges.Modi_Code1
                       this.claimPaymentModel[ndx].claimPayments.Alternate_Code=element.claimCharges.Alternate_Code
                        //  this.claimViewModel.claimCharges[x].claimCharges.Dos_From = this.datepipe.transform(this.claimViewModel.claimCharges[x].claimCharges.Dos_From, 'MM/dd/yyyy');
                        this.claimPaymentModel[ndx].claimPayments.Dos_To = element.claimCharges.Dos_To;

                        this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = element.claimCharges.Amount;
                        console.log("Element amnt: ", element.claimCharges.Amount);
                        this.claimPaymentModel[ndx].claimPayments.Units = element.claimCharges.Units.toString();
                        // this.claimPaymentModel[ndx].claimPayments.Paid_Proc_Code = element.claimCharges.Procedure_Code;
                        if (this.claimPaymentModel[ndx].claimPayments.Payment_Source == "1" || this.claimPaymentModel[ndx].claimPayments.Payment_Source == "2" || this.claimPaymentModel[ndx].claimPayments.Payment_Source == "3") {
                            this.claimPaymentModel[ndx].claimPayments.MODI_CODE1 = element.claimCharges.Modi_Code1;
                            this.claimPaymentModel[ndx].claimPayments.MODI_CODE2 = element.claimCharges.Modi_Code2;
                        }
                        // this.claimPaymentModel[ndx].claimPayments.MODI_CODE1 = element.claimCharges.Modi_Code1;
                        // this.claimPaymentModel[ndx].claimPayments.MODI_CODE2 = element.claimCharges.Modi_Code2;

                        var charges = this.chargesAmt[ndx];
                        debugger
                        console.log("charges :", charges)

                        if (this.claimPaymentModel[ndx].claimPayments.Amount_Approved != null && this.claimPaymentModel[ndx].claimPayments.Amount_Approved != undefined) {

                            if (charges == null || charges == undefined || charges == "")
                                charges = "0.00";
                            this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = (parseFloat(charges) - this.claimPaymentModel[ndx].claimPayments.Amount_Approved).toString();
                            this.claimPaymentModel[ndx].claimPayments.Units = element.claimCharges.Units.toString();
                        }
                        if (this.claimPaymentModel[ndx].claimPayments.Payment_Source == 'Q' || this.claimPaymentModel[ndx].claimPayments.Payment_Source == 'O') {
                            this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = null;
                        }
                        else {
                            this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = charges;
                        }
                    }
                });
            }
        }
        if (this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code != undefined && this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code != null) {
            var listCharges = this.claimCharges.filter(x => x.claimCharges.Procedure_Code == this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code);
            if (listCharges.length > 0) {
                this.chargesAmt[ndx] = listCharges[0].claimCharges.Amount;
                this.claimPaymentModel[ndx].claimPayments.Units = listCharges[0].claimCharges.Units.toString();
                this.claimPaymentModel[ndx].claimPayments.Paid_Proc_Code = listCharges[0].claimCharges.Procedure_Code;

                if (this.claimPaymentModel[ndx].claimPayments.Payment_Source == "1" || this.claimPaymentModel[ndx].claimPayments.Payment_Source == "2" || this.claimPaymentModel[ndx].claimPayments.Payment_Source == "3") {
                    this.claimPaymentModel[ndx].claimPayments.MODI_CODE1 = listCharges[0].claimCharges.Modi_Code1;
                    this.claimPaymentModel[ndx].claimPayments.MODI_CODE2 = listCharges[0].claimCharges.Modi_Code2;
                }

                var charges = this.chargesAmt[ndx];
                if (this.claimPaymentModel[ndx].claimPayments.Amount_Approved != null && this.claimPaymentModel[ndx].claimPayments.Amount_Approved != undefined) {

                    if (charges == null || charges == undefined || charges == "")
                        charges = "0.00";
                    this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = (parseFloat(charges) - this.claimPaymentModel[ndx].claimPayments.Amount_Approved).toString();
                    this.claimPaymentModel[ndx].claimPayments.Units = listCharges[0].claimCharges.Units.toString();
                }
                else {
                    this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = charges;
                }

            }
        }
        //  let index: number = event.target["selectedIndex"];
        // this.chargesAmt[ndx] = this.claimCharges[index].claimCharges.Amount;
        // this.claimPaymentModel[ndx].claimPayments.Units = this.claimCharges[index].claimCharges.Units.toString();
        // this.claimPaymentModel[ndx].claimPayments.Paid_Proc_Code = this.claimCharges[index].claimCharges.Procedure_Code;
        // if (this.claimPaymentModel[ndx].claimPayments.Payment_Source == "1" || this.claimPaymentModel[ndx].claimPayments.Payment_Source == "2" || this.claimPaymentModel[ndx].claimPayments.Payment_Source == "3") {
        //this.claimPaymentModel[ndx].claimPayments.MODI_CODE1 = this.claimCharges[index].claimCharges.Modi_Code1;
        //  this.claimPaymentModel[ndx].claimPayments.MODI_CODE2 = this.claimCharges[index].claimCharges.Modi_Code2;
        //}

        // var charges = this.chargesAmt[ndx];
        // if (this.claimPaymentModel[ndx].claimPayments.Amount_Approved != null && this.claimPaymentModel[ndx].claimPayments.Amount_Approved != "" && this.claimPaymentModel[ndx].claimPayments.Amount_Approved != undefined) {

        //     if (charges == null || charges == undefined || charges == "")
        //         charges = "0.00";
        //     this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = (parseFloat(charges) - parseFloat(this.claimPaymentModel[ndx].claimPayments.Amount_Approved)).toString();
        //     this.claimPaymentModel[ndx].claimPayments.Units = this.claimCharges[ndx].claimCharges.Units.toString();
        // }
        // else {
        //     this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = charges;
        // }
        debugger
        //added by sami for Patient Payment Enhancement
        if (selectedProcedureCode === "") {
            this.claimPaymentModel[ndx].claimPayments.Units = null
            this.claimPaymentModel[ndx].claimPayments.Paid_Proc_Code = null
            this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code = null
            this.claimPaymentModel[ndx].claimPayments.DOS_From = null
            this.claimPaymentModel[ndx].claimPayments.Dos_To = null
        }


        debugger
        this.checkPaidCharges(ndx);
        debugger
        //added by sami for Patient Payment Enhancement
        if (this.claimPaymentModel[ndx].claimPayments.Payment_Source === 'P'||this.claimPaymentModel[ndx].claimPayments.Payment_Source === 'T') {
            this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = null;


        }
    }

    calculateAdjustedAmount_Approved(ndx: number) {
        if (this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code != undefined && this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code != null) {
            var listCharges = this.claimCharges.filter(x => x.claimCharges.Procedure_Code == this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code);
            if (listCharges.length > 0) {
                this.claimPaymentModel[ndx].claimPayments.Units = listCharges[0].claimCharges.Units.toString();
                this.claimPaymentModel[ndx].claimPayments.Paid_Proc_Code = listCharges[0].claimCharges.Procedure_Code;
            }
        }
        //let index = ndx;
        if (this.claimPaymentModel[ndx].claimPayments.Amount_Approved != null && this.claimPaymentModel[ndx].claimPayments.Amount_Approved != undefined) {
            let a = this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted;
            let b = this.claimPaymentModel[ndx].claimPayments.Amount_Approved

            let data = parseFloat(a) - b;
            var charges = this.chargesAmt[ndx];
            if (charges == null || charges == undefined || charges == "")
                charges = 0.00;
            const formatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            let adjAmt = parseFloat(charges) - this.claimPaymentModel[ndx].claimPayments.Amount_Approved;
            this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = formatter.format(adjAmt);
            // this.claimPaymentModel[ndx].claimPayments.Units = this.claimCharges[ndx].claimCharges.Units.toString();
            let rejAmt = this.claimPaymentModel[ndx].claimPayments.Amount_Approved - this.claimPaymentModel[ndx].claimPayments.Amount_Paid;
            this.claimPaymentModel[ndx].claimPayments.Reject_Amount = parseFloat(formatter.format(rejAmt));
            if (this.claimPaymentModel[ndx].claimPayments.Reject_Amount.toString() == "NaN") {
                this.claimPaymentModel[ndx].claimPayments.Reject_Amount = 0;
            }
        }
        this.checkPaidCharges(ndx);
    }

    AmountPaidChange(event: KeyboardEvent, ndx: number) {
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    
    
        let inputvalue = (event.target as HTMLInputElement).value;
        let enteredAmount = inputvalue === "" ? 0 : parseFloat(inputvalue);
    
        const payment = this.claimPaymentModel[ndx].claimPayments;
        const paymentSource = payment.Payment_Source;
    

    
        // Validate individual 'T', 'Q', 'O' entries
        if ((paymentSource === 'Q' || paymentSource === 'O') && enteredAmount > -1) {
            swal('Error', "Amount paid cannot be greater than 0", 'error');
            payment.Amount_Paid = null;
            return;
        }
        if (paymentSource === 'T' && (isNaN(enteredAmount) || enteredAmount >= 0)) {
            swal('Failed', "Amt. Paid is required. Please enter a negative amount", 'error');
            payment.Amount_Paid = null;
            payment.Amount_Paid = null;
            return;
        }
    
        // Calculate sum of 'T' payments where Claim_Payment_Id === 0, excluding current one
        let totalTPayments = this.claimPaymentModel.reduce((sum, item, index) => {
            const p = item.claimPayments;
            if (
                p.Payment_Source === 'T' &&
                p.claim_payments_id === 0 &&
                index !== ndx &&
                !isNaN(p.Amount_Paid)
            ) {
                return sum + p.Amount_Paid;
            }
            return sum;
        }, 0);
    
        // Add current enteredAmount
        if (paymentSource === 'T' && payment.claim_payments_id === 0) {
            totalTPayments += enteredAmount;
    
            if (totalTPayments < this.PatientCredit) {
                swal('Failed', "Please enter an amount Amt. Paid equal to or less than the Patient Credit balance", 'error');
                payment.Amount_Paid = null;
                return;
            }
        }
    
        payment.Amount_Paid = enteredAmount;
    
        // Calculate reject amount
        let diff = payment.Amount_Approved - payment.Amount_Paid;
        payment.Reject_Amount = parseFloat(formatter.format(diff));
        if (isNaN(payment.Reject_Amount)) {
            payment.Reject_Amount = 0;
        }
    
        if (paymentSource === 'Q' || paymentSource === 'O') {
            payment.Reject_Amount = 0;
    
        if (paymentSource === 'Q' || paymentSource === 'O') {
            payment.Reject_Amount = 0;
        }
    
    
        this.checkPaidCharges(ndx);
    }
    
    

    }


    checkPaidCharges(ndx: number) {
        debugger;
        var listCharges = this.claimCharges.filter(x => x.claimCharges.Procedure_Code == this.claimPaymentModel[ndx].claimPayments.Charged_Proc_Code);
        if (listCharges.length > 0) {
            this.chargesAmt[ndx] = listCharges[0].claimCharges.Amount;
            this.claimPaymentModel[ndx].claimPayments.Units = listCharges[0].claimCharges.Units.toString();
            this.claimPaymentModel[ndx].claimPayments.Paid_Proc_Code = listCharges[0].claimCharges.Procedure_Code;
            var charges = this.chargesAmt[ndx];
        }
        // Bug ID 406 
        //Added By Hamza Akhlaq For CareVoyant
        if (this.claimPaymentModel[ndx].claimPayments.ENTERED_FROM != "60") {
            if (this.claimPaymentModel[ndx].claimPayments.Amount_Paid > parseFloat(charges)) {
                this.claimPaymentModel[ndx].claimPayments.Amount_Paid = 0;
                this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = "0";
                swal('Failed', "Amount paid can't be greater than charges.", 'error');
            }
        }
        if (this.claimPaymentModel[ndx].claimPayments.Amount_Approved > parseFloat(charges)) {
            this.claimPaymentModel[ndx].claimPayments.Amount_Approved = 0;
            this.claimPaymentModel[ndx].claimPayments.Amount_Adjusted = "0";
            this.claimPaymentModel[ndx].claimPayments.Amount_Paid = 0;
            swal('Failed', "Amount approved can't be greater than charges.", 'error');
        }


        if (this.claimPaymentModel[ndx].claimPayments.Payment_Source !== 'P') {
            //Added By Hamza Akhlaq For CareVoyant
            if (this.claimPaymentModel[ndx].claimPayments.ENTERED_FROM != "60") {
                if (+this.claimPaymentModel[ndx].claimPayments.Amount_Paid > +this.claimPaymentModel[ndx].claimPayments.Amount_Approved) {
                    this.claimPaymentModel[ndx].claimPayments.Amount_Paid = 0;
                    swal('Failed', "Amount paid can't be greater than amount approved.", 'error');
                }
            }
        }
    }

    Tooltip(name: number, index: number) {
        if (index == undefined) {
            index = 0;
        }
        this.tempVariable_P = $.trim($($("select[name='" + name + "']")[index]).find("option:selected").text());
    }

    DeletePayment(ndx: number) {
       if(this.claimPaymentModel[ndx].claimPayments.Payment_Source=="T"&&this.claimPaymentModel[ndx].claimPayments.claim_payments_id > 0){
        this.DeleteTCBPayment(ndx);
        return
       }
        if (this.claimPaymentModel[ndx].claimPayments.claim_payments_id == 0) {
            this.claimPaymentModel.splice(ndx, 1);
            if (this.paymentDetails != null || this.paymentDetails !== undefined) {
                this.isFromposting = false;
            } else {
                this.isFromposting = false
            }
            return;
        }
        

        if ((new Date(this.claimPaymentModel[ndx].claimPayments.Date_Entry).getMonth() == new Date().getMonth())
            &&
            (new Date(this.claimPaymentModel[ndx].claimPayments.Date_Entry).getFullYear() == new Date().getFullYear())) {
            let setIndex = 0;
            this.claimPaymentModel[ndx].claimPayments.Deleted = true;

            if (this.claimPaymentModel.length > 1 && ndx != this.claimPaymentModel.length - 1) {
                for (var k = 0; k < this.claimPaymentModel.length; k++) {
                    if (this.claimPaymentModel[k].claimPayments.Deleted != true) {
                        setIndex++;
                        this.claimPaymentModel[k].claimPayments.Sequence_No = setIndex.toString();
                    }
                }
            }
            else {
                this.claimPaymentModel[ndx].claimPayments.Deleted = true;
                if (this.claimPaymentModel.length > 1 && ndx != this.claimPaymentModel.length - 1) {
                    for (var k = 0; k < this.claimPaymentModel.length; k++) {
                        if (this.claimPaymentModel[k].claimPayments.Deleted != true) {
                            setIndex++;
                            this.claimPaymentModel[k].claimPayments.Sequence_No = setIndex.toString();
                        }
                    }
                }
            }
        }
        else {
            swal('Failed', "Cannot delete entry of previous month(s)", 'error');
        }

    }
    DeleteTCBPayment(ndx: number) {
        const payment = this.claimPaymentModel[ndx].claimPayments;
      
        if (payment.claim_payments_id > 0 && payment.Payment_Source === "T") {
          
              swal({
                title: 'Confirmation',
                text: "This will delete the Transfer Balance credit entry from this claim and the associated claim. Are you sure you want to delete this entry?", 
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes!',
                cancelButtonText: 'No'
              }).then((result) => {
                debugger
                if (result) {
                    payment.Deleted=true;
                }
              }).catch((dismiss) => 
    {
                if (dismiss === 'cancel') {
                    payment.Deleted=false;
                }
              });
          
          
        }
      }
    PaymentSourceSelectionChangeEvent(ndx: number) {
        console.log(this.claimPaymentModel[ndx].claimPayments.Payment_Source, 'payment source write here')
        for (var i = 0; i < this.claimInusrance.length; i++) {

            if (this.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "P" && this.claimPaymentModel[ndx].claimPayments.Payment_Source == "1") {
                this.claimPaymentModel[ndx].InsurancePayerName = this.claimInusrance[i].InsurancePayerName;
                this.claimPaymentModel[ndx].claimPayments.Insurance_Id = this.claimInusrance[i].claimInsurance.Insurance_Id;
                break;
            } else if (this.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "S" && this.claimPaymentModel[ndx].claimPayments.Payment_Source == "2") {
                this.claimPaymentModel[ndx].InsurancePayerName = this.claimInusrance[i].InsurancePayerName;
                this.claimPaymentModel[ndx].claimPayments.Insurance_Id = this.claimInusrance[i].claimInsurance.Insurance_Id;
                break;
            } else if (this.claimInusrance[i].claimInsurance.Pri_Sec_Oth_Type == "O" && this.claimPaymentModel[ndx].claimPayments.Payment_Source == "3") {
                this.claimPaymentModel[ndx].InsurancePayerName = this.claimInusrance[i].InsurancePayerName;
                this.claimPaymentModel[ndx].claimPayments.Insurance_Id = this.claimInusrance[i].claimInsurance.Insurance_Id;
                break;
            } else {
                this.claimPaymentModel[ndx].InsurancePayerName = "";
                this.claimPaymentModel[ndx].claimPayments.Insurance_Id = null;
            }
        }
    }

    payExpand() {
        this.isPayExpand = !this.isPayExpand;
    }

    validateDateFormat(dt: string, Type: string, ndx: number, event: KeyboardEvent = null) {
        if (event.keyCode == 8 || event.keyCode == 46)
            return;
        if (dt == undefined || dt == null)
            return;
        if (dt.length == 2 || dt.length == 5) {
            if (Type == "BatchDate")
                this.claimPaymentModel[ndx].claimPayments.BATCH_DATE = dt + "/";
            else if (Type == "FilingDate")
                this.claimPaymentModel[ndx].claimPayments.Date_Filing = dt + "/";
            else if (Type == "DepositDate")
                this.claimPaymentModel[ndx].claimPayments.DepositDate = dt + "/";
        }
    }
    getpaymentmodule() {
        const menuList = this.Gv.currentUser.Menu;
        const isPaymentMenuAvailable = menuList.some((menu: string) => menu.toLowerCase() === 'carevoyantpayment');
        this.isPaymentAvailable = isPaymentMenuAvailable; // Set this to true or false
    }
    validateDateEntry(dateValue: string, ndx): void {
        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/; // MM/DD/YYYY format
        // Invalid Date Format
        if (!dateRegex.test(dateValue)) {
            swal({
                title: 'Confirmation',
                text: "Invalid date format. Please use MM/DD/YYYY.",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            }).then(() => {
                this.claimPaymentModel[ndx].claimPayments.Date_Entry = '';
            });
            return;
        }
        const today = new Date();
        const enteredDate = new Date(dateValue);
        if (enteredDate > today) {
            swal({
                title: 'Confirmation',
                text: "Future dates are not allowed in Entry Date field.Please select a date on or before current date",
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            }).then(() => {
                this.claimPaymentModel[ndx].claimPayments.Date_Entry = ''
            });
            return;
        }
        this.AddNotesForCareVoyant(ndx);
    }
    carevoyantstatusfordivision() {
        const roleList = this.Gv.currentUser.selectedPractice;
        if (roleList.PracticeCode != null) {
            if (roleList.Division == 2) {
                this.isEshaDivision = true
            }
        }
    }
    AddNotesForCareVoyant(ndx: any) {
        const userid = this.Gv.currentUser.RolesAndRights[0].UserId;
        const username = this.Gv.currentUser.RolesAndRights[0].UserName;
        const entrydate = this.claimPaymentModel[ndx].claimPayments.Date_Entry;
        const currentDate = new Date();
        const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
        let value = `Entry date in Payment section has been modified from Current Date ${formattedDate} to ${entrydate} BY User ${userid}`;
        this.claimNotesModel.Response.Note_Detail = value
        this.claimNotesModel.Response.IsAuto_Note= true
        this.claimNotesModel.Response.Claim_No = this.claimCharges[0].claimCharges.Claim_No;
        this.API.PostData('/Demographic/SaveClaimNotes/', this.claimNotesModel.Response, (d) => {
            if (d.Status == "Sucess") {
                return;
            }
        })

    }
    viewERA(checkNo: number) {
        if(checkNo != null)
        {
            this.claim_no = this.claimCharges[0].claimCharges.Claim_No
        // this.claim_no = 35510325;
        // checkNo = 214131209;
        this.data = new EraSummaryDetailsResponse();
        
            this.data.era = null;
            if (!Common.isNullOrEmpty(this.claim_no)) {
            //   this.API.PostData('/Submission/ViewClaimERA', { claimno: this.claim_no }, (res) => {
                this.API.getData('/Submission/ViewClaimERA?claimno=' + this.claim_no + '&check_No=' + checkNo).subscribe(
                    res => {
                        if (res.Status == "success") {
                            this.data = res.Response;
                            this.isData = true;
                            $('#claimEraView').modal('show');
                        }
                else if (res.Status === 'Error')
                  this.toastService.error('Provided Check Number is not valid', 'Invalid Check Number');
                else
                  this.toastService.error('An error occurred', 'Error');
             

            });
            } else {
              this.toastService.error('Invalid ERA Id');
            }
        }
        else 
        swal('Error', "Check number cannot be null", 'error');
        // ($('#claimDetailModal') as any).modal('show');
    }
    closeModal() {
        ($('#claimEraView') as any).modal('hide');
    }
    downloadPDF() {
        this.spinner.show();
        setTimeout(() => {
            const element = document.getElementById('Report');
            if (!element) {
                console.error('Element not found: Unable to generate PDF');
                this.spinner.hide();
                return;
            }
    
            const options = {
                margin: [10, 12, 10, 10], 
                filename: 'claim-era-view.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2, 
                    scrollY: -window.scrollY, 
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
            };
            html2pdf()
                .from(element)
                .set(options)
                .save()
                .then(() => {
                    this.spinner.hide();
                    console.log('PDF generated and downloaded successfully!');
                })
                .catch((error) => {
                    console.error('Error generating PDF:', error);
                    this.spinner.hide();
                });
        }, 50);
    }
    
    
    
    
    
    //below code is working fine as per img pdf conversion
    //  downloadPDF() {
    //     this.spinner.show();
    //         // Target the content you want to convert to PDF
    //         const element = document.getElementById('Report'); // Get the HTML content inside the modal
            
    //         if (element) {
    //             const options = {
    //                 margin: [10, 12, 10, 10],  // Top, Right, Bottom, Left margins
    //                 filename: 'claim-era-view.pdf',
    //                 image: { type: 'jpeg', quality: 0.98 },
    //                 html2canvas: {
    //                   scale: 2,  // Adjust scaling if necessary
    //                   x: 0,
    //                   y: 0,
    //                   scrollY: -window.scrollY,  // Handle page scrolling, if applicable
    //                 },
    //                 jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }  // A4 size
    //               };
        
    //           // Generate the PDF
    //           html2pdf().from(element).set(options).save();
    //           this.spinner.hide();
    //         }
    //         this.downloadPDF2();
    //     }
        //upper code is working fine as per img pdf conversion
        //below code needs some layout customizaation
        // downloadPDF() {
        //     debugger
        //     const fieldsToPrint = [
        //         'PAYERNAME',
        //         'PAYERADDRESS',
        //         'PAYEENAME',
        //         'PAYEEADDRRESS',
        //         'Provider_',
        //         'CHECKNUMBER',
        //         'GRPNPI',
        //         'CHECKDATE',
        //         'CHECKAMOUNT',
        //         'ProviderAdjAmt'
        //       ];
        //     const doc = new jsPDF();
        //     let yPosition = 10;
        
        //     // If the data exists, start adding text to the PDF
        //     if (this.data) {
        //       doc.setFontSize(12);
              
        //       if (this.data.era) {
        //         doc.text('ERA Details:', 10, yPosition);
        //         yPosition += 10;
          
        //         // Assuming 'era' has properties like ERAID, PAYMENTMETHOD, TRANHADLINGCODE, etc.
        //         for (let key in this.data.era) {
        //             debugger
        //             fieldsToPrint.forEach(field => {
        //                 let value = this.data.era[0][field];
                  
        //                 // Format Date fields (e.g., CHECKDATE)
        //                 if (value instanceof Date) {
        //                   value = value.toLocaleDateString(); // You can customize the date format here
        //                 }
                  
        //                 // Handle null or undefined values gracefully
        //                 if (value == null) {
        //                   value = 'N/A';  // Or you can leave it as an empty string
        //                 }
                  
        //                 // Format currency values if necessary (e.g., CHECKAMOUNT, ProviderAdjAmt)
        //                 if (field === 'CHECKAMOUNT' || field === 'ProviderAdjAmt') {
        //                   value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        //                 }
                  
        //                 // Print the field name and value in the PDF
        //                 doc.text(`${field}: ${value}`, 10, yPosition);
        //                 yPosition += 10;
                  
        //                 // Adjust vertical position for each field
        //                 if (yPosition > 270) {  // Prevents overflow (last line before page break)
        //                   doc.addPage();
        //                   yPosition = 10;
        //                 }
        //               });
        //             break;
        //         }
        //       }
        //     }
        
        //     // Save the generated PDF
        //     doc.save('generated-file.pdf');
        //   }
          //upper code needs some layout customizaation
          
          downloadPDF2() {
            const doc = new jsPDF();
            let yPosition = 20; // Start Y position
            const lineHeight = 10; // Height between rows
            const sectionGap = 15; // Gap between sections
          
            // Fonts and Styles
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
          
            // Header
            doc.text("Check Information", 10, yPosition);
            yPosition += sectionGap;
          
            if (this.data && this.data.era && this.data.era[0]) {
              const eraData = this.data.era[0]; // Assuming we're processing the first object
          
              // SECTION 1: Left-Aligned Without Labels
              const leftAlignedFields = [
                eraData.PAYERNAME || "",
                eraData.PAYERADDRESS || "",
                eraData.PAYEENAME || "",
                eraData.PAYEEADDRRESS || "",
              ];
          
              leftAlignedFields.forEach((value) => {
                doc.text(value, 10, yPosition); // Left-align values
                yPosition += lineHeight;
              });
          
              const section2StartY = yPosition + sectionGap; // Save the Y position for Section 2
          
              // SECTION 2: Left-Aligned With Labels
              const leftLabeledFields = [
                { label: "EFT #", value: eraData.CHECKNUMBER || "N/A" },
                {
                  label: "Check Date",
                  value: eraData.CHECKDATE
                    ? new Date(eraData.CHECKDATE).toLocaleDateString("en-US")
                    : "N/A",
                },
                {
                  label: "Check Amount",
                  value: eraData.CHECKAMOUNT
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(eraData.CHECKAMOUNT)
                    : "N/A",
                },
              ];
          
              leftLabeledFields.forEach((field) => {
                doc.text(`${field.label}:`, 10, yPosition); // Label
                doc.text(field.value, 50, yPosition); // Value, aligned after label
                yPosition += lineHeight;
              });
          
              // Reset the yPosition for Section 3 to align it horizontally with Section 2
              yPosition = section2StartY - 15;
          
              // SECTION 3: Right-Aligned With Labels
              const rightLabeledFields = [
                { label: "Provider #", value: eraData.Provider_ },
                { label: "Provider Tax ID #", value: eraData.ProviderTaxID_ },
                { label: "NPI / Group Provider Number", value: eraData.GRPNPI },
              ];
          
              const labelX = 100; // X position for label
              const valueX = 150; // X position for value
          
              rightLabeledFields.forEach((field) => {
                doc.text(`${field.label}:`, labelX, yPosition); // Right-aligned label
                doc.text(field.value, valueX, yPosition); // Value aligned to label
                yPosition += lineHeight;
              });
          
              // SECTION 4: New Section - Claim Information
              if (this.data.eraClaims && this.data.eraClaims.length > 0)
              {

                yPosition += sectionGap; // Add spacing before the new section
                doc.setFont("helvetica", "bold");
                doc.text("Claim Information", 10, yPosition);
                yPosition += lineHeight;
          
                doc.setFont("helvetica", "normal");
                this.data.eraClaims.forEach((claim) => {
                    if (Array.isArray(claim.claims) && claim.claims.length > 0) {
                      
                        // Left column fields for claim information
                        const leftFields = [
                          { label: "Patient Name", value: claim.claims[0].PATIENTNAME || "N/A" },
                          { label: "Insured Name", value: claim.claims[0].INSUREDNAME || "N/A" },
                          { label: "Patient Account Number", value: claim.claims[0].PATIENTACCOUNTNUMBER || "N/A" },
                          { label: "Claim Status", value: claim.claims[0].CLAIMSTATUS || "N/A" },
                          { label: "Claim Payment Amount", value: claim.claims[0].CLAIMPAYMENTAMOUNT || "N/A" },
                          { label: "Claim Adj Amt", value: claim.claims[0].ADJAMT1 || "N/A" },
                          { label: "Claim Adj Codes", value: claim.claims[0].ADJUCODE1 || "N/A" },
                          { label: "Claim Remark Codes", value: claim.claims[0].CLAIMREMARKCODES || "N/A" },
                        ];
                  
                        // Right column fields for claim information
                        const rightFields = [
                          { label: "Member Identification #", value: claim.claims[0].MEMBERIDENTIFICATION_ || "N/A" },
                          {
                            label: "Insured Member Identification",
                            value: claim.claims[0].INSUREDMEMBERIDENTIFICATION_ || "N/A",
                          },
                          { label: "Rendering Provider", value: claim.claims[0].RENNDERINGPROVIDER || "N/A" },
                          { label: "Rendering NPI", value: claim.claims[0].RENDERINGNPI || "N/A" },
                          {
                            label: "Payer Claim Control # / ICN#",
                            value: claim.claims[0].PAYERCLAIMCONTROLNUMBERICN_ || "N/A",
                          },
                          {
                            label: "Patient Responsibility",
                            value: claim.claims[0].PATIENTRESPONSIBILITY.toString() || "N/A",
                          },
                          {
                            label: "Patient Responsibility Reason Code",
                            value: claim.claims[0].PATIENTRESPONSIBILITYREASONCODE || "N/A",
                          },
                          { label: "Patient Group#", value: claim.claims[0].PATIENTGROUP_ || "N/A" },
                        ];
                        
                  
                        // Left column X positions
                        const leftLabelX = 10;
                        const leftValueX = 60;
                  
                        // Right column X positions
                        const rightLabelX = 120;
                        const rightValueX = 180;
                  
                        // Render left fields
                        leftFields.forEach((field) => {
                          doc.text(`${field.label}:`, leftLabelX, yPosition);
                          doc.text(field.value, leftValueX, yPosition);
                          yPosition += lineHeight;
                        });
                  
                        // Reset Y position for the right column
                        yPosition -= leftFields.length * lineHeight; // Align with the first row of the left column
                  
                        // Render right fields
                        rightFields.forEach((field) => {
                          doc.text(`${field.label}:`, rightLabelX, yPosition);
                          doc.text(field.value, rightValueX, yPosition);
                          yPosition += lineHeight;
                        });
                  
                        yPosition += sectionGap; // Add gap before the next subClaim
                     
                    } else {
                      doc.text("No claims data available for this entry.", 10, yPosition);
                      yPosition += lineHeight + sectionGap;
                    }
                  });
              }
              this.data.eraClaims.forEach((eraClaim) => {
                if (Array.isArray(eraClaim.claims) && eraClaim.claims.length > 0) {
                    doc.setFont("helvetica", "bold");
    doc.text("Service Line Information", 10, yPosition);
    yPosition += lineHeight;
                  // Service Line Table Header
                  const tableHeaders = [
                    "Begin Service Date",
                    "End Service Date",
                    "Rendering NPI",
                    "Paid Units",
                    "Proc/Rev Code, Mods",
                    "Billed Amount",
                    "Allowed Amount",
                    "Deduct Amount",
                    "CoIns Amount",
                    "CoPay Amount",
                    "Other Adjusts",
                    "Adjust Codes",
                    "Provider Paid",
                    "Remark Codes",
                  ];
                  const headerFontSize = 8; // Reduced font size for headers
                  const dataFontSize = 9;   // Data rows font size
                  const columnSpacing = 20;
                  // X positions for columns
                  const columnPositions = [
                    10,                        // Begin Service Date
                    10 + columnSpacing,        // End Service Date
                    10 + columnSpacing * 2,    // Rendering NPI
                    10 + columnSpacing * 3,    // Paid Units
                    10 + columnSpacing * 4,    // Proc/Rev Code
                    10 + columnSpacing * 5,    // Billed Amount
                    10 + columnSpacing * 6,    // Allowed Amount
                    10 + columnSpacing * 7,    // Deduct Amount
                    10 + columnSpacing * 8,    // CoIns Amount
                    10 + columnSpacing * 9,    // CoPay Amount
                    10 + columnSpacing * 10,   // Other Adjusts
                    10 + columnSpacing * 11,   // Adjust Codes
                    10 + columnSpacing * 12,   // Provider Paid
                    10 + columnSpacing * 13,   // Remark Codes
                  ];
              
                  // Draw Header
                  doc.setFontSize(headerFontSize); // Set smaller font size for headers
tableHeaders.forEach((header, index) => {
  doc.text(header, columnPositions[index], yPosition);
});

              
                  yPosition += lineHeight; // Move to the next line for data rows
              
                  // Draw Table Rows
                  doc.setFontSize(dataFontSize);
                  doc.setFont("helvetica", "normal");
                  eraClaim.claims.forEach((serviceLine) => {
                    const rowData = [
                      serviceLine.BEGINSERVICEDATE || "N/A",
                      serviceLine.ENDSERVICEDATE || "N/A",
                      serviceLine.RENDERINGNPI || "N/A",
                      serviceLine.PAIDUNITS || "N/A",
                      serviceLine.PROCCODE || "N/A",
                      serviceLine.BILLEDAMOUNT
                        ? `$${parseFloat(serviceLine.BILLEDAMOUNT).toFixed(2)}`
                        : "N/A",
                      serviceLine.ALLOWEDAMOUNT
                        ? `$${parseFloat(serviceLine.ALLOWEDAMOUNT).toFixed(2)}`
                        : "N/A",
                      serviceLine.DEDUCTAMOUNT
                        ? `$${parseFloat(serviceLine.DEDUCTAMOUNT.toString()).toFixed(2)}`
                        : "N/A",
                      serviceLine.COINSAMOUNT
                        ? `$${parseFloat(serviceLine.COINSAMOUNT.toString()).toFixed(2)}`
                        : "N/A",
                      serviceLine.COPAYAMOUNT
                        ? `$${parseFloat(serviceLine.COPAYAMOUNT.toString()).toFixed(2)}`
                        : "N/A",
                      serviceLine.OTHERADJUSTMENT
                        ? `$${parseFloat(serviceLine.OTHERADJUSTMENT.toString()).toFixed(2)}`
                        : "N/A",
                      serviceLine.ADJCODE1 + serviceLine.ADJCODE2 + serviceLine.ADJCODE3 || "N/A",
                      serviceLine
                        ? `$${parseFloat(serviceLine.PROVIDERPAID).toFixed(2)}`
                        : "N/A",
                      serviceLine.CLAIMREMARKCODES || "N/A",
                    ];
              
                    // Render each cell in the row
                    rowData.forEach((cell, index) => {
                      doc.text(cell.toString(), columnPositions[index], yPosition);
                    });
              
                    yPosition += lineHeight; // Move to the next row
                  });
              
                  // Add a totals row (optional, adjust based on available data)
                  const totals = eraClaim.claimsTotal; // Assuming totals are part of the data structure
                  const totalsRow = [
                    "SERVICE LINE TOTALS:",
                    "",
                    "",
                    "",
                    "",
                    totals.BILLEDAMOUNT
                      ? `$${parseFloat(totals.BILLEDAMOUNT.toString()).toFixed(2)}`
                      : "N/A",
                    totals.ALLOWEDAMOUN
                      ? `$${parseFloat(totals.ALLOWEDAMOUN.toString()).toFixed(2)}`
                      : "N/A",
                    totals.DEDUCTAMOUNT
                      ? `$${parseFloat(totals.DEDUCTAMOUNT.toString()).toFixed(2)}`
                      : "N/A",
                    totals.COINSAMOUNT
                      ? `$${parseFloat(totals.COINSAMOUNT.toString()).toFixed(2)}`
                      : "N/A",
                    totals.COPAYAMOUNT
                      ? `$${parseFloat(totals.COPAYAMOUNT.toString()).toFixed(2)}`
                      : "N/A",
                    totals.OTHERADJUSTMENT
                      ? `$${parseFloat(totals.OTHERADJUSTMENT.toString()).toFixed(2)}`
                      : "N/A",
                    "",
                    totals.PROVIDERPAID
                      ? `$${parseFloat(totals.PROVIDERPAID.toString()).toFixed(2)}`
                      : "N/A",
                    "",
                  ];
              
                  yPosition += lineHeight; // Add space before totals row
                  totalsRow.forEach((cell, index) => {
                    doc.text(cell, columnPositions[index], yPosition);
                  });
              
                  yPosition += sectionGap; // Add gap before the next claim section
                } else {
                  doc.text("No service line data available for this claim.", 10, yPosition);
                  yPosition += lineHeight + sectionGap;
                }
              });
            } 
            else
             {
              // No Data Available
              doc.setFont("helvetica", "normal");
              doc.text("No data available to generate the PDF.", 10, yPosition);
            }
          
            // Save the generated PDF
            doc.save("generated-file.pdf");
          }
          
          
          
          
          
    downloadPDF22() {
        debugger
    // Target the content you want to convert to PDF
    const element = document.getElementById('Report'); // Get the HTML content inside the modal

    if (element) {
        const options = {
            margin: [10, 12, 10, 10],  // Top, Right, Bottom, Left margins
            filename: this.claim_no + 'era-view.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,  // Adjust scaling if necessary
              x: 0,
              y: 0,
              scrollY: -window.scrollY,  // Handle page scrolling, if applicable
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }  // A4 size
          };

      // Generate the PDF
    //  html2pdf().from(element).set(options).save();
    }
}
downloadPDF1() {
    var doc = new jsPDF();
    doc.text("Hello world.sdsadsad",20, 20, );
    doc.save("Test.pdf");
  }
  disableFields(payment: claimPayment): boolean {
    if (payment && payment.claimPayments) {
      return payment.claimPayments.Payment_Source == "T" && payment.claimPayments.claim_payments_id > 0;
    }
    return false;
  }
  
}