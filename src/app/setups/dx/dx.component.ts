import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { SearchCriteriaDX,DXModel} from '../../fee-schedule/fee-schedule-model'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dx',
  templateUrl: './dx.component.html',
  styleUrls: ['./dx.component.css']
})
export class DXComponent implements OnInit {

  public placeholderGS: string = 'MM/DD/YYYY';
  public SearchCriteria: SearchCriteriaDX;
  public DXModel:DXModel;
  public showText:string;
  public showno:string;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '93%'
};
  RequestModel: any;
  editClick: boolean = false;
  
  globalRow: number;
  dataTableDX: any;
  isEdit: boolean =true;
  isNEW = false;
  showHideGuarantorElements: boolean = false;
  retPostData: any; 
  constructor(private chRef: ChangeDetectorRef, public API: APIService,    public datepipe: DatePipe
    ) {
    
    this.DXModel=new DXModel();
    this.SearchCriteria=new SearchCriteriaDX();
   }

  ngOnInit() {
    this.isEdit=true
    this.DXModel.ICD_version='i10';
  }
  searchDXbyKey(event: KeyboardEvent) {
    if (event.keyCode == 13) { //Enter key
        this.searchDX();
    }
}

onDateChangedEffectiveAddUpdate(event) {
  this.DXModel.Diag_Effective_Date = event.formatted;
}

onDateChangedExpiryAddUpdate(event) {
  this.DXModel.Diag_Expiry_Date = event.formatted;
}

dateMaskGS(event: any) {
    debugger
  var v = event.target.value;
  if (v) {
      if (v.match(/^\d{2}$/) !== null) {
          event.target.value = v + '/';
      } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
          event.target.value = v + '/';
      }
  }
}



DeleteDX(index: any) {
    let id = this.RequestModel[index].diag_code;
    this.API.confirmFun('Confirmation', 'Do you want to delete this Diagnosis?', () => {
        this.API.getData(`/Setup/DeleteDX?DX_code=${id}`).subscribe(
            response => {
                if (response.Status === 'Sucess') {
                    swal ('Delete Success', 'Diagnosis  has been deleted successfully.', 'success');
                } else {
                    swal('Delete Failed', 'Failed to delete the Diagnosis.', 'error');
                }
            }, () => {

            }, () => {
                this.searchDX();
            });
    });
}
ModifyDXinfo(row: number) {
    if (!this.editClick) {
        this.globalRow = row;
        this.EnableDisableModifierElements("Modify");
        this.DXModel.diag_code= this.RequestModel[row].diag_code;
        this.DXModel.Diag_Description= this.RequestModel[row].Diag_Description;
        this.DXModel.Gender_Applied_On= this.RequestModel[row].Gender_Applied_On;
       this.DXModel.ICD_version= this.RequestModel[row].ICD_version;
       this.DXModel.Diag_Effective_Date=this.RequestModel[row].Diag_Effective_Date
       this.DXModel.Diag_Expiry_Date=this.RequestModel[row].Diag_Expiry_Date
       debugger
        if (this.DXModel.Diag_Effective_Date != null) {
            this.DXModel.Diag_Effective_Date = this.datepipe.transform(this.DXModel.Diag_Effective_Date, 'MM/dd/yyyy');
        }
        if (this.DXModel.Diag_Expiry_Date != null) {
            this.DXModel.Diag_Expiry_Date = this.datepipe.transform(this.DXModel.Diag_Expiry_Date, 'MM/dd/yyyy');
        }
    }


}
searchDX(){

  if (!Common.isNullOrEmptywithoutzero(this.SearchCriteria.Diag_Code) ||
            !Common.isNullOrEmpty(this.SearchCriteria.Diag_Description)    
        
            
            ) {
            this.API.PostData(`/Setup/GetDXList`, this.SearchCriteria, (data) => {
                if (data.Status === 'Sucess') {
                    if (this.dataTableDX) {
                        this.dataTableDX.destroy();
                    }
                    this.RequestModel = data.Response;
                    this.isEdit=false;
                    this.chRef.detectChanges();
                    this.dataTableDX = $('.dataTableDX').DataTable({
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
            swal('Diagnosis Search', 'Please enter any search criteria.', 'warning');
        }

}
canSave() {

  if (Common.isNullOrEmptywithoutzero(this.DXModel.diag_code)) {
      return swal('Validation Error', 'Diagnosis Code is Required.', 'error');
  }
    debugger
  let value=this.DXModel.diag_code.split(".");
  if(value.length == 2 ){
    if(Common.isNullOrEmptywithoutzero(value[1])){
    

      return swal('Validation Error', 'Diagnosis Code is invalid.', 'error');
    }else if(Common.isNullOrEmptywithoutzero(value[0])){
      return swal('Validation Error', 'Diagnosis Code is invalid.', 'error');
    }
    
    
   
  }else{
    return swal('Validation Error', 'Diagnosis Code is invalid.', 'error');
  }
  if (Common.isNullOrEmpty(this.DXModel.Diag_Description)) {
    return swal('Validation Error', 'Description is Required.', 'error');
}
if (Common.isNullOrEmpty(this.DXModel.ICD_version)) {
  return swal('Validation Error', 'ICD is Required.', 'error');
}
const date = new Date(this.DXModel.Diag_Effective_Date); 
const date1= new Date(this.DXModel.Diag_Expiry_Date); 

if (date1<date) {
  return swal('Validation Error', 'Expiry Date is greater than Effective date.', 'error');
}
 else {
    if(this.showText =='Edit'){
this.UpdateDX() 
    }else{
      this.AddDX();
    }
     
  }
}

AddDX() {

 
  this.API.PostData('/Setup/SaveDX/', this.DXModel, (d) => {
      if (d.Status == "Sucess") {
          swal('Success', 'Diagnosis has been '+this.showno+'.', 'success');
          this.EnableDisableModifierElements("Cancel");
      }else if(d.Status == "duplicate"){
        swal({
          type: 'error',
          title: 'Error',
          text: "Diagnosis already exist" ,
          footer: ''
      })
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
UpdateDX() {

 
  this.API.PostData('/Setup/UpdateDX/', this.DXModel, (d) => {
      if (d.Status == "Sucess") {
          swal('Success', 'Diagnosis has been '+this.showno+'.', 'success');
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
EnableDisableModifierElements(value:any){
  if (value == "New") {
    this.DXModel=new DXModel();
    this.DXModel.ICD_version='i10';
    this.showText="Add"
    this.showno="added"

    this.showHideGuarantorElements = true;
    this.isEdit = true;
}
else if (value == "Modify") {
    this.DXModel=new DXModel();
    this.showText="Edit"
    this.showno="edited"

    this.showHideGuarantorElements = true;
    this.isEdit = true;
}
else if (value == "Cancel") {
    this.showHideGuarantorElements = false;
    this.isEdit = true;
}
else if (value == "Clear") {
    this.ClearSearchFields();
    this.showHideGuarantorElements = false;

}
}
ClearSearchFields() {
  if (this.dataTableDX) {
      this.dataTableDX.destroy();
  }
  this.RequestModel = [];
  this.chRef.detectChanges();
  this.dataTableDX = $('.dataTableDX').DataTable({
      columnDefs: [
          { orderable: false, targets: -1 }
      ],
      language: {
          emptyTable: "No data available"
      }
  });
  this.DXModel=new DXModel();
  this.SearchCriteria = new SearchCriteriaDX();
}

}
