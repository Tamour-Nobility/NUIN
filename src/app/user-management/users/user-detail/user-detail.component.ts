import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../classes/requestResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  activatedRouteSub: Subscription;
  objUser: User;

  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router) {
    this.objUser = new User();
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
    this.apiService.getData(`/UserManagementSetup/GetUser?id=${id}`)
      .subscribe(res => {
        if (res['Status'] === 'Success') {
          this.objUser = res['Response'];
        }
        else {
          this.toaster.error(res['Status'], 'Error');
        }
      });
  }
}
