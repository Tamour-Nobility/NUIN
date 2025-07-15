import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { GurantorResponse } from '../guarantors/classes/responseMedel';
import { SearchCriteria, Response } from '../guarantors/classes/request';
import { APIService } from '../../components/services/api.service';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { Common } from '../../services/common/common';
import { IMyDpOptions } from 'mydatepicker';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
    selector: 'app-guarantor',
    templateUrl: './guarantor.component.html',
    styleUrls: ['./guarantor.component.css']
})
export class GuarantorComponent implements OnInit {
    public placeholderGS: string = 'MM/DD/YYYY';
    dataTableGuarantor: any;
    @Output() notifyParent: EventEmitter<any> = new EventEmitter();
    isEdit = false;
    isNEW = false;
    public GurantorModel: GurantorResponse;
    editClick: boolean = false;
    globalRow: number;
    public SearchCriteria: SearchCriteria;
    enablenew: boolean = false;
    RequestModel: Response[];
    public retPostData;
    showHideGuarantorElements: boolean = false;
    private today = new Date();
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'mm/dd/yyyy', height: '25px', width: '93%', disableSince: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 }
    };
    constructor(private chRef: ChangeDetectorRef,
        public API: APIService,
        public Gv: GvarsService,
        public datepipe: DatePipe,
    ) {
        this.GurantorModel = new GurantorResponse;
        this.SearchCriteria = new SearchCriteria;
        this.RequestModel = [];
    }

    ngOnInit() {
    }

    sendNotification() {
        this.notifyParent.emit('Close Model');
    }

    EnableDisableModifierElements(NewModifyCancel: string) {
        if (NewModifyCancel == "New") {
            this.GurantorModel = new GurantorResponse();
            this.showHideGuarantorElements = true;
            this.isEdit = true;
        }
        else if (NewModifyCancel == "Modify") {
            this.GurantorModel = new GurantorResponse();
            this.showHideGuarantorElements = true;
            this.isEdit = true;
        }
        else if (NewModifyCancel == "Cancel") {
            this.showHideGuarantorElements = false;
            this.isEdit = false;
        }
        else if (NewModifyCancel == "Clear") {
            this.ClearSearchFields();
            this.showHideGuarantorElements = false;

        }
    }
    searchGurantorbyKey(event: KeyboardEvent) {
        if (event.keyCode == 13) { //Enter key
            this.searchGurantor();
        }
    }

    AddGurantor() {
        this.GurantorModel.Status = "Success";
        this.API.PostData('/Setup/SaveGurantor/', this.GurantorModel.Response, (d) => {
            if (d.Status == "Sucess") {
                swal('Success', 'Guarantor has been saved.', 'success');
                this.EnableDisableModifierElements("Cancel");
            }
            else {
                this.retPostData = d;
                swal({
                    type: 'error',
                    title: 'Error',
                    text: this.retPostData,
                    footer: ''
                })
            }
        })
    }

    ClearSearchFields() {
        if (this.dataTableGuarantor) {
            this.dataTableGuarantor.destroy();
        }
        this.RequestModel = [];
        this.chRef.detectChanges();
        this.dataTableGuarantor = $('.dataTableGuarantor').DataTable({
            columnDefs: [
                { orderable: false, targets: -1 }
            ],
            language: {
                emptyTable: "No data available"
            }
        });
        this.GurantorModel = new GurantorResponse();
        this.SearchCriteria = new SearchCriteria();
    }

    searchGurantor() {
        if (!Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_Fname) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_Lname) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_Dob) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_Home_Phone) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_City) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_State) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_Zip) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Response.Guarant_Address)) {
            this.API.PostData(`/Setup/GetGurantorsList`, this.SearchCriteria.Response, (data) => {
                if (data.Status === 'Sucess') {
                    if (this.dataTableGuarantor) {
                        this.dataTableGuarantor.destroy();
                    }
                    this.RequestModel = data.Response;
                    this.chRef.detectChanges();
                    this.dataTableGuarantor = $('.dataTableGuarantor').DataTable({
                        columnDefs: [
                            { orderable: false, targets: -1 }
                        ],
                        language: {
                            emptyTable: "No data available"
                        }
                    });
                } else {
                    this.RequestModel = [];
                    swal('Failed', data.Status);
                }
            });
        } else {
            swal('Guarantor Search', 'Please enter any search criteria.', 'warning');
        }

    }

    FillGurantor(LastName, FirstName, Code) {
        // alert("dadas")
        // if (this.Gv.GurrantorCall == "Claim") {
        //     this.Gv.GurantorName_C = LastName + ' , ' + FirstName;
        //     this.Gv.GUARANTOR_CODE_C = Code;
        //     this.sendNotification();
        // }
        // else {
        //     this.Gv.GurantorName_P = LastName + ' , ' + FirstName;
        //     this.Gv.GUARANTOR_CODE_P = Code;
        //     this.sendNotification();
        // }
    }

    ModifyGuarantorinfo(row: number) {
        if (!this.editClick) {
            this.globalRow = row;
            this.EnableDisableModifierElements("Modify");
            this.GurantorModel.Response = this.RequestModel[row];
            if (this.GurantorModel.Response.Guarant_Dob != null) {
                this.GurantorModel.Response.Guarant_Dob = this.datepipe.transform(this.GurantorModel.Response.Guarant_Dob, 'MM/dd/yyyy');
            }
        }


    }

    onBlurMethod(Type: string) {
        var id: any;
        if (Type == "res") {
            id = this.SearchCriteria.Response.Guarant_Zip;
        }
        else {
            id = this.GurantorModel.Response.Guarant_Zip;
        }

        if (id == undefined || id == null || id == "" || id.length < 4)
            return;

        this.API.getData('/Demographic/GetCityState?ZipCode=' + id).subscribe(
            data => {
                if (data.Status == "Sucess") {

                    if (Type == "res") {
                        this.SearchCriteria.Response.Guarant_City = data.Response.CityName;
                        this.SearchCriteria.Response.Guarant_State = data.Response.State;
                    }
                    else {
                        this.GurantorModel.Response.Guarant_City = data.Response.CityName;
                        this.GurantorModel.Response.Guarant_State = data.Response.State;
                    }
                }
                else {
                    if (Type == "res") {
                        this.SearchCriteria.Response.Guarant_City = "";
                        this.SearchCriteria.Response.Guarant_State = "";
                    }
                    else {
                        this.GurantorModel.Response.Guarant_City = "";
                        this.GurantorModel.Response.Guarant_State = "";
                    }
                }
            }
        );
    }

    dateMaskGS(event: any) {
        var v = event.target.value;
        if (v) {
            if (v.match(/^\d{2}$/) !== null) {
                event.target.value = v + '/';
            } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
                event.target.value = v + '/';
            }
        }
    }

    isnullorEmpty(str: any): boolean {
        if (str == undefined || str == null)
            return true;
        if ($.trim(str) == "")
            return true;
        else return false;
    }

    onDateChangedDOB(event) {
        this.SearchCriteria.Response.Guarant_Dob = event.formatted;
    }

    onDateChangedDOBAddUpdate(event) {
        this.GurantorModel.Response.Guarant_Dob = event.formatted;
    }

    DeleteGurantor(index: any) {
        let id = this.RequestModel[index].Guarantor_Code;
        this.API.confirmFun('Confirmation', 'Do you want to delete this Guarantor?', () => {
            this.API.getData(`/Setup/DeleteGurantor?GurantorId=${id}`).subscribe(
                response => {
                    if (response.Status === 'Sucess') {
                        swal('Delete Success', 'Guarantor has been deleted successfully.', 'success');
                    } else {
                        swal('Delete Failed', 'Failed to delete the Guarantor.', 'error');
                    }
                }, () => {

                }, () => {
                    this.searchGurantor();
                });
        });
    }
    canSave() {
        if (Common.isNullOrEmpty(this.GurantorModel.Response.Guarant_Lname)) {
            return swal('Validation Error', 'Last name is Required.', 'error');
        }
        if (Common.isNullOrEmpty(this.GurantorModel.Response.Guarant_Fname)) {
            return swal('Validation Error', 'First name is Required.', 'error');
        }
        if (Common.isNullOrEmpty(this.GurantorModel.Response.Guarant_Gender)) {
            return swal('Validation Error', 'Gender is Required.', 'error');
        }
        if (Common.isNullOrEmpty(this.GurantorModel.Response.Guarant_Address)) {
            return swal('Validation Error', 'Address is Required.', 'error');
        }
        else {
            this.AddGurantor();
        }
    }
}
