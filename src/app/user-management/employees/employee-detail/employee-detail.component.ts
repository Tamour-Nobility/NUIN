import { Component, OnInit } from '@angular/core';
import { EmployeeViewModel } from '../../classes/requestResponse';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  objEmployee: EmployeeViewModel;
  activatedRouteSubscr: Subscription;
  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService) {
    this.objEmployee = new EmployeeViewModel();
  }

  ngOnInit() {
    this.activatedRouteSubscr = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
      }
    });
  }
  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetEmployee?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objEmployee = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }
}
