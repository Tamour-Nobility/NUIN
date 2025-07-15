import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { Reportforclaimasssignee} from '../../Claims/Classes/ClaimAssignee';

import { Aging_Summary_Analysis_Report_Result, PracticesList } from '../classes/aging-summary-report-model'
import { APIService } from '../../components/services/api.service';
import { DatatableService } from '../../../app/services/data/datatable.service';
import { ActivatedRoute } from '@angular/router';
import { GvarsService } from '../../services/G_vars/gvars.service';

@Component({
  selector: 'app-claim-assignmentreport',
  templateUrl: './claim-assignmentreport.component.html',

})
export class ClaimAssignmentreportComponent implements OnInit {

  listPracticesList: PracticesList[];
  isRouted: boolean = false;
  claimAssigneeReports :Reportforclaimasssignee[];
  ddlPracticeCode: string | number = 0;
ClaimAssigneeReportDetail: any;
  dataTable: any;
  PDForm: FormGroup;
  strFromDate: string;
  strToDate: string;
  isSearchInitiated: boolean = false;
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };

  constructor(private chRef: ChangeDetectorRef,
    public API: APIService,
    private datatableService: DatatableService,
    private route: ActivatedRoute,
    public toaster: ToastrService,
    private Gv: GvarsService) { 

      this.claimAssigneeReports = [];
    }

  ngOnInit() {
    this.InitForm();
    this.getPractices();
    //this.getClaimAssignmentReport();
   
  }
  InitForm() {
    this.PDForm = new FormGroup({
      practice: new FormControl('', [
        Validators.required,
      ]),
      dateFrom: new FormControl('', [
        Validators.required,
      ]),
      dateTo: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  onDateChanged(e, dType: string) {
    if (dType == 'From') {
      this.strFromDate = e.formatted;
    }
    else {
      this.strToDate = e.formatted;
    }
  }
 

  getClaimAssignmentReport() {
    this.claimAssigneeReports = [];
    let practiceCode=this.ddlPracticeCode
    if (typeof practiceCode == 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.getData('/Report/ClaimAssignmentReport?PracticeCode=' +
      practiceCode + '&DateFrom=' + this.strFromDate + '&DateTo=' + this.strToDate).subscribe(
     data => {
       if (data.Status == 'Sucess') {
        this.isSearchInitiated=true;
        if (this.ClaimAssigneeReportDetail) {
          this.chRef.detectChanges();
          this.ClaimAssigneeReportDetail.destroy();
        }
         if(data.Response.length==0){
          this.toaster.warning( 'No Record Found Againts the Given Criteria', '');
          return
         }
        this.claimAssigneeReports = data.Response;
      
      
        this.chRef.detectChanges();
        const table: any = $('.ClaimAssigneeReportDetail');
        this.ClaimAssigneeReportDetail = table.DataTable({
          width: '100%',
          columnDefs: [
            {
              type: 'date', targets: [5]
            },
            {
              width: '5%', targets: [0,1,8,9]
            },
            {
              width: '15%', targets: [ 2,3,4, 5, 6, 7, 9, 10]
            }
          ],
          language: {
            emptyTable: "No data available"
          },
          autoWidth: false,
          paging: true,
          scrollX: true,
          scrollY: '290',
          dom: this.datatableService.getDom(),
          buttons: this.datatableService.getExportButtons(["Claims Assignment Report"])
        })

       }
       else {
          
        this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
      }
     }
   )
 }


 onchangePractice() {
  if (this.ddlPracticeCode == undefined || this.ddlPracticeCode == null || this.ddlPracticeCode == 0)
    return;
  this.getClaimAssignmentReport();
}


  getPractices() {

    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
          this.listPracticesList = this.listPracticesList.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
              };
             });
          console.log(this.listPracticesList)
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

}