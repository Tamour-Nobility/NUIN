import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../../../components/services/api.service';
import { InsuranceNameViewModel } from '../../classes/insurance-name-model';

@Component({
  selector: 'app-ins-name-setup-details',
  templateUrl: './ins-name-setup-details.component.html'
})
export class InsNameSetupDetailsComponent implements OnInit {
  objInsNameRsp: InsuranceNameViewModel;

  constructor(
    private activatedRoute: ActivatedRoute,
    private API: APIService,
  ) {
    this.objInsNameRsp = new InsuranceNameViewModel();

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getInsName(id);
      }
    });
  }

  getInsName(insNameId: any) {
    this.API.getData('/InsuranceSetup/GetInsuranceName?InsuranceNameId=' + insNameId + '').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.objInsNameRsp = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
}
