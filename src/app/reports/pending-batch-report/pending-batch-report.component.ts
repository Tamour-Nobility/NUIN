import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../components/services/api.service';
import { ReportRequestModel } from '../../dynamic-reports/models/report-request.model';
import { Common } from '../../services/common/common';
import { DatatableService } from '../../services/data/datatable.service';
import * as xlsx from 'xlsx';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PracticesList } from '../classes/aging-summary-report-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pending-batch-report',
  templateUrl: './pending-batch-report.component.html',
  styleUrls: ['./pending-batch-report.component.css']
})
export class PendingBatchReportComponent implements OnInit {

  PendingBatchReport: any[] = [];
   SearchForm: FormGroup;

   requestPayload: any = {
    practiceCode: '',
  };

listPracticesList: any;
isRouted: boolean = false;
ddlPracticeCode: number = 0;
isDisabled:boolean = false;
firstLoad:boolean = false;
dataTable: any;
  constructor( 
    private chRef: ChangeDetectorRef,
    private API: APIService,
    public datatableService: DatatableService,
    private route: ActivatedRoute,private fb: FormBuilder
  ) {
    this.SearchForm = this.fb.group({
      PracCode: [''] 
    });
  }
  ngOnInit() {
    this.getPractices();
    this.route.queryParams.subscribe(qs => {
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        this.getPendingBatchReport(qs['PracticeCode']);
      }
    })
  }
  getPractices() {

    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          debugger
          this.listPracticesList = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  getPendingBatchReport(Practice_Code: any) {
    this.firstLoad = true
    this.requestPayload.practiceCode = Practice_Code;
    if(this.requestPayload.practiceCode)
    {
      this.API.getData('/Submission/Get999Report?PracticeCode=' + this.requestPayload.practiceCode).subscribe(
        d => {
          if (d.Status === "Success") {
            if (this.dataTable) {
              this.dataTable.destroy();
              this.dataTable = null;
            }
            this.PendingBatchReport = d.Response;
            this.chRef.detectChanges(); 
            if (this.PendingBatchReport.length > 0) {
              const table: any = $('.dataTablePR');
              this.dataTable = table.DataTable({
                "scrollX": true,
                dom: this.datatableService.getDom(),
                buttons: this.datatableService.getExportBtn(['Pending 999 report', this.requestPayload.practiceCode +'-'+ moment(new Date()).format("MM/DD/YYYY")]),
                language: {
                  emptyTable: "No data available"
                }
              });
            }
          } else {
            swal('Failed', d.Status, 'error');
          }
        },
        error => {
          swal('Error', 'Failed to fetch report data', 'error');
        }
      );
    }
    else {
      swal('Failed', 'Please select practice', 'error');
    }
    
  }
  
  onchangePractices(practiceCode: string) {
    this.isDisabled = true
    this.requestPayload.practiceCode = practiceCode.toString();
  }
}