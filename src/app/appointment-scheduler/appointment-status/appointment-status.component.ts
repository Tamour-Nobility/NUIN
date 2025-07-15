import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { AppointmentStatus, PracticeAppointmentStatus } from '../models/appointment-status.model';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { AddEditAppointmentStatusComponent } from './add-edit-appointment-status/add-edit-appointment-status.component';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-appointment-status',
  templateUrl: './appointment-status.component.html',
  styleUrls: ['./appointment-status.component.css']
})
export class AppointmentStatusComponent implements OnInit {
  practiceAppointmentStatuses: PracticeAppointmentStatus[];
  // template reference
  @ViewChild(AddEditAppointmentStatusComponent) appointmentStatus: AddEditAppointmentStatusComponent;
  // datatable
  dataTableStatuses: any;
  isSearchInitiated: boolean = false;
  constructor(private _api: APIService,
    private _gv: GvarsService,
    private cd: ChangeDetectorRef,
    private toast: ToastrService) {
    this.practiceAppointmentStatuses = [];
  }

  ngOnInit() {
    this.getPracticeAppointmentStatuses();
  }

  getPracticeAppointmentStatuses() {
    this.isSearchInitiated = true;
    this._api.getData(`/Scheduler/GetPracticeAppointmentStatuses/?practiceCode=${this._gv.currentUser.selectedPractice.PracticeCode}`).subscribe(response => {
      if (response && response.Status === "Success") {
        if (this.dataTableStatuses)
          this.dataTableStatuses.destroy();
        this.practiceAppointmentStatuses = response.Response;
        this.cd.detectChanges();
        const table: any = $('.dataTableStatuses');
        this.dataTableStatuses = table.DataTable({
          columnDefs: [
            { orderable: false, targets: -1 }
          ],
          language: {
            emptyTable: "No data available"
          }
        })
      }
    })
  }

  onNew() {
    this.appointmentStatus.show();
  }

  deleteConfirm(index: number) {
    this._api.confirmFun('Confirmation', `Are you sure you want to delete?`, () => {
      this.onDelete(index);
    })
  }

  onDelete(index: number) {
    let id = this.practiceAppointmentStatuses[index].PracAppSID;
    this._api.getData(`/scheduler/DeletePracticeAppointmentStatuse?id=${id}`).subscribe(r => {
      if (r.Status == "Success") {
        this.toast.success('Practice Appointment Status has been deleted successfully', 'Delete Success');
        this.getPracticeAppointmentStatuses();
      }
    })
  }

  onSubmit(event) {
    this.getPracticeAppointmentStatuses();
  }
}