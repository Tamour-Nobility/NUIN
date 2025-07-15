import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { isNullOrUndefined } from 'util';
import { APIService } from '../../../components/services/api.service';
import { Common } from '../../../services/common/common';
declare var $: any;

@Component({
  selector: 'app-patient-statement-claims',
  templateUrl: './patient-statement.claims.component.html'
})

export class PatientStatementClaimsComponent implements OnInit {
  @ViewChild(ModalDirective) patientStatement: ModalDirective;
  @Input('PatientAccount') PatientAccount: number;
  @Input() showDownloadBtn: boolean;
  dataTableStatement: any;
  claimsList: any[];
  @Input() ExcludedClaimsIds: number[];
  @Output() onHidden: EventEmitter<any> = new EventEmitter();
  constructor(private _apiService: APIService,
    private chRef: ChangeDetectorRef) {
    this.claimsList = [];
    this.ExcludedClaimsIds = [];
  }

  ngOnInit() {
  }

  show() {
    this.patientStatement.show();
  }

  hide() {
    this.patientStatement.hide();
  }

  onPatientStatementShown(event) {
    if (!Common.isNullOrEmpty(this.PatientAccount)) {
      this._apiService.getData(`/Demographic/GetPatientClaimsForStatement?PatientAccount=${this.PatientAccount}`).subscribe(
        res => {
          if (res.Status == 'Success') {
            if (this.dataTableStatement) {
              this.dataTableStatement.destroy();
            }
            // res.Response.claimList.forEach(item => {
            //   if (+item.Amt_Due > 0 && item.Pri_Status && (item.Pri_Status.toLowerCase() == 'n' || item.Pri_Status.toLowerCase() == 'r' || item.Pri_Status.toLowerCase() == 'b')) {
            //     item.ResponsibleParty = 'Primary Insurance';
            //   }
            //   else if (+item.Amt_Due > 0 && item.Sec_Status && (item.Sec_Status.toLowerCase() == 'n' || item.Sec_Status.toLowerCase() == 'r' || item.Sec_Status.toLowerCase() == 'b')) {
            //     item.ResponsibleParty = 'Secondary Insurance';
            //   }
            //   else if (+item.Amt_Due > 0 && item.Oth_Status && (item.Oth_Status.toLowerCase() == 'n' || item.Oth_Status.toLowerCase() == 'r' || item.Oth_Status.toLowerCase() == 'b')) {
            //     item.ResponsibleParty = 'Other Insurance';
            //   }
            //   else if (+item.Amt_Due > 0 && item.Pat_Status && (item.Pat_Status.toLowerCase() == 'n' || item.Pat_Status.toLowerCase() == 'r' || item.Pat_Status.toLowerCase() == 'b')) {
            //     item.ResponsibleParty = 'Patient';
            //   }
            //   else {
            //     item.ResponsibleParty = '';
            //   }
            // });
            
            this.claimsList = res.Response;
            this.chRef.detectChanges();
            const table: any = $('.dataTableStatement');
            this.dataTableStatement = table.DataTable({
              lengthMenu: [[5, 10, 15, 20], [5, 10, 15, 20]],
              columnDefs: [{
                'targets': 0,
                'checkboxes': {
                  'selectRow': true
                }
              },
              {
                className: 'control',
                orderable: false,
                targets: 1
              }],
              responsive: {
                details: {
                  type: 'column',
                  target: 1
                }
              },
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
              order: [2, 'asc']
            });
            this.MakeSelection();
          }
        }
      )
    }
  }

  MakeSelection() {
    if (this.claimsList && this.claimsList.length > 0) {
      let rowsLength = this.dataTableStatement.rows().count();
      if (this.ExcludedClaimsIds.length == rowsLength)
        this.dataTableStatement.rows().deselect();
      else {
        // this.dataTableStatement.cell(0,1).data();
        // this.dataTableStatement.cells().count()
        for (let r = 0; r < rowsLength; r++) {
          if (!isNullOrUndefined(this.ExcludedClaimsIds.find(f => f == this.dataTableStatement.cell(r, 2).data()))) {
            this.dataTableStatement.row(r).deselect();
          }
          else
            this.dataTableStatement.row(r).select();
        }
      }
    }
  }

  onPatientStatementHidden(event) {
    let deselectedRows = this.dataTableStatement.rows({ selected: false });
    if (this.showDownloadBtn && deselectedRows[0].length == this.dataTableStatement.rows().count()) {
      swal('Validation', 'Please Select Atleast One Claim', 'error');
      return;
    }
    else {
      let deselectedClaimsIds = this.dataTableStatement.cells(deselectedRows.nodes(), 2).data();
      for (let i = 0; i < deselectedClaimsIds.length; i++) {
        if (this.ExcludedClaimsIds.findIndex(f => f == deselectedClaimsIds[i]) < 0)
          this.ExcludedClaimsIds.push(deselectedClaimsIds[i]);
      }
      let isAllExcluded: boolean = false;
      if (this.dataTableStatement.rows().count() == this.ExcludedClaimsIds.length) {
        isAllExcluded = true;
      }
      this.onHidden.emit({ PatientAccount: this.PatientAccount, ExcludedClaimsIds: JSON.parse(JSON.stringify(this.ExcludedClaimsIds)), PatientDeselected: isAllExcluded });
      this.ExcludedClaimsIds = [];
      this.patientStatement.hide();
    }
  }

  downloadPatientStatment(event) {
    this.onPatientStatementHidden(event);
  }
}