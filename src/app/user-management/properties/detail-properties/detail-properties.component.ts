import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubModuleProperties } from '../../classes/requestResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { isThisMinute } from 'date-fns';

@Component({
  selector: 'app-detail-properties',
  templateUrl: './detail-properties.component.html',
  styleUrls: ['./detail-properties.component.css']
})
export class DetailPropertiesComponent implements OnInit {
  activatedRouteSub: Subscription;
  objSubModuleProperties: SubModuleProperties;
  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router) {
    this.objSubModuleProperties = new SubModuleProperties();
  }

  ngOnInit() {
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
      }
    });
  }

  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetSubModuleProperty?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objSubModuleProperties = JSON.parse(JSON.stringify(res.Response));
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }
}
