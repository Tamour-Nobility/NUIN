import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { APIService } from '../../components/services/api.service';
import { Common } from '../../services/common/common';
import { SearchCriteria, NDCModel } from '../../fee-schedule/fee-schedule-model'
import { DatePipe } from '@angular/common';
import { GvarsService } from '../../services/G_vars/gvars.service';
import { SelectListViewModel } from '../../models/common/selectList.model';

@Component({
  selector: 'app-ndc',
  templateUrl: './ndc.component.html',
  styleUrls: ['./ndc.component.css']
})
export class NdcComponent implements OnInit {
  public placeholderGS: string = 'MM/DD/YYYY';
  public SearchCriteria: SearchCriteria;
  public NDCModel: NDCModel;
  public showText: string;
  public showno: string;

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy', height: '25px', width: '93%'
  };
  RequestModel: any;
  editClick: boolean = false;

  globalRow: number;
  dataTableNDC: any;
  isEdit: boolean = true;
  isNEW = false;
  showHideGuarantorElements: boolean = false;
  retPostData: any;

  //mychanges
  listPracticesList: SelectListViewModel[];
  practiceCode:String| number;
  practiceName: string;
  checkAll: boolean = false;
  datatable: any;
  patientList: any[];
  constructor(private chRef: ChangeDetectorRef, public API: APIService, public datepipe: DatePipe, private _gv: GvarsService,
  ) {

    this.NDCModel = new NDCModel();
    this.SearchCriteria = new SearchCriteria();
    //mychanges
    this.listPracticesList = [];
    this.patientList = [];

  }

  ngOnInit() {
    this.isEdit = true
    //mychanges
    this.getPractices()
  }

  //mychanges
  getPractices() {
    debugger;
    this.API.getData('/Setup/GetPracticeList').subscribe(
      d => {
        if (d.Status == "Sucess") {
          this.listPracticesList = d.Response;
          this.listPracticesList = this.listPracticesList.map(practice => {
            return {
                ...practice,  // Keep all existing properties
                PracticeLabel: `${practice.Id} | ${practice.Name}`  // Add new combined property
              };
             });
          const practiceID = this._gv.currentUser.selectedPractice.PracticeCode;
          this.getSetPractice(practiceID);
        }
        else {
          swal('Failed', d.Status, 'error');
        }
      })
  }

  //mychanges

  onSelectPractice() {
    debugger;
    let practiceCode=this.practiceCode
    if (typeof practiceCode === 'string' && practiceCode.includes(' | ')) {
      const practiceCodeString = practiceCode.split(' | ')[0]; // Extract the numeric part
      practiceCode = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.getSetPractice(practiceCode)
  }
  //mychanges

  getSetPractice(pracID) {
    debugger
    const userLvlPractice = this.listPracticesList.find(p => p.Id == pracID)
    if (userLvlPractice) {
      this.practiceCode = userLvlPractice.Id;
      this.practiceName = userLvlPractice.Name;
       let p= `${userLvlPractice.Id} | ${userLvlPractice.Name}`
       this.practiceCode=p
      this.SearchCriteria.practice_code = userLvlPractice.Id;
      this.NDCModel.practice_code = userLvlPractice.Id
    }
    if(this.RequestModel.length>0){
      this.searchNDC()
    }
  }

  searchndcbyKey(event: KeyboardEvent) {
    if (event.keyCode == 13) { //Enter key
      this.searchNDC();
    }
  }

  onDateChangedFromAddUpdate(event) {
    this.NDCModel.effectivefrom = event.formatted;
  }

  onDateChangedToAddUpdate(event) {
    this.NDCModel.effectiveto = event.formatted;
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
  DrugCodeMask(ndc: string) {


    let newNDC = ndc[0] + ndc[1] + ndc[2] + ndc[3] + ndc[4] + '-' + ndc[5] + ndc[6] + ndc[7] + ndc[8] + '-' + ndc[9] + ndc[10]

    return newNDC
  }

  // DeleteNDC(index: any) {
  //     debugger
  //     let id = this.RequestModel[index].NDC_ID;
  //     this.API.confirmFun('Confirmation', 'Do you want to delete this NDC?', () => {
  //         this.API.getData(`/Setup/DeleteNDC?NDC_ID=${id}`).subscribe(
  //             response => {
  //                 if (response.Status === 'Sucess') {
  //                     swal ('Delete Success', 'NDC  has been deleted successfully.', 'success');
  //                 } else {
  //                     swal('Delete Failed', 'Failed to delete the NDC.', 'error');
  //                 }
  //             }, () => {

  //             }, () => {
  //                 this.searchNDC();
  //             });
  //     });
  // }

  ModifyNDCinfo(row: number) {
    debugger;
    if (!this.editClick) {
      this.globalRow = row;
      this.EnableDisableModifierElements("Modify");
      //mychanges
      this.NDCModel.practice_code = this.RequestModel[row].Practice_Code;
      this.NDCModel.NDC_ID = this.RequestModel[row].NDC_ID;
      this.NDCModel.HCPCS_code = this.RequestModel[row].HCPCS_Code;
      this.NDCModel.drug_name = this.RequestModel[row].Drug_Name;
      this.NDCModel.PKG_Qty = this.RequestModel[row].PKG_Qty;
      this.NDCModel.labeler_name = this.RequestModel[row].Labeler_Name;
      this.NDCModel.qualifer = this.RequestModel[row].Qualifier;
      this.NDCModel.ndc_code = this.RequestModel[row].NDC2;
      this.NDCModel.effectivefrom = this.RequestModel[row].Effective_Date_From
      this.NDCModel.effectiveto = this.RequestModel[row].Effective_Date_To
      if (this.NDCModel.effectivefrom != null) {
        this.NDCModel.effectivefrom = this.datepipe.transform(this.NDCModel.effectivefrom, 'MM/dd/yyyy');
      }
      if (this.NDCModel.effectiveto != null) {
        this.NDCModel.effectiveto = this.datepipe.transform(this.NDCModel.effectiveto, 'MM/dd/yyyy');
      }
      //mychanges
      this.NDCModel.description = this.RequestModel[row].Short_Description;

    }


  }
  searchNDC() {
    debugger
    if (this.SearchCriteria.ndc_code != null) {
      if (this.SearchCriteria.ndc_code.length == 11) {
        this.SearchCriteria.ndc_code = this.DrugCodeMask(this.SearchCriteria.ndc_code)
      }


    }

    //mychanges
    if (!Common.isNullOrEmptywithoutzero(this.SearchCriteria.HCPCS_code) ||
      !Common.isNullOrEmpty(this.SearchCriteria.drug_name) ||
      !Common.isNullOrEmpty(this.SearchCriteria.practice_code) ||
      (!Common.isNullOrEmpty(this.SearchCriteria.ndc_code) && this.SearchCriteria.ndc_code.length >= 5)

    ) {
      console.log('PracticeName', this.practiceName, this.practiceCode)
      this.API.PostData(`/Setup/GetNDCList`, this.SearchCriteria, (data) => {
        if (data.Status === 'Sucess') {
          debugger
          if (this.dataTableNDC) {
            this.dataTableNDC.destroy();
            //mychanges
            this.dataTableNDC.clear();
          }
          debugger;
          this.RequestModel = data.Response;
          this.isEdit = false;
          this.chRef.detectChanges();
          this.dataTableNDC = $('.dataTableNDC').DataTable({
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
      swal('NDC Search', 'Please enter any search criteria.', 'warning');
    }

  }
  canSave() {

    if (Common.isNullOrEmpty(this.NDCModel.HCPCS_code)) {
      return swal('Validation Error', 'HCPCS Code is Required.', 'error');
    }


    if (Common.isNullOrEmpty(this.NDCModel.ndc_code)) {
      return swal('Validation Error', 'Drug Code  is Required.', 'error');
    }

    if (this.NDCModel.ndc_code != null) {
      if (this.NDCModel.ndc_code.length == 11) {
        this.NDCModel.ndc_code = this.DrugCodeMask(this.NDCModel.ndc_code);
      }

    }
    if (!Common.isNullOrEmpty(this.NDCModel.ndc_code)) {
      if (this.NDCModel.ndc_code.length != 13) {
        return swal('Validation Error', 'Please Enter valid Drug Code ', 'error');
      }
    }

    if (Common.isNullOrEmpty(this.NDCModel.PKG_Qty)) {
      return swal('Validation Error', 'Drug Quantity is Required.', 'error');
    }
    if (Common.isNullOrEmpty(this.NDCModel.qualifer)) {
      return swal('Validation Error', 'Qualifier is Required.', 'error');
    }

    if (Common.isNullOrEmpty(this.NDCModel.effectivefrom)) {
      return swal('Validation Error', 'Effective From Date is Required.', 'error');
    }

    if (Common.isNullOrEmpty(this.NDCModel.effectiveto)) {
      return swal('Validation Error', 'Effective To Date is Required.', 'error');
    }

    const date = new Date(this.NDCModel.effectivefrom);
    const date1 = new Date(this.NDCModel.effectiveto);

    if (date1 < date) {
      return swal('Validation Error', 'Effective from  Date is greater than Effective to date.', 'error');
    }

    else {
        this.AddNDC();
    }
  }

  AddNDC() {

    //mychanges
    debugger;
    let practiceCode=this.practiceCode
    if (typeof this.NDCModel.practice_code === 'string' && this.NDCModel.practice_code.includes(' | ')) {
      const practiceCodeString = this.NDCModel.practice_code.split(' | ')[0]; // Extract the numeric part
      this.NDCModel.practice_code = parseInt(practiceCodeString, 10); // Convert to a number
    }
    this.API.PostData('/Setup/SaveNDC/', this.NDCModel, (d) => {
      debugger
      if (d.Status == "Sucess") {
        const practiceID = this._gv.currentUser.selectedPractice.PracticeCode
        this.getSetPractice(practiceID)
        swal('Success', 'National Drug Code has been ' + this.showno + '.', 'success');
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

  EnableDisableModifierElements(value: any) {
    debugger;
    if (value == "New") {
      this.NDCModel = new NDCModel();
      this.showText = "Add"
      this.showno = "added"

      this.showHideGuarantorElements = true;
      this.isEdit = true;
      //mychanges
      this.ClearSearchFields();


    }
    else if (value == "Modify") {
      this.NDCModel = new NDCModel();
      this.showText = "Edit"
      this.showno = "edited"

      this.showHideGuarantorElements = true;
      this.isEdit = true;
     
    }
    else if (value == "Cancel") {
      this.showHideGuarantorElements = false;
      this.isEdit = true;
      this.showText = "Add"
      this.showno = "added"
      //mychanges
      this.ClearSearchFields();


    }
    else if (value == "Clear") {
            //mychanges
      this.ClearSearchFields();
      this.showHideGuarantorElements = false;

    }
  }

  ClearSearchFields() {
    if (this.dataTableNDC) {
      this.dataTableNDC.destroy();
      this.dataTableNDC.clear();
      
    }
    this.RequestModel = [];
    this.chRef.detectChanges();
    this.dataTableNDC = $('.dataTableNDC').DataTable({
      columnDefs: [
        { orderable: false, targets: -1 }
      ],
      language: {
        emptyTable: "No data available"
      }
    });
    this.NDCModel = new NDCModel();
    this.SearchCriteria = new SearchCriteria();
    const practiceID = this._gv.currentUser.selectedPractice.PracticeCode
    this.getSetPractice(practiceID)
  }

}
