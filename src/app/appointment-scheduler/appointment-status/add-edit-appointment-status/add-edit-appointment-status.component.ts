import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { ProviderSchedulesViewModel } from '../../models/timing.model';
import { PracticeAppointmentStatus, AppointmentStatus, PracticeAppointmentStatusCreateVM } from '../../models/appointment-status.model';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { GvarsService } from '../../../services/G_vars/gvars.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'add-edit-appointment-status',
  templateUrl: './add-edit-appointment-status.component.html',
  styleUrls: ['./add-edit-appointment-status.component.css']
})
export class AddEditAppointmentStatusComponent implements OnInit {
  // input and output
  @Output() close: EventEmitter<ProviderSchedulesViewModel> = new EventEmitter();
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  @Input() pracAppointmentStatuses: PracticeAppointmentStatus[];
  // modal
  @ViewChild(ModalDirective) modalWindow: ModalDirective;
  modalTitle = `<i _" class="fa fa-plus"></i>&nbsp;Add Appointment Status`;
  //etc
  form: FormGroup;
  appointmentStatuses: AppointmentStatus[];
  selectedAppointmentStatuses: AppointmentStatus[];
  practiceAppointmentStatusCreateVM: PracticeAppointmentStatusCreateVM;
  // multiselect
  settings = {};
  constructor(private _api: APIService,
    private toast: ToastrService,
    private _gv: GvarsService) {
    this.appointmentStatuses = [];
    this.pracAppointmentStatuses = [];
    this.selectedAppointmentStatuses = [];
    this.practiceAppointmentStatusCreateVM = new PracticeAppointmentStatusCreateVM();
    // multi select dropdown
    this.settings = {
      text: "Select Statuses",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class-ng2-multi-dropdown",
      primaryKey: "Appointment_Status_Id",
      labelKey: "Appointment_Status_Description",
      noDataLabel: "Search Statuses...",
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
    this.form.reset();
    this.submit.emit();
  }

  onModalShown() {
    this.initializeModel();
  }

  initializeModel() {
    this._api.getData(`/Scheduler/Statuses`).subscribe(r => {
      if (r.Status == "Success") {
        let appointmentStatuses: AppointmentStatus[] = r.Response;
        this.appointmentStatuses = appointmentStatuses.filter(as => {
          return (this.pracAppointmentStatuses.findIndex(p => p.AppStatusID == as.Appointment_Status_Id) <= -1);
        });
      }
    })
  }

  show() {
    this.modalWindow.show();
  }

  hide() {
    this.modalWindow.hide();
  }

  onSubmit() {
    if (this.selectedAppointmentStatuses && this.selectedAppointmentStatuses.length > 0) {
      this.practiceAppointmentStatusCreateVM.PracticeCode = this._gv.currentUser.selectedPractice.PracticeCode;
      this.practiceAppointmentStatusCreateVM.AppointmentStatusesId = this.selectedAppointmentStatuses.map(p => p.Appointment_Status_Id);
      this._api.PostData(`/Scheduler/SaveStatus`, this.practiceAppointmentStatusCreateVM, (response) => {
        if (response.Status === "Success") {
          this.selectedAppointmentStatuses = [];
          this.toast.success("Appointment Status has been saved successfully.", "Saved Success");
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