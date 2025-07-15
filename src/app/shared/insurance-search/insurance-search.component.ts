import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { InsuranceSearchReponseModel, InsuranceModel } from '../../patient/Classes/patientInsClass';
import { APIService } from '../../components/services/api.service';
import { BaseComponent } from '../../core/base/base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'insurance-search',
  templateUrl: './insurance-search.component.html',
  styleUrls: ['./insurance-search.component.css']
})
export class InsuranceSearchComponent extends BaseComponent implements OnInit {
  searchModel: InsuranceModel;
  blnEditDemoChk: boolean = false;
  currentInsuranceNumber: number;
  insurances: InsuranceSearchReponseModel[];
  dataTable: any;
  gurantorCheck: boolean;
  gurantorCheckIndex: number;
  isSearchInitiated: boolean = false;
  form: FormGroup;
  @Output() onSelectInsurance: EventEmitter<any> = new EventEmitter();
  @Input() practiceCode: string;
  constructor(
    private API: APIService,
    private chRef: ChangeDetectorRef,
    private toastService: ToastrService
  ) {
    super();
  }
  ngOnInit() {
    this.searchModel = new InsuranceModel();
    this.insurances = [];
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      payerDesc: new FormControl('', [Validators.maxLength(250), Validators.required]),
      insName: new FormControl('', [Validators.required]),
      groupName: new FormControl('', [Validators.maxLength(50), Validators.required]),
      zip: new FormControl('', [Validators.minLength(5), Validators.maxLength(9), Validators.required]),
      state: new FormControl('', [Validators.maxLength(2), Validators.minLength(2), Validators.required]),
      city: new FormControl('', [Validators.maxLength(50), Validators.required]),
      address: new FormControl('', [Validators.maxLength(500), Validators.required]),
      payerId: new FormControl('', [Validators.maxLength(50), Validators.required])
    });
  }

  public canSearch() {
    let canSearch = true; // false;
    const { controls } = this.form;
    for (const name in controls) {
      if (controls[name].valid) {
        canSearch = true;
        break;
      }
    }
    return canSearch;
  }
  searchInsurance() {
    if (this.canSearch()) {
      this.isSearchInitiated = true;
      this.searchModel.PracticeCode = this.practiceCode;
      this.API.PostData('/Demographic/ProviderPayerSearchInsurance/', this.searchModel, (d) => {
        if (d.Status == "success") {
          if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
          }
          this.insurances = d.Response;
          this.chRef.detectChanges();
          const table: any = $('.dTSearchInsurace');
          this.dataTable = table.DataTable({
            language: {
              emptyTable: "No data available" 
            },
            order: [[1, 'asc']]
          });
        }
        else if (d.Status == "No mapped") {
          swal('Failed', d.Response, 'error');
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      });
    }
    else {
      this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
    }
  }
  // searchInsurance() {
  //   if (this.canSearch()) {
  //     this.isSearchInitiated = true;
  //     this.API.PostData('/Demographic/ProviderPayerSearchInsurance/', this.searchModel, (d) => {
  //       if (d.Status == "success") {
  //         if (this.dataTable) {
  //           this.chRef.detectChanges();
  //           this.dataTable.destroy();
  //         }
  //         this.insurances = d.Response;
  //         this.chRef.detectChanges();
  //         const table: any = $('.dTSearchInsurace');
  //         this.dataTable = table.DataTable({
  //           language: {
  //             emptyTable: "No data available"
  //           },
  //           order: [[1, 'asc']]
  //         });
  //       }
  //       else if(d.Status == "No mapped"){
  //         swal('Failed', d.Response, 'error');
  //       }
  //       else {
  //         swal('Failed', d.Status, 'error');
  //       }
  //     })
  //   }
  //   else {
  //     this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
  //   }
  // }

  clearForm() { 
    this.chRef.detectChanges();
    if (this.dataTable)
      this.dataTable.destroy();
    this.isSearchInitiated = false;
    this.insurances = [];
    this.form.reset();
  }

  onDblClickInsurance({ Inspayer_Description, Insurance_Id }) {
    this.onSelectInsurance.emit({
      Inspayer_Description,
      Insurance_Id
    });
  }
}
