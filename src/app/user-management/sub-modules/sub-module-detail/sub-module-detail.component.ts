import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubModule } from '../../classes/requestResponse';
import { SelectListViewModel } from '../../../models/common/selectList.model';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../components/services/api.service';
import { ToastrService } from 'ngx-toastr';

// import swal from 'sweetalert';

@Component({
  selector: 'app-sub-module-detail',
  templateUrl: './sub-module-detail.component.html',
  styleUrls: ['./sub-module-detail.component.css']
})
export class SubModuleDetailComponent implements OnInit {
  activatedRouteSub: Subscription;
  objSubModule: SubModule;
  moduleSelectList: SelectListViewModel[];

  constructor(private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private apiService: APIService,
    private route: Router) {
    this.objSubModule = new SubModule();
    this.moduleSelectList = [];
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
    this.apiService.getData(`/UserManagementSetup/GetSubModule?id=${id}`)
      .subscribe(res => {
        if (res.Status === 'Success') {
          this.objSubModule = res.Response;
        }
        else {
          this.toaster.error(res.Status, 'Error');
        }
      });
  }
}
