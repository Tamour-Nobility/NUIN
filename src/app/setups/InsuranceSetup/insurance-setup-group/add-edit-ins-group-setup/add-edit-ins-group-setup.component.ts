import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { groupModel } from '../../classes/ins-group-model';
import { APIService } from '../../../../components/services/api.service';
import { ValidateWhiteSpace } from '../../../../validators/validateWhiteSpace.validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-ins-group-setup',
  templateUrl: './add-edit-ins-group-setup.component.html'
})
export class AddEditInsGroupSetupComponent implements OnInit, OnChanges {
  @Input() groupId: number | null = null; // Receive group ID
  @Output() onSave = new EventEmitter<any>(); // Emit save event
  @Output() onCancel = new EventEmitter<void>(); // Emit cancel event

  objInsGroupRsp: groupModel;
  addeditForm: FormGroup;

  constructor(private API: APIService,    private toast: ToastrService,) {
    this.objInsGroupRsp = new groupModel();
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    debugger
    if (changes['groupId'] && changes['groupId'].currentValue != null) {
      this.loadGroup(changes['groupId'].currentValue); // Load group data when groupId changes
    }
  }

  initForm() {
    this.addeditForm = new FormGroup({
      groupName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        ValidateWhiteSpace
      ]),
    });
  }

  loadGroup(groupId: number) {
    this.API.getData(`/InsuranceSetup/GetInsuranceGroup?InsuranceGroupId=${groupId}`).subscribe(
      response => {
        if (response.Status === 'Sucess') {
          this.objInsGroupRsp = response;
          this.addeditForm.patchValue({
            groupName: this.objInsGroupRsp.Response.Insgroup_Name,
          });
        } else {
          swal('Failed', response.Status, 'error');
        }
      }
    );
  }

  onSaveClick() {
    if (this.addeditForm.valid) {
      this.objInsGroupRsp.Response.Insgroup_Name = this.addeditForm.value.groupName;
      this.API.PostData('/InsuranceSetup/SaveInsuranceGroup/', this.objInsGroupRsp.Response, response => {
        if (response.Status === 'Success') {
          if( this.objInsGroupRsp.Response.Insgroup_Id>0){
            swal('Success', 'Insurance Group edited successfully.', 'success');
          }
          else {
            swal('Success', 'Insurance Group saved successfully.', 'success');
          }
          this.onSave.emit(response); // Emit save event
          this.addeditForm.reset()
        }
        if(response.Status==='Duplicate Group Name'){
          this.toast.error(response.Response, 'Duplicate Group Name');
         
        }
      });
    }
  }

  onCancelClick() {
    this.onCancel.emit(); // Emit cancel event
  }
}
