import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { SearchCriteria, Response } from '../../../setups/guarantors/classes/request';
import { IMyDpOptions } from 'mydatepicker';
import { APIService } from '../../../components/services/api.service';
import { Router } from '@angular/router';
import { Common } from '../../../services/common/common';
import { BaseComponent } from '../../../core/base/base.component';
import { ToastrService } from 'ngx-toastr';
import { NO_SEARCH_CRITRIA } from '../../../constants/messages';

@Component({
  selector: 'app-list-guarantors-shared',
  templateUrl: './list-guarantors-shared.component.html',
  styleUrls: ['./list-guarantors-shared.component.css']
})
export class ListGuarantorsSharedComponent extends BaseComponent implements OnInit {
  @Input() caller: string;
  @Output() onSelectGuarantor: EventEmitter<any> = new EventEmitter();
  isSearchInitiated: boolean = false;
  placeholderGS: string = 'MM/DD/YYYY';
  SearchCriteria: SearchCriteria;
  private today = new Date();
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    height: '25px',
    width: '100%',
    disableSince: {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate() + 1
    }
  };
  dataTableGuarantor: any;
  RequestModel: Response[];
  constructor(
    private chRef: ChangeDetectorRef,
    private API: APIService,
    private toasterService: ToastrService,
    private router: Router) {
    super();
    this.SearchCriteria = new SearchCriteria;
    this.RequestModel = [];
  }

  ngOnInit() {
  }

  searchGurantorbyKey(event: KeyboardEvent) {
    if (event.keyCode == 13) { //Enter key
      this.searchGurantor();
    }
  }

  ClearSearchFields() {
    this.isSearchInitiated = false;
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
      this.isSearchInitiated = true;
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
      this.toasterService.warning(NO_SEARCH_CRITRIA, 'Guarantor Search');
    }
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

  onEditClick(id: number) {
    this.router.navigate([`guarantors/edit/${id}`]);
  }

  handleDoubleClick({ Guarantor_Code, Guarant_Fname, Guarant_Lname }) {
    if (!Common.isNullOrEmpty(this.caller)) {
      this.onSelectGuarantor.emit({
        for: this.caller,
        data: {
          guarantorName: Guarant_Lname + ' , ' + Guarant_Fname,
          guarantorCode: Guarantor_Code
        }
      });
      this.ClearSearchFields();
      this.isSearchInitiated = false;
    }
  }

  isPointerStyle(): boolean {
    return !Common.isNullOrEmpty(this.caller);
  }
}