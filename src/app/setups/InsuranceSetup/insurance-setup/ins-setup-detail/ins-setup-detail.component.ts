import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../../../components/services/api.service';
import { InsModel } from '../../classes/insurance-setup-model';
import { Common } from '../../../../services/common/common';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ins-setup-detail',
  templateUrl: './ins-setup-detail.component.html'
})
export class InsSetupDetailComponent implements OnInit {
  insModel: InsModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private API: APIService,
    private titleCase: TitleCasePipe,
    private upperCase: UpperCasePipe
  ) {
    this.insModel = new InsModel();
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.searchInsurancesDetail(id);
      }

    });
  }

  searchInsurancesDetail(InsuranceId: any) {
    this.API.getData('/InsuranceSetup/GetInsurance?InsuranceId=' + InsuranceId).subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.insModel.ObjResponse = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  getFormattedAddress(StreetAddress: string = "", Zip: string = "", City: string = "", State: string = "") {
    let pipedCity = this.titleCase.transform(City);
    let maskedZip = (Common.isNullOrEmpty(Zip) ? '' : (Zip.length == 9 ? Zip.substring(0, 5) + '-' + Zip.substring(5, 9) : Zip));
    let pipedState = this.upperCase.transform(State);
    return `${StreetAddress} ${pipedCity}, ${pipedState} ${maskedZip}`;
  }

}

