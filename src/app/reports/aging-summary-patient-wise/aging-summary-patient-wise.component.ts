import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';

import { AgingPatientSummary, PracticesList } from '../classes/aging-summary-report-model'
import { APIService } from '../../components/services/api.service';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aging-summary-patient-wise',
  templateUrl: './aging-summary-patient-wise.component.html',
  styleUrls: ['../reports.css']
})
export class AgingSummaryPatientWiseComponent implements OnInit {
  dataTable: any;
  listAgingSummary: AgingPatientSummary[];
  listPracticesList: PracticesList[];
  ddlPracticeCode: number = 0;
  isRouted: boolean = false;
  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute) {
    this.listAgingSummary = [];
    this.listPracticesList = [];
  }

  ngOnInit() {
    this.getPractices();
    this.route.queryParams.subscribe(qps => {
      if (qps && qps['PracticeCode']) {
        this.isRouted = true;
        this.ddlPracticeCode = qps['PracticeCode'];
        this.getAgingSummaryReport(this.ddlPracticeCode);
      }
    })
  }

  getAgingSummaryReport(Practice_Code: any) {
    this.API.getData('/Report/AgingSummaryPatientAnalysisReport?PracticeCode=' + Practice_Code).subscribe(
      d => {
        if (d.Status == "Sucess") {
          if (this.dataTable) {
            this.dataTable.destroy();
          }
          this.listAgingSummary = d.Response;
          this.chRef.detectChanges();
          const table: any = $('.dataTableASPW');
          this.dataTable = table.DataTable({
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Patient Wise Aging Summary', moment(new Date()).format("MM/DD/YYYY")]),
            "order": [[8, "desc"]],
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

  onchangePractice() {
    if (this.ddlPracticeCode == undefined || this.ddlPracticeCode == null || this.ddlPracticeCode == 0)
      return;
    this.getAgingSummaryReport(this.ddlPracticeCode);
  }
}