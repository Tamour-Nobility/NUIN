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
import { Router } from '@angular/router';
import { Common } from '../../../services/common/common';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-claim-rejection',
  templateUrl: './claim-rejection.component.html',
  styleUrls: ['./claim-rejection.component.css']
})
export class ClaimRejectionComponent implements OnInit {  
  prac: any; 
  showFullMessage: { [key: string]: boolean } = {};
  listPracticesList: SelectListViewModel[];
  practiceCode: number;
  ClaimRejection: any[];
  ClaimRejectionTable: any;
  @ViewChild('myPopover') myPopover: Popover;
  checkAll: boolean = false;
  constructor(private _api: APIService,
              private chRef: ChangeDetectorRef,
              private _gv: GvarsService,
              private router: Router,
              private datatableService: DatatableService) {
    this.listPracticesList = [];
    this.ClaimRejection = [];
  }
  ngOnInit() {
    this.prac = { RejectionReason: "Your long rejection reason goes here." };
    this.getPractices();
  }
  toggleFullMessage(attribute: string) {
    this.showFullMessage[attribute] = !this.showFullMessage[attribute];
  }
  getPractices() {
    this._api.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
          const userLvlPractice = this.listPracticesList.find(p => p.Id == this._gv.currentUser.selectedPractice.PracticeCode)
          if (userLvlPractice) {
            this.practiceCode = userLvlPractice.Id;
            this.onSelectPractice(null);
          }
        } else {
          swal('Failed', d.Status, 'error');
        }
      });
  }
  onSelectPractice(e: any) {
    if (this.practiceCode) {
      this.checkAll = false;
      this._api.getData(`/Scrubber/GetClaimRejections?PracticeCode=${this.practiceCode}`).subscribe(
        (objResponse) => {
          if (objResponse.Status == 'Success') {
            if (this.ClaimRejectionTable) {
              this.chRef.detectChanges();
              this.ClaimRejectionTable.destroy();
            } 
            this.ClaimRejection = objResponse.obj;
            this.chRef.detectChanges();
          const table: any = $('.ClaimRejectionTable');
          this.ClaimRejectionTable = table.DataTable({
            language: {
              emptyTable: "No data available"
            },
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(["Scrubber report"])
          });
        } 
        else {
          console.log('Error fetching Claim Submission Report');
          this.ClaimRejectionTable = $(
            '.ClaimRejectionTable'
          ).DataTable({
            columnDefs: [{ orderable: false, targets: -1 }],
            language: {
              emptyTable: 'No data available',
            },
          });
        }
        }
      );
    }
    else {
      swal('Failed', 'Please insert data', 'error');
    } 
  }
  editClaim(claimNo, patientAccount, firstName, lastName) {
    this.router.navigate(['/Patient/Demographics/ClaimDetail/',
      Common.encodeBase64(JSON.stringify({
        Patient_Account: patientAccount,
        claimNo: claimNo,
        disableForm: false,
        PatientLastName: lastName,
        PatientFirstName: firstName
      }))]);
  }
}
