import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { SelectListViewModel } from '../../models/common/selectList.model';
import { Common } from '../../services/common/common';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Subscription } from 'rxjs';
import { PracticeAppointmentReasonViewModel } from '../models/appointment-reason.model';
import { AddEditAppointmentReasonComponent } from './add-edit-appointment-reason/add-edit-appointment-reason.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-reasons',
  templateUrl: './appointment-reasons.component.html',
  styleUrls: ['./appointment-reasons.component.css']
})
export class AppointmentReasonsComponent implements OnInit {
  locationSelectList: SelectListViewModel[];
  providerSelectList: SelectListViewModel[];
  practiceAppintmentReasons: PracticeAppointmentReasonViewModel[];
  providerCode: number;
  locationCode: number;
  // template References
  @ViewChild(AddEditAppointmentReasonComponent) appointmentReason: AddEditAppointmentReasonComponent;
  @ViewChild('colorpicker1') colorpick: ElementRef;
  
  // subscriptions
  subProviderSelectList: Subscription;
  subsLocationSelectList: Subscription;
  //datatable
  dataTableReasons: any;
  isSearchInitiated: boolean = false;
  constructor(private _api: APIService,
    private _gv: GvarsService,
    private cd: ChangeDetectorRef,
    private toast: ToastrService) {
    this.locationSelectList = [];
    this.providerSelectList = [];
    this.providerCode = null;
    this.locationCode = null;
    this.practiceAppintmentReasons = [];
  }

  ngOnInit() {
    this.getProvidersAndLocations();
    console.log("this.colorpick",this.colorpick)
  }
  colorPicker(){
    console.log("this.colorpick",this.colorpick)
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

  onSelect(e: any) {
    if (Common.isNullOrEmpty(this.locationCode)) {
      this._api.getDataWithoutSpinner(`/Demographic/GetPracticeDefaultLocation?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}`).subscribe(response => {
        if (response && response.Status == "Success" && !Common.isNullOrEmpty(response.Response)) {
          this.setLocation(response.Response);
          if (!Common.isNullOrEmpty(this.providerCode) && !Common.isNullOrEmpty(this.locationCode)) {
            this.fetchPracticeProviderReason();
          }
        }
      });
    } else {
      if (!Common.isNullOrEmpty(this.providerCode) && !Common.isNullOrEmpty(this.locationCode)) {
        this.fetchPracticeProviderReason();
      }
    }
  }

  fetchPracticeProviderReason() {
    this._api.getData(`/Scheduler/GetPracAppointmentReasons?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}&providerCode=${this.providerCode}&locationCode=${this.locationCode}`).subscribe(r => {
      if (r.Status === 'Success') {
        if (this.dataTableReasons)
          this.dataTableReasons.destroy();
        this.practiceAppintmentReasons = r.Response;
        this.cd.detectChanges();
        const table: any = $('.dataTableReasons');
        this.dataTableReasons = table.DataTable({
          columnDefs: [
            { orderable: false, targets: -1 },
            { orderable: false, targets: -2 },
          ],
          language: {
            emptyTable: "No data available"
          }
        })
      }
    })
  }

  setLocation(location: any) {
    this.locationCode = location.Id;
  }

  onNew() {
    this.appointmentReason.show();
  }

  onSubmitReason() {
    this.onSelect(null);
  }

  onColorSelect(event, index) {
    this._api.PostDataWithoutSpinner(`/Scheduler/changeColor`, {
      PracAppReasonID: this.practiceAppintmentReasons[index].PracAppReasonID,
      ReasonColor: event
    }, (results) => {
      if (results.Status !== "Success")
        this.toast.error(results.Status, 'Error');
    })
  }

  deleteConfirm(index: number) {
    this._api.confirmFun('Confirmation', `Are you sure you want to delete?`, () => {
      this.onDelete(index);
    })
  }

  onDelete(index: number) {
    let id = this.practiceAppintmentReasons[index].PracAppReasonID;
    this._api.getData(`/scheduler/DeletePracticeAppointmentReason?id=${id}`).subscribe(r => {
      if (r.Status == "Success") {
        this.toast.success('Practice Appointment Reason has been deleted successfully', 'Delete Success');
        this.fetchPracticeProviderReason();
      }
    })
  }
}
