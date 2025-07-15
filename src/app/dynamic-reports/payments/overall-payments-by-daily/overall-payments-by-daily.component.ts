import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common'
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';

import { APIService } from '../../../components/services/api.service';
import { Common } from '../../../services/common/common';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { ReportRequestModel } from '../../models/report-request.model';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { DatatableService } from '../../../services/data/datatable.service';
import { PaymentDateRangeTypes } from '../../models/report-criterias';
import { NO_DATA_AGAINST_FILTER } from '../../../constants/messages';

@Component({
    selector: 'overall-payments-by-daily-report',
    templateUrl: './overall-payments-by-daily.component.html'
})
export class OverallPaymentsByDaily implements OnInit {
    data: any;
    form: FormGroup;
    request: ReportRequestModel;
    dataTable: any;
    isSearchInitiated: boolean = false;
    today = new Date();
    isDateValid: boolean;
    myDateRangePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '100%',
        disableSince: {
            year: this.today.getFullYear(),
            month: this.today.getMonth() + 1,
            day: this.today.getDate() + 1,
        },
    };
    locationSelectList: SelectListViewModel[];
    selectedLocations: SelectListViewModel[];
    locationsSettings = {};
    //#region Chart
    public barChartOptions: ChartOptions = {
        responsive: true,
        scales: {
            xAxes: [{}], yAxes: [{
                ticks: {
                    callback: function (value, index, values) {
                        return Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
                    }
                }
            }]
        },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        },
        tooltips: {
            callbacks: {
                label: function (t, d) {
                    var xLabel = d.datasets[t.datasetIndex].label;
                    var yLabel = t.yLabel >= 1000 ? '$' + t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '$' + t.yLabel;
                    return xLabel + ': ' + yLabel;
                }
            }
        }
    };
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartLabels: string[] = [];
    public barChartData: ChartDataSets[] = [{ data: [], label: 'Charges Claims' }];
    //#endregion
    dateRangeTypes = PaymentDateRangeTypes;
    dateLabel = "";
    constructor(private chRef: ChangeDetectorRef,
        private toastService: ToastrService,
        private API: APIService,
        private gv: GvarsService,
        private datePipe: DatePipe,
        private datatableService: DatatableService) {
        this.request = new ReportRequestModel();
        this.data = [];
        this.locationSelectList = [];
        this.selectedLocations = [];
    }

    ngOnInit() {
        this.InitializeForm();
        this.getLocations()
        this.locationsSettings = {
            text: "Select Locations",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: "myclass custom-class-ng2-multi-dropdown",
            primaryKey: "Id",
            labelKey: "Name",
            noDataLabel: "Search Locations...",
            enableSearchFilter: true,
            badgeShowLimit: 3
        };
        this.request.dateType = 'doe';
        this.isDateValid = false;
    }
    //Added by HAMZA ZULFIQAR as per USER STORY 119: Reporting Dashboard Implementation For All Practices
    isReporting()
    {
        return this.gv.isReportingPerson();
    }

    getLocations() {
        this.API.getData(`/Demographic/GetLocationSelectList?searchText=''&practiceCode=${this.gv.currentUser.selectedPractice.PracticeCode}&all=${true}`).subscribe(res => {
            if (res.Status === 'Success')
                this.locationSelectList = res.Response;
        });
    }

    InitializeForm(): any {
        this.form = new FormGroup({
            dateRange: new FormControl(null),
            location: new FormControl(null),
            dateRangeType: new FormControl(null, [Validators.required])
        });
    }

    onDateRangeChanged(event: IMyDateRangeModel) {
        this.request.dateFrom = Common.isNullOrEmpty(event.beginJsDate) ? null : moment(event.beginJsDate).format('MM/DD/YYYY');
        this.request.dateTo = Common.isNullOrEmpty(event.endJsDate) ? null : moment(event.endJsDate).format('MM/DD/YYYY');
    }

    onSearch() {
        if (this.canSearch()) {
            this.request.locationCode = this.selectedLocations.map(l => l.Id);
            this.request.practiceCode = this.gv.currentUser.selectedPractice.PracticeCode;
            this.API.PostData('/Report/PaymentDailyRefresh', this.request, (res) => {
                this.isSearchInitiated = true;
                if (res.Status == "success" && res.Response && res.Response.length > 0) {
                    this.dateLabel = this.dateRangeTypes.find(drt => drt.id === this.request.dateType).label;
                    this.updateChart(res.Response);
                    this.updateDatatable(res.Response);
                }
                else {
                    this.toastService.warning(NO_DATA_AGAINST_FILTER, 'No result');
                    this.updateDatatable(res.Response);
                }
            });
        } else {
            this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
        }
    }

    updateDatatable(data) {
        if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
        }
        this.data = data;
        this.chRef.detectChanges();
        const table: any = $('.datatablePaymentDaily');
        this.dataTable = table.DataTable({
            columnDefs: [
                {
                    orderable: false,
                    targets: -1
                },
                {
                    type: 'date',
                    targets: 0
                }
            ],
            language: {
                emptyTable: "No data available"
            },
            order: [0, 'desc'],
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Overall Payments Daily', this.request.dateFrom, this.request.dateTo]),
        });
    }

    updateChart(data) {
        if (data && data.length > 0)
            data = data.reverse();
        this.barChartLabels = data.map(d => this.datePipe.transform(d.Date, 'MM/dd/yyyy'));
        this.barChartData = [{ data: data.map(d => d.PAYMENT), label: 'Daily Payments' }];
    }

    canSearch() {
        return ((!Common.isNullOrEmpty(this.selectedLocations) && this.selectedLocations.length > 0) &&
            !Common.isNullOrEmpty(this.request.dateFrom) &&
            !Common.isNullOrEmpty(this.request.dateTo) &&
            this.form.valid && this.isDateValid);
    }

    onClear() {
        this.chRef.detectChanges();
        this.dataTable && this.dataTable.destroy();
        // this.request
        this.data = [];
        this.selectedLocations = [];
        this.isSearchInitiated = false;
        this.form.reset();
        this.request = new ReportRequestModel();
    }

    onDeSelectAllLocations() {
        this.selectedLocations = [];
    }

    inputFieldChanged({ valid }) {
        this.isDateValid = valid;
    }
}
