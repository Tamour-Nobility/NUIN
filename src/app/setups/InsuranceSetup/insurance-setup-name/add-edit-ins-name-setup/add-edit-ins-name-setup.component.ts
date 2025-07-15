import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InsuranceNameModelViewModel } from '../../classes/insurance-name-model';
import { SelectListViewModel } from '../../../../models/common/selectList.model';
import { APIService } from '../../../../components/services/api.service';
import { TableRefreshService } from '../../../../services/data/table-refresh.service';
import { ValidateWhiteSpace } from '../../../../validators/validateWhiteSpace.validator';
import { Common } from '../../../../services/common/common';

@Component({
  selector: 'app-add-edit-ins-name-setup',
  templateUrl: './add-edit-ins-name-setup.component.html'
})
export class AddEditInsNameSetupComponent implements OnInit {
  strAddEditTitle: string = "";
  objInsuranceName: InsuranceNameModelViewModel;
  groupsSelectList: SelectListViewModel[];
  insNameForm: FormGroup;
  constructor(
    private activatedRoute: ActivatedRoute,
    private API: APIService,
    private route: Router,
    private refreshGrid: TableRefreshService
  ) {
    this.objInsuranceName = new InsuranceNameModelViewModel();
    this.groupsSelectList = [];
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.InitForm();
      let id = +params['id'];
      if (id) {
        this.GetInsuranceNameModel(id);
        this.strAddEditTitle = 'Edit Insurance Name';
      }
      else {
        this.GetInsuranceNameModel();
        this.strAddEditTitle = 'Add New Insurance Name';
      }
    });
  }

  InitForm() {
    this.insNameForm = new FormGroup({
      gName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)

      ]),
      iName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        ValidateWhiteSpace
      ]),
    });
  }

  GetInsuranceNameModel(insNameId?: any) {
    this.API.getData(`/InsuranceSetup/GetInsuranceNameModel?InsuranceNameId=${insNameId}`).subscribe(
      d => {
        if (d.Status == "Success") {
          this.objInsuranceName = d.Response;
          if (this.groupsSelectList == null) {
            this.groupsSelectList = [];
          }
          if (this.groupsSelectList.find(t => t.Id == d.Response.InsuranceGroup.Id) == null) {
            this.groupsSelectList.push(d.Response.InsuranceGroup);
          }
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  onSaveClick() {
    if (this.canSave()) {
      this.API.PostData('/InsuranceSetup/SaveInsuranceName/', this.objInsuranceName, (d) => {
        if (d.Status == "Sucess") {
          swal('Add/Edit', 'Insurance group has been saved successfully.', 'success');
          this.onCancelClick();
        }
      })
    }
  }
  canSave(): boolean {
    if ($.trim(this.objInsuranceName.Insname_Description) == "") {
      swal('Failed', "Please enter Insurance Name.", 'error');
      return false;
    }

    if (this.objInsuranceName.Insgroup_Id == undefined || this.objInsuranceName.Insgroup_Id == null || this.objInsuranceName.Insgroup_Id == 0) {
      swal('Failed', "Please select Insurance Group.", 'error');
      return false;
    }
    return true;
  }
  onCancelClick() {
    this.route.navigate(['/InsuranceSetup/insName']);
    this.refreshGrid.refresh.next({ name: 'insName', insGroup: this.groupsSelectList.find(i => i.Id == this.objInsuranceName.Insgroup_Id) });

  }

  onTypeGroups(e: any) {
    if (!Common.isNullOrEmpty(e) && e.length >= 3) {
      this.API.getData(`/InsuranceSetup/GetSmartInsuranceGroupsSelectList?searchText=${e}`).subscribe(
        d => {
          if (d.Status == "Success") {
            this.groupsSelectList = d.Response;
          }
          else {
            swal('Failed', d.Status, 'error');
          }
        });

    }
  }

}