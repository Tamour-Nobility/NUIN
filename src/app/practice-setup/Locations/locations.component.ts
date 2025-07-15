import { Component, OnInit, ChangeDetectorRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { APIService } from '../../components/services/api.service';
import { GvarService } from '../../components/services/GVar/gvar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { zipdata } from '../../patient/Classes/patientInsClass';
import { LocationModel, SaveLocationRequest } from '../Locations/Classes/locationClass';
import { IMyDpOptions } from 'mydatepicker';
declare var $: any
import 'datatables.net';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  public isAdd = false;
  public isList = true;
  locationmodel: LocationModel[];
  saveLocationRequest: SaveLocationRequest;
  bisEdit: boolean = false;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '20px', width: '93%'
  };
  dataTable: any;
  //zipData: zipdata;
  cmpRef: ComponentRef<any>;
  bIsEdit: boolean = false;
  SelectedPracticeCode: number;
  zipLocationData: zipdata[];
  constructor(private chRef: ChangeDetectorRef,
    public datepipe: DatePipe,
    public router: Router,
    public route: ActivatedRoute,
    public API: APIService,
    public Gv: GvarService) {
    this.locationmodel = [];
    this.saveLocationRequest = new SaveLocationRequest;
    this.zipLocationData=[]
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] !== 0 && params['id'] !== '0') {
        this.SelectedPracticeCode = params['id'];
        this.GetPracticeLocations();
      }
    });
  }
  GetPracticeLocations() {
    if (this.SelectedPracticeCode == null || this.SelectedPracticeCode == 0 || this.SelectedPracticeCode == undefined)
      return;
    this.showList();
    this.API.getData('/PracticeSetup/GetPracticeLocationList?PracticeId=' + this.SelectedPracticeCode).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          if (this.dataTable) {
            this.chRef.detectChanges();
            this.dataTable.destroy();
          }
          this.locationmodel = [];
          this.locationmodel = data.Response;
          this.chRef.detectChanges();
          const table: any = $('.praclocTable');
          this.dataTable = table.DataTable({
            language: {
              emptyTable: "No data available"
            }
          });
        } else {
          swal('Failed', data.Status, 'error');
        }
      }
    );

  }

  showList() {
    this.isList = true;
    this.isAdd = false;
  }
  showAdd() {
    this.isList = false;
    this.isAdd = true;
  }
  AddLocation() {
    if (this.saveLocationRequest.Location_Code === undefined) {
      this.saveLocationRequest.Location_Code = 0;
    }
    this.saveLocationRequest.Is_Active = true;
    this.saveLocationRequest.Deleted = false;
    this.saveLocationRequest.Practice_Code = this.SelectedPracticeCode;

    if (!this.canSave())
      return;

    this.API.PostData('/PracticeSetup/SavePracticeLocation/', this.saveLocationRequest, (d) => {
      if (d.Status === 'Sucess') {
        this.GetPracticeLocations();
        this.bisEdit = !this.bisEdit;
        swal('Practice Location', 'Location has been saved.', 'success');
      }
      else {
        swal('Failed', d.Status, 'error');
      }
    });
  }
  onDateChangedExp(event) {
    this.saveLocationRequest.Clia_Expiry_Date = event.formatted;
  }
  // Get City State zIP
  onBlurMethod() {
    this.API.getData('/Demographic/GetCityState?ZipCode=' + this.saveLocationRequest.Location_Zip).subscribe(
      data => {
        if (data.Status === 'Success') {
          this.zipLocationData = data.Response;
          this.saveLocationRequest.Location_City = this.zipLocationData[0].CityName;
          this.saveLocationRequest.Location_State = this.zipLocationData[0].State;
        } else {
          this.saveLocationRequest.Location_City = '';
          this.saveLocationRequest.Location_State = '';
        }
      }
    );
  }

  GetPracticeLocationDetails(Location_code) {
    this.API.getData('/PracticeSetup/GetPracticeLocation?PracticeId=' + this.SelectedPracticeCode + '&PracticeLocationId=' + Location_code).subscribe(
      data => {
        if (data.Status === 'Sucess') {
          this.saveLocationRequest = data.Response;
          if(this.saveLocationRequest.Location_City!=''||this.saveLocationRequest.Location_City!=null){
           this.onBlurMethod();
          }
          this.saveLocationRequest.Clia_Expiry_Date = this.datepipe.transform(this.saveLocationRequest.Clia_Expiry_Date, 'MM/dd/yyyy');
        }
      });
  }
  EditLocation(Location_Code) {
    this.showAdd();
    this.bisEdit = true;
    this.GetPracticeLocationDetails(Location_Code);
  }
  LocationEmptyModel() {
    this.bisEdit = true;
    this.showAdd();
    this.saveLocationRequest = new SaveLocationRequest();
    $('#inpphoneno').val('');
    $('#inpfaxno').val('');
  }
  ViewLocation(Location_Code) {
    this.showAdd();
    this.bisEdit = false;
    this.GetPracticeLocationDetails(Location_Code);
  }
  resetFields() {
    this.bisEdit = false;
    //this.showList();
    if (this.saveLocationRequest.Location_Code != undefined && this.saveLocationRequest.Location_Code != null && this.saveLocationRequest.Location_Code != 0) {
      this.GetPracticeLocationDetails(this.saveLocationRequest.Location_Code);
    }
    else
      this.saveLocationRequest = new SaveLocationRequest;
  }
  DeleteLocation(Location_Code) {
    this.API.confirmFun('Do you want to delete this Practice ?', '', () => {
      this.API.getData('/PracticeSetup/DeletePracticeLocation?PracticeId=' +
        this.SelectedPracticeCode + '&PracticeLocationId=' + Location_Code).subscribe(
          data => {
            if (data.Status === 'Sucess') {
              this.GetPracticeLocations();
            }
          });
    });
  }

  canSave(): boolean {
    if (this.isNullOrEmptyString(this.saveLocationRequest.Location_Name)) {
      swal('"Enter Location.', '', 'info');
      return false;
    }
    if (this.isNullOrEmptyString(this.saveLocationRequest.Location_Zip)) {
      swal('"Enter Zip Code.', '', 'info');
      return false;
    }
    if (this.isNullOrEmptyString(this.saveLocationRequest.Location_City)||this.saveLocationRequest.Location_City=="Select City" ) {
      swal('"Enter Location City.', '', 'info');
      return false;
    }
    else if (this.saveLocationRequest.Location_Zip.length < 4 || this.isNullOrEmptyString(this.saveLocationRequest.Location_City)) {
      swal('"Enter valid Zip Code.', '', 'info');
      return false;
    }
    // if (this.isNullOrEmptyString(this.saveLocationRequest.Clia_Number)) {
    //   swal('"Enter CLIA Number.', '', 'info');
    //   return false;
    // }
    if (this.isNullOrEmptyString(this.saveLocationRequest.Location_Address)) {
      swal('"Enter Location Address.', '', 'info');
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
