import { Component, OnInit } from '@angular/core';
import { Practice, ClaimDetail } from './classes/edi-general-class';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from '../components/services/api.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-edi-setup-main',
  templateUrl: './edi-setup-main.component.html'
})
export class EdiSetupMainComponent implements OnInit {
  listPractice: Practice[];
  ediForm: FormGroup;
  ddlPracticeCode: number = 0;
  inClaimNo: number;
  objClaimDetail: ClaimDetail;
  isSearchInitiated: boolean = false;
  constructor(public API: APIService) {
    this.listPractice = [];
    this.objClaimDetail = new ClaimDetail();
  }

  ngOnInit() {
    this.getPractice();
    this.InitForm();
  }
  InitForm() {
    this.ediForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),
      claim: new FormControl('', [
        Validators.required
      ]),
    });
  }
  getPractice() {
    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPractice = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  getClaimSubmissionDetail() {
    if (isNullOrUndefined(this.ddlPracticeCode) || this.ddlPracticeCode == 0) {
      swal('EDI Setup', 'Select Practice.', 'warning');
      return;
    }

    if (isNullOrUndefined(this.inClaimNo) || this.inClaimNo == 0) {
      swal('EDI Setup', 'Enter Claim #.', 'warning');
      return;
    }
    this.isSearchInitiated = true;
    this.API.getData('/Submission/GenerateBatch_5010_P?practice_id=' + this.ddlPracticeCode + '&claim_id=' + this.inClaimNo).subscribe(
      d => {
        if (d.Status == "Success") {
          this.objClaimDetail.Details = d.Response;
        }
        else {
          let error = d.Response;
          if (error && error.length > 0) {
            let errorStr = error.join(',');
            this.objClaimDetail.Details = errorStr;
          }
          else {
            swal('Error', d.Response, 'error');
          }
        }
      })
  }
}
