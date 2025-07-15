export class PanelBillingFrontEnd {
    Panel_Billing_Code_Id:number;
    Panel_Billing_Code_CPTId:number;
    CPTCode: any;
    CPTDescription:any;
    AlternateCode: any;
    Units:any;
    Charges : any;
    EditConditon :any='AND';
    M_1: any;
    M_2:any;
    M_3: any;
    M_4:any;
    isDisabled?: boolean; // Add the optional `isDisabled` property
}

export class PanelBillingFrontEndList{
    
    Gcc_id:any; 
    Practice_Code:any;
    EditErrorMassage : any;
    EditName:any;
    EditDescirption:any;
    customedits: PanelBillingFrontEnd[]=[new PanelBillingFrontEnd()];
   // customeditss:CustomEdits_FrontEnd=[];
}