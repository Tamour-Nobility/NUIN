import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectListViewModel } from '../../../../models/common/selectList.model';
import { InsurancePayerModelVM } from '../../classes/ins-payer-model';
import { APIService } from '../../../../components/services/api.service';
import { TableRefreshService } from '../../../../services/data/table-refresh.service';
import { Common } from '../../../../services/common/common';

@Component({
  selector: 'app-add-edit-ins-setup-payer',
  templateUrl: './add-edit-ins-setup-payer.component.html'
})
export class AddEditInsSetupPayerComponent implements OnInit {
  strAddEditTitle: string = "";
  groupsSelectList: SelectListViewModel[];
  nameSelectList: SelectListViewModel[];
  insPayerModel: InsurancePayerModelVM;
  payerForm: FormGroup;

  gaName = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  iName = new FormControl('', [Validators.maxLength(50), Validators.required]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private API: APIService,
    private route: Router,
    private refreshGrid: TableRefreshService
  ) {
    this.groupsSelectList = [];
    this.nameSelectList = [];
    this.insPayerModel = new InsurancePayerModelVM();
  }

  ngOnInit() {
    this.InitForm();
    this.activatedRoute.params.subscribe(params => {
      let id = +params['id'];
      if (id) {
        this.GetInsurancePayerModel(id);
        this.strAddEditTitle = 'Edit Insurance Payer';
      }
      else {
        this.GetInsurancePayerModel();
        this.strAddEditTitle = 'Add New Insurance Payer';
      }
    });
  }
  InitForm() {
    this.payerForm = new FormGroup({
      pName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      pPlan: new FormControl('', [
      ]),
      pState: new FormControl('', [
      ]),
      sType: new FormControl('', [
      ]),
      tfDay: new FormControl('', [
      ]),
      eSetup: new FormControl('', [
      ]),
      erSetup: new FormControl('', [
      ]),
      partA: new FormControl('', [
      ]),
      rPayer: new FormControl('', [
      ]),
      pId: new FormControl('', [
        Validators.required]),
    });
  }

  GetInsurancePayerModel(InsurancePayerId?: any) {
    this.API.getData('/InsuranceSetup/GetInsurancePayerModel?InsurancePayerId=' + InsurancePayerId).subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.insPayerModel = d.Response;
          this.insPayerModel.Inspayer_Description=d.Response.Inspayer_Description.toUpperCase();
          if (d.Response.InsuranceGroup) {
            if (this.groupsSelectList == null)
              this.groupsSelectList = [];
            if (this.groupsSelectList.find(f => f.Id == d.Response.InsuranceGroup.Id) == null)
              this.groupsSelectList.push(d.Response.InsuranceGroup);
          }
          if (d.Response.InsuranceName) {
            if (this.nameSelectList == null)
              this.nameSelectList = [];
            if (this.nameSelectList.find(f => f.Id == d.Response.InsuranceName.Id) == null)
              this.nameSelectList.push(d.Response.InsuranceName);
          }
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  checkSpcialCharfornum(event: KeyboardEvent) {
    if (!((event.charCode >= 65) && (event.charCode <= 90) || (event.charCode >= 97) && (event.charCode <= 122) || (event.charCode >= 48) && (event.charCode <= 57) || (event.charCode == 32))) {
      event.returnValue = false;
      return;
    }
  }

  onSaveClick() {
    if (this.canSave()) {
      this.API.PostData('/InsuranceSetup/SaveInsurancePayer/', this.insPayerModel, (d) => {
        if (d.Status == "Sucess") {
          swal("Add/Edit", 'Insurance Payer has been saved successfully.', 'success');
          this.onCancelClick();
          this.refreshGrid.refresh.next({
            InsuranceGroup: this.groupsSelectList.find(i => i.Id == this.insPayerModel.Insgroup_Id),
            InsuranceName: this.nameSelectList.find(i => i.Id == this.insPayerModel.Insname_Id),
            name: 'insPayer'
          })
        }
      })
    }
  }

  canSave(): boolean {
    if (this.insPayerModel.Inspayer_Description == undefined || this.insPayerModel.Inspayer_Description == null || $.trim(this.insPayerModel.Inspayer_Description) == "") {
      swal('Failed', "Please enter Insurance Payer Description.", 'error');
      return false;
    }

    if (this.insPayerModel.Insgroup_Id == undefined || this.insPayerModel.Insgroup_Id == null || this.insPayerModel.Insgroup_Id == 0) {
      swal('Failed', "Please enter Insurance Group Name.", 'error');
      return false;
    }


    if (this.insPayerModel.Insname_Id == undefined || this.insPayerModel.Insname_Id == null || this.insPayerModel.Insname_Id == 0) {
      swal('Failed', "Please enter Insurance Name Description.", 'error');
      return false;
    }

    return true;
  }

  onCancelClick() {
    
    this.route.navigate(['/InsuranceSetup/insPayer']);
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

  onSelectGroup(e: any) {
    this.nameSelectList = [];
  }

  onRemoveGroup(e: any) {
    this.nameSelectList = [];
  }

  onTypeName(e: any) {
    if (!Common.isNullOrEmpty(e) && e.length >= 3 && !Common.isNullOrEmpty(this.insPayerModel.Insgroup_Id)) {
      this.API.getData(`/InsuranceSetup/GetSmartInsuranceNameList?insuranceGroupId=${this.insPayerModel.Insgroup_Id}&searchText=${e}`).subscribe(
        d => {
          if (d.Status == "Success") {
            this.nameSelectList = d.Response;
          }
          else {
            swal('Failed', d.Status, 'error');
          }
        });

    }
  }

  onSelectName(e: any) {
  }

  onRemoveName(e: any) {

  }

}