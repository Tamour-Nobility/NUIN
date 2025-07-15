import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { InsuranceSearchReponseModel, InsuranceModel } from '../../patient/Classes/patientInsClass';
import { APIService } from '../../components/services/api.service';
import { BaseComponent } from '../../core/base/base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PracticeModel } from '../../practice-setup/practiceList/Classes/practiceClass';

@Component({
  selector: 'prac-tab-insurance-search',
  templateUrl: './prac-tab-insurance-search.component.html',
  styleUrls: ['./prac-tab-insurance-search.component.css']
})
export class PracTabInsuranceSearchComponent extends BaseComponent implements OnInit {
  searchModel: InsuranceModel;
  blnEditDemoChk: boolean = false;
  currentInsuranceNumber: number;
  insurances: InsuranceSearchReponseModel[];
  dataTable: any;     
  gurantorCheck: boolean;
  gurantorCheckIndex: number;
  isSearchInitiated: boolean = false;
  form: FormGroup;
   objPracticeModel: PracticeModel;
   numProviderLocation: number;
   locationCode: number | null = null; // Variable to store Location_Code
  @Output() onSelectInsurance: EventEmitter<any> = new EventEmitter();
  @Output() onMapSuccess: EventEmitter<void> = new EventEmitter<void>();
  @Input() PracticeCode: any;
  @Input() Location :any;
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
    console.log('this.PracticeCode Received data:', this.PracticeCode); // Log the received data
    this.getPracticeProviderLocation(); // Call the method during initialization
    console.log('Location ID data:', ); // Log the received data
  
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
    let canSearch = false;
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
      this.getPracticeProviderLocation('ProviderPayers');
      this.isSearchInitiated = true;
      this.API.PostData('/Demographic/SearchInsurance/', this.searchModel, (d) => {
        if (d.Status == "success") {
          if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
          }
          this.insurances = d.Response;
          this.chRef.detectChanges();
          const table: any = $('.PISearchInsurace');
          this.dataTable = table.DataTable({
            language: {
              emptyTable: "No data available"
            },
            order: [[1, 'asc']]
          });
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
    }
    else {
      this.toastService.warning('Please provide search criteria', 'Invalid Search Criteria');
    }
  }
  initializeDataTable() {
    const table: any = $('.PISearchInsurace');
    this.dataTable = table.DataTable({
      language: { emptyTable: 'No data available' },
      order: [[1, 'asc']],
    });
  }
  

  // clearForm() {
  //   this.chRef.detectChanges();
  //   if (this.dataTable)
  //     this.dataTable.destroy();
  //   this.isSearchInitiated = false;
  //   this.insurances = [];
  //   this.form.reset();
  // }
  clearForm() {
    this.searchModel = new InsuranceModel();
    if (this.dataTable) this.dataTable.destroy();
    this.insurances = [];
    this.isSearchInitiated = false;
    this.form.reset();
    this.chRef.detectChanges();
  }
  

  onDblClickInsurance({ Inspayer_Description, Insurance_Id }) {
    this.onSelectInsurance.emit({
      Inspayer_Description,
      Insurance_Id
    });
  }
  
  mapPayer(row: any) {
    const payload = {
      Insurance_Id: row.InsPayerID,
      PracticeId: this.PracticeCode,
    };
    this.API.PostData('/PracticeSetup/MapPayer', payload, (response: any) => {

    if (response.Status === 'Success') {
      this.toastService.success('Insurance is mapped with practice successfully.');
      this.onMapSuccess.emit();
    } else if (response.Status === 'Failure') {
      this.toastService.error(response.Response); 
    } else if (response.Status === 'Reactivated') {
      this.toastService.success(response.Response); 
      this.onMapSuccess.emit();
    } else {
      alert('An error occurred: ' + response.Response);
    }
  },
  (error) => {
    alert('Failed to map payer. Please try again.');
  }
);
  }
  
  getPracticeProviderLocation(Type: string = "") {
    this.API.getData('/PracticeSetup/GetPracticeLocationList?PracticeId=' + this.PracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess' && data.Response) { 
          try {
            this.locationCode = data.Response[0].Location_Code; 
          } catch (err) {
          }
        } else {
          swal('Failed', data ? data.Status : 'Unknown error', 'error');
        }
      },
      error => {
        swal('Error', 'An error occurred while fetching data.', 'error');
      }
    );
  }
  
  
}

