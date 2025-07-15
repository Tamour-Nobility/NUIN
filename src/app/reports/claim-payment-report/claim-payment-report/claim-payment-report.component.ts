import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../../components/services/api.service'
import { ClaimPaymentsDetail, ClaimPaymentsDetailRequest } from '../../classes/claim-payments-detail-model';

@Component({
  selector: 'app-claim-payment-report',
  templateUrl: './claim-payment-report.component.html',
  styleUrls: ['./claim-payment-report.component.css']
})

export class ClaimPaymentReportComponent implements OnInit {
  CPDForm: FormGroup;
  searchRequest: ClaimPaymentsDetailRequest;
  claimPayments: ClaimPaymentsDetail;
  listPracticesList: any[];
  listPaymentTypes: any[];
  listPaymentFrom: any[];
  dtClaimPayments: any;
  public placeholder: string = 'MM/DD/YYYY';
  public myDatePickerOptions: IMyDrpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '93%',
  };
  isSearchInitiated: boolean = false;
  constructor(private API: APIService,
    public toaster: ToastrService,
    private chRef: ChangeDetectorRef) {
    this.listPaymentTypes = [
      { name: 'Check', value: 'Check' },
      { name: 'Credit Card', value: 'Credit Card' },
    ];
    this.listPaymentFrom = [
      { name: 'Patient', value: 'Patient' },
      { name: 'Primary', value: 'Primary' },
      { name: 'Secondary', value: 'Secondary' }
    ]
  }

  ngOnInit() {
    this.InitForm();
    this.getPractices();
  }

  InitForm() {
    this.CPDForm = new FormGroup({
      PracCode: new FormControl('', [
        Validators.required,
      ]),
      PaymentType: new FormControl(''),
      PaymentFrom: new FormControl(''),
      CheckNo: new FormControl('', Validators.pattern(/^[0-9]+$/)),
      PatientName: new FormControl('', Validators.pattern('[a-zA-Z ]*')),
      InsuranceName: new FormControl(''),
      PaymentDateFrom: new FormControl(''),
      PaymentDateTo: new FormControl(''),
    })
  }

  get f() {
    return this.CPDForm.controls;
  }

  getPractices() {
    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  onDateChanged(e, dType: string) {
    if (dType == 'From') {
      this.f.paymentDateFrom.setValue(e.formatted);
    }
    else {
      this.f.paymentDateTo.setValue(e.formatted);
    }
  }

  getClaimPayemtsDetail() {
    this.searchRequest = this.CPDForm.value;
    this.API.PostData('/Report/ClaimPaymentsDetailReport', this.searchRequest, (response) => {
      if (response.Status == "Error")
        this.toaster.error(response.Response, 'Error')
      else {
        this.isSearchInitiated = true;
        if (this.dtClaimPayments) {
          this.chRef.detectChanges();
          this.dtClaimPayments.destroy();
        }
        this.claimPayments = response.Response;
        this.chRef.detectChanges();
        const table: any = $('.dtClaimPayments');
        this.dtClaimPayments = table.DataTable({
          width: '100%',
          columnDefs: [
            {
              type: 'date', targets: [5, 6]
            },
            {
              width: '20%', targets: [1]
            },
            {
              width: '10%', targets: [0, 2, 3, 4, 5, 6, 7, 8]
            }
          ],
          language: {
            emptyTable: "No data available"
          },
          autoWidth: false,
          paging: true,
          scrollX: true,
          scrollY: '290'
        });
      }
    });
  }

  onClear() {
    this.CPDForm.reset();
  }
}
