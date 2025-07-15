import {
    Component, OnInit, ChangeDetectorRef, ViewChild, ComponentRef
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { APIService } from '../../components/services/api.service';
import { GvarService } from '../../components/services/GVar/gvar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { zipdata } from '../../patient/Classes/patientInsClass';
import { PracticeFacility, PracticeFacilityModel, GetPracticeFacilites } from '../Facilities/Classes/FacilitiesModel';
import { FacilitiesComponent } from '../../setups/Facility/facilities.component'
import { IMyDpOptions } from 'mydatepicker';
declare var $: any
import 'datatables.net';

@Component({
    selector: 'app-facility',
    templateUrl: './facilities.component.html',
    styleUrls: ['./facilities.component.css']
})
export class PracFacilitiesComponent implements OnInit {
    @ViewChild(FacilitiesComponent) GurChild;
      selectedClassName : string = 'New'
    public isAdd = false;
    public isList = true;
    practiceFacility: PracticeFacility;
    objGetPracticeFacilites: GetPracticeFacilites;
    practiceFacilityModel: PracticeFacilityModel;
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '93%'
    };
    dataTable: any;
    zipData: zipdata;
    cmpRef: ComponentRef<any>;
    SelectedPracticeCode: number;
    constructor(private chRef: ChangeDetectorRef,
        public datepipe: DatePipe,
        public router: Router,
        public route: ActivatedRoute,
        public API: APIService,
        public Gv: GvarService) {
        this.practiceFacility = new PracticeFacility;
        this.practiceFacilityModel = new PracticeFacilityModel;
        this.objGetPracticeFacilites = new GetPracticeFacilites;

    }
    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id'] !== 0 && params['id'] !== '0') {
                this.SelectedPracticeCode = params['id'];
                this.GetPracticeFacilityList();
                this.showList();
            }
        });
    }
    GetPracticeFacilityList() {

        if (this.SelectedPracticeCode == null || this.SelectedPracticeCode == 0 || this.SelectedPracticeCode == undefined)
            return;

        this.showList();
        this.API.getData('/PracticeSetup/GetPracticeFacilityList?PracticeId=' + this.SelectedPracticeCode).subscribe(
            data => {
                if (data.Status === 'Sucess' || data.Status === 'No Data Found') {
                    if (this.dataTable) {
                        this.chRef.detectChanges();
                        this.dataTable.destroy();
                    }
                    this.practiceFacilityModel.Response = data.Response;
                    this.chRef.detectChanges();
                    const table: any = $('.facilitytbl');
                    this.dataTable = table.DataTable({
                        language: {
                            emptyTable: "No data available"
                        }
                    });
                } else {
                    swal('Failed', data.Status, 'error');
                }
            });
    }
    showList() {
        this.isList = true;
        this.isAdd = false;
    }
    showAdd() {
        this.isList = false;
        this.isAdd = true;
    }
    AddUpdateFacility() {

        if (this.SelectedPracticeCode == undefined || this.SelectedPracticeCode == null || this.SelectedPracticeCode == 0) {
            swal('Failed', "Please add Practice first.", 'error');
            return;
        }

        this.objGetPracticeFacilites.PracticeFacilityCode = this.SelectedPracticeCode;
        this.practiceFacility.PracticeFacilityCode = this.SelectedPracticeCode;
        this.objGetPracticeFacilites.FacilityCode = this.practiceFacility.Facility_Code;
        this.objGetPracticeFacilites.resp = this.practiceFacility;



        this.API.PostData('/PracticeSetup/SavePracticeFacility/', this.objGetPracticeFacilites, (d) => {
            if (d.Status === 'Sucess') {
                this.GetPracticeFacilityList();
            } else {
                swal('Failed', d.Status, 'error');
            }
        });
    }
    // Get City State zIP

    onBlurMethod() {
        this.API.getData('/Demographic/GetCityState?ZipCode=' + this.practiceFacility.Facility_ZIP).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.zipData = data.Response;
                    this.practiceFacility.Facility_City = this.zipData.CityName;
                    this.practiceFacility.Facility_State = this.zipData.State;
                } else {
                    this.practiceFacility.Facility_City = '';
                    this.practiceFacility.Facility_State = '';
                }
            });
    }
    GetPracticeFacility(PracticeFacilityId) {
        this.API.getData('/PracticeSetup/GetPracticeFacility?PracticeId=' + this.SelectedPracticeCode + '&PracticeFacilityId=' + PracticeFacilityId).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.practiceFacility = data.Response;
                } else {
                    swal('Failed', data.Status, 'error');
                }
            });
    }
    EditFacility(PracticeFacilityId) {
        this.showAdd();
        this.GetPracticeFacility(PracticeFacilityId);
    }
    FacilityEmptyModel() {
        this.showAdd();
        this.practiceFacility = new PracticeFacility;
    }
    ViewFacility(PracticeFacilityId) {
        this.showAdd();
        this.GetPracticeFacility(PracticeFacilityId);
    }
    resetFields() {
        this.showList();
        this.practiceFacility = new PracticeFacility;
    }
    DeleteFacility(PracticeFacilityId) {
        this.API.confirmFun('Do you want to delete this Facility ?', '', () => {
            this.API.getData('/PracticeSetup/DeletePracticeFacility?PracticeId=' +
                this.SelectedPracticeCode + '&PracticeFacilityId=' + PracticeFacilityId).subscribe(
                    data => {
                        if (data.Status === 'Sucess') {
                            this.GetPracticeFacilityList();
                        } else {
                            swal('Failed', data.Status, 'error');
                        }
                    });
        });
    }
    getNotificationFacility(val: any) {
        if (this.API.Gv.FacilityCode != undefined && this.API.Gv.FacilityCode != 0 && this.API.Gv.FacilityCode != null)
            this.getPracticeFacility(this.API.Gv.FacilityCode);
        else
            this.practiceFacility = new PracticeFacility;

        document.getElementById("facilityClose").click();
    }

    showFacility() {
        document.getElementById("Facilities").click();
    }
    getPracticeFacility(PracticeFacilityId) {
        this.API.getData('/Setup/GetFacility?FacilityId=' + PracticeFacilityId).subscribe(
            data => {
                if (data.Status === 'Sucess') {
                    this.practiceFacility = data.Response;
                } else {
                    swal('Failed', data.Status, 'error');
                }
            });
    }


}
