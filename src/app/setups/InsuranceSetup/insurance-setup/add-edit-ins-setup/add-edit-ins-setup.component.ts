import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { groupModel } from '../../classes/ins-group-model';
import { InsurancePayerModelVM } from '../../classes/ins-payer-model';
import { SelectListViewModel } from '../../../../models/common/selectList.model';
import { InsModel } from '../../classes/insurance-setup-model';
import { APIService } from '../../../../components/services/api.service';
import { TableRefreshService } from '../../../../services/data/table-refresh.service';
import { Common } from '../../../../services/common/common';
import { isNullOrUndefined } from 'util';
import { InsuranceNameModelViewModel } from '../../classes/insurance-name-model';
import { ValidateWhiteSpace } from '../../../../../app/validators/validateWhiteSpace.validator';

@Component({
  selector: 'app-add-edit-ins-setup',
  templateUrl: './add-edit-ins-setup.component.html'
})
export class AddEditInsSetupComponent implements OnInit {
  strAddEditTitle: string = "";
  GroupModel: groupModel[];
  insPayerModel: InsurancePayerModelVM;
  InsuranceTypeCode : string;
  insPayerList: SelectListViewModel[];
  objInsuranceName: InsuranceNameModelViewModel;
  groupsSelectList: SelectListViewModel[];
  insModel: InsModel;
  subsSearch: Subscription;
  insuranceForm: FormGroup;
  isview:boolean=false;
  allgroup:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private API: APIService,
    private route: Router,
    private tableRefreshService: TableRefreshService,
  ) {
    this.GroupModel = [];
    this.insPayerModel = new InsurancePayerModelVM();
    this.insModel = new InsModel();
    this.insPayerList = [];
    this.objInsuranceName = new InsuranceNameModelViewModel();
    this.groupsSelectList = [];
  }

  ngOnInit() {
    this.InitForm();
    this.GetAllGroups();
    this.getStateList()
    this.updateMainContentVisibility();

    // Subscribe to route changes to toggle visibility dynamically
    this.route.events.subscribe(() => {
      this.updateMainContentVisibility();
    });
    this.activatedRoute.params.subscribe(params => {
      debugger
      let id = +params['id'];
      let nameId=+params['nameId'];
      let payerId=+params['payerid']
      if (id) {
        this.GetInsuranceModel(id);
        this.strAddEditTitle = 'Edit Insurance ';
      }
      else {
        this.GetInsuranceModel();
      
        this.strAddEditTitle = 'Add New Insurance ';
      }
      if(nameId){
        this.GetInsuranceNameModel(nameId);
      }else{
        this.GetInsuranceNameModel();

      }
      if(payerId){
        this.GetInsurancePayerModel(payerId);
      }else {
      this.GetInsurancePayerModel();
    }
    });
    
     
  }
  private updateMainContentVisibility(): void {
    // Hide main content if the URL includes "add", "edit", or "detail"
    const hiddenRoutes = [ '/detail'];
    this.isview = hiddenRoutes.some((path) => this.route.url.includes(path));
    if(this.isview){
      debugger
      this.insuranceForm.disable()  
        }
  }
  InitForm() {
    this.insuranceForm = new FormGroup({
      gName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)

      ]),
      iName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        ValidateWhiteSpace
      ]),
      paName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
      ]),
      zCode: new FormControl('', [
        Validators.required,
        Validators.maxLength(9)
      ]),
      iAddress: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000)

      ]),
      zCity: new FormControl('', []),
      zState: new FormControl('', []),
      insDept: new FormControl('', []),
      pType: new FormControl('', []),
      pTypee: new FormControl('', []),
      InsTypeCode: new FormControl('', [
        Validators.required]),
      phone: new FormControl('', []),
      phonee: new FormControl('', []),
      cFilling: new FormControl('', []),
      aFilling: new FormControl('', []),
      sec: new FormControl('', []),
      secPaper: new FormControl('', []),
      iActive: new FormControl('', []),
      pPlan: new FormControl('', [
      ]),
      pState: new FormControl('', [
        Validators.required]),
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
  reset(){
    this.GetInsuranceModel();
    this.GetInsuranceNameModel();
    this.GetInsurancePayerModel();
  }
  GetInsuranceModel(InsuranceId?: any) {
    this.API.getData(`/InsuranceSetup/GetInsuranceModel?InsuranceId= ${InsuranceId}`).subscribe(
      d => {
        if (d.Status == "Sucess") {
          // if (this.insPayerList == null) {
          //   this.insPayerList = [];
          // }
          // if (this.insPayerList.find(f => f.Id == d.Response.InsurancePayer.Id) == null) {
          //   this.insPayerList.push(d.Response.InsurancePayer);
          // }
          this.insModel.ObjResponse = d.Response;
          this.insModel.ObjResponse.Insurance_Address=d.Response.Insurance_Address.toUpperCase()

             }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  GetInsuranceNameModel(insNameId?: any) {

    this.API.getData(`/InsuranceSetup/GetInsuranceNameModel?InsuranceNameId=${insNameId}`).subscribe(
      d => {
        if (d.Status == "Success") {
          this.objInsuranceName = d.Response;
          this.objInsuranceName.Insname_Description=d.Response.Insname_Description.toUpperCase()

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

  getInsPayerList() {
    this.API.getData('/InsuranceSetup/GetInsPayerList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.insPayerList = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  stateList:any;
  getStateList() {
    this.API.getData('/Demographic/GetStateDropDownList').subscribe(
      d => {
        debugger
        if (d.Status == "Success") {
          this.stateList = d.Response;
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }
  onBlurMethod() {

    if (this.insModel.ObjResponse.Insurance_Zip == undefined || this.insModel.ObjResponse.Insurance_Zip == null || this.insModel.ObjResponse.Insurance_Zip == "" || this.insModel.ObjResponse.Insurance_Zip.length < 4) {
      this.insModel.ObjResponse.Insurance_City = "";
      this.insModel.ObjResponse.Insurance_State = "";
      return;
    }
    else {
      this.API.getData('/Demographic/GetCityState?ZipCode=' + this.insModel.ObjResponse.Insurance_Zip).subscribe(
        data => {
          if (data.Status == "Success") {
            debugger
            this.insModel.ObjResponse.Insurance_City = data.Response[0].CityName;
            this.insModel.ObjResponse.Insurance_State = data.Response[0].State;
 
          }
          else {
            this.insModel.ObjResponse.Insurance_City = "";
            this.insModel.ObjResponse.Insurance_State = "";
          }
        }
      );
    }
  }

  onSaveClick() {
    if (this.canSave()) {
      this.API.PostData('/InsuranceSetup/SaveInsurance', this.insModel.ObjResponse, (d) => {
        if (d.Status == "Sucess") {
          swal('Add/Edit', 'Insurance has been saved successfully.', 'success');
          this.onCancelClick();
        }
      })
    }
  }

  canSave(): boolean {
    if (this.insModel.ObjResponse.InsPayer_Id == undefined || this.insModel.ObjResponse.InsPayer_Id == null || this.insModel.ObjResponse.InsPayer_Id == 0) {
      swal('Failed', "Please select Insurance Payer Name.", 'error');
      return false;
    }
    if (this.insModel.ObjResponse.Insurance_City == undefined || this.insModel.ObjResponse.Insurance_City == null || this.insModel.ObjResponse.Insurance_City == "") {
      swal('Failed', "Please enter Zip Code.", 'error');
      return false;
    }
    if (this.insModel.ObjResponse.Insurance_Zip == undefined || this.insModel.ObjResponse.Insurance_Zip == null || this.insModel.ObjResponse.Insurance_Zip == "") {
      swal('Failed', "Please enter Zip Code.", 'error');
      return false;
    }
    if (this.insModel.ObjResponse.Insurance_Address == undefined || this.insModel.ObjResponse.Insurance_Address == null || $.trim(this.insModel.ObjResponse.Insurance_Address) == "") {
      swal('Failed', "Please enter Insurance Address.", 'error');
      return false;
    }
    return true;
  }

  onCancelClick() {
    this.route.navigate(['/InsuranceSetup/insSetup']);
    this.tableRefreshService.refresh.next({ type: 'insSetup', value: this.insPayerList.find(f => f.Id == this.insModel.ObjResponse.InsPayer_Id) });
  }

  onTypeInsurancePayer(value: any) {
    if (!Common.isNullOrEmpty(value) && value.length >= 3) {
      if (!isNullOrUndefined(this.subsSearch)) {
        this.subsSearch.unsubscribe();
      }
      this.subsSearch = this.API.getData(`/InsuranceSetup/GetSmartInsurancePayersList?searchText=${value}`).subscribe(
        res => {
          if (res.Status == "Success") {
            this.insPayerList = res.Response;
          }
          else {
            swal('Failed', res.Status, 'error');
          }
        });
    }
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
  checkSpcialCharfornum(event: KeyboardEvent) {
    if (!((event.charCode >= 65) && (event.charCode <= 90) || (event.charCode >= 97) && (event.charCode <= 122) || (event.charCode >= 48) && (event.charCode <= 57) || (event.charCode == 32))) {
      event.returnValue = false;
      return;
    }
  }
  onSaveINSClick() {
    debugger
    const requestBody = {
      insuranceNameModelViewModel:this.objInsuranceName,
      insurancePayerViewModel:this.insPayerModel,
      Insurance:this.insModel.ObjResponse,
     // InsuranceTypeCodeModel: { InsuranceTypeCode: this.InsuranceTypeCode },
    };

      this.API.PostData('/InsuranceSetup/AddInsurance', requestBody, (d) => {
        debugger
        if (d.Status == "Success") {
          debugger
          if(this.insModel.ObjResponse.Insurance_Id==0){
            swal('Success', 'Insurance has been saved successfully.', 'success');
          }
          if(this.insModel.ObjResponse.Insurance_Id>0){
            swal('Success', 'Insurance has been edited successfully.', 'success');
          }
          this.onCancelClick();
        }
      })
    }
    GetInsurancePayerModel(InsurancePayerId?: any) {
      this.API.getData('/InsuranceSetup/GetInsurancePayerModel?InsurancePayerId=' + InsurancePayerId).subscribe(
        d => {
          if (d.Status == "Sucess") {
            debugger
            this.insPayerModel = d.Response;
            this.insPayerModel.Inspayer_Description=d.Response.Inspayer_Description.toUpperCase()     
            if (d.Response.InsuranceGroup) {
              if (this.groupsSelectList == null)
                this.groupsSelectList = [];
              if (this.groupsSelectList.find(f => f.Id == d.Response.InsuranceGroup.Id) == null)
                this.groupsSelectList.push(d.Response.InsuranceGroup);
            }
            if (d.Response.InsuranceName) {
              // if (this.nameSelectList == null)
              //   this.nameSelectList = [];
              // if (this.nameSelectList.find(f => f.Id == d.Response.InsuranceName.Id) == null)
              //   this.nameSelectList.push(d.Response.InsuranceName);
            }
          }
          else {
            swal('Failed', d.Status, 'error');
          }
        })
    }

    GetAllGroups() {
  
         this.API.getData(`/InsuranceSetup/GetInsuranceGroupsSelectList`).subscribe(
           d => {
             if (d.Status == "Success") {
                this.allgroup = d.Response;
                
               console.log("All Groups", this.allgroup)
             }
             else {
               swal('Failed', d.Status, 'error');
             }
           });
   
       
     }
   
}