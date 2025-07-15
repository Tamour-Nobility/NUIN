import { Component, OnInit } from '@angular/core';
import { Module } from '../../classes/requestResponse';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.component.html',
  styleUrls: ['./module-detail.component.css']
})
export class ModuleDetailComponent implements OnInit {
  objModule: Module;
  activatedRouteSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService) {
    this.objModule = new Module();
  }

  ngOnInit() {
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.getById(id);
      };
    });
  }

  getById(id: number): any {
    this.apiService.getData(`/UserManagementSetup/GetModule?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objModule = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }
}
