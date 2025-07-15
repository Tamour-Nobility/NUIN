import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { PatientStatementClaimsComponent } from '../patient-statement-claims/patient-statement.claims.component';
import { PatientStatementRequest, StatementRequest } from '../../../patient/Classes/PatientStatement.model';
import { Popover } from 'ngx-popover';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { APIService } from '../../../components/services/api.service';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { DatatableService } from '../../../services/data/datatable.service';
declare var $: any;

@Component({
  selector: 'app-patient-statement',
  templateUrl: './patient-statement.component.html'
})
export class PatientStatementComponent implements OnInit {
  listPracticesList: SelectListViewModel[];
  subsGetPractices: Subscription;
  practiceCode: number;
  patientList: any[];
  datatable: any;
  patientStatementRequest: PatientStatementRequest;
  @ViewChild(PatientStatementClaimsComponent) PatientStatementClaimsComponent;
  PatientAccount: number;
  ExcludedClaimsIds: number[];
  @ViewChild('myPopover') myPopover: Popover;
  checkAll: boolean = false;
  constructor(private _api: APIService,
    private chRef: ChangeDetectorRef,
    private _gv: GvarsService,
    private datatableService: DatatableService) {
    this.listPracticesList = [];
    this.patientList = [];
    this.patientStatementRequest = new PatientStatementRequest();
    this.ExcludedClaimsIds = [];
  }

  ngOnInit() {
    this.getPractices();
  }

  getPractices() {
    debugger;
    this._api.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
          const userLvlPractice = this.listPracticesList.find(p => p.Id == this._gv.currentUser.selectedPractice.PracticeCode)
          if (userLvlPractice) {
            this.practiceCode = userLvlPractice.Id;
            this.onSelectPractice(null);
          }
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  onSelectPractice(e: any) {
    debugger;
    if (this.practiceCode) {
      this.patientStatementRequest = new PatientStatementRequest();
      this.checkAll = false;

      this._api.getData(`/Demographic/GetStatementPatient?PracticeCode=${this.practiceCode}`).subscribe(r => {
        if (r.Status == 'Success') {
          if (this.datatable) {
            this.datatable.destroy();
            this.chRef.detectChanges();
          }
          debugger
          this.patientList = r.Response;
          this.chRef.detectChanges();
          const table = $('.dataTablePatientForStatement');
          this.datatable = table.DataTable({
            columnDefs: [{
              orderable: false,
              className: 'select-checkbox',
              targets: 0
            },
            {
              orderable: false,
              targets: 4
            }],
            select: {
              style: 'multi',
              selector: 'td:first-child'
            },
            order: [1, 'asc'],
          language: {
              emptyTable: "No data available"
            }
          });
          this.datatable.on('select', (e, dt, type, indexes) => this.onRowSelect(indexes));
          this.datatable.on('deselect', (e, dt, type, indexes) => this.onRowDeselect(indexes));
        } else {
          swal("Patient Statement", r.Status, "success");
        }
      })
    }
  }

  showPatientClaims(patientAccount: number, ndx: any) {
    this.SelectCurrentPatient(ndx);
    this.PatientAccount = patientAccount;
    let excludedClaims = this.patientStatementRequest.statementRequest.find(f => f.PatientAccount == patientAccount);
    if (excludedClaims && excludedClaims.ExcludedClaimsIds.length > 0) {
      this.ExcludedClaimsIds = excludedClaims.ExcludedClaimsIds;
    }

    this.PatientStatementClaimsComponent.show();
  }

  onGeneratePatientStatement(format: string) {
    this.patientStatementRequest.PracticeCode = this.practiceCode;
    this.patientStatementRequest.Format = format;
    if (this.patientStatementRequest && this.patientStatementRequest.statementRequest && this.patientStatementRequest.statementRequest.length > 0) {
      this._api.PostData(`/Demographic/GeneratePatientStatement`, this.patientStatementRequest, (res => {
        if (res.Status == "Success") {
          this.onSelectPractice(null);
          swal("Patient Statement", "Patient Statement has been generated successfully.", "success");
          this.patientStatementRequest.Confirmation = false;
          this.checkAll = false;
        }
        else if (res.Status === 'Confirmation') {
          swal({
            title: 'Patient Statement',
            text: res.Response,
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#d33'
          }).then((result) => {
            if (result) {
              this.patientStatementRequest.Confirmation = true;
              this.onGeneratePatientStatement('xml');
            }
          })
        }
        else {
          swal("Patient Statement", res.Status, "error");
        }
      }))
    } else swal("Patient Statement", "No patient selected to generate statement.", "warning");
  }

  SelectCurrentPatient(ndx: number) {
    this.datatable.rows(ndx).select();
  }

  onHidePatientStatement(e: any) {
    debugger;
    var currentPatient = this.patientStatementRequest.statementRequest.find(f => f.PatientAccount == e.PatientAccount);
    if (isNullOrUndefined(currentPatient))
      this.patientStatementRequest.statementRequest.push(new StatementRequest(e.PatientAccount, e.ExcludedClaimsIds));
    else
      currentPatient.ExcludedClaimsIds = e.ExcludedClaimsIds;
    if (e.PatientDeselected) {
      for (let r = 0; r < this.datatable.rows().count(); r++) {
        if (this.datatable.cell(r, 1).data() == e.PatientAccount) {
          this.datatable.rows(r).deselect();
        }
      }
    }
  }

  onRowDeselect(indexes: any) {
    this.checkAll = false;
    let ndx = this.patientStatementRequest.statementRequest.findIndex(p => p.PatientAccount == this.datatable.cell(indexes, 1).data());
    if (ndx > -1) {
      this.patientStatementRequest.statementRequest.splice(ndx, 1);
    }
  }

  onRowSelect(indexes: any) {
    if (this.patientStatementRequest.statementRequest.findIndex(p => p.PatientAccount == this.datatable.cell(indexes, 1).data()) < 0) {
      this.patientStatementRequest.statementRequest.push(new StatementRequest(this.datatable.cell(indexes, 1).data()));
    }
    var count = this.datatable.rows().count();
    if (count === this.patientStatementRequest.statementRequest.length) {
      this.checkAll = true;
    }
  }

  onToggleCheckAll(checked: boolean) {
    if (checked) {
      this.datatable.rows().select();
      var count = this.datatable.rows({ selected: true }).count();
      var rows = this.datatable.rows({ selected: true }).data();
      this.patientStatementRequest.statementRequest = [];
      for (let index = 0; index < count; index++) {
        this.patientStatementRequest.statementRequest.push(new StatementRequest(rows[index][1]));
      }
    } else {
      this.datatable.rows().deselect();
      this.patientStatementRequest.statementRequest = [];
    }
  }
}
