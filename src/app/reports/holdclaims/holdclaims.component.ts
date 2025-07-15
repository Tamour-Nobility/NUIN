import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatatableService } from '../../services/data/datatable.service';
import { APIService } from '../../components/services/api.service'

@Component({
  selector: 'app-holdclaims',
  templateUrl: './holdclaims.component.html',
  styleUrls: ['./holdclaims.component.css']
})
export class HoldclaimsComponent implements OnInit {
  CPDForm: FormGroup;
  isSearchInitiated: boolean;
  dtholdreportdetials: any;
  holdClaimsDetailReport: any;
  listPracticesList: any;
  PracticeCode:String|number;

  constructor(public toaster: ToastrService,
    private chRef: ChangeDetectorRef,
    public datatableService: DatatableService,
    private API: APIService) { }

  ngOnInit() {
    this.InitForm();
    this.getPractices();
  }

  InitForm() {
    this.CPDForm = new FormGroup({
      PracCode: new FormControl('123', [
        Validators.required,
      ])
    })
  }
  get f() {
    return this.CPDForm.controls;
  }
  
  onDateChanged(e, dType: string) {
    if (dType == 'From') {
      this.f.dateFrom.setValue(e.formatted);
    }
    else {
      this.f.dateTo.setValue(e.formatted);
    }
  }

  getInsuranceReportDetail() {
    let practiceCode=this.CPDForm.value.PracCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }

    this.API.getData('/Report/holdReport?practiceCode=' + practiceCode  ).subscribe(
      data => {
        if (data.Status == 'success') {
          this.isSearchInitiated = true;
          if (this.dtholdreportdetials) {
            this.chRef.detectChanges();
            this.dtholdreportdetials.destroy();
          }
          this.holdClaimsDetailReport = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.dtholdreportdetials');
          this.dtholdreportdetials = table.DataTable({
            "scrollX": true,
            columnDefs: [
            
              {
                width: '17em', targets: [0 ,1 ,2, 3 ,4,5]
              },
            
            ],
            language: {
              emptyTable: "No data available"
            },
            dom: this.datatableService.getDom(),
            buttons: this.datatableService.getExportButtons(["Hold claims Analysis"])
          })
        }
        else {
          this.toaster.warning(data.Response + ' Found Againts the Given Criteria', '');
        }
      }
    )
  }
  getPractices() {
    debugger
    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          debugger
          this.listPracticesList = d.Response;
          this.listPracticesList = this.listPracticesList.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
              };
              
             });
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  onClear() {
    this.isSearchInitiated = false;
    this.chRef.detectChanges();
    if (this.dtholdreportdetials) {
      this.dtholdreportdetials.destroy();
    }
    this.CPDForm.reset();
    this.holdClaimsDetailReport = [];
  }

  onchangePractice(selectedPracticeCode: any) {
    debugger
    if(selectedPracticeCode!=0)
    {
    this.PracticeCode= selectedPracticeCode;
    }
   // this.CPDForm.value.PracCode=this.CPDForm.get('PracCode').value
    if (this.CPDForm.value.PracCode == undefined || this.CPDForm.value.PracCode == null || this.CPDForm.value.PracCode == 0) {
      swal('Failed', "Select Practice", 'error');
      return;
    }
    if(this.CPDForm.value.PracCode != '123' ){
      this. getInsuranceReportDetail();
    }
    
  }


}
