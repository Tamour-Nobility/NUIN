import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input, SimpleChanges,OnChanges } from '@angular/core';
import { zipdata } from '../../patient/Classes/patientInsClass';
import { searchFacilty } from './Classes/searchFacility';
import { responseFacility, saveFacilityModel } from './Classes/responseFacility';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { isNullOrUndefined } from 'util';
import { CurrentUserViewModel } from '../../models/auth/auth';
import { ToastrService } from 'ngx-toastr';


declare var $: any;

@Component({
    selector: 'app-facilities',
    templateUrl: './facilities.component.html',
    styleUrls: ['./facilities.component.css'],

})
export class FacilitiesComponent implements OnInit,OnChanges {
    showHideFacilityElements: boolean = false;
    @Output() notifyParent: EventEmitter<any> = new EventEmitter();
    @Output() onSelectFacility: EventEmitter<any> = new EventEmitter();
    @Input() isFromAnotherComponent: string = '';
    @Input() facilityName: string = 'Self';
    listPracticesList: any[];
    loggedInUser: CurrentUserViewModel;
    PracticeCode: number = null;
    zipFacilityData: zipdata[];
    dtSearchFacility: any;
    // haserror:boolean=false;
    editClick: boolean = false;
    copyEdit: any = [];
    checkedit: boolean = false;
    PageNo: number;
    firstRow: number = 1;
    FacilityMode: string;
    focusTimeFrameFS: boolean = false;
    selectedRow: number = 0;
    deleteIndex: number;
    currentRow: string;
    highlightedRow: string;
    sControl: string;
    bIsRecordFound: boolean = false;
    PageIndex: number;
    selectedFS: number = 0;
    pageString: number;
    totalPages: number;
    focusFacilityType: boolean = false;
    selectedFac: number = 0;
    isSearched: boolean = false;
    CityStateLst: zipdata[];
    FaciCodeTemp: string = "";
    searchCriteria: searchFacilty;
    deleteRecord: boolean = true;
    responseFacility: responseFacility[];
    saveFacilityModel: saveFacilityModel;
    DatePickerOptions = {
        dateFormat: 'mm/dd/yyyy',
        height: '20px',
        width: '100%',
        border: 'none',
        inline: false,
        disabledDatePicker: false,
        selectionTxtFontSize: '14px',
        disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1, indicateInvalidDate: true }
    };
    Dateoptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    isSearchInitiated: boolean = false;

    constructor(private chRef: ChangeDetectorRef, public API: APIService, public Gv: GvarsService,private toaster: ToastrService) {
        debugger;
        this.searchCriteria = new searchFacilty();
        this.responseFacility = [];
        this.CityStateLst = [];
        this.saveFacilityModel = new saveFacilityModel;
        this.loggedInUser = new CurrentUserViewModel();
        
        this.showHideFacilityElements = false;
        this.zipFacilityData=[];
    }

    ngOnInit() {
        debugger;
        this.showHideFacilityElements = false;
        this.searchCriteria.Response.PracticeCode = 0;
        this.saveFacilityModel.Response.Practice_Code = 0;
        this.facilityName = 'Self'
        this.loggedInUser = this.Gv.currentUser;
        this.loggedInUser.Practices = this.loggedInUser.Practices.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.PracticeCode} | ${practice.PracticeName}`  // Add new combined property
            };
        });
    //      if (this.facilityName === 'Self') {
    //   this.searchCriteria.Response.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;
    // }
        console.log('NotifyParent isFromAnotherComponent', this.facilityName);
        debugger;
        
    }
    
   
    ngViewInit() {
        debugger;
        this.showHideFacilityElements = false;
        this.facilityName = 'Self'
        console.log('NotifyParent isFromAnotherComponent viewinit', this.isFromAnotherComponent);
        debugger;
    }

    SelectRow(index: number) {
        if (!this.editClick) {
            if (this.showHideFacilityElements) {
                this.showHideFacilityElements = false;
                this.deleteRecord = true;
            }
        }
        this.editClick = false;
        this.selectedFS = index;

    }
    SelectFS(index: number) {
        this.selectedFS = index;
    }
    searchFacility(event: KeyboardEvent) {
        debugger;
        if (event.keyCode == 13) { //Enter key
            this.getFacilities('true');
        }
    }
    ClearFields() {
        if (this.dtSearchFacility)
            this.dtSearchFacility.destroy();
        this.responseFacility = [];
        this.chRef.detectChanges();
        this.dtSearchFacility = $('.dtSearchFacility').DataTable({
            language: {
                emptyTable: "No data available"
            }
        });

        this.saveFacilityModel.Response.Created_By = "";
        this.saveFacilityModel.Response.Created_Date = "";
        if(this.facilityName === 'Self'){
            this.saveFacilityModel.Response.Practice_Code = 0;
            this.searchCriteria.Response.PracticeCode = 0
        }
        this.saveFacilityModel.Response.Facility_Address = "";
        this.saveFacilityModel.Response.Facility_City = "";
        this.saveFacilityModel.Response.Facility_Code = undefined;
        this.saveFacilityModel.Response.Facility_Contact_Name = "";
        this.saveFacilityModel.Response.facility_id_number = "";
        this.CityStateLst = [];
        this.saveFacilityModel.Response.Facility_Name = "";
        this.saveFacilityModel.Response.Facility_Phone = "";
        this.saveFacilityModel.Response.Facility_State = "";
        this.saveFacilityModel.Response.Facility_Type = "";
        this.saveFacilityModel.Response.Facility_ZIP = "";
        this.saveFacilityModel.Response.IS_DEMO = false;
        this.saveFacilityModel.Response.NPI = "";
        this.saveFacilityModel.Response.Modified_By = "";
    }

    formatNumber(phone: string) {
        var newphone = "";
        if (phone != undefined && phone != "") {
            newphone = '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6);
        }
        return newphone;
    }
    unformatNumber(phone: string) {
        var newphone = "";
        if (phone != undefined && phone != "") {
            newphone = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');
        }
        return newphone;
    }
    formatPhoneNumber(phone: string, type: string) {

        var value = phone;
        if (phone.length >= 10) {
            value = this.formatNumber(phone);
        }
        if (type == "facility") {
            this.saveFacilityModel.Response.Facility_Phone = "";
            this.saveFacilityModel.Response.Facility_Phone = value;
        }
        else if (type == "search") {
            this.searchCriteria.Response.Phone = "";
            this.searchCriteria.Response.Phone = value;
        }

    }

    EnableDisableFacilityElements(NewModifyCancel: string) {
        debugger
        this.loggedInUser.Practices = this.loggedInUser.Practices.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.PracticeCode} | ${practice.PracticeName}`  // Add new combined property
            };
        });
        if (NewModifyCancel == "New") {
            this.ClearFields();
            this.ClearSearchFields();
            this.isSearchInitiated =  false;
            if(this.facilityName === 'Claim'){
            this.saveFacilityModel.Response.Practice_Code =  this.loggedInUser.selectedPractice.PracticeCode;
            this.searchCriteria.Response.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;
            }else{
                this.saveFacilityModel.Response.Practice_Code =  0;
                this.searchCriteria.Response.PracticeCode = 0;
            }
            this.FacilityMode = "New Facility Setup";
            this.responseFacility = [];
            setTimeout(function () {
                $("#saveFaciNameID").focus();
            }, 500);
            this.showHideFacilityElements = true;
        }
        else if (NewModifyCancel == "Search") {
            this.responseFacility = [];
        }
        else if (NewModifyCancel == "Modify") {
            //  this.haserror=false;
            this.showHideFacilityElements = true;
            setTimeout(function () {
                $("#saveFaciNameID input").focus()
            }, 500);
            // this.showHideFacilityElements = true;
        }
        else if (NewModifyCancel == "Cancel") {
            debugger;
            this.showHideFacilityElements = false;
            if (this.dtSearchFacility) {
                this.chRef.detectChanges();
                this.dtSearchFacility.destroy();
            }
           
            this.chRef.detectChanges();
            this.dtSearchFacility = $('.dtSearchFacility').DataTable({
                language: {
                    emptyTable: "No data available"
                }
            });

            if(this.saveFacilityModel.Response.Facility_Name === null || this.saveFacilityModel.Response.Facility_Name === ''){
                if(this.facilityName === 'Claim'){
                    this.saveFacilityModel.Response.Practice_Code =  this.loggedInUser.selectedPractice.PracticeCode;
                    this.searchCriteria.Response.PracticeCode =  this.loggedInUser.selectedPractice.PracticeCode;
                    }else{
                        this.saveFacilityModel.Response.Practice_Code =  0;
                        this.searchCriteria.Response.PracticeCode = 0;
                    }
            }
            if(this.isSearchInitiated){
                this.getPracticeFacility();

            }
           
            this.deleteRecord = true;
            this.editClick = false;
            this.checkedit = false;
            //   this.haserror=false;
            setTimeout(function () {
                $("#Code").focus();
            }, 1000);
        }
        else {
            this.showHideFacilityElements = false;
        }
    }

    unformatZIPNumber_Search(zip: string, typee: string) {
        var val = "";
        if (typee == "search") {
            val = this.unformatZip(zip);
            this.searchCriteria.Response.ZIP = val;
        }
    }

    unformatZIPNumber(zip: string, typee: string) {
        var val = "";
        if (typee == "facility") {
            val = this.unformatZip(zip);
            this.saveFacilityModel.Response.Facility_ZIP = val;
        }
    }

    unformatPhoneNumber(phone: string, type: string) {
        var value = "";
        if (type == "facility") {
            value = this.unformatNumber(phone);
            this.saveFacilityModel.Response.Facility_Phone = value;
        }
        else if (type == "search") {
            value = this.unformatNumber(phone);
            this.searchCriteria.Response.Phone = value;
        }

    }

    unformatZip(zip: string) {
        var newzip = "";
        if (zip != undefined && zip != "") {
            newzip = zip.replace('-', '').replace(' ', '');
        }
        return newzip;
    }

    ClearSearchFields() {
        this.searchCriteria = new searchFacilty();
        this.bIsRecordFound = false;
        this.isSearchInitiated = false;
        // this.haserror=false;
        this.responseFacility = [];
        this.totalPages = 1;
        setTimeout(function () {
            $("#Code").focus();

        }, 1000);
        if(this.facilityName === 'Claim'){
            this.showHideFacilityElements =  false;
            this.searchCriteria.Response.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;
            this.saveFacilityModel.Response.Practice_Code = this.loggedInUser.selectedPractice.PracticeCode;
        }else
            {
                this.searchCriteria.Response.PracticeCode = 0;
                this.saveFacilityModel.Response.Practice_Code = 0;
            }
          
        
        this.ClearFields();
    }

    GetCityState_Search(zipp: string) {
        this.searchCriteria.Response.ZIP = this.formatZip(zipp);
    }

    formatZip(zip: string) {
        var newzip = zip;
        if (zip.length > 5 && zip.length < 10) {
            newzip = zip.substring(0, 5) + '-' + zip.substring(5);
        }
        return newzip;
    }

    getFacilities(button: string) {
        debugger;
        let practiceCode=this.searchCriteria.Response.PracticeCode
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        if(this.facilityName === 'Claim'){
            practiceCode =  this.loggedInUser.selectedPractice.PracticeCode;

        }
        if ($.trim(this.searchCriteria.Response.FacilityCode) == ""
            && $.trim(this.searchCriteria.Response.FacilityName) == ""
             && $.trim(practiceCode) == 0
            && $.trim(this.searchCriteria.Response.FacilityType) == ""
            && $.trim(this.searchCriteria.Response.ZIP) == ""
            && $.trim(this.searchCriteria.Response.City) == ""
            && $.trim(this.searchCriteria.Response.State) == ""
            && $.trim(this.searchCriteria.Response.Phone) == ""
            && $.trim(this.searchCriteria.Response.FacilityCode) == ""
            && $.trim(this.searchCriteria.Response.NPI) == "") {
            $('#Code').focus();
            //this.haserror=true;
            swal('Facility Search', "Please enter any search criteria.", 'warning');
            this.ClearFields();
            //  this.responseFacility = [];
            return;
        }
        this.isSearchInitiated = true;
        debugger;
       this.getPracticeFacility();
       
    }

    getPracticeFacility(){
        debugger
         let practicecode=this.searchCriteria.Response.PracticeCode;
        if (typeof this.searchCriteria.Response.PracticeCode === 'string' && this.searchCriteria.Response.PracticeCode.includes(' | ')) {
          const practiceCodeString = this.searchCriteria.Response.PracticeCode.split(' | ')[0]; // Extract the numeric part
          this.searchCriteria.Response.PracticeCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        this.API.PostData('/Demographic/SearchFacilities/', this.searchCriteria.Response, (d) => {
            if (d.Status == "Sucess") {
                debugger;
                // this.haserror=false;
                this.searchCriteria.Response.PracticeCode=practicecode
                debugger;
                if (this.dtSearchFacility) {
                    this.chRef.detectChanges();
                    this.dtSearchFacility.destroy();
                }
                console.log('Search Facility response', d.response);
                this.responseFacility = d.Response;
                this.chRef.detectChanges();
                this.dtSearchFacility = $('.dtSearchFacility').DataTable({
                    language: {
                        emptyTable: "No data available"
                    }
                });
            }
        });
    }

    GetCityState(zip: string) {
        debugger;
        this.API.getData('/Demographic/GetCitiesByZipCode?ZipCode=' + zip).subscribe(
            data => {
                debugger
                debugger
                if (data.Status == "Sucess") {
                    debugger
                    if(data.Response.length == 0){
                        this.toaster.error('Invalid Zip Code',`${zip}`);
                        // add by Hamza Akhlaq
                        this.saveFacilityModel.Response.Facility_ZIP='';
                         return;
                      }
                    debugger
                    this.zipFacilityData = data.Response;
                    this.saveFacilityModel.Response.Facility_City = this.zipFacilityData[0].CityName;
                    this.saveFacilityModel.Response.Facility_State = this.zipFacilityData[0].State;
                }
                else {
                    this.saveFacilityModel.Response.Facility_City = "";
                    this.saveFacilityModel.Response.Facility_State = "";
                }
            }
        );
    }
   

    SaveData() {
        
        if (!this.canSave())
            return;
        debugger;
        console.log('SAve Model', this.saveFacilityModel.Response);
        if(this.facilityName === 'Claim'){
            this.saveFacilityModel.Response.Practice_Code =  this.loggedInUser.selectedPractice.PracticeCode;
        }
        this.API.PostData('/Setup/SaveFacility/', this.saveFacilityModel.Response, (d) => {
            if (d.Status == "Sucess") {
                swal('', 'Facility has been saved.', 'success');
                this.EnableDisableFacilityElements('New');
                this.showHideFacilityElements = false;
            }
            else {
                swal('Error', 'Facility was not saved', 'error');
            }
        })
    }
    
    canSave(): boolean {
        debugger
        if (isNullOrUndefined(this.saveFacilityModel.Response.Practice_Code) || $.trim(this.saveFacilityModel.Response.Practice_Code) == 0) {
            swal('Facility', 'Please select Facility Practice.', 'error');
            return false;
        }
        if (isNullOrUndefined(this.saveFacilityModel.Response.Facility_Name) || $.trim(this.saveFacilityModel.Response.Facility_Name) == '') {
            swal('Facility', 'Please enter Facility Name.', 'error');
            return false;
        }
        
        if (isNullOrUndefined(this.saveFacilityModel.Response.Facility_Address) || $.trim(this.saveFacilityModel.Response.Facility_Address) == '') {
            swal('Facility', 'Please enter Facility Address.', 'error');
            return false;
        }
        if (isNullOrUndefined(this.saveFacilityModel.Response.Facility_Type) || $.trim(this.saveFacilityModel.Response.Facility_Type) == '' || $.trim(this.saveFacilityModel.Response.Facility_Type) == '0') {
            swal('Facility', 'Please enter Facility Type.', 'error');
            return false;
        }
        if (isNullOrUndefined(this.saveFacilityModel.Response.Facility_ZIP) || $.trim(this.saveFacilityModel.Response.Facility_ZIP) == '' || $.trim(this.saveFacilityModel.Response.Facility_ZIP) == '0') {
            swal('Facility', 'Please enter Facility Zip Code.', 'error');
            return false;
        }
        if (isNullOrUndefined(this.saveFacilityModel.Response.Facility_City) || $.trim(this.saveFacilityModel.Response.Facility_ZIP) == '' || $.trim(this.saveFacilityModel.Response.Facility_ZIP) == '0'
             ||this.saveFacilityModel.Response.Facility_City=="Select City")
        {
            swal('Facility', 'Please enter Facility City.', 'error');
            return false;
        }
        if (isNullOrUndefined(this.saveFacilityModel.Response.NPI) || $.trim(this.saveFacilityModel.Response.NPI) == '') {
            swal('Facility', 'Please enter NPI Code.', 'error');
            return false;
        }

        return true;

    }

    EditRow(row: number) {
        debugger
        if (row != undefined) {
            debugger
            this.EnableDisableFacilityElements('Modify');
            // document.getElementById("Modifybtn").click();
            this.copyEdit = this.responseFacility[row];
            this.GetCityState( this.copyEdit.Facility_ZIP)
            this.saveFacilityModel.Response = this.copyEdit;
        }

    }
    sendNotification() {
        this.notifyParent.emit('Close Model');
    }

    FillFacility(name: string, ID: number) {
        this.Gv.FacilityCode = ID;
        this.Gv.FacilityName = name;
        this.sendNotification();
        this.onSelectFacility.emit({ ID, name });
        this.ClearSearchFields();
    }

    deleteFacility(FacilityId: number) {
        if (FacilityId == undefined || FacilityId == null || FacilityId == 0)
            return;
        this.API.confirmFun('Do you want to delete selected Facility?', '', () => {
            this.API.getData('/Setup/DeleteFacility?FacilityId=' + FacilityId).subscribe(
                data => {
                    swal({ position: 'top-end', type: 'success', title: 'Selected Facility has been Deleted.', showConfirmButton: false, timer: 1500 })
                    this.getFacilities('true');

                });
        });

    }
   
      onPracticeChange() {
        debugger
        let practiceCode=this.searchCriteria.Response.PracticeCode
        if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
          const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
          practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
        }
        const selectedPracticeId = practiceCode;
        
        // this.searchCriteria.Response.PracticeCode = event.target.value;
        if(this.showHideFacilityElements === false){
            practiceCode = practiceCode;

        }else{
        this.saveFacilityModel.Response.Practice_Code = practiceCode;
        }
        console.log('Selected practice on facility', selectedPracticeId)
      }
      ngOnChanges(changes: SimpleChanges) {
        debugger;
        // Check if facilityName has been set
        if (changes['facilityName'] && changes['facilityName'].currentValue) {
            this.facilityName = changes['facilityName'].currentValue;
            this.showHideFacilityElements = false;
            this.saveFacilityModel.Response.Practice_Code = this.loggedInUser.selectedPractice.PracticeCode;
            this.searchCriteria.Response.PracticeCode = this.loggedInUser.selectedPractice.PracticeCode;

          console.log('facilityName is passed:', this.facilityName);
        } else {
          console.log('facilityName is not passed or is empty');
        }
      }
      
}
