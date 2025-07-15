import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../../../components/services/api.service';
import { groupModel } from '../../classes/ins-group-model'
@Component({
  selector: 'app-ins-group-setup-details',
  templateUrl: './ins-group-setup-details.component.html'
})
export class InsGroupSetupDetailsComponent implements OnInit {
  objInsGroupRsp: groupModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private API: APIService,
    //private route: Router
  ) {
    this.objInsGroupRsp = new groupModel();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getInsGroup(id);
      }

    });
  }

  getInsGroup(insGroupId: any) {
    this.API.getData('/InsuranceSetup/GetInsuranceGroup?InsuranceGroupId=' + insGroupId + '').subscribe(
      d => {
        if (d.Status == "Sucess") {
          $('.datatables').DataTable().destroy();
          this.objInsGroupRsp = d;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

}
