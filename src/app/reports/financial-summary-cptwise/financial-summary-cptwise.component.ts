import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { DatePipe } from '@angular/common'

import { FinancialAnalysisCPT, PracticesList } from '../classes/aging-summary-report-model';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { DatatableService } from '../../../app/services/data/datatable.service';

@Component({
  selector: 'app-financial-summary-cptwise',
  templateUrl: './financial-summary-cptwise.component.html'
})
export class FinancialSummaryCPTWiseComponent implements OnInit {
  strToDate: string = "";
  strFromDate: string = "";
  CPTWForm: FormGroup;
  dataTable: any;
  listFinancialSummary: FinancialAnalysisCPT[];
  listPracticesList: PracticesList[];
  ddlPracticeCode: number = 0;
  isSearchInitiated: boolean = false;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '93%'
  };
  public placeholder: string = 'MM/DD/YYYY';
  Dateoptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    public datepipe: DatePipe,
    private datatableService: DatatableService) {
    this.listFinancialSummary = [];
    this.listPracticesList = [];
  }

  ngOnInit() {
    this.getPractices();
    var curDate = new Date();
    this.InitForm();
    // this.strToDate = this.datepipe.transform(curDate, 'MM/dd/yyyy');
    // this.strFromDate = this.datepipe.transform(curDate, 'MM/dd/yyyy');
  }
  InitForm() {
    this.CPTWForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
      dateTo: new FormControl('', [
        Validators.required
      ]),
      dateFrom: new FormControl('', [
        Validators.required
      ]),
    });
  }
  formatDate(date: string) {
    if (date == null)
      return;
    var day = parseInt(date.split('/')[1]) < 10 ? date.split('/')[1] : date.split('/')[1];
    var month = parseInt(date.split('/')[0]) < 10 ? date.split('/')[0] : date.split('/')[0];
    var year = date.split('/')[2];
    if (year != undefined && month != undefined && day != undefined)
      return month + "/" + day + "/" + year;
  }

  onDateChanged(event, Type: any) {
    if (Type == "TO")
      this.strToDate = event.formatted;
    else if (Type == "FROM")
      this.strFromDate = event.formatted;
  }

  getAgingSummaryReport() {
    if (!Common.isNullOrEmpty(this.strFromDate) && !Common.isNullOrEmpty(this.strToDate) && !Common.isNullOrEmpty(this.ddlPracticeCode)) {
      this.isSearchInitiated = true;
      this.API.getData('/Report/FinancialAnalysisCPTLevelReport?PracticeCode=' + this.ddlPracticeCode + '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate).subscribe(
        d => {
          if (d.Status == "Sucess") {
            if (this.dataTable) {
              this.dataTable.destroy();
            }
            this.listFinancialSummary = d.Response;
            this.chRef.detectChanges();
            const table: any = $('.dataTableFSSPTW');
            this.dataTable = table.DataTable({
              "order": [[2, "desc"]],
              language: {
                emptyTable: "No data available"
              },
              "scrollX": true,
              dom: this.datatableService.getDom(),
              buttons: this.datatableService.getExportButtons(['CPT wise Financial Summary', this.strFromDate, this.strToDate]),
            });
          }
          else {
            swal('Failed', d.Status, 'error');
          }
        })
    } else {
      swal("Reports", "Please provide required values", "error");
    }
  }


  getPractices() {
    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
}