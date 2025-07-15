import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APIService } from '../../../components/services/api.service';
import { ZipCodeLength } from '../../../validators/zipcode.validator';
import { IMyDate, IMyDpOptions } from "mydatepicker";
import { DatePipe } from "@angular/common";
import { Common } from '../../../services/common/common';

export class zipdata{
  CityName:string;
  State:string;
}
@Component({
  selector: 'app-add-edit-referral-physician',
  templateUrl: './add-edit-referral-physician.component.html',
  styleUrls: ['./add-edit-referral-physician.component.css']
})
export class AddEditReferralPhysicianComponent implements OnInit {

  UserForm: FormGroup;
  refCode: any;
  type: any;
  routeName: any = "Add";
  btnName: any = "Save";
  taxonomies: any = [];
  SelectedSpecialityGroup:any;
  specialtyCategoryOne:any = [];
  public placeholder: string = 'MM/DD/YYYY';
  strProv_DEA_EXP: string = "";
  strProv_DOB: string = "";
  taxonomyCode = "";
  Ziprefdate:zipdata[];
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '20px', width: '100%',
    
  };
  constructor(private datepipe: DatePipe,
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private apiService:APIService,
    private toaster: ToastrService,
    private route: Router){
      this.Ziprefdate=[];
    this.InitializeForm();
  }

  ngOnInit() {
    this.getSpecialityGroups();
    this.getSpecializations();
    this.gettingParams();
  }

  gettingParams()
  {
    this.refCode = this.activatedRoute.snapshot.paramMap.get('id');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');

    if (this.type == 'edit'){
     this.getPhysician(this.refCode);
     this.routeName = 'Edit';
     this.btnName = 'Update'; 
    }
    if (this.type == 'view'){
      this.getPhysician(this.refCode);
      this.UserForm.disable();
      this.routeName = 'View';
    }
  }

  clearForm(){
    this.UserForm.reset();
    this.specialtyCategoryOne = [];
  }

  goBack(){
    this.router.navigateByUrl('referral-physician');
  }

  getFieldValue(field){
    if (this.UserForm.get(field).touched){
      if (this.UserForm.get(field).invalid){
        return true;
      }
    }
    return false;
  }

  specializations:any = [];
  getSpecializations(){
    this.apiService.getData('/PracticeSetup/GetSpecializations')
      .subscribe(
        data => {
          if (data.Status === "success") {
            this.specializations = data.Response;
            //console.log("resulting specializations", data);
          }
        },
        error => {
          this.toaster.error("some error occured");
          console.error('An error occurred:', error);
        }
      );
  }

  getSpecialityGroups(){
    this.apiService.getData('/PracticeSetup/GetSpecialityGroups')
      .subscribe(
        data => {
          if (data.Status === "success") {
            this.taxonomies = data.Response;
          }
        },
        error => {
          this.toaster.error("some error occured");
          console.error('An error occurred:', error);
        }
      );
  }

  strDobDate: IMyDate;
  strDAEExpDate: IMyDate;

  setStrDate(date: string, type) {
    if (type == 'dob'){
      if (!Common.isNullOrEmpty(date)) {
        let dDate = new Date(date);
        this.strDobDate = {
            year: dDate.getFullYear(),
            month: dDate.getMonth() + 1,
            day: dDate.getDate()
        };
      }
    }else{
      if (!Common.isNullOrEmpty(date)) {
        let dDate = new Date(date);
        this.strDAEExpDate = {
            year: dDate.getFullYear(),
            month: dDate.getMonth() + 1,
            day: dDate.getDate()
        };
      }
    }
  }

  InitializeForm(): any {
    this.UserForm = new FormGroup({
      Pin: new FormControl('', [Validators.pattern(/^[0-9]+$/)] ),
      Referral_License: new FormControl(''),
      Exported: new FormControl(false),
      NPI: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]),
      Referral_Mi: new FormControl('', [Validators.maxLength(1)]),
      Referral_Phone: new FormControl(''),
      Referral_Lname: new FormControl('', [Validators.required]),
      Referral_Fname: new FormControl('', [Validators.required]),
      Referral_Fax: new FormControl(''),
      Referral_Email: new FormControl(''),
      Recent_Use: new FormControl(false),
      Referral_Address: new FormControl('', [Validators.required]),
      Referral_City: new FormControl('', [Validators.required]),
      Referral_Contact_Person: new FormControl(''),
      Referral_Ssn: new FormControl('', Validators.pattern(/^[0-9]+$/)),
      Referral_State: new FormControl('', [Validators.required, Validators.maxLength(2)]),
      Referral_Taxonomy_Code: new FormControl('', [Validators.required]),
      Referral_Tax_Id: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.maxLength(9), Validators.minLength(9)]),
      Referral_Upin: new FormControl('', [Validators.maxLength(15)]),
      Referral_Zip: new FormControl('', [Validators.required, ZipCodeLength]),
      Title: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z\s]*?$/)]),
      Referral_Code: new FormControl(''),
      specialityGroupNumber: new FormControl(''),
    });
  }

  onSubmit(){ 
    if (this.btnName == 'Save'){
      this.apiService.PostData('/ReferralPhysicians/CreateReferralPhysician', this.UserForm.value, (response) => {
        if (response.Status === 'success') {
          this.toaster.success('Referral physician has been saved successfully.', 'Success');
          this.route.navigate(['referral-physician']);
        } else {
          this.toaster.error('Failure to add detail', 'Error');
        }
      });
    }
    else if (this.btnName == 'Update'){
      this.apiService.PostData('/ReferralPhysicians/UpdateReferralPhysician', this.UserForm.value, (response) => {
        if (response.Status === 'success') {
          this.toaster.success('Referral physician has been updated successfully.', 'Success');
          this.route.navigate(['referral-physician']);
        } else {
          this.toaster.error('Failure to add detail', 'Error');
        }
      });
    }
    else if (this.btnName == 'Go back'){
      this.route.navigate(['referral-physician']);
    }
    
  }

  onChangeTaxonomyCode(data){

    this.taxonomyCode = data.target.value;
  }

  onChangeSpecialityGroup(data: any) {
    this.taxonomyCode = "";
    this.specialtyCategoryOne=[];
    this.UserForm.get("Referral_Taxonomy_Code").setValue("");
    this.apiService.getData(`/PracticeSetup/GetPracticeSpecialityCategoryOne?GroupNo=${data}`).subscribe(
        data => {
            if (data.Status === 'Sucess') {
                this.specialtyCategoryOne = data.Response;
            } else {
                swal('Failed', data.Status, 'error');
            }
        }
    );
  }

  onDateChangedExp(event, id) {
    if (id === 0) {
        this.UserForm.get('DEA_Expiry_Date').setValue(event.formatted);
        this.strProv_DEA_EXP = event.formatted;
        
    } else {
      this.UserForm.get('Date_Of_Birth').setValue(event.formatted);
      this.strProv_DOB = event.formatted;
    }
  }

  transformToUppercase(fieldname : string) {
    debugger;
    let control = this.UserForm.get(fieldname); // Replace 'form' with your actual form instance
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  getPhysician(refCode){
   debugger
    this.apiService.getData('/ReferralPhysicians/GetReferralPhysicianByRefCode?refCode=' + refCode)
      .subscribe(
        data => {
          if (data.Status === "success") {
            debugger;
            this.UserForm.patchValue(data.Response);
            this.UserForm.get('Title').setValue(data.Response.Title.toUpperCase())
            this.UserForm.get('Referral_Lname').setValue(data.Response.Referral_Lname.toUpperCase())
            this.UserForm.get('Referral_Fname').setValue(data.Response.Referral_Fname.toUpperCase())
            this.UserForm.get('Referral_Mi').setValue(data.Response.Referral_Mi.toUpperCase())
            this.UserForm.get('Referral_Address').setValue(data.Response.Referral_Address.toUpperCase())

            this.onBlurMethod();
            let dob = this.datepipe.transform(data.Response.Date_Of_Birth, 'MM/dd/yyyy');
            let dae = this.datepipe.transform(data.Response.DEA_Expiry_Date, 'MM/dd/yyyy');
            this.setStrDate(dob, 'dob');
            this.setStrDate(dae, 'dae');
            if (data.Response.SpecialityGroupNo > 0){
              this.UserForm.get('specialityGroupNumber').setValue(data.Response.SpecialityGroupNo)
              if (data.Response.Referral_Taxonomy_Code != undefined || data.Response.Referral_Taxonomy_Code != null || data.Response.Referral_Taxonomy_Code != ""){
                
                this.onChangeSpecialityGroup(data.Response.SpecialityGroupNo)
                this.UserForm.get('Referral_Taxonomy_Code').setValue(data.Response.Referral_Taxonomy_Code)
                this.taxonomyCode = data.Response.Referral_Taxonomy_Code;
              }
            }
          }
        },
        error => {
          this.toaster.error("some error occured");
          console.error('An error occurred:', error);
        }
      );
  }

  onBlurMethod() {
    const referralZip = this.UserForm.get('Referral_Zip').value;
    if (!referralZip || referralZip.length < 4) {
      this.UserForm.patchValue({
        Referral_City: "",
        Referral_State: ""
      });
      return;
    }
  
    this.apiService.getData('/Demographic/GetCitiesByZipCode?ZipCode=' + referralZip).subscribe(
      data => {
        if (data.Status === "Sucess") {
          this.Ziprefdate=data.Response;
          this.UserForm.patchValue({
            Referral_City: this.Ziprefdate[0].CityName,
            Referral_State: this.Ziprefdate[0].State
          });
        } else {
          this.UserForm.patchValue({
            Referral_City: "",
            Referral_State: ""
          });
        }
      }
    );
  }

  onEditable()
  {
    debugger;
    this.router.navigateByUrl('referral-physician/'+this.refCode+'/edit');
   
    setTimeout(() => {
      this.gettingParams()
    }, 100);
    this.UserForm.enable();

  }

}
  