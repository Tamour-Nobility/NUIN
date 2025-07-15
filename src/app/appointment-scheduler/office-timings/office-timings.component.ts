import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { ProviderWorkingDayTime, TimingSearchViewModel, ProviderSchedulesViewModel } from '../models/timing.model';
import { SelectListViewModel } from '../../models/common/selectList.model';

import { AddEditOfficeTimingComponent } from './add-edit-office-timing/add-edit-office-timing.component';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-office-timings',
  templateUrl: './office-timings.component.html',
  styleUrls: ['./office-timings.component.css']
})
export class OfficeTimingsComponent implements OnInit {
  timings: ProviderWorkingDayTime[];
  bkpTimings: ProviderWorkingDayTime[];
  locationSelectList: SelectListViewModel[];
  providerSelectList: SelectListViewModel[];
  providerSchedules: ProviderSchedulesViewModel[];
  timingSearchViewModel: TimingSearchViewModel;
  selectedProviderScheduleId: number = null;
  selectedProviderSchedule: ProviderSchedulesViewModel;
  // subscriptions
  subProviderSelectList: Subscription;
  subsLocationSelectList: Subscription;
  // template reference
  @ViewChild('addEditProviderSchedule') addEditProviderSchedule: AddEditOfficeTimingComponent;
  constructor(private _gv: GvarsService,
    private _api: APIService) {
    this.timings = [];
    this.timingSearchViewModel = new TimingSearchViewModel();
    this.locationSelectList = [];
    this.providerSelectList = [];
    this.providerSchedules = [];
    this.selectedProviderSchedule = new ProviderSchedulesViewModel();
  }

  ngOnInit() {
    this.getProvidersAndLocations();
  }

  getProvidersAndLocations() {
    if (!Common.isNullOrEmpty(this.subsLocationSelectList))
      this.subsLocationSelectList.unsubscribe();
    this.subsLocationSelectList = this._api.getDataWithoutSpinner(`/Scheduler/GetProvidersAndLocations?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}`).subscribe(
      res => {
        if (res.Status == "Success") {
          this.locationSelectList = res.Response.Locations;
          this.providerSelectList = res.Response.Providers;
        }
      });
  }

  fetchTimings() {
    this.timingSearchViewModel.practiceCode = this._gv.currentUser.selectedPractice.PracticeCode;
    this._api.PostData(`/scheduler/timings`, this.timingSearchViewModel, (r) => {
      if (r && r.Status === "Success") {
        if (r.Response && r.Response.timings && r.Response.timings.length > 0) {
          this.bkpTimings = JSON.parse(JSON.stringify(r.Response.timings))
          this.timings = this.bkpTimings.filter(r => r.Day_on);
        }
      };
    })
  }

  onSave() {
    this._api.PostData(`/scheduler/saveOfficeTimings`, this.timings, () => {

    })
  }

  onNew() {
    this.selectedProviderSchedule = new ProviderSchedulesViewModel();
    this.addEditProviderSchedule.show();
  }

  onEdit() {
    this.selectedProviderSchedule = { ...this.providerSchedules.find(f => f.SrNo == this.selectedProviderScheduleId) };
    this.addEditProviderSchedule.show();
  }

  onShowAddEditOfficeTiming() {

  }

  onHiddenAddEditOfficeTiming() {

  }

  transform(time: string) {
    if (!Common.isNullOrEmpty(time)) {
      let dummyDate = new Date();
      let hms = [];
      hms = time.split(':');
      dummyDate.setHours(hms[0]);
      dummyDate.setMinutes(hms[1]);
      dummyDate.setSeconds(hms[2]);
      return dummyDate;
    } else {
      return "";
    }
  }

  onSelect(e: any) {
    if (Common.isNullOrEmpty(this.timingSearchViewModel.locationCode)) {
      this._api.getDataWithoutSpinner(`/Demographic/GetPracticeDefaultLocation?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}`).subscribe(response => {
        if (response && response.Status == "Success" && !Common.isNullOrEmpty(response.Response)) {
          this.setLocation(response.Response);
          if (!Common.isNullOrEmpty(this.timingSearchViewModel.providerCode) && !Common.isNullOrEmpty(this.timingSearchViewModel.locationCode)) {
            this.fetchProviderSchedules();
          }
        }
      });
    } else {
      if (!Common.isNullOrEmpty(this.timingSearchViewModel.providerCode) && !Common.isNullOrEmpty(this.timingSearchViewModel.locationCode)) {
        this.fetchProviderSchedules();
      }
    }
  }

  fetchProviderSchedules() {
    this._api.getData(`/scheduler/GetProviderSchedules?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}&providerCode=${this.timingSearchViewModel.providerCode}&locationCode=${this.timingSearchViewModel.locationCode}`).subscribe(schedules => {
      this.selectedProviderScheduleId = null;
      this.providerSchedules = schedules.Response;
      if (this.providerSchedules && this.providerSchedules.length > 0) {
        this.selectedProviderSchedule = this.providerSchedules[0];
        this.selectedProviderScheduleId = this.selectedProviderSchedule.SrNo;
        this.onChangeProviderSchedule(null);
      } else {
        this.selectedProviderSchedule = new ProviderSchedulesViewModel();
        this.selectedProviderScheduleId = null;
      }
    })
  }

  setLocation(location: any) {
    this.timingSearchViewModel.locationCode = location.Id;
  }

  setProviderAndLocation(data) {
    // Provider
    if (this.providerSelectList == null)
      this.providerSelectList = [];
    if (this.providerSelectList.find(f => f.Id == data.Provider.Id) == null) {
      this.providerSelectList.push(data.Provider);
    }
    this.timingSearchViewModel.providerCode = data.Provider.Id;

    // Location
    if (this.locationSelectList == null || (this.locationSelectList.length == 1 && this.locationSelectList[0] === undefined))
      this.locationSelectList = [];
    if (this.locationSelectList.find(f => f.Id == data.Location.Id) == null) {
      this.locationSelectList.push(data.Location);
    }
    this.timingSearchViewModel.locationCode = data.Location.Id;
  }

  onChangeProviderSchedule(event) {
    let selectedSchedule = this.providerSchedules.find(s => s.SrNo == this.selectedProviderScheduleId);
    if (!Common.isNullOrEmpty(selectedSchedule)) {
      this.timingSearchViewModel.dateFrom = selectedSchedule.DateFrom;
      this.timingSearchViewModel.dateTo = selectedSchedule.DateTo;
      this.fetchTimings();
    }
  }

  onCloseAddEditWindow(event: ProviderSchedulesViewModel) {
    this.fetchProviderSchedules();
  }

  transformSlotSize(duration: number) {
    if (duration < 60) {
      return `${duration} min`;
    } else if (duration == 60) {
      return `${1} hr`;
    } else {
      return duration;
    }
  }
}