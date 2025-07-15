import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';

import { Aging_Summary_Analysis_Report_Result, PracticesList } from '../classes/aging-summary-report-model'
import { APIService } from '../../components/services/api.service';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aging-summary-report',
  templateUrl: './aging-summary-report.component.html',
  styleUrls: ['../reports.css']
})
export class AgingSummaryReportComponent implements OnInit {
  dataTable: any;
  listAgingSummary: Aging_Summary_Analysis_Report_Result[];
  listPracticesList: PracticesList[];
  ddlPracticeCode: String | number = 0;
  isRouted: boolean = false;
  Checkpraccode:any;
  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute) {
    this.listAgingSummary = [];
    this.listPracticesList = [];
  }

  ngOnInit() {
    this.getPractices();
    this.route.queryParams.subscribe(qs => {
      if (qs && qs['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qs['PracticeCode'];
        this.getAgingSummaryReport(qs['PracticeCode']);
      }
    })
  }

  getAgingSummaryReport(Practice_Code: any) {
    this.API.getData('/Report/AgingSummaryAnalysisReport?PracticeCode=' + Practice_Code).subscribe(
      d => {
        if (d.Status == "Sucess") {
          if (this.dataTable) {
            this.dataTable.destroy();
          }
          this.listAgingSummary = d.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableASR');
          this.dataTable = table.DataTable({
            "order": [[8, "desc"]],
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.getExportButtons(),
            language: {
              emptyTable: "No data available"
            }
          });
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  getExportButtons() {
    const isReportAvailable = this.listAgingSummary.length ==0;
    return this.datatableService.getExportButtons(['Aging Summary', moment(new Date()).format("MM/DD/YYYY")], isReportAvailable);
  }
  
  getPractices() {

    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
          this.listPracticesList = this.listPracticesList.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
              };
             });
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  onchangePractice(selectedPracticeCode?: any) {
    debugger;
    if(selectedPracticeCode!=0)
    {
      let practiceCode=selectedPracticeCode
      if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
        const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
        practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
      }
      this.Checkpraccode=practiceCode
    }
    

    if (this.Checkpraccode == undefined || this.Checkpraccode == null || this.Checkpraccode == 0) {
      swal('Failed', "Select Practice", 'error');
      return;
    }
    this.getAgingSummaryReport(this.Checkpraccode);
  }




}