import { IMyDate } from "mydaterangepicker";

export class OccurenceSpanModel{
 
  OSCID: any = 0;
  Practice_Code: number = 0;
  ClaimNo: number = 0;
  OccSpanCode: any = 0;
  DateFrom: string='';
  DateThrough: string='';
  Descriptions: any = "";
  Isdeleted: boolean = false;
}



export class OccSpanCode {
OccSpanCode = new OccurenceSpanModel();
}
export class OccurrenceCodeModel{

  OCID: any = 0;
  Practice_Code: number = 0;
  Claim_no: number = 0;
  OccCode: any = 0;
  Descriptions: any = "";
  Date2: string=''; // Using "?" indicates it's an optional property
 
   
  Isdeleted: boolean;
  constructor(){
    //this.Date2=new Date();
  }

// OCID:any=0;
// Practice_Code:number=0;
// Claim_no:number=0;
// OccCode:any=0;
// Descriptions:any;
// Date2?:string;
// Isdeleted:boolean;

}
export class OccCode {
OccCode = new OccurrenceCodeModel();
}


export class ConditionCodeModel {
  CCID: any = 0;
  Practice_Code: number = 0;
  Claim_No: number = 0;
  ConditionCode: any = 0;
  Descriptions: any = "";
  Date: string='';
  Isdeleted: boolean = false;
}

// export class ConditionCodeModel{

// CCID:any;
// Practice_Code:number;
// Claim_No:number;
// ConditionCode:any;
// Descriptions:any;
// Date:any;
// Isdeleted:boolean=false;

// }
export class CCOde {
    CCOde = new ConditionCodeModel();
}

export class ValueCode{

  ValueCode= new ValueeCode();
}

export class ValueeCode{


  
    VCID: any = 0; // Default value
    Practice_Code: number = 0; // Default value
    Claim_No: number = 0; // Default value
    Amount: any = 0; // Default value
    Value_Codes_Id: any = 0; // Default value
    Isdeleted: boolean = false; // Default value
    


}
export class Condition_Codes_List
{
Condition_Code :any;
Description :any;
}
export class Occurrence_Codes_List
{
Occ_Code :any=0;
Description:any;
}
 export class  Occurrence_Span_Codes_List
{
Occurrence_Span_Code :any
Description :any;
}

export class CombinedCodeViewModel{

    condition_Codes_List: Condition_Codes_List[];
    occurrence_Codes_List: Occurrence_Codes_List[];
    occurrence_Span_Codes_List: Occurrence_Span_Codes_List[];
    Value_CodesList :Value_Codes[];

    constructor()
{
this.condition_Codes_List=[];
this.occurrence_Codes_List=[];
this.occurrence_Span_Codes_List=[];
this.Value_CodesList=[];
}
}

export class UbClaimDropdowns{

  ValueCode:ValueCode[];
  CcOde :CCOde[];
  Occcode:OccCode[];
  OccspanCode:OccSpanCode[];

}


export class ListEmitterData {
    type: string;
    list: any[];
  }


  export class UBhospitalization{
    ID:any;
    TOBFacility:any;
    TOBCare:any;
    TOBSequence:any;
    PracticeCode:number;
    ClaimNo:number;
    AdmissionHour:any;
    AdmissionType:any;
    AdmissionSource:any;
    DischargeHour:any;
    DischargeStatus:any
  }
  export class allDropdowns{

Type_Of_AdmissionList:Type_Of_Admission[];
Type_of_facilityList:Type_of_facility[];
Discharge_StatusList:Discharge_Status[];
Source_of_AdmissionList:Source_of_Admission[];
sequence_of_careList:sequence_of_care[];
Type_of_CareList:Type_of_Care[];
constructor(){
this.Type_Of_AdmissionList=[];
this.Type_of_facilityList=[];
this.Discharge_StatusList=[];
this.Source_of_AdmissionList=[];
this.sequence_of_careList=[];
this.Type_of_CareList=[];


}

  }


  export class Type_Of_Admission {
Id : any;
Descriptions:any;
Deleted :any;
}
export class Type_of_facility {
Id : any;
Descriptions:any;
Deleted :any;
 }
 export class Type_of_Care {
 Id : any;
Descriptions:any;
Deleted :any;
 }
 export class sequence_of_care {
 Id : any;
 Descriptions:any;
 Deleted :any;
 }            
 export class Source_of_Admission {
Id : any;
Descriptions:any;
Deleted :any;
}
  export class Discharge_Status {
 Id : any;
 Descriptions:any;
 Deleted :any;
}
 export class Value_Codes {
Id : any;
Descriptions:any ;
Deleted :any;
}


export class Admission_Detail{



    Id:any=9; //primary key
    Type_Of_Admission_Id: any=0 ; 
    Admhour: any ='';
    AdmSource: any =0;
    Dischargehour: any ='';
    Discharge_status_Id: any=0 ;
    Type_of_Bill?:any=0;
    Claim_No: any =0;
    Practice_code:any=0; 
    
}

export class AdmissionDetails{
Id:any; //primary key
Type_Of_Admission_Id: any ; 
Admhour: any ;
AdmSource: any ;
Dischargehour: any ;
Discharge_status_Id: any ;
Type_of_Facility_Id: any ; //
Type_of_Care_Id: any ; //
Sequence_of_care_Id: any ;//
Claim_No: any ;
Practice_code:any; 
}


export class ClaimsUbDropdowns{

  ValueCode:ValueeCode[];
  CcOde:ConditionCodeModel[];
  OccCode:OccurrenceCodeModel[];
  OccSpanCode:OccurenceSpanModel[];
}



