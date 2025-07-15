import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { IMyDpOptions } from 'mydatepicker';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../../../components/services/api.service';
import { ProviderWorkingDayTime, ProviderSchedulesViewModel } from '../../models/timing.model';
import { Common } from '../../../services/common/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'add-edit-office-timing',
  templateUrl: './add-edit-office-timing.component.html',
  styleUrls: ['./add-edit-office-timing.component.css']
})
export class AddEditOfficeTimingComponent implements OnInit {
  //Modal 
  @ViewChild(ModalDirective) modalWindow: ModalDirective;
  // Modal
  // input properties
  @Input() providerCode: number;
  @Input() locationCode: number;
  // output properties
  @Output() close: EventEmitter<ProviderSchedulesViewModel> = new EventEmitter();
  // date range
  today = new Date();
  disableDateRangePicker: boolean = false;
  // private _scheduleModel;
  @Input() providerSchedule: ProviderSchedulesViewModel;
  form: FormGroup;
  timings: ProviderWorkingDayTime[];
  existingSchedules: ProviderSchedulesViewModel[];
  modalMode = '';
  public myDateRangePickerOptions: IMyDpOptions = {
    dateFormat: 'mmm, dd yyyy', height: '25px', width: '100%',
    disableUntil: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() - 1,
    },
  }
  modalTitle: string;

  constructor(private _gv: GvarsService,
    private _api: APIService,
    private toast: ToastrService) {
    this.initForm();
    this.timings = [];
    this.existingSchedules = [];
  }

  ngOnInit(): void {
  }

  initForm() {
    this.form = new FormGroup({
      dateRange: new FormControl('', [Validators.required])
    });
  }

  pushMissingWeekDays(weekDays: number[], timings: ProviderWorkingDayTime[]) {
    if (Common.isNullOrEmpty(timings))
      timings = [];
    weekDays.forEach((weekDay: number) => {
      if (timings.findIndex(t => +t.weekday_id === weekDay) < 0) {
        let dayToPush = this.defaultTimingModel.find(t => +t.weekday_id === weekDay);
        dayToPush.Day_on = false;
        timings.push(dayToPush);
      }
    });
    return timings;
  }

  resetDateRange() {
    this.form.patchValue({ dateRange: '' });
  }

  setDateRange(beginDateStr: string, endDateStr: string) {
    let beginDate = new Date(beginDateStr);
    let endDate = new Date(endDateStr);
    this.form.patchValue({
      dateRange: {
        beginDate: {
          year: beginDate.getFullYear(),
          month: beginDate.getMonth() + 1,
          day: beginDate.getDate()
        },
        endDate: {
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
          day: endDate.getDate()
        }
      }
    });
  }

  initializeNewTimingModel(beginDate: Date, endDate: Date) {
    let weekdays = this.getWeekDaysBetweenDates(beginDate, endDate);
    this.timings = this.defaultTimingModel.filter(model => {
      return !(weekdays.indexOf(+model.weekday_id) === -1);
    });
  }

  onDateRangeChanged(event: IMyDateRangeModel) {
    if (event.beginJsDate == null || event.endJsDate == null) {
      this.timings = [];
      this.existingSchedules = [];
      this.providerSchedule = new ProviderSchedulesViewModel();
    }
    else {
      let requestObj: ProviderSchedulesViewModel = new ProviderSchedulesViewModel();
      requestObj.DateFrom = new Date(event.beginDate.year, event.beginDate.month - 1, event.beginDate.day).toDateString();
      requestObj.DateTo = new Date(event.endDate.year, event.endDate.month - 1, event.endDate.day).toDateString();
      requestObj.ProviderCode = this.providerCode;
      requestObj.LocationCode = this.locationCode;
      requestObj.PracticeCode = this._gv.currentUser.selectedPractice.PracticeCode;
      this.isScheduleAlreadyExist(requestObj).then((result: any) => {
        if (result && result.Response && result.Response.length > 0) {
          this.existingSchedules = result.Response;
          this.modalMode = "edit";
        } else {
          this.initializeNewTimingModel(new Date(event.beginDate.year, event.beginDate.month - 1, event.beginDate.day), new Date(event.endDate.year, event.endDate.month - 1, event.endDate.day));
          this.providerSchedule = new ProviderSchedulesViewModel();
          this.providerSchedule.DateFrom = new Date(event.beginDate.year, event.beginDate.month - 1, event.beginDate.day).toDateString();
          this.providerSchedule.DateTo = new Date(event.endDate.year, event.endDate.month - 1, event.endDate.day).toDateString();
          this.providerSchedule.ProviderCode = this.providerCode;
          this.providerSchedule.LocationCode = this.locationCode;
          this.providerSchedule.PracticeCode = this._gv.currentUser.selectedPractice.PracticeCode;
        }
      })
    }
  }

  goToEdit(index) {
    this.providerSchedule = this.existingSchedules[index];
    this.existingSchedules = [];
    this.initializeEditModel();
    this.modalMode = 'edit';
  }

  onNew() {
    this.providerSchedule.DateTo = null;
    this.providerSchedule.DateFrom = null;
    this.existingSchedules = [];
    this.timings = [];
    this.modalTitle = `<i _" class="fa fa-plus"></i>&nbsp;Add Office Timing`;
    this.resetDateRange();
    this.form.enable();
    this.modalMode = 'new';
  }

  isScheduleAlreadyExist(providerSchedule: ProviderSchedulesViewModel) {
    return new Promise((res, rej) => {
      this._api.PostData(`/Scheduler/GetMatchingSchedules`, providerSchedule, (result) => {
        res(result);
      })
    }).catch(err => {
      throw err;
    })
  }

  getDaysCount(beginDate: Date, endDate: Date) {
    return ((new Date(endDate).getTime() - new Date(beginDate).getTime()) / (1000 * 3600 * 24));
  }

  getWeekDaysBetweenDates(beginDate: Date, endDate: Date): number[] {
    let weekDays = [];
    if (this.getDaysCount(beginDate, endDate) >= 7) {
      weekDays = [1, 2, 3, 4, 5, 6, 7];
    }
    else {
      for (let d = beginDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        weekDays.push(d.getDay() + 1);
      }
    }
    return weekDays.sort();
  }

  onDayOnOff(index: number) {
    let currentDay = <ProviderWorkingDayTime>this.timings[index];
    if (currentDay.Day_on) {
      currentDay.Enable_Break = true;
      currentDay.Break_time_From = "10:00:00";
      currentDay.Break_Time_To = "11:00:00";
      currentDay.Time_From = "09:00:00";
      currentDay.Time_To = "17:00:00";
      currentDay.time_slot_size = 15;
    }
    else {
      currentDay.Enable_Break = false;
      currentDay.Break_time_From = "";
      currentDay.Break_Time_To = "";
      currentDay.Time_From = "";
      currentDay.Time_To = "";
      currentDay.time_slot_size = null;
    }
  }

  onClose() {
    this.close.emit(this.providerSchedule);
  }

  onSubmit() {
    if (!this.timings.find(p => p.hasBreakError)) {
      this._api.PostData(`/Scheduler/SaveOfficeTimings`, { timings: this.timings, schedule: this.providerSchedule }, (response) => {
        if (response.Status === "Success") {
          this.toast.success('Office Timing saved successfully.', 'Saved Success');
          this.hide();
        }
        else {
          this.toast.success(response.Response, 'Validation');
          this.hide();
        }
      })
    } else {
      this.toast.error('Please provide valid Break Timing.', 'Invalid Break Timing');
    }
  }

  onInputBreakTiming(e, index: number) {
    if (!Common.isNullOrEmpty(this.timings[index].Break_time_From) && !Common.isNullOrEmpty(this.timings[index].Break_Time_To)) {
      // check for break timings
      if (this.stringTimeToCurrentDate(this.timings[index].Break_time_From) >= this.stringTimeToCurrentDate(this.timings[index].Break_Time_To)) {
        this.timings[index].hasBreakError = true;
        return;
      }
      if ((this.stringTimeToCurrentDate(this.timings[index].Time_From) > this.stringTimeToCurrentDate(this.timings[index].Break_time_From)) ||
        (this.stringTimeToCurrentDate(this.timings[index].Break_Time_To) > this.stringTimeToCurrentDate(this.timings[index].Time_To))) {
        this.timings[index].hasBreakError = true;
        return;
      }
      this.timings[index].hasBreakError = false;
      return;
    } else if (!Common.isNullOrEmpty(this.timings[index].Break_time_From) || !Common.isNullOrEmpty(this.timings[index].Break_Time_To)) {
      this.timings[index].hasBreakError = true;
    } else {
      this.timings[index].hasBreakError = false;
    }
  }

  stringTimeToCurrentDate(time: string) {
    let dummyDate = new Date();
    let hms = [];
    hms = time.split(':');
    dummyDate.setHours(hms[0]);
    dummyDate.setMinutes(hms[1]);
    dummyDate.setMilliseconds(0);
    return dummyDate;
  }

  get defaultTimingModel(): ProviderWorkingDayTime[] {
    return [
      {
        AMPMTIMEFROM: null,
        AMPMTIMEto: null,
        Break_Time_To: '11:00:00',
        Break_time_From: '10:00:00',
        Day_on: true,
        Enable_Break: false,
        LOCATION_CODE: this.locationCode,
        PRACTICE_CODE: this._gv.currentUser.selectedPractice.PracticeCode,
        PROVIDER_CODE: this.providerCode,
        Provider_Working_Days_Time_Id: 0,
        Time_From: "09:00:00",
        Time_To: "17:00:00",
        dayNam: 'Monday',
        time_slot_size: 15,
        weekday_id: '1'
      },
      {
        AMPMTIMEFROM: null,
        AMPMTIMEto: null,
        Break_Time_To: '11:00:00',
        Break_time_From: '10:00:00',
        Day_on: true,
        Enable_Break: false,
        LOCATION_CODE: this.locationCode,
        PRACTICE_CODE: this._gv.currentUser.selectedPractice.PracticeCode,
        PROVIDER_CODE: this.providerCode,
        Provider_Working_Days_Time_Id: 0,
        Time_From: "09:00:00",
        Time_To: "17:00:00",
        dayNam: 'Tuesday',
        time_slot_size: 15,
        weekday_id: '2'
      },
      {
        AMPMTIMEFROM: null,
        AMPMTIMEto: null,
        Break_Time_To: '11:00:00',
        Break_time_From: '10:00:00',
        Day_on: true,
        Enable_Break: false,
        LOCATION_CODE: this.locationCode,
        PRACTICE_CODE: this._gv.currentUser.selectedPractice.PracticeCode,
        PROVIDER_CODE: this.providerCode,
        Provider_Working_Days_Time_Id: 0,
        Time_From: "09:00:00",
        Time_To: "17:00:00",
        dayNam: 'Wednesday',
        time_slot_size: 15,
        weekday_id: '3'
      },
      {
        AMPMTIMEFROM: null,
        AMPMTIMEto: null,
        Break_Time_To: '11:00:00',
        Break_time_From: '10:00:00',
        Day_on: true,
        Enable_Break: false,
        LOCATION_CODE: this.locationCode,
        PRACTICE_CODE: this._gv.currentUser.selectedPractice.PracticeCode,
        PROVIDER_CODE: this.providerCode,
        Provider_Working_Days_Time_Id: 0,
        Time_From: "09:00:00",
        Time_To: "17:00:00",
        dayNam: 'Thursday',
        time_slot_size: 15,
        weekday_id: '4'
      },
      {
        AMPMTIMEFROM: null,
        AMPMTIMEto: null,
        Break_Time_To: '11:00:00',
        Break_time_From: '10:00:00',
        Day_on: true,
        Enable_Break: false,
        LOCATION_CODE: this.locationCode,
        PRACTICE_CODE: this._gv.currentUser.selectedPractice.PracticeCode,
        PROVIDER_CODE: this.providerCode,
        Provider_Working_Days_Time_Id: 0,
        Time_From: "09:00:00",
        Time_To: "17:00:00",
        dayNam: 'Friday',
        time_slot_size: 15,
        weekday_id: '5'
      },
      {
        AMPMTIMEFROM: null,
        AMPMTIMEto: null,
        Break_Time_To: null,
        Break_time_From: null,
        Day_on: false,
        Enable_Break: false,
        LOCATION_CODE: this.locationCode,
        PRACTICE_CODE: this._gv.currentUser.selectedPractice.PracticeCode,
        PROVIDER_CODE: this.providerCode,
        Provider_Working_Days_Time_Id: 0,
        Time_From: null,
        Time_To: null,
        dayNam: 'Saturday',
        time_slot_size: null,
        weekday_id: '6'
      },
      {
        AMPMTIMEFROM: null,
        AMPMTIMEto: null,
        Break_Time_To: null,
        Break_time_From: null,
        Day_on: false,
        Enable_Break: false,
        LOCATION_CODE: this.locationCode,
        PRACTICE_CODE: this._gv.currentUser.selectedPractice.PracticeCode,
        PROVIDER_CODE: this.providerCode,
        Provider_Working_Days_Time_Id: 0,
        Time_From: null,
        Time_To: null,
        dayNam: 'Sunday',
        time_slot_size: null,
        weekday_id: '7'
      }
    ];
  }

  onModalHidden(event: any) {
    this.close.emit(this.providerSchedule);
    this.existingSchedules = [];
  }

  onModalShown(event: any) {
    this.initializeEditModel();
  }

  initializeEditModel() {
    if (this.providerSchedule && !Common.isNullOrEmpty(this.providerSchedule.DateFrom) && !Common.isNullOrEmpty(this.providerSchedule.DateTo)) {
      this.getProviderScheduleTiming();
      this.modalTitle = `<i class="fa fa-pencil"></i>&nbsp;Edit Office Timing`;
      this.modalMode = 'edit';
    }
    else {
      // new Provider Schedule
      this.modalTitle = `<i _" class="fa fa-plus"></i>&nbsp;Add Office Timing`;
      this.resetDateRange();
      this.form.enable();
      this.timings = [];
      this.modalMode = 'new';
    }
  }

  getProviderScheduleTiming() {
    this.timings = [];
    this._api.PostData(`/scheduler/Timings`, {
      providerCode: this.providerSchedule.ProviderCode,
      locationCode: this.providerSchedule.LocationCode,
      dateFrom: this.providerSchedule.DateFrom,
      dateTo: this.providerSchedule.DateTo,
      practiceCode: this.providerSchedule.PracticeCode
    }, (r) => {
      if (r && r.Status === "Success") {
        if (r.Response) {
          let weekDaysBetween = this.getWeekDaysBetweenDates(new Date(this.providerSchedule.DateFrom), new Date(this.providerSchedule.DateTo));
          this.timings = this.pushMissingWeekDays(weekDaysBetween, r.Response.timings);
          this.setDateRange(this.providerSchedule.DateFrom.toString(), this.providerSchedule.DateTo.toString());
          this.form.disable();
        }
      };
    })
  }

  show() {
    this.modalWindow.show();
  }

  hide() {
    this.modalWindow.hide();
  }
}