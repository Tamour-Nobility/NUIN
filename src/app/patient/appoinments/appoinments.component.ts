import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientAppoinments } from '../Classes/patientClass';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Common } from '../../services/common/common';


@Component({
  selector: 'app-appoinments',
  templateUrl: './appoinments.component.html',
  styleUrls: ['./appoinments.component.css']
})
export class AppoinmentsComponent implements OnInit {
  listPatientAppoinments: PatientAppoinments[];
  patientInfo: any;
  datatable: any;
  constructor(private route: ActivatedRoute,
    private API: APIService,
    private chRef: ChangeDetectorRef,
    private _router: Router) {
    this.listPatientAppoinments = [];
  }

  ngOnInit() {
    this.route.params.subscribe(qp => {
      if (qp) {
        this.patientInfo = JSON.parse(Common.decodeBase64(qp['param']));
        if (this.patientInfo.Patient_Account > 0)
          this.getAppoinments();
      }
    })
  }

  getAppoinments() {
    this.API.getData(`/Demographic/GetAppointments?PatientAccount=${this.patientInfo.Patient_Account}`).subscribe(
      data => {
        if (data.Status === "Sucess") {
          if (this.datatable) {
            this.datatable.destroy();
            this.chRef.detectChanges();
          }
          this.listPatientAppoinments = data.Response;
          this.chRef.detectChanges();
          this.datatable = $(".datatableAppointments").DataTable({
            language: {
              emptyTable: "No data available"
            }
          });
        }
      }
    );
  }

  setPaymentRptStyle(index: number) {
    let styles;
    if (this.listPatientAppoinments == undefined || this.listPatientAppoinments == null || this.listPatientAppoinments.length == 0)
      return styles;

    if (this.listPatientAppoinments[index].STATUS == "Pending") {
      styles = {
        'color': '#00f',
      };
    } else if (this.listPatientAppoinments[index].STATUS == "Completed") {
      styles = {
        'color': '#0f0',
      };
    } else if (this.listPatientAppoinments[index].STATUS == "Cancelled") {
      styles = {
        'color': '#f00',
      };
    } else {
      styles = {
      };
    }
    return styles;
  }

  onClickAppointmentRow(id: number) {
    this._router.navigate(['appointments/scheduler'], { queryParams: { id: id } });
  }
}
