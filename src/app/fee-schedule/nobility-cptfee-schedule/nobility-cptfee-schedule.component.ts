import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StandartCPTFee, State } from '../fee-schedule-model'
import { APIService } from '../../components/services/api.service';
@Component({
  selector: 'app-nobility-cptfee-schedule',
  templateUrl: './nobility-cptfee-schedule.component.html'
})
export class NobilityCPTFeeScheduleComponent implements OnInit {
  dtNobilityFeeSchedule: any;
  listNPMFeeSchedule: StandartCPTFee[];
  listState: State[];
  ddlStateCode: number = 0;

  constructor(private chRef: ChangeDetectorRef,
    public API: APIService) {
    this.listNPMFeeSchedule = [];
    this.listState = [];
  }

  ngOnInit() {
    this.getState();
  }

  getAgingSummaryReport(StateCode: any) {
    this.API.getData('/Setup/GetStandardNobilityCPTFeeSchedule?StateCode=' + StateCode).subscribe(
      d => {
        if (d.Status == "Sucess") {
          if (this.dtNobilityFeeSchedule) {
            this.dtNobilityFeeSchedule.destroy();
          }
          this.listNPMFeeSchedule = d.Response;
          this.chRef.detectChanges();
          this.dtNobilityFeeSchedule = $('.dtNobilityFeeSchedule').DataTable({
            language: {
              emptyTable: "No data available"
            }
          });
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }


  getState() {
    this.API.getData('/Setup/GetStatesList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listState = d.Response;
          this.ddlStateCode = 0;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  onchangeState() {
    if (this.ddlStateCode == undefined || this.ddlStateCode == null || this.ddlStateCode == 0) {

      //swal('Failed', "Select State", 'error');
      return;
    }
    this.getAgingSummaryReport(this.ddlStateCode);
  }




}