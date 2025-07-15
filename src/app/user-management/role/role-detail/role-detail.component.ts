import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { Role } from '../../classes/requestResponse';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css']
})
export class RoleDetailComponent implements OnInit {
  objRole: Role;
  activatedRouteSub: Subscription;
  constructor(private route: Router,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private apiService: APIService) {
    this.objRole = new Role();
  }

  ngOnInit() {
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getByID(id);
      }
    });
  }
  getByID(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetRole?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objRole = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }
}
