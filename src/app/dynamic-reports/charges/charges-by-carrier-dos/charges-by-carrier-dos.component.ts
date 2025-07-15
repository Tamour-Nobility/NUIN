import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDateRangeModel } from 'mydaterangepicker';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';

import { APIService } from '../../../components/services/api.service';
import { Common } from '../../../services/common/common';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { ReportRequestModel } from '../../models/report-request.model';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { DatatableService } from '../../../services/data/datatable.service';
import { ChargesDateRangeTypes } from '../../models/report-criterias';
import { NO_DATA_AGAINST_FILTER } from '../../../constants/messages';

@Component({
    selector: 'charges-by-carrier-dos-report',
    templateUrl: './charges-by-carrier-dos.component.html'
})
export class ChargesByCarrierDos implements OnInit {
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
    mappedReportData: any[] = [];
    reportColumns: any[] = [];
    dateRangeTypes = ChargesDateRangeTypes;
    constructor(private chRef: ChangeDetectorRef,
        private toastService: ToastrService,
        private API: APIService,
        private gv: GvarsService,
        private datatableService: DatatableService,
        private currency: CurrencyPipe) {
        this.request = new ReportRequestModel();
        this.locationSelectList = [];
        this.selectedLocations = [];
    }

    ngOnInit() {
        this.InitializeForm();
        this.getLocations();
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
        this.request.dateType = 'dos';
        this.isDateValid = false;
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
            this.API.PostData('/Report/ByCarrierDOS', this.request, (res) => {
                this.isSearchInitiated = true;
                if (res.Status == "success" && res.Response && res.Response.length > 0) {
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
        this.mappedReportData = [];
        this.reportColumns = [];
        if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
        }
       
       
       // this.mappedReportData = data.map(obj => Object.values(obj).map((v, index) => index > 1 ? this.currency.transform(v) : v));
        
        
       this.mappedReportData = data.map(obj => {
        return Object.values(obj).map((v, index) => {
          if (index > 1 && obj.Type.includes('CHARGES')) {
            return this.currency.transform(v);
          } else {
            return v;
          }
        });
      });

        
        
        if (data.length > 0)
            this.reportColumns = Object.keys(data[0]).map((key) => ({ title: key }));
        this.chRef.detectChanges();
        const table: any = $('.dataTableByCPTDos');
        this.dataTable = table.DataTable({
            "data": this.mappedReportData,
            "columns": this.reportColumns,
            "scrollX": true,
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(['Charges by Carrier', this.request.dateFrom, this.request.dateTo]),
        });
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
        this.mappedReportData = [];
        this.reportColumns = [];
        // this.request
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
