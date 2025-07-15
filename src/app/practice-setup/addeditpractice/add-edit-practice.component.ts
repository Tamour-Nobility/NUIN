import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../../components/services/api.service';
import { GvarService } from '../../components/services/GVar/gvar.service';
import { FormGroup, FormControl } from '@angular/forms';
import { zipdata } from '../../patient/Classes/patientInsClass';
import { PracticeModel, PracticeSynchronization } from '../practiceList/Classes/practiceClass';
import { IMyDate, IMyDpOptions } from 'mydatepicker';
import { DatePipe } from '@angular/common';
import { WCBRating, SpecialtyGroups, SpecialtyCategory, VendorLists } from '../providers/Classes/providersClass';
import { Common } from '../../services/common/common';
import { ToastrService } from 'ngx-toastr';
declare var swal: any;

@Component({
    selector: 'app-add-edit-practice',
    templateUrl: './add-edit-practice.component.html',
    styleUrls: ['./add-edit-practice.component.css']
})

export class AddEditPracticeComponent implements OnInit {
    public PracticeModel: PracticeModel;
    practiceSynchronization: PracticeSynchronization
    getpracticeSynchronization: PracticeSynchronization;
    disableSync: boolean = false;
    public placeholdertxt: string = 'MM/DD/YYYY';
    ptitle = 'Focal Person';
    rForm: FormGroup;
    public retPostData;
    //zipData: zipdata;
    zipPracData: zipdata[];
    zipMalingData: zipdata[];
    strComDate: IMyDate;
    // strEfsDate: string;
    isEdit: boolean = false;
    newPractice: boolean = false;
    @Input() listWCBRating: WCBRating[];
    @Input() listSpecialtyGroups: SpecialtyGroups[];
    @Output() onChangeVendor: EventEmitter<boolean> = new EventEmitter();
    specialtyCategoryOne: SpecialtyCategory[];
    specialtyCategoryTwo: SpecialtyCategory[];
    SelectedSpecialityGroup: SpecialtyGroups;
    allVendorList: VendorLists[];
    SelectedSpecialityCategoryOne: SpecialtyCategory;
    SelectedPracticeCode: number;
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '93%'
    };
    selectedVendor: number;
    constructor(
        //private renderer: Renderer2, 
        private toaster: ToastrService,
        public datepipe: DatePipe, public router: Router,
        public route: ActivatedRoute, public Gv: GvarService, public API: APIService) {
        this.PracticeModel = new PracticeModel;
        this.route.params.subscribe(params => {
            debugger;
            if (params['id'] !== 0 && params['id'] !== '0') {
                this.GetPracticeData(params['id']);
                this.SelectedPracticeCode = params['id'];
                if (params['Type'] == "Edit" || params['Type'] == "New")
                    this.isEdit = true;
                else
                    this.isEdit = false;
            }
            else {
                this.PracticeModel = new PracticeModel;
                this.SelectedPracticeCode = params['id'];
                this.isEdit = true;
                this.newPractice = true;
            }
        });
        this.specialtyCategoryOne = [];
        this.specialtyCategoryTwo = [];
        this.allVendorList = [];
        this.getpracticeSynchronization = new PracticeSynchronization();
        this.practiceSynchronization = new PracticeSynchronization();
        this.SelectedSpecialityGroup = new SpecialtyGroups();
        this.SelectedSpecialityCategoryOne = new SpecialtyCategory();
        this.zipPracData= [];
        this.zipMalingData= [];
    }

    ngOnInit() {
        this.getPracticeSynchronization();
        this.getVendorList();
    }

    isFieldValid(field: string) {
        return !this.rForm.get(field).valid && this.rForm.get(field).touched;
    }

    GetPracticeData(practiceCode: number) {
        if (practiceCode == 0)
            return;
        this.API.getData('/PracticeSetup/GetPractice?PracticeId=' + practiceCode).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                   debugger;
                   console.log('Practice Data', data)
                   
                    this.PracticeModel = data;
                    this.PracticeModel.Response.PracticeModel.Prac_Name = data.Response.PracticeModel.Prac_Name.toUpperCase();
                    this.PracticeModel.Response.PracticeModel.prac_doing_business = data.Response.PracticeModel.prac_doing_business.toUpperCase();
                    this.PracticeModel.Response.PracticeModel.Prac_Address = data.Response.PracticeModel.Prac_Address.toUpperCase();
                    this.PracticeModel.Response.PracticeModel.Mailing_Address = data.Response.PracticeModel.Mailing_Address.toUpperCase();


                        this.onBlurMethod(0);
                        this.onBlurMethod(1);

                 
                    // this.PracticeModel.Response.PracticeModel.EFSDate = this.datepipe.transform(this.PracticeModel.Response.PracticeModel.EFSDate, 'MM/dd/yyyy');
                    // this.strEfsDate = this.PracticeModel.Response.PracticeModel.EFSDate;
                    this.onChangeSpecialityGroup(this.PracticeModel.Response.PracticeModel.GroupNo, "edit");
                 
                   
                    this.PracticeModel.Response.PracticeModel.Commencement_Date = this.datepipe.transform(this.PracticeModel.Response.PracticeModel.Commencement_Date, 'MM/dd/yyyy');
                    this.setStrDate(this.PracticeModel.Response.PracticeModel.Commencement_Date)
                    this.selectedVendor = this.PracticeModel.Response.PracticeVendors[0].VendorId;
                } else {

                }
            }
        );
    }

    setStrDate(date: string) {
        if (!Common.isNullOrEmpty(date)) {
            let dDate = new Date(date);
            this.strComDate = {
                year: dDate.getFullYear(),
                month: dDate.getMonth() + 1,
                day: dDate.getDate()
            };
        }
    }

    onDateChangedExp(event) {
        this.PracticeModel.Response.PracticeModel.Commencement_Date = event.formatted;
        this.strComDate = event.formatted;
    }

    // onDateChangedEfs(event) {
    //     this.PracticeModel.Response.PracticeModel.EFSDate = event.formatted;
    //     this.strEfsDate = event.formatted;
    // }

    // Get City State zIP
    onBlurMethod(value) {
        var ZipCode = "";
        if (value == 0)
            ZipCode = this.PracticeModel.Response.PracticeModel.Prac_Zip;
        else
            ZipCode = this.PracticeModel.Response.PracticeModel.Mailing_Zip;
        if(ZipCode.length == 5 || ZipCode.length == 9){
            this.API.getData('/Demographic/GetCitiesByZipCode?ZipCode=' + ZipCode).subscribe(
                data => {
                    if (value === 0) {
                        if (data.Status === 'Sucess') {
                            this.zipPracData = data.Response;
                            this.PracticeModel.Response.PracticeModel.Prac_City = this.zipPracData[0].CityName;
                            this.PracticeModel.Response.PracticeModel.Prac_State = this.zipPracData[0].State;
                        } 
                        else 
                        {
                            this.PracticeModel.Response.PracticeModel.Prac_City = '';
                            this.PracticeModel.Response.PracticeModel.Prac_State = '';
                        }
                    } 
                    else
                    {
                        if (data.Status === 'Sucess') {
                            this.zipMalingData = data.Response;
                            this.PracticeModel.Response.PracticeModel.Mailing_City = this.zipMalingData[0].CityName;
                            this.PracticeModel.Response.PracticeModel.Mailing_State = this.zipMalingData[0].State;
                        } else {
                            this.PracticeModel.Response.PracticeModel.Mailing_City = '';
                            this.PracticeModel.Response.PracticeModel.Mailing_State = '';
                        }
                    }
                }
            );
        }
    
        
    }

    AddEditPracticeDetails() {
        debugger;
        this.PracticeModel.Response.PracticeModel.Practice_Code = this.SelectedPracticeCode;
        this.PracticeModel.Response.PracticeModel.Deleted = false;
        this.PracticeModel.Response.PracticeModel.Is_Active = true;
        // this.PracticeModel.Response.PracticeModel.Commencement_Date = this.strComDate;
        // this.PracticeModel.Response.PracticeModel.EFSDate = this.strEfsDate;
        if (!this.canSave())
            return;
        this.API.PostData('/PracticeSetup/PostSavePractice/', this.PracticeModel.Response.PracticeModel, (d) => {
            if (d.Status === 'Sucess') {
                this.toaster.success('Practice has been saved', 'Success');
                this.router.navigate(['/PracticeList']);
            }
            else {
                this.toaster.error('An error occured while syncing', 'Failed');
            }
        });
    }

    


    canSave(): boolean {
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Name)) {
            this.toaster.warning('Enter Legal Business Name', 'Validation');
            //this.renderer.selectRootElement('#ipracName').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Zip)) {
            this.toaster.warning('Enter Zip Code', 'Validation');
            //this.renderer.selectRootElement('#Prac_Zip').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_City)|| this.PracticeModel.Response.PracticeModel.Prac_City=="Select City") {
            this.toaster.warning('Enter Practice City', 'Validation');
            //this.renderer.selectRootElement('#Prac_Zip').focus();
            return false;
        }
        else if (this.PracticeModel.Response.PracticeModel.Prac_Zip.length < 4 || this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_City)) {
            this.toaster.warning('Enter valid Zip Code', 'Validation');
            //this.renderer.selectRootElement('#Prac_Zip').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Email_Address)) {
            this.toaster.warning('Enter Email Address', 'Validation');
            //this.renderer.selectRootElement('#PracEmail').focus();
            return false;
        } else if (!(this.PracticeModel.Response.PracticeModel.Email_Address.indexOf("@") > -1)) {
            this.toaster.warning('Enter valid Email Address', 'Validation');
            //this.renderer.selectRootElement('#PracEmail').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Address)) {
            this.toaster.warning('Enter Address', 'Validation');
            //this.renderer.selectRootElement('#PracAddress').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Phone)) {
            this.toaster.warning('Enter Phone No', 'Validation');
            //this.renderer.selectRootElement('#Prac_Phone').focus();
            return false;
        } else if ((this.PracticeModel.Response.PracticeModel.Prac_Phone.length) != 10) {
            this.toaster.warning('Enter valid Phone No', 'Validation');
            //this.renderer.selectRootElement('#Prac_Phone').focus();
            return false;
        }
        // if (this.PracticeModel.Response.PracticeModel.EFS == true && this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.EFSDate)) {
        //     this.toaster.warning('Enter the EFS Date', 'error');
        //this.renderer.selectRootElement('#PracAddress').focus();    
        //return false
        // }
        // if (this.PracticeModel.Response.PracticeModel.EFSDate != null && this.PracticeModel.Response.PracticeModel.EFS == false) {
        //     this.toaster.warning('Please check the EFS box for the entered EFS Date', 'error');
        // this.renderer.selectRootElement('#PracAddress').focus();//     
        //return false
        // }
        if (!this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Alternate_Phone))
            if ((this.PracticeModel.Response.PracticeModel.Prac_Alternate_Phone.length) != 10) {
                this.toaster.warning('Enter valid Fax No.', 'Validation');
                //this.renderer.selectRootElement('#Prac_Alternate_Phone').focus();
                return false;
            }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.NPI)) {

            this.toaster.warning('Enter NPI Number.', 'Validation');
            //this.renderer.selectRootElement('#PracNPI').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Tax_Id)) {
            this.toaster.warning('Enter Tax ID Number.', 'Validation');
            //this.renderer.selectRootElement('#PracTaxID').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Office_Manager)) {
            this.toaster.warning('Enter Primary Contact Office Manager', 'Validation');
            //this.renderer.selectRootElement('#Office_Manager').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Contact_Person_Phone)) {
            this.toaster.warning('Enter Primary Phone No.', 'Validation');
            //this.renderer.selectRootElement('#Contact_Person_Phone').focus();
            return false;
        } else if ((this.PracticeModel.Response.PracticeModel.Contact_Person_Phone.length) != 10) {
            this.toaster.warning('Enter valid Primary Phone No.', 'Validation');
            //this.renderer.selectRootElement('#Contact_Person_Phone').focus();
            return false;
        }
        // if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Email_Contact_Person))
        // {
        //     this.toaster.warning('Enter Primary Email Address.' 'error');
        //this.renderer.selectRootElement('#PracAddress').focus();//     
        //return false;
        // }
        if (!this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Email_Contact_Person))
            if (!(this.PracticeModel.Response.PracticeModel.Email_Contact_Person.indexOf("@") > -1)) {
                this.toaster.warning('Enter valid Primary Email Address.', 'Validation');
                //this.renderer.selectRootElement('#Email_Contact_Person').focus();
                return false;
            }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Mailing_Address)) {
            this.toaster.warning('Enter Mailing Address.', 'Validation');
            //this.renderer.selectRootElement('#PracAddress').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Mailing_Zip)) {
            this.toaster.warning('Enter Mailing Zip Code.', 'Validation');
            //this.renderer.selectRootElement('#MailingAddress').focus();
            return false;
        } 
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Mailing_City)|| this.PracticeModel.Response.PracticeModel.Mailing_City=="Select City") {
            this.toaster.warning('Enter Mailing City.', 'Validation');
            //this.renderer.selectRootElement('#MailingAddress').focus();
            return false;
        }
        else
            if (this.PracticeModel.Response.PracticeModel.Mailing_Zip.length < 4 || this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Mailing_City)) {
                this.toaster.warning('Enter valid Mailing Zip Code.', 'Validation');
                //this.renderer.selectRootElement('#MZip').focus();
                return false;
            }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Type)) {
            this.toaster.warning('Enter Practice Type.', 'Validation');
            //this.renderer.selectRootElement('#Prac_Type').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Commencement_Date)) {
            this.toaster.warning('Select Commencement Date.', 'Validation');
            //this.renderer.selectRootElement('#PracAddress').focus();
            return false;
        } else if (!this.isVerifyDate(this.PracticeModel.Response.PracticeModel.Commencement_Date)) {
            this.toaster.warning('Select valid Commencement Date.', 'Validation');
            //this.renderer.selectRootElement('#PracAddress').focus();
            return false;
        }
        if (this.PracticeModel.Response.PracticeModel.GroupNo == null) {
            this.toaster.warning('Select Taxonomy Type.', 'Validation');
            //this.renderer.selectRootElement('#GroupNo').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.TAXONOMY_CODE)) {
            this.toaster.warning('Select Taxonomy Code from Code One', 'Validation');
            //this.renderer.selectRootElement('#TAXONOMY_CODE').focus();
            return false;
        }
        if (this.isNullOrEmptyString(this.PracticeModel.Response.PracticeModel.Prac_Soft)) {
            this.toaster.warning('Select Billing Soft', 'Validation');
            //this.renderer.selectRootElement('#TAXONOMY_CODE').focus();
            return false;
        }
        return true;

    }//End canSave

    //--Validation functions

    isNullOrEmptyString(str: string): boolean {
        if (str == undefined || str == null || $.trim(str) == '')
            return true;
        else
            return false;
    }


    isNullOrUndefinedNumber(num: number): boolean {
        if (num == undefined || num == null)
            return true;
        else
            return false;
    }


    isVerifyDate(date: string): boolean {
        var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
        if (!match)
            return false;
        else
            return true;
    }

    resetPracticeDetails() {
       // this.isEdit = this.isEdit;
        this.PracticeModel = new PracticeModel;
        this.GetPracticeData(this.SelectedPracticeCode);
    }

    loadEditPractice() {
        this.isEdit = !this.isEdit;
        this.router.navigate(['/EditPractice/' + this.SelectedPracticeCode + '/Edit']);
    }

    onChangeSpecialityGroup(data: any, type: string = 'add') {
        this.SelectedSpecialityGroup = this.listSpecialtyGroups.find(t => t.GROUP_NO == data);
        this.specialtyCategoryOne = [];
        if (type !== 'edit') {
            this.PracticeModel.Response.PracticeModel.TAXONOMY_CODE = '';
        }
        this.SelectedSpecialityCategoryOne = new SpecialtyCategory();
        this.API.getData(`/PracticeSetup/GetPracticeSpecialityCategoryOne?GroupNo=${data}`).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.specialtyCategoryOne = data.Response;

                } else {
                    swal('Failed', data.Status, 'error');
                }
            }
        );
    }

    getPracticeSynchronization() {
        this.API.getData(`/PracticeSetup/GetPracticeSynchronization?practiceid=${this.SelectedPracticeCode}`).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.getpracticeSynchronization = data.Response;
                } else {

                }
            }
        );
    }

    enableSynchronization() {
        this.practiceSynchronization.PracticeId = this.SelectedPracticeCode;
        this.practiceSynchronization.vendorId = this.selectedVendor;
        this.API.PostData('/PracticeSetup/AddPracticeSynchronization/', this.practiceSynchronization, (d) => {
            if (d.Status === 'Sucess') {
                this.toaster.success('Success', 'Practice has been Synchronized.');
            } else if (d.Status === 'Practice Already Synchronized') {
                this.toaster.warning('Validation', 'Practice Already Synchronized');
            } else {
                this.toaster.error('Error', 'Failed to sync');
            }
        });
    }

    getVendorList() {
        this.API.getData(`/Vendor/GetVendorList`).subscribe(
            data => this.allVendorList = data);
    }

    onChangeVender(data: any) {
        this.disableSync = data == "" ? true : false;
        this.onChangeVendor.emit(this.disableSync);
    }

    onChangePracticeSpecialityCategoryOne(data: any): any {
        this.SelectedSpecialityCategoryOne = this.specialtyCategoryOne.find(t => t.CAT_NO == data);
        this.specialtyCategoryTwo = [];
        this.API.getData(`/PracticeSetup/GetPracticeSpecialityCategoryTwo?GroupNo=${this.SelectedSpecialityGroup.GROUP_NO}&CatLevel=${this.SelectedSpecialityCategoryOne.CAT_LEVEL}`).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.specialtyCategoryTwo = data.Response;
                }
                else {
                    this.toaster.error('Error', 'Failed');
                }
            }
        );
    }
}
