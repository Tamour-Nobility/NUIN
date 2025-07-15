import { Component, OnInit, ChangeDetectorRef, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { DiagnosisRequest, DiagnosisResponse, ClaimDiagnosisRequest, Diagnosis } from '../../Claims/Classes/Diagnosis'
import { APIService } from '../../components/services/api.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Diag } from '../Classes/Diagnosis'
declare var $: any
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';
import { Common } from '../../services/common/common';
import { GvarsService } from '../../services/G_vars/gvars.service';
import * as moment from 'moment';

@Component({
    selector: 'app-diagnosis',
    templateUrl: './diagnosis.component.html',
    styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit, AfterViewInit {
    @Output() OnAddDiagnosis: EventEmitter<any> = new EventEmitter();
    @Output() onRemoveDiagnosis: EventEmitter<any> = new EventEmitter();
    @Input() claimDos: string;
 
    totalpages: string;
    Diag: Diag[];
    checker:boolean=true;
    Issearch: boolean = false;
    sControl: string;
    diagnosis: Diagnosis[];
    diagRequest: ClaimDiagnosisRequest;
    diagSearchRequest: DiagnosisRequest;
    diagnosisResponse: DiagnosisResponse[];
    currentdxNumber: number;
    error: any;
    showDiagnosisPopup: boolean = false;
    DiagnosisFlag: boolean = false;
    claimID: string;
    isClaimEdit: number;
    PatientAccount: string;
    DOS: string;
    CheckDXCode:any=null
    claimCallFlag: boolean = false;
    flagfordx:boolean = false;
    dx1: DiagnosisRequest;
    dx2: DiagnosisRequest;
    dx3: DiagnosisRequest;
    dx4: DiagnosisRequest;
    dx5: DiagnosisRequest;
    dx6: DiagnosisRequest;
    dx7: DiagnosisRequest;
    dx8: DiagnosisRequest;
    dx9: DiagnosisRequest;
    dx10: DiagnosisRequest;
    dx11: DiagnosisRequest;
    dx12: DiagnosisRequest;
    selectedDiagnoseCode: number = 0;
    isViewMode: boolean;
    constructor(public cd: ChangeDetectorRef, public API: APIService, private gv: GvarsService) {
        this.diagRequest = new ClaimDiagnosisRequest();
        this.diagSearchRequest = new DiagnosisRequest();
        this.diagnosisResponse = [];
        this.diagnosis = [];
        this.Diag = [];
        this.dx1 = new DiagnosisRequest();
        this.dx2 = new DiagnosisRequest();
        this.dx3 = new DiagnosisRequest();
        this.dx4 = new DiagnosisRequest();
        this.dx5 = new DiagnosisRequest();
        this.dx6 = new DiagnosisRequest();
        this.dx7 = new DiagnosisRequest();
        this.dx8 = new DiagnosisRequest();
        this.dx9 = new DiagnosisRequest();
        this.dx10 = new DiagnosisRequest();
        this.dx11 = new DiagnosisRequest();
        this.dx12 = new DiagnosisRequest();
    }

    ngOnInit() {
    }

    AddNewDiagnosis() {
        if(!this.validateDOS()) return ;
            let noofdel = 0;
            for (var i = 0; i < this.Diag.length; i++) {
                if (this.Diag[i].Diagnosis.Deleted) {
                    noofdel++;
                }
            }
            if (this.Diag.length - noofdel == 12) {
                return;
            }
            var cp: Diag;
            cp = new Diag();
            cp.Diagnosis.Deleted = false;
            this.Diag.push(cp);     
    }

    ClearDiagnosis() {
        this.diagSearchRequest.DiagnoseCode = '';
        this.diagSearchRequest.Description = '';
        this.diagnosisResponse = [];
        $("#txt_icd_code").focus();
    }

    DeleteDiag(ndx: number) {
        debugger;
      this.onRemoveDiagnosis.emit(ndx);
      this.Diag.splice(ndx, 1);
    }

    selectDiagnosis(index: number) {
        this.selectedDiagnoseCode = index;
    }

    setDiagnosis(Diag_Code: string, Diag_Description: string, Diag_Effective_Date: string,Diag_Expiry_Date: string) {
        debugger 
        const diagnosis = this.Diag[this.currentdxNumber].Diagnosis;

        // Check if Code is missing or empty
        if (diagnosis.Code === undefined || diagnosis.Code === null || (typeof diagnosis.Code === "string" && diagnosis.Code.trim() === "")) {
            diagnosis.AddorUpdate = true;
        } else {
            diagnosis.AddorUpdate = false;
        }      
        debugger
        this.Diag[this.currentdxNumber].Diagnosis.Code = Diag_Code;
        this.Diag[this.currentdxNumber].Diagnosis.Description = Diag_Description;
        this.Diag[this.currentdxNumber].Diagnosis.Diag_Effective_Date = Diag_Effective_Date;
        this.Diag[this.currentdxNumber].Diagnosis.Diag_Expiry_Date = Diag_Expiry_Date;
        
    }

    ChangeDiagnosisVersion(value: string) {
        this.diagSearchRequest.Version = value;
    }

    diagnosisKeyPressEvent(event: KeyboardEvent) {
        if (event.key == "Enter") {
            this.searchDiagnosis();
        }
    }

    selectDiagnosisEvent(Diag_Code: string, Diag_Description: string, Diag_Effective_Date: string,Diag_Expiry_Date: string,Isfound: number) {
        if (Isfound == 1) {
           // Parse the dates into Date objects
const claimDate = new Date( this.claimDos); 
const expiryDate = new Date(Diag_Expiry_Date);
const effectiveDate = new Date(Diag_Effective_Date);
debugger

// if(Diag_Expiry_Date !== null && Diag_Expiry_Date !== undefined && (Diag_Effective_Date === null || Diag_Effective_Date === undefined)){
//     if(claimDate > expiryDate){
//         swal('Failed', 'The diagnosis code has expired. Please enter a valid code', 'error')
//     }
// }else if(Diag_Effective_Date !== null && Diag_Effective_Date !== undefined && (Diag_Expiry_Date === null || Diag_Expiry_Date === undefined)){
//     if(claimDate < effectiveDate){
//         swal('Error', 'The diagnosis code cannot be entered before its effective date. Please select a valid code', 'error')
//     }
// }else if(claimDate < effectiveDate && claimDate > expiryDate && Diag_Effective_Date !== null && Diag_Effective_Date !== undefined && Diag_Expiry_Date !== null && Diag_Expiry_Date !== undefined){
//     swal('Error', 'The diagnosis code is not valid as it is outside the defined effective and expiration dates. Please select a valid code', 'error')
// }

if(claimDate < effectiveDate && claimDate > expiryDate && Diag_Effective_Date !== null  && Diag_Expiry_Date !== null ){
    swal('Failed', 'The diagnosis code is not valid as it is outside the defined effective and expiration dates. Please select a valid code', 'error')
    return;
}
else if(claimDate > expiryDate && Diag_Expiry_Date !== null && Diag_Expiry_Date !== undefined){
    swal('Failed', 'The diagnosis code has expired. Please select a valid code.', 'error')
    return;

}
else if(claimDate < effectiveDate && Diag_Effective_Date !== null && Diag_Effective_Date !== undefined){
    swal('Failed', 'The diagnosis code cannot be entered before its effective date. Please select a valid code.', 'error')
    return;
}
            // if(claimDate > expiryDate && Diag_Expiry_Date !== null){
            //     swal('Error', 'The diagnosis code cannot be entered before its effective date. Please select a valid code', 'error')

            // }
      
            else 
            {
                debugger;
                
                this.setDiagnosis(Diag_Code, Diag_Description,Diag_Effective_Date,Diag_Expiry_Date);
                this.showDiagnosisPopup = !this.showDiagnosisPopup;
                this.findDuplicatedDiagnosis(this.currentdxNumber);
                this.CheckDXCode = this.Diag[this.currentdxNumber].Diagnosis.Code;
                // if( this.flagfordx == false && this.CheckDXCode != null && this.CheckDXCode != undefined )
                //    {
                //      this.Diag[this.currentdxNumber].Diagnosis.AddorUpdate=true
                //    }
                if (this.currentdxNumber < 12) {
                    this.OnAddDiagnosis.emit({ Diag: this.Diag[this.currentdxNumber], index: this.currentdxNumber,olddxcode : this.CheckDXCode });
                    let focusDx = this.currentdxNumber + 1;
                    $("#DX0" + focusDx).focus();
                    document.getElementById("closeModel").click();
                }
                this.Issearch = false;
            }
          
        }
        else {
            swal('Validation', 'Please Add Dx to Provider First', 'Error');
            return;
        }
    }

    GetDiagnosis() {
        this.dx1.DiagnoseCode = this.diagnosis[0].Code;
        this.dx1.Description = this.diagnosis[0].Description;
        this.dx2.DiagnoseCode = this.diagnosis[1].Code;
        this.dx2.Description = this.diagnosis[1].Description;
        this.dx3.DiagnoseCode = this.diagnosis[2].Code;
        this.dx3.Description = this.diagnosis[2].Description;
        this.dx4.DiagnoseCode = this.diagnosis[3].Code;
        this.dx4.Description = this.diagnosis[3].Description;
        this.dx5.DiagnoseCode = this.diagnosis[4].Code;
        this.dx5.Description = this.diagnosis[4].Description;
        this.dx6.DiagnoseCode = this.diagnosis[5].Code;
        this.dx6.Description = this.diagnosis[5].Description;
        this.dx7.DiagnoseCode = this.diagnosis[6].Code;
        this.dx7.Description = this.diagnosis[6].Description;
        this.dx8.DiagnoseCode = this.diagnosis[7].Code;
        this.dx8.Description = this.diagnosis[7].Description;
        this.dx9.DiagnoseCode = this.diagnosis[8].Code;
        this.dx9.Description = this.diagnosis[8].Description;
        this.dx10.DiagnoseCode = this.diagnosis[9].Code;
        this.dx10.Description = this.diagnosis[9].Description;
        this.dx11.DiagnoseCode = this.diagnosis[10].Code;
        this.dx11.Description = this.diagnosis[10].Description;
        this.dx12.DiagnoseCode = this.diagnosis[11].Code;
        this.dx12.Description = this.diagnosis[11].Description;
    }

    findDuplicatedDiagnosis(diagIndex: number = 0) {
        var selectedDiag = this.Diag.filter(x => x.Diagnosis.Code !== undefined && x.Diagnosis.Code !== null && x.Diagnosis.Code !== '')
        var valueArr = selectedDiag.map(function (item) { return (item.Diagnosis.Code).toLowerCase(); });
        var isDuplicate = valueArr.some(function (item, idx) {
            return valueArr.indexOf(item) != idx
        });
        if (isDuplicate) {
            swal('Diagnosis', 'Duplicate diagnosis exist.', 'error');
            this.Diag[diagIndex].Diagnosis.Code = "";
            this.Diag[diagIndex].Diagnosis.Description = "";
            return;
        }
        // for (var i = 0; i < selectedDiag.length; i++) {
        //     if (selectedDiag.filter(x => $.trim(x.Diagnosis.Code) == $.trim(selectedDiag[i].Diagnosis.Code)).length > 1) {
        //         swal('Diagnosis', 'Duplicate diagnosis exist.', 'error');
        //         this.Diag[diagIndex].Diagnosis.Code = "";
        //         this.Diag[diagIndex].Diagnosis.Description = "";
        //     }
        // }
    }

    diagOnBlur(event: any, value: string, diagIndex: number, flg?: boolean) {
        // if (event.key != 'Enter') {
         
       this.checker=true;
        this.getDiagnosisDescription(value, diagIndex);
        // }
        // else if (event.key == 'Enter' && event.type != "blur") {
        //     if (value && value.length > 2 && this.validateDOS()) {
        //         this.getDiagnosisDescription(value, diagIndex);
        //     }
        // }
    }

    selectOnFocus(id: string) {
        setTimeout(() => {
            $("#DX0" + id.replace('dx', '')).focus();
            $("#DX0" + id.replace('dx', '')).select();
        }, 500);
    }

    getSetDiagnosis(diagIndex: string, data: any) {
        debugger;
        if (diagIndex == "dx1") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx1.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx1.Description = $.trim(data.Response[0].Diag_Description == null ? "" : data.Response[0].Diag_Description);
                this.dx1.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx1.Version = data.Response[0].ICD_version;
                if (this.dx1.Description == "" || this.dx1.Description == null || this.dx1.Description == undefined) {
                    this.dx1.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx2") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx2.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx2.Description = data.Response[0].Diag_Description;
                this.dx2.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx2.Version = data.Response[0].ICD_version;
                if (this.dx2.Description == "" || this.dx2.Description == null || this.dx2.Description == undefined) {
                    this.dx2.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx3") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx3.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx3.Description = data.Response[0].Diag_Description;
                this.dx3.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx3.Version = data.Response[0].ICD_version;
                if (this.dx3.Description == "" || this.dx3.Description == null || this.dx3.Description == undefined) {
                    this.dx3.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx4") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx4.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx4.Description = data.Response[0].Diag_Description;
                this.dx4.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx4.Version = data.Response[0].ICD_version;

                if (this.dx4.Description == "" || this.dx4.Description == null || this.dx4.Description == undefined) {
                    this.dx4.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx5") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx5.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx5.Description = data.Response[0].Diag_Description;
                this.dx5.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx5.Version = data.Response[0].ICD_version;
                if (data == "" || data == null || data == undefined) {
                    this.dx5.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx6") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx6.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx6.Description = data.Response[0].Diag_Description;
                this.dx6.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx6.Version = data.Response[0].ICD_version;
                if (this.dx6.Description == "" || this.dx6.Description == null || this.dx6.Description == undefined) {
                    this.dx6.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx7") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx7.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx7.Description = data.Response[0].Diag_Description;
                this.dx7.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx7.Version = data.Response[0].ICD_version;
                if (this.dx7.Description == "" || this.dx7.Description == null || this.dx7.Description == undefined) {
                    this.dx7.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx8") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx8.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx8.Description = data.Response[0].Diag_Description;
                this.dx8.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx8.Version = data.Response[0].ICD_version;
                if (this.dx8.Description == "" || this.dx8.Description == null || this.dx8.Description == undefined) {
                    this.dx8.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx9") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx9.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx9.Description = data.Response[0].Diag_Description;
                this.dx9.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx9.Version = data.Response[0].ICD_version;
                if (this.dx9.Description == "" || this.dx9.Description == null || this.dx9.Description == undefined) {
                    this.dx9.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx10") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx10.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx10.Description = data.Response[0].Diag_Description;
                this.dx10.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx10.Version = data.Response[0].ICD_version;
                if (this.dx10.Description == "" || this.dx10.Description == null || this.dx10.Description == undefined) {
                    this.dx10.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx11") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx11.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx11.Description = data.Response[0].Diag_Description;
                this.dx11.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx11.Version = data.Response[0].ICD_version;
                if (this.dx11.Description == "" || this.dx11.Description == null || this.dx11.Description == undefined) {
                    this.dx11.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
        else if (diagIndex == "dx12") {
            if (data == undefined || data == null || data.Response == undefined || data.Response == null || data.Response.length == 0) {
                this.dx12.Description = "";
                this.selectOnFocus(diagIndex);
            }
            else {
                this.dx12.Description = data.Response[0].Diag_Description;
                this.dx12.DiagnoseCode = $.trim(data.Response[0].Diag_Code);
                this.dx12.Version = data.Response[0].ICD_version;
                if (this.dx12.Description == "" || this.dx12.Description == null || this.dx12.Description == undefined) {
                    this.dx12.DiagnoseCode = "";
                    this.selectOnFocus(diagIndex);
                }
            }
        }
    }

    getDiagnosisDescription(value: string, diagIndex: number) {
        this.API.getData('/Demographic/GetDiagnosis?DiagCode=' + $.trim(value) + '&DiagDesc= &PracticeCode=' + this.gv.currentUser.selectedPractice.PracticeCode).subscribe(
            data => {
                console.log('GetDiagnosis', data);
                if (data.Response.length > 0) {
                    if ((data.Response[0].ICD_version == 'i9' || data.Response[0].ICD_version == 'I9') && (new Date('10/01/2015') < new Date(this.claimDos))) {
                        swal('Diagnosis', 'Please enter valid ICD-10.', 'error');
                        this.Diag[diagIndex].Diagnosis.Code = "";
                        this.Diag[diagIndex].Diagnosis.Description = "";
                        return;
                    }
                    else if (data.Response.length == 1 && data.Response[0].Isfound == 1) {
                        this.Diag[diagIndex].Diagnosis.Code = data.Response[0].Diag_Code.trim();
                        this.Diag[diagIndex].Diagnosis.Description = data.Response[0].Diag_Description.trim();
                        this.OnAddDiagnosis.emit({ Diag: this.Diag[diagIndex], index: diagIndex });
                        this.refresh();
                        this.findDuplicatedDiagnosis(diagIndex);
                    }
                    else {
                        this.currentdxNumber = diagIndex;
                        this.diagSearchRequest.DiagnoseCode = value;
                        this.diagnosisResponse = data.Response;
                        document.getElementById("openSearchModalButton").click();
                        this.refresh();
                        // this.searchDiagnosis();
                    }
                }
                else {
                    swal('', 'Invalid DX Code.', 'error');
                    this.Diag[diagIndex].Diagnosis.Code = '';
                    this.Diag[diagIndex].Diagnosis.Description = '';
                }
            });
    }

    validateDOS() {
        if (Common.isNullOrEmpty(this.claimDos)) {
            swal('Diagnosis', 'Select Claim DOS.', 'error');
            return;
        }
        else
            return true
    }

    removeDiagnosisDescription(diagIndex: string) {
        if (diagIndex == "dx1") {
            this.dx1.DiagnoseCode = "";
            this.dx1.Description = "";
        }
        if (diagIndex == "dx2") {
            this.dx2.DiagnoseCode = "";
            this.dx2.Description = "";
        }
        if (diagIndex == "dx3") {
            this.dx3.DiagnoseCode = "";
            this.dx3.Description = "";
        }
        if (diagIndex == "dx4") {
            this.dx4.DiagnoseCode = "";
            this.dx4.Description = "";
        }
        if (diagIndex == "dx5") {
            this.dx5.DiagnoseCode = "";
            this.dx5.Description = "";
        }
        if (diagIndex == "dx6") {
            this.dx6.DiagnoseCode = "";
            this.dx6.Description = "";
        }
        if (diagIndex == "dx7") {
            this.dx7.DiagnoseCode = "";
            this.dx7.Description = "";
        }
        if (diagIndex == "dx8") {
            this.dx8.DiagnoseCode = "";
            this.dx8.Description = "";
        }
        if (diagIndex == "dx9") {
            this.dx9.DiagnoseCode = "";
            this.dx9.Description = "";
        }
        if (diagIndex == "dx10") {
            this.dx10.DiagnoseCode = "";
            this.dx10.Description = "";
        }
        if (diagIndex == "dx11") {
            this.dx11.DiagnoseCode = "";
            this.dx11.Description = "";
        }
        if (diagIndex == "dx12") {
            this.dx12.DiagnoseCode = "";
            this.dx12.Description = "";
        }
    }

    removeDiagnosis(diagIndex: string) {
        if (diagIndex == "dx1") {
            this.dx1.DiagnoseCode = "";
            this.dx1.Description = "";
        }
        if (diagIndex == "dx2") {
            this.dx2.DiagnoseCode = "";
            this.dx2.Description = "";
        }
        if (diagIndex == "dx3") {
            this.dx3.DiagnoseCode = "";
            this.dx3.Description = "";
        }
        if (diagIndex == "dx4") {
            this.dx4.DiagnoseCode = "";
            this.dx4.Description = "";
        }
        if (diagIndex == "dx5") {
            this.dx5.DiagnoseCode = "";
            this.dx5.Description = "";
        }
        if (diagIndex == "dx6") {
            this.dx6.DiagnoseCode = "";
            this.dx6.Description = "";
        }
        if (diagIndex == "dx7") {
            this.dx7.DiagnoseCode = "";
            this.dx7.Description = "";
        }
        if (diagIndex == "dx8") {
            this.dx8.DiagnoseCode = "";
            this.dx8.Description = "";
        }
        if (diagIndex == "dx9") {
            this.dx9.DiagnoseCode = "";
            this.dx9.Description = "";
        }
        if (diagIndex == "dx10") {
            this.dx10.DiagnoseCode = "";
            this.dx10.Description = "";
        }
        if (diagIndex == "dx11") {
            this.dx11.DiagnoseCode = "";
            this.dx11.Description = "";
        }
        if (diagIndex == "dx12") {
            this.dx12.DiagnoseCode = "";
            this.dx12.Description = "";
        }
    }

    ShowDiagnosisPopup(dxNumber: number) {
        this.diagSearchRequest.Version = 'i10';
        $("#radioicd9").removeAttr('checked');
        $("#radioicd10").prop('checked', true);
        this.diagnosisResponse = [];
        this.diagSearchRequest.DiagnoseCode = "";
        this.diagSearchRequest.Description = "";
        this.totalpages = "1";
        this.showDiagnosisPopup = !this.showDiagnosisPopup;
        this.sControl = "#DX0" + dxNumber;
        $('#Diagnosistsearch').on('shown.bs.modal', function () {
            $("#Diagnosistsearch #txt_icd_code").focus();
        })
        document.getElementById("openSearchModalButton").click();
        this.currentdxNumber = dxNumber;
        this.checker=false;
        //setTimeout(function () {
        //    $("#txt_icd_code").focus();
        //}, 1000);

        
        
    }

    SearchDiagnosis() {
        if (this.diagSearchRequest.DiagnoseCode === "" && this.diagSearchRequest.Description === "") {
            swal('Diagnosis', 'Please enter Diagnose Code or  Description.', 'error');
            return;
        }
        this.searchDiagnosis();
    }

    refresh() {
        this.cd.detectChanges();
    }

    searchDiagnosis() {
        if (this.validateDOS()) {
            this.API.getData('/Demographic/GetDiagnosis?DiagCode=' + this.diagSearchRequest.DiagnoseCode + '&DiagDesc=' + this.diagSearchRequest.Description + '&PracticeCode=' + this.gv.currentUser.selectedPractice.PracticeCode).subscribe(
                data => {
                    console.log('/Demographic/GetDiagnosis', data)
                    this.diagnosisResponse = data.Response;
                    if (this.diagnosisResponse.length > 0) {
                        if ((data.Response[0].ICD_version == 'i9' || data.Response[0].ICD_version == 'I9') && (new Date('10/01/2015') < new Date(this.claimDos))) {
                            swal('Diagnosis', 'Please enter valid ICD-10.', 'error');
                            this.diagnosisResponse = [];
                            return;
                        }
                        else {
                            this.selectDiagnosis(0);
                            this.refresh();
                        }
                    }
                    () => {
                        this.error = "Some Error Occurred while connecting to database.";
                    }
                });
        }
    }

    closeDiagnosis() {
        if (this.sControl) {
            $(this.sControl).focus();
            this.sControl = "";
          
            
        }
    //    this.Diag[this.currentdxNumber].Diagnosis.Code='';
    //    this.Diag[this.currentdxNumber].Diagnosis.Description='';
        
        
    
    }

    ngAfterViewInit() {
        var dragLastPlace;
        var movedLastPlace;
        ($('.draggable') as any).draggable({
            placeholder: 'placeholder',
            zIndex: 1000,
            containment: 'table',
            helper: function () {
                var that = $(this).clone().get(0);
                $(this).hide();
                return that;
            },
            start: function () {
                dragLastPlace = $(this).parent();
            },
            cursorAt: {
                top: 20,
                left: 20
            }
        });
        ($('.droppable') as any).droppable({
            hoverClass: 'placeholder',
            drop: function (evt, ui) {
                var draggable = ui.draggable;
                var droppable = this;
                if ($(droppable).children('.draggable:visible:not(.ui-draggable-dragging)').length > 0) {
                    $(droppable).children('.draggable:visible:not(.ui-draggable-dragging)').detach().prependTo(dragLastPlace);
                }

                $(draggable).detach().css({
                    top: 0,
                    left: 0
                }).prependTo($(droppable)).show();

                movedLastPlace = undefined;
            },
            over: function (evt, ui) {
                var draggable = ui.draggable;
                var droppable = this;
                if (movedLastPlace) {
                    $(dragLastPlace).children().not(draggable).detach().prependTo(movedLastPlace);
                }
                if ($(droppable).children('.draggable:visible:not(.ui-draggable-dragging)').length > 0) {
                    $(droppable).children('.draggable:visible').detach().prependTo(dragLastPlace);
                    movedLastPlace = $(droppable);
                }
            }
        })
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }
    addDxToProvider(diagCode: string) {
        debugger;
        if (diagCode) {
            this.API.PostData('/Demographic/AddDxToProvider', {
                DiagCode: diagCode,
                PracticeCode: this.gv.currentUser.selectedPractice.PracticeCode,
            },
                (result) => {

                    console.log("/Demographic/AddDxToProvider",result)
                    if (result.Status == "Success") {
                        this.searchDiagnosis();
                    }
                    else {
                        swal('Error', result.Response, 'error');
                    }
                });
        }
        else
            swal('Validation', 'Diagnosis Code Missing', 'error');
    }
   
//    getnewaddeddx(dxcode,index)
//    {
//     debugger;
//     var code=any;
//     code=dxcode
//     var indexx=any;
//     index = indexx
    


//    }
    }

