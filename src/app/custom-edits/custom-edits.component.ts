import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { APIService } from '../components/services/api.service';
import { IMyDpOptions } from 'mydatepicker/dist/interfaces/my-options.interface';
import { Common } from '../services/common/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomEdits_FrontEnd, CustomEdits_FrontEndList } from '../models/custom-edits-front-end';
import { GvarsService } from '../services/G_vars/gvars.service';
import { AuthService } from '../services/auth/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { ToastrService } from 'ngx-toastr';
import { trackByHourSegment } from 'angular-calendar/modules/common/util';
import { CurrentUserViewModel } from '../models/auth/auth';





@Component({
  selector: 'app-custom-edits',
  templateUrl: './custom-edits.component.html',
  styleUrls: ['./custom-edits.component.css']
})

export class CustomEditsComponent implements OnInit {

  showConfirmation = false;
  numRowsToDisplay: number = 0;
  customedits: CustomEdits_FrontEnd[]=[new CustomEdits_FrontEnd()];
  customEditsList = new CustomEdits_FrontEndList()
   EditID:any;
   PracticeCode: any;
   TableName1:any;
   SelectedColumn1: string | null = null;
   Operators = [
    { value: '>', displayName: 'Greater than' },
    { value: '<', displayName: 'Less than' },
    { value: '=', displayName: 'Equal' },
    { value: '<>', displayName: 'Not Equal' },
    { value: '>=', displayName: 'Greater than or equal to' },
    { value: '<=', displayName: 'Less than or equal to' }, ];
   Value:any;
   TableName2:any;
   SelectedColumn2: string | null = null;
   ErrorMessage:any;
   Editdescription:any;
   Editname:any;
   Conditon:any;
   TableList:any[]=[];
   ColumnName_List: any=[];
   ColumnName_List1:any=[];
   SelectedColumn:any;
   columnList:any=[];
   Column2:string;
   Add:any;
   Entervalue: 'Enter Value';
   CustomValue:any='CustomValue';
   UserDefineValue:any=[];
   Operator: any;
  isViewMode = false; 
  isFromposting = false; 
  CustomEdits_FrontEnd: CustomEdits_FrontEnd[]=[new CustomEdits_FrontEnd()];
  customEdits_Edit = [];
  CustomEditsdata :any=[];
  loggedInUser: CurrentUserViewModel;
  Menus:any=[];
  Menu: string[];
  DOS:any;
  disableCrossButton: boolean = false;
  today = new Date();
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy-mm-dd',
    height: '25px',
    width: '100%',
    disableSince: {
       day: this.today.getDate() + 1,
        month: this.today.getMonth() + 1,
        year: this.today.getFullYear(),
    },
};
  id: any;
  type: any;
  customFormValues: any=[];
  ViewMode: boolean = false;
  CancelViewMode:boolean=false;
  constructor(public API: APIService,
              private route:ActivatedRoute,
              private router:Router,
              private cd:ChangeDetectorRef ,
              private toaster: ToastrService, ) { 
                          this.customedits=[];
                          this.route.params.subscribe(params => {
                          this.id = params['id']; 
                          this.type = params['type'];
    });
  }


  ngOnInit() 
  {
    
   this.getColumnList();
   this.getTableList();
   this.AddRowForCustomEdits();
   if(this.type == 'edit' )
   {
    this.getEditDataById();
   }
   if(this.type == 'view' )
   {
    this.getEditDataForView();
  
   }
}

HandlePriviousselectionofEntity(ndx :any){
  if(this.customedits[ndx].Entity1!=='' || this.customedits[ndx].Entity1!==null || this.customedits[ndx].Entity1!==undefined ){
      this.customedits[ndx].Field1="";
  }
}

HandlePriviousselectionofEntityForEntity2(ndx : any){
  if(this.customedits[ndx].Entity2 !=='' || this.customedits[ndx].Entity2 !==null || this.customedits[ndx].Entity2 !==undefined ){
    this.customedits[ndx].Field2="";
}
}

SelectemptyValueCase(value:any,ndx:any){
  debugger;
  if (value=="" || value==undefined) {
    this.customedits[ndx].Field1=""
}

}


SelectemptyValueCase1(value:any,ndx:any){
  debugger;
  if (value=="" || value==undefined) {
    this.customedits[ndx].Field2=""
}


}


AddRowForCustomEdits() {
    debugger;
    if (this.customedits.length === 0)
    {
      this.customedits.push(new CustomEdits_FrontEnd());
    } 
    else if (this.customedits.length && this.customedits.length < 5)
    {
     
      const firstRow = this.customedits[0];
      const newIndex = this.customedits.indexOf(this.customedits[this.customedits.length - 1]);
    if (this.customedits[newIndex].Field1 != null && this.customedits[newIndex].Field1 !== ''&&
        this.customedits[newIndex].Operator!=''&&this.customedits[newIndex].Operator!=null)
    {
          this.customedits.push(new CustomEdits_FrontEnd());
    } 
    }
   
  }
  
  
updateCustomRulesProperty(ndx: number, property: string, value: any) {
   debugger;
    this.customedits[ndx] = {
        ...this.customedits[ndx],
        [property]: value || null,
    };
    this.cd.detectChanges();
}
  

getTableList() {
  debugger;
  this.API.getData('/Scrubber/GetTableList').subscribe(
    (data: any) => {
    if (data && Array.isArray(data.Response)) 
    {
        this.TableList = data.Response; 
    } 
    },
  );
}


getColumsList_againstTable(getcolumnlist: any,ndx: number, property: string) {
  debugger;
  const apiUrl = '/Scrubber/GetColumsList';
  const requestData = { TableName: getcolumnlist.Entity1 };
  this.API.PostData(apiUrl, requestData, (columns: any) => {
  this.updateCustomRulesProperty(ndx,property,columns.Response);
  });
}

getColumsList_on_Edit(getcolumnlist: any,ndx: number, property: string) {
  debugger;
  const apiUrl = '/Scrubber/GetColumsList';
  const requestData = { TableName: getcolumnlist };
  this.API.PostData(apiUrl, requestData, (columns: any) => {
//  this.updateCustomRulesProperty(ndx,property,columns.Response);
debugger;
  this.customedits[ndx].ColumnName_List=columns.Response;
  });
}

getColumsList_on_EditForList1(getcolumnlist1 :any,ndx: number, property: string) {
  debugger;
  const apiUrl = '/Scrubber/GetColumsList';
  const requestData = { TableName: getcolumnlist1 };
  this.API.PostData(apiUrl, requestData, (columns: any) => {
//  this.updateCustomRulesProperty(ndx,property,columns.Response);
  debugger;
  this.customedits[ndx].ColumnName_List1=columns.Response;
  });
}


getColumsList_againstTable1(getcolumnlist1 :any,ndx: number, property: string) {
  const apiUrl = '/Scrubber/GetColumsList';
  const requestData = { TableName: getcolumnlist1.Entity2 };
  this.API.PostData(apiUrl, requestData, (columns: any) => {
  this.updateCustomRulesProperty(ndx,property,columns.Response);
  });
}


AddCustomEdits() {
  for (let i = 0; i < this.customedits.length; i++) {
    const a = this.customedits[i];

    if (Array.isArray(a.Field1)) {
      a.Field1 = a.Field1.join(); 
    }
    if (Array.isArray(a.Field2)) {
      a.Field2 = a.Field2.join(); 
    }
  }

  this.customEditsList.Gcc_id = this.EditID;
  this.getValue('PracticeCode');
  this.customEditsList.Practice_Code = this.PracticeCode;
  this.customEditsList.EditName = this.Editname;
  this.customEditsList.EditDescirption = this.Editdescription;
  this.customEditsList.EditErrorMassage = this.ErrorMessage;
  this.customEditsList.customedits = this.customedits;

  for (let ndx = 0; ndx < this.customedits.length; ndx++) {
    const customedits = this.customedits[ndx];

    if (customedits.Entity1 == null || customedits.Entity1 == undefined || customedits.Entity1 == "") {
      this.toaster.error("Entity1 is Empty");
      return;
    }
    if (customedits.Field1 == null || customedits.Field1 == undefined || customedits.Field1 == "") {
      this.toaster.error("Field1 is Empty");
      return;
    }
    if (customedits.Field1 == 'DOS' || customedits.Field1 == 'DeathDate' || customedits.Field1 == 'Date_Of_Birth' ||
        customedits.Field1 == 'Bill_Date' || customedits.Field1 == 'Hospital_From' || customedits.Field1 == 'Hospital_To' ||
        customedits.Field1 == 'Accident_Date' || customedits.Field1 == 'Last_Seen_Date' || customedits.Field1 == 'Current_Illness_Date' ||
        customedits.Field1 == 'Injury_Date') {
      if (customedits.Operator == null || customedits.Operator == undefined || customedits.Operator == "") {
        this.toaster.error("Operator is Empty");
        return;
      }
      if (customedits.Entity2 !== null && customedits.Entity2 !== undefined && customedits.Entity2 !== "") {
        if (customedits.Field2 == null || customedits.Field2 == undefined || customedits.Field2 == "") {
          this.toaster.error("Field2 is Empty");
          return;
        }
      }

      if (this.Editname === null || this.Editname === "" || this.Editname === undefined) {
        this.toaster.error("Edit Name is Empty");
        return;
      }
      if (this.Editdescription === null || this.Editdescription === "" || this.Editdescription === undefined) {
        this.toaster.error("Edit Description is Empty");
        return;
      }
      if (this.ErrorMessage === null || this.ErrorMessage === "" || this.ErrorMessage === undefined) {
        this.toaster.error("Error Message is Empty");
        return;
      }
    } else {
      if (customedits.Entity1 == null || customedits.Entity1 == undefined || customedits.Entity1 == "") {
        this.toaster.error("Entity1 is Empty");
        return;
      }
      if (customedits.Operator == null || customedits.Operator == undefined) {
        this.toaster.error("Operator is Empty");
        return;
      }

      if (customedits.Value == null || customedits.Value == undefined || customedits.Value === "") {
        if (customedits.Entity2 == null || customedits.Entity2 == undefined || customedits.Entity2 === "" &&
            customedits.Field2 == null || customedits.Field2 == undefined || customedits.Field2 === "") {
          this.toaster.error("Entity2 & Field2 is Empty");
          return;
        }
      }
      if (customedits.Entity2 == null || customedits.Entity2 == undefined &&
          customedits.Field2 == null || customedits.Field2 == undefined) {
        if (customedits.Value == null && customedits.Value == undefined) {
          this.toaster.error("Value is Empty");
          return;
        }
      }

      if (customedits.Entity2 !== null && customedits.Entity2 !== undefined) {
        if (customedits.Field2 == null || customedits.Field2 == undefined) {
          this.toaster.error("Field2 is Empty");
          return;
        }
      }

      if (this.Editname === null || this.Editname === "" || this.Editname === undefined) {
        this.toaster.error("Edit Name is Empty");
        return;
      }
      if (this.Editdescription === null || this.Editdescription === "" || this.Editdescription === undefined) {
        this.toaster.error("Edit Description is Empty");
        return;
      }
      if (this.ErrorMessage === null || this.ErrorMessage === "" || this.ErrorMessage === undefined) {
        this.toaster.error("Error Message is Empty");
        return;
      }
    }
  }

  this.API.PostData('/Scrubber/AddCustom_Edits_Rules/', this.customEditsList, (d) => {
    this.router.navigateByUrl('claimsubmission/scrubber/update');
  });

  this.CancelViewMode = true;
}




resetFields() {
  this.customEditsList.Gcc_id = ''; 
  this.PracticeCode = ''; 
  this.Editname = ''; 
  this.Editdescription = ''; 
  this.ErrorMessage = ''; 
  if (this.customedits && this.customedits.length > 0) {
    for (let i = 0; i < this.customedits.length; i++) {
      this.customedits[i] = new CustomEdits_FrontEnd(); 
    }
  }
  this.customEditsList = {
    Gcc_id: '', 
    Practice_Code: '', 
    EditName: '', 
    EditDescirption: '', 
    EditErrorMassage: '', 
    customedits: this.customedits, 
  };
}

CancelFields() {
  this.customEditsList.Gcc_id = ''; 
  this.PracticeCode = ''; 
  this.Editname = ''; 
  this.Editdescription = ''; 
  this.ErrorMessage = ''; 
  if (this.customedits && this.customedits.length > 0) {
    for (let i = 0; i < this.customedits.length; i++) {
      this.customedits[i] = new CustomEdits_FrontEnd(); 
    }
  }
  this.customEditsList = {
    Gcc_id: '', 
    Practice_Code: '', 
    EditName: '', 
    EditDescirption: '', 
    EditErrorMassage: '', 
    customedits: this.customedits, 
  };
  swal('Validation', 'From Date cannot be greater than To Date', 'warning');
  
}

confirmFun(title: string, text: string, yesCallback: () => void, noCallback: () => void) {
  swal({
    title: title,
    text: text,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.value) {
      // User clicked "Yes"
      yesCallback();
    } else {
      // User clicked "No, keep it"
      noCallback();
    }
  });
}

showConfirmationDialog() {
  this.confirmFun('Confirmation', 'Are you sure you want to cancel?', () => {
    this.onYesClick();
  }, () => {
    this.onNoClick();
  });
}

onNoClick(): any {
  this.router.navigateByUrl('claimsubmission/scrubber/update')
  // this.resetFields();
}

onYesClick(): any {

}

getValue(key: string): any {
  if( localStorage.getItem('sp') === null)
  {
    this.PracticeCode = {PracticeCode: '1010999'}
    this.PracticeCode = Number(this.PracticeCode['PracticeCode']);
  }
  else
  {
    this.PracticeCode=JSON.parse(localStorage.getItem('sp'));
    this.PracticeCode= this.PracticeCode['PracticeCode'];
    this.PracticeCode= Number(this.PracticeCode);
  }
  
}

getEditDataById() {
  
  this.API.getData('/Scrubber/GetCustomRuleById/' + this.id).subscribe(
    (data) => {
      this.customedits = this.mapDataToCustomEdits(data.Response);
      this.ViewMode = false;
      this.disableCrossButton = true;

      
    }
  );
}

mapDataToCustomEdits(data: any[]): CustomEdits_FrontEnd[] {
  let ind=0;
  return data.map((item) => {

    debugger;
    const customEditsList = new CustomEdits_FrontEndList();
    const customEdit = new CustomEdits_FrontEnd();
    customEdit.Entity1 = item.Entity1;
   customEdit.ColumnName_List[ind] = item.Field1;
    customEdit.Field1=customEdit.ColumnName_List[ind];
    customEdit.Operator = item.Operator;
    customEdit.Value = item.Value;
    customEdit.Entity2 = item.Entity2;
    customEdit.ColumnName_List1[ind]= item.Field2;
    customEdit.Field2=customEdit.ColumnName_List1[ind];
    customEdit.Edit_id=item.Edit_id;
    if(item.Edit_Name!=''&&item.Edit_Name!=''){
      this.Editname=item.Edit_Name;
      this.Editdescription=item.Edit_Description;
      this.ErrorMessage=item.ErrorMessage;
    }
    this.EditID=item.Gc_id;
    customEditsList.customedits.push(customEdit);
    this.getColumsList_on_Edit(customEdit.Entity1,ind,this.ColumnName_List)
    this.getColumsList_on_EditForList1(customEdit.Entity2,ind,this.ColumnName_List1)
    ind++;
    return customEdit;
  });
}

DeleteRowOfCustomRule(index: number) {
  if (index >= 0 && index < this.customedits.length) {
    if (this.customedits.length > 1) 
    { 
      this.customedits.splice(index, 1);
    } 
  }
}

getEditDataForView(){
  this.API.getData('/Scrubber/GetCustomRuleById/' + this.id).subscribe(
    (data) => {
      this.customedits = this.mapDataToCustomEdits(data.Response);
      this.ViewMode = true;
      this.disableCrossButton = true;


    }
  );
}

onDateChangedForDate(event,ndx) {
  debugger;
  this.customedits[ndx].Value = event.formatted;
  this. updateCustomRulesDateValue(ndx)
  }
  updateCustomRulesDateValue(ndx: any) {
    debugger;
     this.customedits[ndx] = {
         ...this.customedits[ndx],
     };
     this.cd.detectChanges();
 }

  getColumnList(){

    this.API.getData('/Scrubber/GetColumn_Lists_FrontEnd').subscribe(
      data => {
        // console.log("data.Response",data)
        this.ColumnName_List = data;
        // this.ColumnName_List.Table_Name=data;
       console.log("ColumnName_List",this.ColumnName_List)
  
      }
    );
    
  }

 
getCustomEdits(){
  debugger
  this.API.getData('/Scrubber/GetAllCustomEdits').subscribe(
    data=>{
       this.CustomEditsdata=data;
    }
  )
}

dateMask(event: any) {
  Common.DateMask(event);
}

isDisabled(entity2Value: string): boolean {
  // If entity2Value is empty, return true (disabled), otherwise return false (enabled)
  return !!entity2Value;
}
}



