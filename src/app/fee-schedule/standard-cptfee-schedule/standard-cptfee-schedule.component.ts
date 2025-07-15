import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StandartCPTFee, State } from '..//fee-schedule-model'
import { APIService } from '../../components/services/api.service';

@Component({
  selector: 'app-standard-cptfee-schedule',
  templateUrl: './standard-cptfee-schedule.component.html'
})
export class StandardCPTFeeScheduleComponent implements OnInit {
  dtStandardFeeSchedule: any;
  listStandardCPTFee: StandartCPTFee[];
  listState: State[];
  ddlStateCode: number = 0;

  constructor(private chRef: ChangeDetectorRef,
    public API: APIService) {
    this.listStandardCPTFee = [];
    this.listState = [];
  }

  ngOnInit() {
    this.getState();
  }

  getAgingSummaryReport(StateCode: any) {
    this.API.getData('/Setup/GetStandardCPTFeeSchedule?StateCode=' + StateCode).subscribe(
      d => {
        if (d.Status == "Sucess") {
          if (this.dtStandardFeeSchedule) {
            this.dtStandardFeeSchedule.destroy();
          }
          this.listStandardCPTFee = d.Response;
          this.chRef.detectChanges();
          this.dtStandardFeeSchedule = $('.dtStandardFeeSchedule').DataTable({
            language: {
              emptyTable: "No data available"
            }
          })
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