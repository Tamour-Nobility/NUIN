import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { Subscription } from 'rxjs';
import { Common } from '../../../services/common/common';
import { APIService } from '../../../components/services/api.service';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { ProviderAppointmentRules, ProviderAppointmentRuleViewModel, ProviderSchedulesViewModel } from '../../models/timing.model';
import { AddEditBlockAppointmentsComponent } from '../add-edit-block-appointments/add-edit-block-appointments/add-edit-block-appointments.component';

@Component({
  selector: 'app-block-appointments',
  templateUrl: './block-appointments.component.html'
})
export class BlockAppointmentsComponent implements OnInit {
  providerSelectList: SelectListViewModel[];
  locationSelectList: SelectListViewModel[];
  selectedAppointmentRule: ProviderAppointmentRules;
  providerAppointmentRules: ProviderAppointmentRules[];
  rules: ProviderAppointmentRuleViewModel[];
  selectedAppointmentRuleId: number = null;
  // subscriptions
  subProviderSelectList: Subscription;
  subsLocationSelectList: Subscription;
  // template reference
  @ViewChild('addEditAppRule') addEditAppRule: AddEditBlockAppointmentsComponent;
  providerCode: number;
  locationCode: number;
  constructor(private _gv: GvarsService,
    private _api: APIService) {
    this.selectedAppointmentRule = new ProviderAppointmentRules();
    this.locationSelectList = [];
    this.providerSelectList = [];
    this.providerAppointmentRules = [];
    this.rules = [];
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

  onSelect() {
    if (Common.isNullOrEmpty(this.selectedAppointmentRule.Location_code)) {
      this._api.getDataWithoutSpinner(`/Demographic/GetPracticeDefaultLocation?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}`).subscribe(response => {
        if (response && response.Status == "Success" && !Common.isNullOrEmpty(response.Response)) {
          this.setLocation(response.Response);
          if (!Common.isNullOrEmpty(this.selectedAppointmentRule.Provider_code) && !Common.isNullOrEmpty(this.selectedAppointmentRule.Location_code)) {
            this.getProviderAppointmentRules();
          }
        }
      });
    } else {
      if (!Common.isNullOrEmpty(this.selectedAppointmentRule.Provider_code) && !Common.isNullOrEmpty(this.selectedAppointmentRule.Location_code)) {
        this.getProviderAppointmentRules();
      }
    }
  }

  setLocation(location: any) {
    this.selectedAppointmentRule.Location_code = location.Id;
  }

  getProviderAppointmentRules() {
    this._api.getData(`/scheduler/GetProviderBlockedSchedules?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}&providerCode=${this.selectedAppointmentRule.Provider_code}&locationCode=${this.selectedAppointmentRule.Location_code}`).subscribe(
      rls => {
        if (rls.Status == "Success") {
          this.selectedAppointmentRuleId = null;
          this.providerAppointmentRules = rls.Response;
          this.selectedAppointmentRule = this.providerAppointmentRules[0];
          this.selectedAppointmentRuleId = this.selectedAppointmentRule.Rule_Id;
          this.fetchTimings(this.selectedAppointmentRule);
        }
        else {
          this.selectedAppointmentRuleId = null;
          this.providerAppointmentRules = [];
          // this.selectedAppointmentRule = new ProviderAppointmentRules();
        }
      })
  }

  onChangeAppointmentRule() {
    let temArray = this.providerAppointmentRules;
    let selectedRule = this.providerAppointmentRules.find(s => s.Rule_Id == this.selectedAppointmentRuleId);
    if (!Common.isNullOrEmpty(selectedRule)) {
      this.selectedAppointmentRule = selectedRule;
      this.fetchTimings(this.selectedAppointmentRule);
    }
    this.providerAppointmentRules = temArray;
  }

  fetchTimings(aSM) {
    this._api.PostData(`/scheduler/Rules`, aSM, (r) => {
      if (r.Status === "Success") {
        if (r.Response.length > 0) {
          this.rules = r.Response;
        }
        else {
          swal('Error', 'No Data Found', 'error');
          return;
        }
      };
    })
  }

  onNew() {
    this.providerCode = this.selectedAppointmentRule.Provider_code;
    this.locationCode = this.selectedAppointmentRule.Location_code;
    this.selectedAppointmentRule = new ProviderAppointmentRules();
    this.addEditAppRule.show();
  }

  onEdit() {
    this.providerCode = this.selectedAppointmentRule.Provider_code;
    this.locationCode = this.selectedAppointmentRule.Location_code;
    this.selectedAppointmentRule = { ...this.providerAppointmentRules.find(f => f.Rule_Id == this.selectedAppointmentRule.Rule_Id) };
    this.addEditAppRule.show();
  }

  onCloseAddEditWindow(event) {
    if (!this.isObjectEmpty(event)) {
      this.selectedAppointmentRule = event;
      this.getProviderAppointmentRules();
    }
    else {
      this.selectedAppointmentRule.Provider_code = this.providerCode;
      this.selectedAppointmentRule.Location_code = this.locationCode;
      this.getProviderAppointmentRules();
    }
  }

  isObjectEmpty(obj) {
    if (obj.Provider_code == null && obj.Location_code == null)
      return true
    else
      return false
  }

  setProviderAndLocation(data) {
    // Provider
    if (this.providerSelectList == null)
      this.providerSelectList = [];
    if (this.providerSelectList.find(f => f.Id == data.Provider.Id) == null) {
      this.providerSelectList.push(data.Provider);
    }
    this.selectedAppointmentRule.Provider_code = data.Provider.Id;

    // Location
    if (this.locationSelectList == null || (this.locationSelectList.length == 1 && this.locationSelectList[0] === undefined))
      this.locationSelectList = [];
    if (this.locationSelectList.find(f => f.Id == data.Location.Id) == null) {
      this.locationSelectList.push(data.Location);
    }
    this.selectedAppointmentRule.Location_code = data.Location.Id;
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
