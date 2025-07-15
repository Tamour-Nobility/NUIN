import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormControl } from '@angular/forms';
import { IMyDateRangeModel } from 'mydaterangepicker';
import * as moment from 'moment';

import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { ReportRequestModel } from '../../dynamic-reports/models/report-request.model';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { DatatableService } from '../../../app/services/data/datatable.service';

@Component({
    selector: 'practice-analysis-report',
    templateUrl: './practice-analysis.component.html'
})
export class PracticeAnalysisComponent implements OnInit {
    data: any;
    form: FormGroup;
    request: ReportRequestModel;
    dataTable: any;
    myDateRangePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%'
    };
    isSearchInitiated: boolean = false;
    practicesList: SelectListViewModel[];
    constructor(private chRef: ChangeDetectorRef,
        private toastService: ToastrService,
        private API: APIService,
        private datatableService: DatatableService) {
        this.request = new ReportRequestModel();
        this.data = [];
        this.practicesList = [];
    }

    ngOnInit() {
        this.InitializeForm();
        this.getPractices();
    }

    getPractices() 
    {
        debugger;
        this.API.getData('/Setup/GetPracticeList').subscribe(d => {
            if (d.Status == "Sucess")
                 {
                    debugger
                    this.practicesList = d.Response;
                    this.practicesList = this.practicesList.map(practice => {
                    return {
                        ...practice,  // Keep all existing properties
                        PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
                      };
                     });
                }
            else 
              {
                swal('Failed', d.Status, 'error');
              }
              })
    }

    InitializeForm(): any {
        this.form = new FormGroup({
            dateRange: new FormControl(null),
            practiceCode: new FormControl(null),
        });
    }

    onDateRangeChanged(event: IMyDateRangeModel) {
        this.request.dateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
        this.request.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
    }

    onSearch() {
        let practicecodewithname=this.form.get('practiceCode').value
        let practiceCode= this.form.get('practiceCode').value
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.request.practiceCode=practiceCode;
        debugger
        if (this.canSearch()) {
            this.API.PostData('/Report/PeriodAnalysisAndClosing', this.request, (res) => {
                this.isSearchInitiated = true;
                if (res.Status == "success") {
                    debugger
                    this.request.practiceCode=practicecodewithname;
                    this.updateDatatable(res.Response);
                }
                else
                    swal(res.status, res.Response, 'error');
            });
        }
         else {
            this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
        }
        this.request.practiceCode=practicecodewithname;
    }

    updateDatatable(data) {
        debugger
        if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
        }
        this.data = data;
        this.chRef.detectChanges();
        const table: any = $('.datatablePracticeAnalysisByFacility');
        this.dataTable = table.DataTable({
            language: {
                emptyTable: "No data available"
            },
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Practice Analysis by Facility', this.request.dateFrom, this.request.dateTo]),
        });
    }


    canSearch() {
        return (!Common.isNullOrEmpty(this.request.practiceCode) &&
            !Common.isNullOrEmpty(this.request.dateFrom) &&
            !Common.isNullOrEmpty(this.request.dateTo));
    }

    onClear() {
        this.isSearchInitiated = false;
        this.chRef.detectChanges();
        this.dataTable.destroy();
        // this.request
        this.request = new ReportRequestModel();
        this.form.reset();
        this.data = [];
    }
}
