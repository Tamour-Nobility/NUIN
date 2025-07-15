import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Injectable } from '@angular/core';
import { GvarsService } from '../../../../services/G_vars/gvars.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../../../../components/services/api.service';
import { ProviderAppointmentRuleViewModel, ProviderAppointmentRules } from '../../../models/timing.model';
import { Common } from '../../../../services/common/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

/**
 * Example of a String Time adapter
 */
@Injectable()
export class NgbTimeStringAdapter extends NgbTimeAdapter<string> {

  fromModel(value: string | null): NgbTimeStruct | null {
    if (!value) {
      return null;
    }
    const split = value.split(':');
    return {
      hour: parseInt(split[0], 10),
      minute: parseInt(split[1], 10),
      second: parseInt(split[2], 10)
    };
  }

  toModel(time: NgbTimeStruct | null): string | null {
    return time != null ? `${pad(time.hour)}:${pad(time.minute)}:${pad(time.second)}` : null;
  }
}

@Component({
  selector: 'app-add-edit-block-appointments',
  templateUrl: './add-edit-block-appointments.component.html',
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }]
})
export class AddEditBlockAppointmentsComponent implements OnInit {
  //Modal 
  @ViewChild(ModalDirective) modalWindow: ModalDirective
  modalTitle: string;
  modalMode = '';
  // input properties
  @Input() providerAppointmentRule: ProviderAppointmentRules;
  @Input() locationCode: number;
  @Input() providerCode: number;
  // output properties
  @Output() close: EventEmitter<ProviderAppointmentRules> = new EventEmitter();
  // private _scheduleModel;
  form: FormGroup;
  appointmentRuleView: ProviderAppointmentRuleViewModel;
  today: Date;
  minDate: String;
  meridian: boolean = true;

  constructor(private _gv: GvarsService,
    private _api: APIService,
    private toast: ToastrService,
    private datepipe: DatePipe) {
    this.initForm();
    this.appointmentRuleView = new ProviderAppointmentRuleViewModel();
  }

  ngOnInit(): void {

  }

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  initForm() {
    this.today = new Date();
    let year = this.today.getFullYear();
    let month = (this.today.getMonth() + 1) < 10 ? '0' + (this.today.getMonth() + 1) : (this.today.getMonth() + 1).toString();
    let day = (this.today.getDate()) < 10 ? '0' + this.today.getDate() : (this.today.getDate()).toString();
    this.minDate = year + '-' + month + '-' + day;
    this.form = new FormGroup({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      timefrom: new FormControl(null, [Validators.required]),
      timeTo: new FormControl(null, [Validators.required]),
    });
  }

  onModalShown(event: any) {
    this.initializeEditModel();
  }

  initializeEditModel() {
    if (this.providerAppointmentRule && !Common.isNullOrEmpty(this.providerAppointmentRule.No_Appointments_Start_Time) && !Common.isNullOrEmpty(this.providerAppointmentRule.No_Appointment_End_Time)) {
      this.appointmentRuleView.No_Appointments_Start_Date = this.datepipe.transform(this.providerAppointmentRule.No_Appointments_Start_Time, 'yyyy-MM-dd');
      this.appointmentRuleView.No_Appointments_Start_Time = this.datepipe.transform(this.providerAppointmentRule.No_Appointments_Start_Time, 'HH:mm:ss');
      this.appointmentRuleView.No_Appointment_End_Date = this.datepipe.transform(this.providerAppointmentRule.No_Appointment_End_Time, 'yyyy-MM-dd');
      this.appointmentRuleView.No_Appointment_End_Time = this.datepipe.transform(this.providerAppointmentRule.No_Appointment_End_Time, 'HH:mm:ss');
      this.modalTitle = `<i class="fa fa-pencil"></i>&nbsp;Edit Appointment Rule`;
      this.modalMode = 'edit';
    }
    // new Provider Schedule
    else {
      this.appointmentRuleView = new ProviderAppointmentRuleViewModel();
      this.modalTitle = `<i _" class="fa fa-plus"></i>&nbsp;Add Appointment Rule`;
      this.modalMode = 'new';
    }
  }

  onSubmit() {
    if (this.canSave()) {
      let r: ProviderAppointmentRules = {
        Rule_Id: this.providerAppointmentRule.Rule_Id,
        Practice_Code: this._gv.currentUser.selectedPractice.PracticeCode,
        Provider_code: this.providerCode,
        Location_code: this.locationCode,
        No_Appointments_Start_Time: this.appointmentRuleView.No_Appointments_Start_Date + ' ' + this.appointmentRuleView.No_Appointments_Start_Time,
        No_Appointment_End_Time: this.appointmentRuleView.No_Appointment_End_Date + ' ' + this.appointmentRuleView.No_Appointment_End_Time,
      };
      if (r) {
        // if (this.checkTime(new Date(r.No_Appointments_Start_Time), new Date(r.No_Appointment_End_Time))) {
        this._api.PostData(`/Scheduler/SaveAppointmentRules`, r, (response) => {
          if (response.Status === "Success") {
            this.toast.success('Appointment Rule Saved Successfully.', 'Success');
            this.providerAppointmentRule = response.Response;
            this.timeout(2000);
            this.hide();
          }
          else {
            this.toast.warning(response.Response, 'Validation');
            this.appointmentRuleView.No_Appointments_Start_Date = '';
            this.appointmentRuleView.No_Appointment_End_Date = '';
            this.appointmentRuleView.No_Appointments_Start_Time = '';
            this.appointmentRuleView.No_Appointment_End_Time = '';
          }
        })
        // }
      }
    }
  }

  canSave() {
    if (this.onTimeChange('From') && this.onTimeChange('To'))
      return true;
    else
      return false
  }

  timeout(ms) { //pass a time in milliseconds to this function
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onModalHidden(event: any) {
    this.close.emit(this.providerAppointmentRule);
    this.form.reset();
  }

  show() {
    this.modalWindow.show();
  }

  hide() {
    this.modalWindow.hide();
  }

  onDateChange(d: string) {
    if (this.appointmentRuleView.No_Appointments_Start_Date && this.appointmentRuleView.No_Appointment_End_Date) {
      let dFrom = new Date(this.appointmentRuleView.No_Appointments_Start_Date);
      let dTo = new Date(this.appointmentRuleView.No_Appointment_End_Date);
      if (dFrom > dTo) {
        if (d == "From") {
          this.appointmentRuleView.No_Appointments_Start_Date = '';
          swal('Validation', 'From Date cannot be greater than To Date', 'warning');
        }
        else {
          this.appointmentRuleView.No_Appointment_End_Date = '';
          swal('Validation', 'To Date cannot be less than From Date', 'warning');
        }
      }
    }
  }

  onTimeChange(d: string) {
    if (this.appointmentRuleView.No_Appointments_Start_Time && this.appointmentRuleView.No_Appointment_End_Time) {
      let tFrom = this.appointmentRuleView.No_Appointments_Start_Time;
      let tTo = this.appointmentRuleView.No_Appointment_End_Time;
      if (tFrom >= tTo) {
        if (d == "From") {
          this.appointmentRuleView.No_Appointments_Start_Time = '';
          swal('Validation', 'Time From cannot be greater than or equal to Time To', 'warning');
          return false;
        }
        else {
          swal('Validation', 'Time To cannot be less than or equal to Time From', 'warning');
          this.appointmentRuleView.No_Appointment_End_Time = '';
          return false;
        }
      }
      else
        return true;
    }
  }

  checkTime(tFrom, tTo) {
    let currentTime = new Date();
    if (tFrom.getTime() < currentTime.getTime()) {
      this.appointmentRuleView.No_Appointments_Start_Time = '';
      swal('Validation', 'Time From cannot be less than current time', 'warning');
      // return false;
    }
    else if (tTo.getTime() > currentTime.getTime()) {
      swal('Validation', 'Time To cannot be less than current time From', 'warning');
      this.appointmentRuleView.No_Appointment_End_Time = '';
      // return false;
    }
    else
      return true;
  }
}
