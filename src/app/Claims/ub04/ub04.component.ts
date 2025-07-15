import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import {  GvarsService } from '../../services/G_vars/gvars.service';
import { APIService } from './../../components/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

import { CCOde, CombinedCodeViewModel, ConditionCodeModel, OccCode, 
  OccSpanCode, OccurenceSpanModel, OccurrenceCodeModel , ListEmitterData, allDropdowns, ValueCode, ValueeCode, ClaimsUbDropdowns } from './Classes/ubclasses';
import * as moment from 'moment';
import { IMyDate } from 'mydaterangepicker';


@Component({
  selector: 'app-ub04',
  templateUrl: './ub04.component.html',
  styleUrls: ['./ub04.component.css']
})
export class UB04Component implements OnInit {

  @Output() listEmitter: EventEmitter<ListEmitterData> = new EventEmitter<ListEmitterData>();
  @Input() dataToChild: any;
  combinedCodeViewModel : CombinedCodeViewModel;
  SetDordpownValues:ClaimsUbDropdowns;



a:any;
  responseConditionCodeModel: ConditionCodeModel[];
  responseOccurrenceCodeModel:OccurrenceCodeModel[];
  responseOccurenceSpanModel:OccurenceSpanModel[];
  resValueCodeModel:ValueeCode[];

ListConditionCodeModel: CCOde[];
ListOccurrenceCodeModel:OccCode[];
ListOccurenceSpanModel:OccSpanCode[];
ListCodeModel:ValueCode[];
OccDate: any[]=[] ;
OccSpanDatefrom: any[]=[] ;
OccSpanDateThrough: any[]=[] ;
 
  labels: number[] = [1]; 
  // OccDate: string;
  constructor(
    private cd: ChangeDetectorRef,
    public router: Router,
    public route: ActivatedRoute,
    public datepipe: DatePipe,
    public API: APIService,
    public Gv: GvarsService,
   
    private toast: ToastrService
  ) {
  

  this.responseConditionCodeModel=[];
  this.responseOccurrenceCodeModel=[];
  this.responseOccurenceSpanModel=[];
  this.resValueCodeModel=[];
  this.combinedCodeViewModel= new CombinedCodeViewModel();
  this.SetDordpownValues= new ClaimsUbDropdowns();
    
   }

  ngOnInit() {
   
    this.getCombinedCodeData();
    debugger
    this.SetDordpownValues= this.dataToChild;
    if(this.SetDordpownValues.CcOde.length>0||this.SetDordpownValues.ValueCode.length>0||this.SetDordpownValues.OccSpanCode.length>0||this.SetDordpownValues.OccCode.length>0)
    {
    this.responseOccurrenceCodeModel= this.SetDordpownValues.OccCode;
    this.resValueCodeModel = this.SetDordpownValues.ValueCode;
    this.responseOccurenceSpanModel= this.SetDordpownValues.OccSpanCode;
    this.responseConditionCodeModel= this.SetDordpownValues.CcOde;
    debugger
    if ( this.responseOccurrenceCodeModel!=null){   
      let i=0;   
      this.responseOccurrenceCodeModel.forEach((item) => {
       item.Date2 = this.datepipe.transform(item.Date2 , 'MM/dd/yyyy');
       this.OccDate[i] = this.setDate(item.Date2);
       i++;
      });
    }
    if ( this.responseOccurenceSpanModel!=null){  
      debugger 
      let j=0;   
      this.responseOccurenceSpanModel.forEach((item) => {
        item.DateThrough = this.datepipe.transform(item.DateThrough , 'MM/dd/yyyy');
        this.OccSpanDateThrough[j] = this.setDate(item.DateThrough);
       item.DateFrom = this.datepipe.transform(item.DateFrom , 'MM/dd/yyyy');
       this.OccSpanDatefrom[j] = this.setDate(item.DateFrom);
       j++;
      });
    }

    

}
   
    // this.responseConditionCodeModel=[];
    // this.responseOccurrenceCodeModel=[];
    // this.responseOccurenceSpanModel=[];
    // this.resValueCodeModel=[];

  }


  formatDate(date: string) {
    if (date == null)
        return;
    var day = parseInt(date.split('/')[1]) < 10 ? date.split('/')[1] : date.split('/')[1];
    var month = parseInt(date.split('/')[0]) < 10 ? date.split('/')[0] : date.split('/')[0];
    var year = date.split('/')[2];
    if (year != undefined && month != undefined && day != undefined)
        return month + "/" + day + "/" + year;
}


  setDate(dateParam: any) {
    let date = new Date(dateParam);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    };
}

  onDateChanged(event: any, dateType: string) {
    if (dateType != undefined && dateType != "") {

        
    }}






    sendListToParent(type: string) {
      console.log(this.responseConditionCodeModel)
      let list = [];
  
      // Depending on the provided 'type', set the 'list' variable accordingly
      if (type === 'occurenceSpan') {
          list = this.responseOccurenceSpanModel;
      } else if (type === 'occurrenceCode') {
      
          list = this.responseOccurrenceCodeModel;
      } else if (type === 'ConditionCode') {
          list = this.responseConditionCodeModel;
      } else if (type === 'ValueCode') {
          list = this.resValueCodeModel;
      }
  
      // Emit the list with the provided 'type' identifier
      this.listEmitter.emit({ type, list });
  }
   
  //   sendListToParent() {
  //    // Emit the first list with a type identifier
  // this.listEmitter.emit({ type: 'occurenceSpan', list: this.responseOccurenceSpanModel });

  // // Emit the second list with a different type identifier
  // this.listEmitter.emit({ type: 'occurrenceCode', list: this.responseOccurrenceCodeModel });

  // this.listEmitter.emit({ type: 'ConditionCode', list: this.responseConditionCodeModel });

  // this.listEmitter.emit({ type: 'ValueCode', list: this.resValueCodeModel });

  //   }


    onCCOdeValueChange( fieldName: string, newValue: any, index: number){
     

      const item = this.responseConditionCodeModel[index];
      if (item) {
        if (fieldName === 'Description') {
       
          item.ConditionCode = newValue;

      }}
      this.sendListToParent('ConditionCode')  ;


    }


    onOccCOdeValueChange(fieldName: string, newValue: any, index: number) {
      
     
      const item = this.responseOccurrenceCodeModel[index];
      


      if (item) {
        if (fieldName === 'Description') {
          item.OccCode = newValue;
        } else if (fieldName === 'OccDate') {
          debugger
           item.Date2 =newValue.formatted; 
          // item.OccCode.Date = this.datepipe.transform(item.OccCode.Date, 'MM/dd/yyyy');
        }
        this.sendListToParent('occurrenceCode');
      }
    }

 


    
    
    // onOccCOdeValueChange(fieldName: string, newValue: any, index: number) {
    //   debugger
    //   const item = this.responseOccurrenceCodeModel[index];
    //   if (item) {
    //     if (fieldName === 'Description') {
    //       item.OccCode.OccCode = newValue;
    //      }
    //        else if (fieldName === 'OccDate') {
    //       item.OccCode.Date = newValue;
    //     }
    //     this.sendListToParent('occurrenceCode')  ;
    //   }
    // }

    onOccSpanValueChange(fieldName: string, newValue: any, index: number) {
      const item = this.responseOccurenceSpanModel[index];
      if (item) {
        if (fieldName === 'Description') {
          item.OccSpanCode = newValue;
        } else if (fieldName === 'DateFrom') {
          item.DateFrom = newValue.formatted;
        } else if (fieldName === 'DateThrough') {
          item.DateThrough = newValue.formatted;
        }
        this.sendListToParent('occurenceSpan');
      }
    }

    ChangeValueCode(fieldName: string, newValue: any, index: number){
     
      const item = this.resValueCodeModel[index];
      if (item) {
        if (fieldName === 'Description') {
          item.Value_Codes_Id = newValue; // Assuming 'Description' corresponds to 'Code'
        } else if (fieldName === 'Amount') {
          item.Amount = newValue;
        }
        // Call any additional logic or functions as needed
      }
      this.sendListToParent('ValueCode')  ;
    }
  
  
    AddNewOccSpanCode() {
      this.Gv.OSCrowAdded = true;
      // if( this.responseOccurenceSpanModel==undefined){
      //   this.responseOccurenceSpanModel=[];
      // }
          let noofdel = 0;
          for (var i = 0; i < this.responseOccurenceSpanModel.length; i++) {
              if (this.responseOccurenceSpanModel[i].Isdeleted) {
                  noofdel++;
              }
          }
          if (this.responseOccurenceSpanModel.length - noofdel + 2 <= 4) {
            for (let i = 0; i < 2; i++) {
                var cp: OccurenceSpanModel;
                cp = new OccurenceSpanModel();
                cp.Isdeleted = false;
                this.responseOccurenceSpanModel.push(cp);
            }
        } 
      
  }


  

  deleteOccurrenceCodePair(index: number) {
   this.Gv.OCrowAdded = false;
    // Check if the index is valid
    if (index >= 0 && index < this.responseOccurrenceCodeModel.length) {
      if (index % 2 === 0) {
        // If even, mark index and index+1 as deleted
        this.responseOccurrenceCodeModel[index].Isdeleted = true;
        this.responseOccurrenceCodeModel[index + 1].Isdeleted = true;
      } else {
        // If odd, mark index and index-1 as deleted
        this.responseOccurrenceCodeModel[index].Isdeleted = true;
        this.responseOccurrenceCodeModel[index - 1].Isdeleted = true;
      }
  
      // Filter out items marked as deleted
      this.responseOccurrenceCodeModel = this.responseOccurrenceCodeModel.filter(item => !item.Isdeleted);
    
      this.sendListToParent('occurrenceCode')  ;
    }
  }


  /////////////Splice Method////////////////
  // deleteOccSpanCodePair(index: number) {
  //   debugger
   
  //   if (index >= 0 && index < this.responseOccurenceSpanModel.length) {
  //     if (index % 2 === 0) {
        
  //       this.responseOccurenceSpanModel.splice(index, 2);
  //     } else {
        
  //       this.responseOccurenceSpanModel.splice(index - 1, 2);
  //     }
  //   }

  //   this.responseOccurenceSpanModel=this.responseOccurenceSpanModel
  // }



  deleteValueCodeRange(index: number) {
    this.Gv.VCrowAdded = false;
    // Check if the index is valid
    if (index >= 0 && index < this.resValueCodeModel.length) {
        // Calculate the start and end indices of the range based on the provided index
        const rangeStart = Math.floor(index / 4) * 4; // Round down to the nearest multiple of 4
        const rangeEnd = rangeStart + 3; // The range includes 4 items (0 to 3)

        // Mark all items in the range as deleted
        for (let i = rangeStart; i <= rangeEnd && i < this.resValueCodeModel.length; i++) {
            this.resValueCodeModel[i].Isdeleted = true;
        }

        // Filter out items marked as deleted
        this.resValueCodeModel = this.resValueCodeModel.filter(item => !item.Isdeleted);
    }
    this.sendListToParent('ValueCode')  ;
}


  deleteConditionCode(index: number) {
   this.Gv.CCrowAdded = false;
       this.responseConditionCodeModel[index].Isdeleted = true;
       this.responseConditionCodeModel = this.responseConditionCodeModel.filter(item => !item.Isdeleted);
       this.sendListToParent('ConditionCode')  ;
     }
  deleteOccSpanCodePair(index: number) {
   
  this.Gv.OSCrowAdded = false;
    if (index >= 0 && index < this.responseOccurenceSpanModel.length) {
      // Check if the item at the specified index should be marked as deleted
      if (index % 2 === 0) {
        this.responseOccurenceSpanModel[index].Isdeleted = true;
        this.responseOccurenceSpanModel[index + 1].Isdeleted = true;
      } else {
        this.responseOccurenceSpanModel[index].Isdeleted = true;
        this.responseOccurenceSpanModel[index - 1].Isdeleted = true;
      }
  
      // Filter out items marked as deleted
      this.responseOccurenceSpanModel = this.responseOccurenceSpanModel.filter(item => !item.Isdeleted);
      this.sendListToParent('occurenceSpan')  ;
    }
  }


 

    AddNewOccurrenceCode() {
     this.Gv.OCrowAdded = true;
      // if( this.responseOccurrenceCodeModel==undefined){
      //   this.responseOccurrenceCodeModel=[];
      // }
      
          let noofdel = 0;
          for (var i = 0; i < this.responseOccurrenceCodeModel.length; i++) {
              if (this.responseOccurrenceCodeModel[i].Isdeleted) {
                  noofdel++;
              }
          }
          if (this.responseOccurrenceCodeModel.length - noofdel + 2 <= 8) {
            for (let i = 0; i < 2; i++) {
                var cp: OccurrenceCodeModel;
                cp = new OccurrenceCodeModel();
                cp.Isdeleted = false;
                this.responseOccurrenceCodeModel.push(cp);
            }
        }    
  }
  

AddNewValueCode() {
   this.Gv.VCrowAdded = true;
    // if( this.resValueCodeModel==undefined){
    //   this.resValueCodeModel=[];
    // }
    

    let noofdel = 0;
    for (var i = 0; i < this.resValueCodeModel.length; i++) {
        if (this.resValueCodeModel[i].Isdeleted) {
            noofdel++;
        }
    }
    if (this.resValueCodeModel.length - noofdel + 4 <= 12) {
        for (let i = 0; i < 4; i++) {
            var cp: ValueeCode; // Assuming ValueCode is the type of objects in resValueCodeModel
            cp = new ValueeCode(); // Assuming ValueCode has a constructor
            cp.Isdeleted = false; // Assuming Isdeleted is a property of ValueCode
            this.resValueCodeModel.push(cp);
        }
    }
}


  AddNewConditionCode() {
   this.Gv.CCrowAdded = true;
    // if( this.responseConditionCodeModel==undefined){
    //   this.responseConditionCodeModel=[];
    // }
    
        let noofdel = 0;
        for (var i = 0; i < this.responseConditionCodeModel.length; i++) {
            if (this.responseConditionCodeModel[i].Isdeleted) {
                noofdel++;
            }
        }
        if (this.responseConditionCodeModel.length - noofdel == 11) {
          return;
      }
      var cp: ConditionCodeModel;
      cp = new ConditionCodeModel();
      cp.Isdeleted = false;
      this.responseConditionCodeModel.push(cp);  
}








  getCombinedCodeData() {


    this.API.getData('/UBClaim/GetAllCodesData').subscribe(
      data => {
        if (data.Status === 'Sucess') {    
          this.combinedCodeViewModel=data.Response;
          this.cd.detectChanges();
        }
      },
      (error: any) => {
        // Handle errors here
        console.error('An error occurred:', error);
      }
    );
  }





}







