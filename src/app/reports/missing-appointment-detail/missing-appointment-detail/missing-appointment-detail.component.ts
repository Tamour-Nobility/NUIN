import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../../components/services/api.service';
import { DatatableService } from '../../../services/data/datatable.service';
import { MissingAppointmentdetailReport } from '../../classes/appointment-detail-report';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'convertFrom24To12Format'})
@Component({
  selector: 'app-missing-appointment-detail',
  templateUrl: './missing-appointment-detail.component.html'
})
export class MissingAppointmentDetailComponent implements OnInit ,PipeTransform{

  PDForm: FormGroup;
  listPracticesList: any[];
  missingAppDetailRepot: MissingAppointmentdetailReport[];
  dtMissingAppointmentDetail: any;
  ddlPracticeCode: string;
  strFromDate: string;
  strToDate: string;
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };
  public placeholder: string = 'MM/DD/YYYY';
  Dateoptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  isSearchInitiated: boolean = false;
  constructor(
    public API: APIService,
    private chRef: ChangeDetectorRef,
    public toaster: ToastrService,
    public datatableService: DatatableService
  ) {
    this.missingAppDetailRepot = [];
  }

  ngOnInit() {
    this.InitForm();
    this.getPractices();
    // this.getPaymentDetailReport();
  }

  InitForm() {
    this.PDForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
      dateFrom: new FormControl('', [
        Validators.required,
      ]),
      dateTo: new FormControl('', [
        Validators.required,
      ]),
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

  onDateChanged(e, dType: string) {
    if (dType == 'From') {
      this.strFromDate = e.formatted;
    }
    else {
      this.strToDate = e.formatted;
    }
  }
  getMissingAppDetailReport() {
    this.API.getData('/Report/MissingAppointmentDetailReport?PracticeCode=' + this.ddlPracticeCode + '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate).subscribe(
      data => {
        if (data.Status == 'Success') {
          this.isSearchInitiated = true;
          if (this.dtMissingAppointmentDetail) {
            this.chRef.detectChanges();
            this.dtMissingAppointmentDetail.destroy();
          }
          this.missingAppDetailRepot = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dtMissingAppointmentDetail');
          this.dtMissingAppointmentDetail = table.DataTable({
            width: '100%',
            columnDefs: [
              {
                type: 'date', targets: [5]
              },
              {
                width: '15%', targets: [1]
              },
              {
                width: '10%', targets: [0, 2, 5, 6, 7, 9, 10]
              },
              {
                width: '5%', targets: [3, 4, 8]
              }
            ],
            language: {
              emptyTable: "No data available"
            },
            autoWidth: false,
            paging: true,
            scrollX: true,
            scrollY: '290',
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(["Appointment Missing Claims Report"])
          })
        }
        else {
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }

  onClear() {
    this.isSearchInitiated = false;
    this.chRef.detectChanges();
    if (this.dtMissingAppointmentDetail) {
      this.dtMissingAppointmentDetail.destroy();
    }
    this.PDForm.reset();
    this.missingAppDetailRepot = [];
  }
  transform(unformatTime:any):any{
    let hour = (unformatTime.split(':'))[0]
    let min = (unformatTime.split(':'))[1]
    let part = hour > 12 ? 'PM' : 'AM';
    min = (min+'').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour+'').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
  }

}
