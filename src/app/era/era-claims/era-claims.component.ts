import { Component, OnInit, ChangeDetectorRef,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Common } from '../../services/common/common';
import { Location } from '@angular/common';

import { ERAClaimDetailsResponse } from '../models/era-claim-details-response.model';
import { APIService } from '../../components/services/api.service';
import { IMyDpOptions } from 'mydatepicker';
import { ModalDirective,ModalOptions } from 'ngx-bootstrap/modal';
declare var $: any;
import 'datatables.net';
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-era-claims',
  templateUrl: './era-claims.component.html',
  styleUrls: ['./era-claims.component.css']
})
export class ERAClaims implements OnInit {
  data: ERAClaimDetailsResponse;
  eraId: number;
  rowCount:any
  datatable: any;
  count:number;
  selectedClaimIds: number[];
  isSearchInitiated: boolean = false;
  dataTableEraClaims: any;
  depositDate: any;
  applyBtn:boolean=true;
  today = new Date();
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '100%',
    disableSince: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() + 1,
    },
  };
  @ViewChild('upModal')upModal:ModalDirective;
  nbDataTable: any;
  eraOverpaidClaims: any;
  constructor(private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toastService: ToastrService,
    private API: APIService,
    private _location: Location
  ) {
    this.data = new ERAClaimDetailsResponse();
    this.selectedClaimIds = [];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== 0 && params['id'] !== '0') {
        this.eraId = params['id'];
        this.getClaimDetails();
      }
    });
  }

  dateMask(event: any) {
    Common.DateMask(event);
  }

  onDateChangedDd(event: any) {
    this.depositDate = event.formatted;

    if(this.depositDate==''){
      $('#AppyBtn').prop('disabled', true);
      $('#autoApplyBtn').prop('disabled', true);
    }else{
      
      if(this.count>=this.rowCount && this.depositDate !=null){
        $('#AppyBtn').prop('disabled', true);
        $('#autoApplyBtn').prop('disabled', false);

        
      }else if(this.count<this.rowCount && this.count>0 && this.depositDate !=null){
        $('#AppyBtn').prop('disabled', false);
        $('#autoApplyBtn').prop('disabled', true);

      }
      else{
        $('#AppyBtn').prop('disabled', true);
      }
    }
  }

  getClaimDetails() {
    if (!Common.isNullOrEmpty(this.eraId)) {
      this.API.PostData('/Submission/ERAClaimSummary', { eraId: this.eraId }, (res) => {
        this.isSearchInitiated = true;
        if (res.Status == "success") {
          if (this.datatable) {
            this.datatable.destroy();
            this.chRef.detectChanges();
          }
          this.data = res.Response;
          this.chRef.detectChanges();
          const table = $('.dataTableEraClaims');
          this.datatable = table.DataTable({
            lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
            columnDefs: [{
              'targets': 0,
              'checkboxes': {
                'selectRow': true
              }
            },
            {
              targets: [1],
              visible: false,
              searchable: false
            },
            {
              className: 'control',
              orderable: false,
              targets: 0
            }],
            select: {
              style: 'multi'
            },
            language: {
              buttons: {
                emptyTable: "No data available"
              },
              select: {
                rows: ""
              }
            },
            order: [2, 'desc']
          });
          this.datatable.on('select',
            (e, dt, type, indexes) => this.onRowSelect(indexes));
          this.datatable.on('deselect',
            (e, dt, type, indexes) => this.onRowDeselect(indexes));

           
        } else if (res.Status === 'invalid-era-id')
          swal(res.status, res.Response, 'error');
        else
          swal(res.status, "An error occurred", 'error');
      });
    } else {
      this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
    }
  }

  onRowDeselect(indexes: any) {
    let ndx = this.selectedClaimIds.findIndex(p => p === this.datatable.cell(indexes, 1).data());
    if (ndx > -1) {
      this.selectedClaimIds.splice(ndx, 1);
    }
    this.count = this.datatable.rows( { selected: true } ).count();
   
    if(this.count==this.rowCount && this.depositDate !=null && this.depositDate !=''){
      $('#AppyBtn').prop('disabled', true);
      $('#autoApplyBtn').prop('disabled', false);

      
    }else if(this.count<=this.rowCount && this.count>=1 && this.depositDate !=null && this.depositDate !=''){
      $('#AppyBtn').prop('disabled', false);
      $('#autoApplyBtn').prop('disabled', true);

    }
    else{
      $('#autoApplyBtn').prop('disabled', true);
      $('#AppyBtn').prop('disabled', true);
    }
    // console.log(this.count)
    // console.log(this.rowCount)
   
  }

  onRowSelect(indexes: any) {
    if (this.selectedClaimIds.findIndex(p => p == this.datatable.cell(indexes, 1).data()) < 0) {
      this.selectedClaimIds.push(this.datatable.cell(indexes, 1).data());
    }
    $('#AppyBtn').prop('disabled', false);
    this.count = this.datatable.rows( { selected: true } ).count();
    if(this.count==this.rowCount && this.depositDate !=null && this.depositDate !=''){
      $('#AppyBtn').prop('disabled', true);

      $('#autoApplyBtn').prop('disabled', false);
      $('#autoApplyBtn').addClass('btn-primary').removeClass('btn-default');

      
    }else if(this.count<=this.rowCount && this.count>0 && this.depositDate !=null && this.depositDate !=''){
      $('#AppyBtn').prop('disabled', false);

      $('#autoApplyBtn').prop('disabled', true);
   


    }
    else{
      $('#autoApplyBtn').prop('disabled', true);
      $('#AppyBtn').prop('disabled', true);
    }
    var rows = this.datatable.rows({ selected: true }).data();
    console.log(rows)
  }

  getAdjustmentAmount(amt1:any, amt2:any,amt3:any,amt4:any) {

    if(amt3==null){
      amt3=0
    }
    if(amt4==null){
      amt4=0
    }

    return parseFloat(amt1) + parseFloat(amt2) + parseFloat(amt3) +parseFloat(amt4);
  }
  getPRESAMTAmount(amts1:any, amts2:any,amts3:any) {
    if(amts1==null){
      amts1=0
    }
    if(amts2==null){
      amts2=0
    }
    if(amts3==null){
      amts3=0
    }
    return parseFloat(amts1) + parseFloat(amts2) + parseFloat(amts3);
  }

  goBack() {
    this._location.back();
  }

  onApply() {
    var filteredClaimIds = this.selectedClaimIds.filter(id => this.data.eraClaims.find(claim => Number(claim.CLAIMNO) === Number(id) && claim.CLAIMPOSTEDSTATUS === 'U'));
    if (this.selectedClaimIds.length > 0) {
      this.API.PostData('/Submission/ApplyERA', { eraId: this.eraId, claims: filteredClaimIds, depositDate: this.depositDate.formatted }, (res) => {
        if (res.Status == "success") {
          this.toastService.success('ERA Apply Success', 'Success');
          this.depositDate = '';
          if (this.datatable) {
            this.datatable.destroy();
            this.chRef.detectChanges();
          }
          this.data = res.Response;
          this.chRef.detectChanges();
          const table = $('.dataTableEraClaims');
          this.datatable = table.DataTable({
            lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
            columnDefs: [{
              'targets': 0,
              'checkboxes': {
                'selectRow': true
              }
            },
            {
              targets: [1],
              visible: false,
              searchable: false
            },
            {
              className: 'control',
              orderable: false,
              targets: 0
            }],
            select: {
              style: 'multi'
            },
            language: {
              buttons: {
                emptyTable: "No data available"
              },
              select: {
                rows: ""
              }
            },
            order: [2, 'desc']
          });
          this.datatable.on('select',
            (e, dt, type, indexes) => this.onRowSelect(indexes));
          this.datatable.on('deselect',
            (e, dt, type, indexes) => this.onRowDeselect(indexes));

          //..below method is to check whether overpayment exist for ear claims or not.
          this.eraClaimsOverPaid();
          this.disableapplyButtons();
        }
        else {
          this.toastService.error('An error occurred while applying ERA', 'Failed to apply ERA');
        }
      });
    } else
      this.toastService.warning('Please select at least one claim to apply.', 'Invalid Selection');
  }

  onAutoPost() {
    this.API.PostData(`/Submission/AutoPost/`, { id: this.eraId, depositDate: this.depositDate.formatted }, (res) => {
      if (res.Status == "success") {
        this.toastService.success('ERA has been Auto Posted successfully.', 'ERA Auto Post Success');
        this.depositDate = '';
        if (this.datatable) {
          this.datatable.destroy();
          this.chRef.detectChanges();
        }
        if (res.Response.eraClaims.length > 0)
          this.data = res.Response;
        this.chRef.detectChanges();
        const table = $('.dataTableEraClaims');
        this.datatable = table.DataTable({
          lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
          columnDefs: [{
            'targets': 0,
            'checkboxes': {
              'selectRow': true
            }
          },
          {
            targets: [1],
            visible: false,
            searchable: false
          },
          {
            className: 'control',
            orderable: false,
            targets: 0
          }],
          select: {
            style: 'multi'
          },
          language: {
            buttons: {
              emptyTable: "No data available"
            },
            select: {
              rows: ""
            }
          },
          order: [2, 'desc']
        });
        this.datatable.on('select',
          (e, dt, type, indexes) => this.onRowSelect(indexes));
        this.datatable.on('deselect',
          (e, dt, type, indexes) => this.onRowDeselect(indexes));

        //..below method is to check whether overpayment exist for ear claims or not.
        this.eraClaimsOverPaid();
        this.disableapplyButtons();
      }
      else {
        this.toastService.error('An error occurred while auto posting ERA', 'Failed to Auto Post ERA');
      }
    });
  }

  getEncodedUrl(claimNo, patientAccount, firstname, lastName) {
    return Common.encodeBase64(JSON.stringify({
      Patient_Account: patientAccount,
      PatientFirstName: firstname,
      PatientLastName: lastName,
      claimNo: claimNo,
      disableForm: false
    }));
  }

  isMismatched(patAccount) {
    return Common.isNullOrEmpty(patAccount);
  }

  canSelectAll() {
    this.data.eraClaims.filter(claim => claim.CLAIMPOSTEDSTATUS === 'U').length > 0 && this.data.era.ERAPOSTEDSTATUS !== 'P'
    this.rowCount=this.data.eraClaims.length
    return ( this.data.eraClaims)
  }

  canAutoPost() {
    return (this.data.era.ERAPOSTEDSTATUS !== 'P' && this.data.eraClaims.some(claim => claim.CLAIMPOSTEDSTATUS !== 'P'))
  }

  canApply() {
    return this.canSelectAll();
  }


  //...below is negative balance implementation by tamour

  hideNegativeBalanceModel() {
    this.upModal.hide();
  }

  disableapplyButtons() {
    $('#AppyBtn').prop('disabled', true);
    $('#autoApplyBtn').prop('disabled', true);
  }

  eraClaimsOverPaid() {
    this.API.PostData('/Submission/ERAClaimsOverPayment', { eraId: this.eraId }, (res) => {
      if (res.Status == "success") {
        if (res.Response.length > 0) {
          //set the modal body static.will close on click OK or Cross
          const modalOptions: ModalOptions = {
            backdrop: 'static'
          };
          this.upModal.config = modalOptions; 
          this.upModal.show();
          if (this.nbDataTable) {
            this.chRef.detectChanges();
            this.nbDataTable.destroy();
          }
          this.eraOverpaidClaims = res.Response;
          this.chRef.detectChanges();
          const table = $('.nbDataTable');
          this.nbDataTable = table.DataTable({
            language: {
              buttons: {
                emptyTable: "No data available"
              }
            }
          });
        }
      }
      else {
        this.toastService.error('An error occurred while checking Overpayment Details', 'Failed to Check OverPayments');
      }
    });
  }

  exportExcel() {
    debugger
  const worksheet = xlsx.utils.json_to_sheet(this.eraOverpaidClaims);
 
  // Format the cells to treat all values as text
  Object.keys(worksheet).forEach(cell => {
    if (worksheet[cell] && worksheet[cell].t === 'n') {
      worksheet[cell].t = 's'; // Treat the cell as a string
    }
  });
 
  // Specify column widths as before
  worksheet['!cols'] = [];
  this.eraOverpaidClaims.forEach(row => {
    Object.keys(row).forEach(key => {
      if (typeof row[key] === 'number') {
        worksheet['!cols'].push({ wch: String(row[key]).length + 2 });
      }
    });
  });
 
  // Format date cells as "MM/DD/YY"
  const dateColIndices = [/* Add the indices of columns containing date values */];
  dateColIndices.forEach(colIndex => {
    for (let row = 2; row <= this.eraOverpaidClaims.length; row++) {
      const cellRef = xlsx.utils.encode_cell({ c: colIndex, r: row });
      if (worksheet[cellRef] && worksheet[cellRef].t === 's') {
        const dateValue = new Date(worksheet[cellRef].v);
        if (!isNaN(dateValue.getTime())) {
          worksheet[cellRef].v = dateValue.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
        }
      }
    }
  });
 
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const excelBuffer: any = xlsx.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });
 
  this.saveAsExcelFile(excelBuffer, 'Negative Balance Claims');
}

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE ='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
    type: EXCEL_TYPE,
  });
  FileSaver.saveAs(
    data,
    fileName + EXCEL_EXTENSION
  );
}



}
