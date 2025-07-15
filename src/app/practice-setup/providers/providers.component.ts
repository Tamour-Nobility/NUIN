import {
    Component, OnInit, ChangeDetectorRef, ViewChild, ViewContainerRef,
    ComponentFactoryResolver, ComponentRef, Input
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { APIService } from '../../components/services/api.service';
import { GvarService } from '../../components/services/GVar/gvar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { zipdata } from '../../patient/Classes/patientInsClass';
import { ProviderModel, SaveProviderModel, Specilization, WCBRating, SpecialtyGroups, SpecialtyCategory } from '../providers/Classes/providersClass';
import { IMyDpOptions } from 'mydatepicker';
declare var $: any
import 'datatables.net';
import { trim } from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-providers',
    templateUrl: './providers.component.html',
    styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {
    @Input() listSpecilization: Specilization[];
    @Input() listWCBRating: WCBRating[];
    @Input() listSpecialtyGroups: SpecialtyGroups[];
    @Input() listSpecializations: Specilization[];
    specialtyCategoryOne: SpecialtyCategory[];
    specialtyCategoryTwo: SpecialtyCategory[];
    SelectedSpecialityCategoryOne: SpecialtyCategory;
    SelectedSpecialityGroup: SpecialtyGroups;
    public isEdit = false;
    public isList = true;
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '20px', width: '100%',
    };
    public placeholder: string = 'MM/DD/YYYY';
    providersModel: ProviderModel[];
    saveProviderModel: SaveProviderModel;
    provtable: any;
    dataTable: any;
    zipData: zipdata;
    cmpRef: ComponentRef<any>;
    strProv_DOB: string = "";
    strProv_DEA_EXP: string = "";
    bISview: boolean = false;
    SelectedPracticeCode: number;
    isNew: boolean;
    zipProviderData: zipdata[];
    TaxonomyCode: any;
    NPICODE :any;
    constructor(private chRef: ChangeDetectorRef,
        public datepipe: DatePipe,
        public router: Router,
        public route: ActivatedRoute,
        public API: APIService,
         private toaster: ToastrService,
        private componentFactoryResolver: ComponentFactoryResolver,
        public Gv: GvarService) {
        this.providersModel = [];
        this.saveProviderModel = new SaveProviderModel;
        this.listSpecilization = [];
        this.specialtyCategoryOne = [];
        this.specialtyCategoryTwo = [];
        this.SelectedSpecialityGroup = new SpecialtyGroups();
        this.SelectedSpecialityCategoryOne = new SpecialtyCategory();
        this.zipProviderData=[];
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id'] !== 0 && params['id'] !== '0') {
                this.SelectedPracticeCode = params['id'];
                this.GetPracticeProvidersList();
            }
        });
        if(this.SelectedPracticeCode)
            {
    
                //get the taxonomy code against the selected practice for payer mapping
                this.TaxonomyCodes();
                // this.NPICode();
            }
    }

    GetPracticeProvidersList(type: string = "") {
        if (this.SelectedPracticeCode == null || this.SelectedPracticeCode == 0 || this.SelectedPracticeCode == undefined)
            return;
        //if(type=="")
        //this.showList();
        this.API.getData('/PracticeSetup/GetProviders?PracticeId=' + this.SelectedPracticeCode).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    if (this.provtable) {
                        this.provtable.destroy();
                    }
                    this.providersModel = data.Response;
                    this.chRef.detectChanges();
                    this.provtable = $('.provtable').DataTable({
                        language: {
                            emptyTable: "No data available"
                        }
                    });

                    //this.providersModel = data.Response;
                    //this.chRef.detectChanges();
                    //const table: any = $('.provtable');
                    //this.dataTable = table.DataTable();
                } else {
                    swal('Failed', data.Status, 'error');
                }
            }
        );
    }


    GetSpecilization() {
        this.API.getData('/PracticeSetup/GetSpecilization').subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.listSpecilization = data.Response;
                } else {
                    swal('Failed', data.Status, 'error');
                }
            }
        );
    }


    //   GetWCBRating() {
    //     this.API.getData('/PracticeSetup/GetWCBRating').subscribe(
    //         data => {
    //             if (data.Status === 'Sucess') {
    //                 this.listWCBRating = data.Response;
    //             } else {
    //                 swal('Failed', data.Status, 'error');
    //             }
    //         }
    //     );
    //   }







    showList() {
        this.isList = true;
        this.isEdit = false;
        this.GetPracticeProvidersList("List");
    }
    showAdd() {
        this.isList = false;
        this.isEdit = true;
    }

    ViewProvider(Provider_Code) {
        this.bISview = true;
        this.showAdd();
        this.GetPracticeProviderDetails(Provider_Code);
    }
    onDateChangedExp(event, id) {
        if (id === 0) {
            this.saveProviderModel.Date_Of_Birth = event.formatted;
            this.strProv_DOB = event.formatted;
        } else {
            this.saveProviderModel.DEA_Expiry_Date = event.formatted;
            this.strProv_DEA_EXP = event.formatted;
        }
    }
    AddProvider() {
        if (this.saveProviderModel.Provider_Code === undefined || this.saveProviderModel.Provider_Code === 0 || this.saveProviderModel.Provider_Code === null) {
            this.saveProviderModel.Provider_Code = 0;
            this.saveProviderModel.Practice_Code = this.SelectedPracticeCode;
            this.saveProviderModel.Is_Active = true;
            this.saveProviderModel.Deleted = false;
        }
        if (!this.canSave())
            return;

        this.saveProviderModel.Date_Of_Birth = this.datepipe.transform(this.strProv_DOB, 'MM/dd/yyyy');
        this.saveProviderModel.DEA_Expiry_Date = this.datepipe.transform(this.strProv_DEA_EXP, 'MM/dd/yyyy');
        this.saveProviderModel.Gender = trim(this.saveProviderModel.Gender);
        this.saveProviderModel.Provid_MName = trim(this.saveProviderModel.Provid_MName);
        this.saveProviderModel.grp_taxonomy_id=this.TaxonomyCode;
        this.API.PostData('/PracticeSetup/SaveProvider/', this.saveProviderModel, (d) => {
            if (d.Status === 'Sucess') {
                if (this.saveProviderModel.Provider_Code == 0) {
                    swal('Provider', 'Provider has been saved successfully.', 'success');
                    this.saveProviderModel.Provider_Code = d.Response;
                }
                else
                    swal('Provider', 'Provider has been updated successfully.', 'success');
                this.resetProviderDetails(d.Response);
                //this.GetPracticeProvidersList();
            }
        });
    }
    onBlurMethod() {
        this.API.getData('/Demographic/GetCitiesByZipCode?ZipCode=' + this.saveProviderModel.ZIP).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.zipProviderData = data.Response;
                    this.saveProviderModel.CITY = this.zipProviderData[0].CityName;
                    this.saveProviderModel.STATE = this.zipProviderData[0].State;
                } else {
                    this.saveProviderModel.CITY = '';
                    this.saveProviderModel.CITY = '';
                }
            }
        );
    }
    EditProvider(Provider_Code) {
        this.showAdd();
        this.bISview = false;
        this.GetPracticeProviderDetails(Provider_Code);
        this.isNew = false;
    }

    resetProviderDetails(Provider_Code) {
        this.bISview = !this.bISview;
        this.GetPracticeProviderDetails(Provider_Code);
    }

    resetFields() {
        this.showList();
        this.saveProviderModel = new SaveProviderModel;
        if (this.isNew) {
            this.isNew = !this.isNew;
        }
    }
    ActiveInactiveProvider(Provider_Code) {
        let selectedProvider = this.providersModel.find(t => t.Provider_Code == Provider_Code);
        this.API.confirmFun('Confirmation', `Are you sure you want to ${!selectedProvider.Is_Active ? 'active' : 'inactive'} this provider?`, () => {
            this.API.getData('/PracticeSetup/ActivateInActiveProvider?providerId=' + Provider_Code + '&PracticeId=' + this.SelectedPracticeCode + '&isActive=' + !selectedProvider.Is_Active).subscribe(
                data => {
                    swal('Provider', 'Provider status has been changed successfully.', 'success');
                    // swal({ position: 'top-end', type: 'success', title: 'Provider has been Deleted.', showConfirmButton: false, timer: 1500 })
                    this.GetPracticeProvidersList();
                });
        });
    }
     //added by pir ubaid - get taxonomy code for payer mapping
     TaxonomyCodes() {
        debugger
        this.API.getData('/PracticeSetup/TaxonomyCode?PracticeId=' + this.SelectedPracticeCode).subscribe( data => {
                    if (data.Status === "Success") {
                        this.TaxonomyCode = data.Response; 
                        } else {
                        console.log("No Data Found");
                    }
                },
                (error) => {
                    console.error("Error fetching taxonomy code:", error);
                }
            );
    }
    
    NPICode() {
        this.API.getData('/PracticeSetup/NPICode?PracticeId=' + this.SelectedPracticeCode).subscribe(
            (data) => {
                if (data.Status === "Success") {
                    // Assign the API response directly to group_npi
                    this.saveProviderModel.group_npi = data.Response;
                } else {
                    console.log("No Data Found");
                }
            },
            (error) => {
                console.error("Error fetching NPI code:", error);
            }
        );
    }
    
    
    //
    ProviderEmptyModel() {
        this.showAdd();
        this.saveProviderModel = new SaveProviderModel;
        this.strProv_DOB = "";
        this.strProv_DEA_EXP = "";
        this.bISview = false;
        this.isNew = true;
        this.NPICode();    }
    GetPracticeProviderDetails(Provider_Code) {
        if (Provider_Code == undefined || Provider_Code == null || Provider_Code == '')
            return;

        this.API.getData('/PracticeSetup/GetProvider?providerId=' + Provider_Code + '&PracticeId=' + this.SelectedPracticeCode).subscribe(
            data => {
                debugger
                if (data.Status === 'Sucess') {
                    this.saveProviderModel = data.Response;
                    this.saveProviderModel.Provid_FName = data.Response.Provid_FName.toUpperCase()
                    this.saveProviderModel.Provid_LName = data.Response.Provid_LName.toUpperCase()
                    this.saveProviderModel.Provid_MName = data.Response.Provid_MName ? data.Response.Provid_MName.toUpperCase() : '';
                    this.saveProviderModel.Provider_Title = data.Response.Provider_Title ? data.Response.Provider_Title.toUpperCase() : '';
                    this.saveProviderModel.ADDRESS = data.Response.ADDRESS.toUpperCase();
                    this.saveProviderModel.Address_Line2 = data.Response.Address_Line2 ? data.Response.Address_Line2.toUpperCase() : '';





                    if(this.saveProviderModel.ZIP!=""|| this.saveProviderModel.ZIP!=null){
                        
                        this.onBlurMethod();
                    }
                    this.saveProviderModel.Date_Of_Birth = this.datepipe.transform(this.saveProviderModel.Date_Of_Birth, 'MM/dd/yyyy');
                    this.saveProviderModel.DEA_Expiry_Date = this.datepipe.transform(this.saveProviderModel.DEA_Expiry_Date, 'MM/dd/yyyy');

                    this.strProv_DOB = this.saveProviderModel.Date_Of_Birth;
                    this.strProv_DEA_EXP = this.saveProviderModel.DEA_Expiry_Date;
                    if (this.saveProviderModel && this.saveProviderModel.GroupNo) {
                        this.onChangeSpecialityGroup(this.saveProviderModel.GroupNo, "edit");
                    }

                }
            });
    }


    canSave(): boolean {
        debugger
        if (this.isNullOrEmptyString(this.saveProviderModel.federal_taxid)) {
            swal('Validation Error', 'Enter Tax ID', 'error');
            return false;
        }

        if (this.isNullOrEmptyString(this.saveProviderModel.Provid_FName)) {
            swal('Validation Error', 'Enter Provider First Name', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.Provid_LName)) {
            swal('Validation Error', 'Enter Provider Last Name', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.ZIP)) {
            swal('Validation Error', 'Enter Zip Code', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.CITY)||this.saveProviderModel.CITY=="Select City" ) {
            swal('Validation Error', 'Enter City ', 'error');
            return false;
        }
        else if (this.saveProviderModel.ZIP.length < 4 || this.isNullOrEmptyString(this.saveProviderModel.CITY)) {
            swal('Validation Error', 'Enter valid Zip Code', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.Email_Address)) {
            swal('Validation Error', 'Enter Email Address.', 'error');
            return false;
        } else if (!(this.saveProviderModel.Email_Address.indexOf("@") > -1)) {
            swal('Validation Error', 'Enter valid Email Address.', 'error');
            return false;
        }
        debugger
        if (this.isNullOrEmptyString(this.saveProviderModel.Phone_One)) {
            swal('Validation Error', 'Enter Home Ph.', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.ADDRESS)) {
            swal('Validation Error', 'Enter Address.', 'error');
            return false;
        }

        if (this.isNullOrEmptyString(this.saveProviderModel.NPI)) {

            swal('Validation Error', 'Enter NPI Number.', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.Taxonomy_Code)) {
            swal('Validation Error', 'Select Taxonomy Code from Category One.', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.SPECIALIZATION_CODE)) {
            swal('Validation Error', 'Select Specialization.', 'error');
            return false;
        }
        if (this.isNullOrEmptyString(this.saveProviderModel.federal_taxidnumbertype)) {
            swal('Validation Error', 'Select Tax ID Type.', 'error');
            return false;
        }
        debugger
        if (this.isNullOrEmptyString(this.saveProviderModel.group_npi)) {
            swal('Validation Error', 'Enter Group NPI.', 'error');
            return false;
        }
        if (this.isNullOrUndefinedNumber(this.TaxonomyCode)) {
            swal('Validation Error', 'Select Group Taxonomy.', 'error');
            return false;
        }
        return true;
    }                     //End canSave
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

    getProviderCode(Type: string = "") {
        this.API.Gv.ProviderCode = this.saveProviderModel.Provider_Code;
        if (Type == 'ProviderPayers') {
                setTimeout(function () {
                $("#btnProviderPayer").trigger("click");
            }, 100);
        }
        else if (Type == "ProviderNotes") {

        }
        else if (Type == "ProviderResources") {
                setTimeout(function () {
                $("#btnProviderResources").trigger("click");
            }, 100);

        }
        else {
            setTimeout(function () {
                $("#btnLoadLocation").trigger("click");
            }, 100);
        }
    }

    onChangeSpecialityGroup(data: any, type: string = 'add') {
        this.SelectedSpecialityGroup = this.listSpecialtyGroups.find(t => t.GROUP_NO == data);
        this.specialtyCategoryOne = [];
        if (type !== 'edit') {
            this.saveProviderModel.Taxonomy_Code = '';
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

    onChangePracticeSpecialityCategoryOne(data: any): any {
        this.SelectedSpecialityCategoryOne = this.specialtyCategoryOne.find(t => t.CAT_NO == data);
        this.specialtyCategoryTwo = [];
        this.API.getData(`/PracticeSetup/GetPracticeSpecialityCategoryTwo?GroupNo=${this.SelectedSpecialityGroup.GROUP_NO}&CatLevel=${this.SelectedSpecialityCategoryOne.CAT_LEVEL}`).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.specialtyCategoryTwo = data.Response;
                } else {
                    swal('Failed', data.Status, 'error');
                }
            }
        );
    }

    transformText(text: string) {
        return text.toLowerCase();
    }

    // Only AlphaNumeric
    keyPressAlphaNumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}
