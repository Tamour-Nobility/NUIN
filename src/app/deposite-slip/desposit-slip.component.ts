import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import{dsModel,searchModel} from './Classes/dsModel';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-desposit-slip',
  templateUrl: './desposit-slip.component.html',
  styleUrls: ['./desposit-slip.component.css']
})
export class DespositSlipComponent implements OnInit {
    isNewDS:boolean=false;
  dSModel:dsModel;
  isCancel:boolean=false;
  dsSearchModel:searchModel;
  dSModelResponse:dsModel[];
  GrandTotal: number = 0;
  GrandOther: number = 0;
  GrandRem: number = 0;
  currentDateTime: string;
  todaysEobCount: number = 0.00;
  DateMethodSearch: boolean = true;
  FixedSearch: boolean = false;
  showHideElements: boolean = false;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat:'mm/dd/yyyy',height: '25px', width:'93%'
};


  constructor(private cd: ChangeDetectorRef) { 
    this.dSModel=new dsModel
    this.dsSearchModel=new searchModel;
    this.dSModelResponse=[];
  }
  DateType(from: string) {
    if (from == "Type") {
        if ($("#dType").val() == 0)
            this.dsSearchModel.Response.By = "CD";
        else if ($("#dType").val() == 1)
            this.dsSearchModel.Response.By = "BD";
        else
            this.dsSearchModel.Response.By = "ED";
    }
    else if (from == "Type") {
        if ($("#dType").val() == "Check") {
            this.dsSearchModel.Response.check_No = this.dsSearchModel.Response.Method;
        }
    }

}
  ngOnInit() {
  }
  TimeFrameChange(index: number) {
    this.todaysEobCount = 0.00;
    this.GrandOther = 0;
    this.GrandTotal = 0;
    this.GrandRem = 0;
//    this.from_date = "";
  //  this.to_date = "";
}
showNewDS(){
this.isNewDS=true;
}
DSCancel(){
    this.isNewDS=false;
    this.refresh();
}
refresh() {
    this.cd.detectChanges();
  }
}
