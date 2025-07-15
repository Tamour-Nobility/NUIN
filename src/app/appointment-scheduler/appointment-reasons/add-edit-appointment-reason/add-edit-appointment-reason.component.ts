import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ProviderSchedulesViewModel } from '../../models/timing.model';
import { PracticeAppointmentStatus, AppointmentStatus, PracticeAppointmentStatusCreateVM } from '../../models/appointment-status.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppointmentReason, PracticeAppointmentReasonCreateVM } from '../../models/appointment-reason.model';
import { Common } from '../../../services/common/common';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'add-edit-appointment-reason',
  templateUrl: './add-edit-appointment-reason.component.html',
  styleUrls: ['./add-edit-appointment-reason.component.css']
})
export class AddEditAppointmentReasonComponent implements OnInit {
  // input and output
  @Output() close: EventEmitter<ProviderSchedulesViewModel> = new EventEmitter();
  @Input() providerCode: number;
  @Input() locationCode: number;
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  // template references
  @ViewChild(ModalDirective) modalWindow: ModalDirective;
  @ViewChild('searchBox') searchBox: ElementRef;
  //etc
  form: FormGroup;
  modalTitle = `<i _" class="fa fa-plus"></i>&nbsp;Add Appointment Reason`;
  appointmentReasons: AppointmentReason[];
  selectedAppointmentReasons: AppointmentReason[];
  practiceAppointmentReasonCreateVM: PracticeAppointmentReasonCreateVM;
  appointmentReasonSubscription: Subscription;
  // multiselect
  settings = {};
  constructor(private _api: APIService,
    private toast: ToastrService,
    private _gv: GvarsService) {
    this.appointmentReasons = [];
    this.selectedAppointmentReasons = [];
    this.practiceAppointmentReasonCreateVM = new PracticeAppointmentReasonCreateVM();
    // multi select dropdown
    this.settings = {
      text: "Select Reasons",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class-ng2-multi-dropdown",
      primaryKey: "Reason_Id",
      labelKey: "Reason_Description",
      noDataLabel: "Search Reasons...",
      enableSearchFilter: true,
      badgeShowLimit: 5
    };
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      multiSelect: new FormControl([], [Validators.required])
    })
  }


  onModalHidden() {
    this.selectedAppointmentReasons = [];
    this.appointmentReasons = [];
    this.searchBox.nativeElement.value = "";
    this.form.reset();
    this.submit.emit();
  }

  onModalShown() {

  }

  onSearch(value: any) {
    let searchText = value.trim() || "";
    if (!Common.isNullOrEmpty(searchText) && (searchText.length == 3 || searchText.length == 5 || searchText.length >= 7)) {
      if (!isNullOrUndefined(this.appointmentReasonSubscription))
        this.appointmentReasonSubscription.unsubscribe();
      this.appointmentReasonSubscription = this._api.getData(`/Scheduler/GetUnassignedAppointmentReasons?searchText=${searchText}&practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}&providerCode=${this.providerCode}&locationCode=${this.locationCode}`).subscribe(r => {
        if (r.Status == "Success") {
          this.appointmentReasons = r.Response;
        }
      })
    }
  }

  show() {
    this.modalWindow.show();
  }

  hide() {
    this.modalWindow.hide();
  }

  onSubmit() {
    if (this.selectedAppointmentReasons && this.selectedAppointmentReasons.length > 0) {
      this.practiceAppointmentReasonCreateVM.PracticeCode = this._gv.currentUser.selectedPractice.PracticeCode;
      this.practiceAppointmentReasonCreateVM.ProviderCode = this.providerCode
      this.practiceAppointmentReasonCreateVM.LocationCode = this.locationCode;
      this.practiceAppointmentReasonCreateVM.ReasonsIds = this.selectedAppointmentReasons.map(r => r.Reason_Id);
      this._api.PostData(`/Scheduler/SaveReason`, this.practiceAppointmentReasonCreateVM, (response) => {
        if (response.Status === "Success") {
          this.selectedAppointmentReasons = [];
          this.toast.success("Appointment Reason has been saved successfully.", "Saved Success");
          this.hide();
        } else {
          this.toast.error(response.Status, "Error");
        }
      })
    } else {
      this.toast.warning('Please select at least one status to add.');
    }

  }
}