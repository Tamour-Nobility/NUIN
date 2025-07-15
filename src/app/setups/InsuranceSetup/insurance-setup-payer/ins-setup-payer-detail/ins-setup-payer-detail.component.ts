import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../../../components/services/api.service';
import { InsurancePayerViewModel, InsurancePayerModelVM } from '../../classes/ins-payer-model';
@Component({
  selector: 'app-ins-setup-payer-detail',
  templateUrl: './ins-setup-payer-detail.component.html'
})
export class InsSetupPayerDetailComponent implements OnInit {
  insPayerModel: InsurancePayerModelVM;
  constructor(
    private activatedRoute: ActivatedRoute,
    private API: APIService,
  ) {
    this.insPayerModel = new InsurancePayerModelVM();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.GetInsurancePayer(id);
      }

    });
  }
  GetInsurancePayer(InsurancePayerId: any) {
    this.API.getData('/InsuranceSetup/GetInsurancePayer?InsurancePayerId=' + InsurancePayerId).subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.insPayerModel = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
}
