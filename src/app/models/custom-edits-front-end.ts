
export class CustomEdits_FrontEnd{
    Edit_id:any;
    Entity1: any;
    Field1:any;
    Operator: any;
    Value:any;
    Entity2:any;
    Field2:any;
    EditConditon :any='AND';
    ColumnName_List: any=[];
    ColumnName_List1:any=[];

    
}

export class CustomEdits_FrontEndList{
    
    Gcc_id:any; 
    Practice_Code:any;
    EditErrorMassage : any;
    EditName:any;
    EditDescirption:any;
    customedits: CustomEdits_FrontEnd[]=[new CustomEdits_FrontEnd()];
   // customeditss:CustomEdits_FrontEnd=[];
}