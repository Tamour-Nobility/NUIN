export class StandartCPTFee {
    Cpt_Standard_id: number;
    State: string;
    Cpt_Code: string;
    Cpt_Description: string;
    Cpt_Modifier: string;
    Non_Facility_Participating_Fee: number | null;
    Non_Facility_Non_Participating_Fee: number | null;
    Facility_Participating_Fee: number | null;
    Facility_Non_Participating_Fee: number | null;
    Deleted: boolean | null;
    Created_By: number;
    //export System.DateTime Created_Date { get; set; }
    Modified_By: number;
    // export System.DateTime Modified_Date { get; set; }
    Non_Facility_Participating_Fee_ctrl_Fee: number | null;
    Non_Facility_Non_Participating_Fee_ctrl_Fee: number | null;
    Facility_Participating_Fee_ctrl_Fee: number | null;
    Facility_Non_Participating_Fee_ctrl_Fee: number | null;
}

export class State {
    State_Code: number;
    State_Name: string;
}

export class Practice {
    Id: number;
    Name: string;
}

export class ProviderCptPlan {
    Provid_FName: string;
    Provid_LName: string;
    Provider_Cpt_Plan_Id: string;
    Practice_Code: number | null;
    Provider_Code: number | null;
    InsPayer_Id: number | null;
    Insurance_State: string;
    Location_Code: number | null;
    Facility_Code: number | null;
    Cpt_Plan: string;
    Percentage_Higher: number | null;
    Deleted: boolean | null;
    Created_By: number | null;
    Created_Date: string;
    Modified_By: number | null;
    Modified_Date: string;
    self_pay: boolean | null;
    PracticeName: string;
    ProviderName: string;
    LocationName: string;
    FacilityName: string;
}

export class ProviderCptPlan_Details {
    Provider_Cpt_Plan_Detail_Id: number;
    Provider_Cpt_Plan_Id: string;
    Cpt_Code: string;
    Cpt_Description: string;
    //.. added by Pir Ubaid - CPT with multiple descriptions
    Alternate_Code: string;
    //..
    Cpt_Modifier: string;
    // Added bY Hamza Akhlaq For Fee Sehedule
    Charges: string;
    Revenue_Code:string;
     Revenue_Description:string;
    Non_Facility_Participating_Fee: number | null;
    Non_Facility_Non_Participating_Fee: number | null;
    Facility_Participating_Fee: number | null;
    Facility_Non_Participating_Fee: number | null;
    Deleted: boolean | null;
    Created_By: number | null;
    //Created_Date: System | null;
    Modified_By: number | null;
    // Modified_Date: System | null;
    Pos: number | null;
    Contractual_Amt: number | null;
    Non_Facility_Participating_Fee_ctrl_Fee: number | null;
    Non_Facility_Non_Participating_Fee_ctrl_Fee: number | null;
    Facility_Participating_Fee_ctrl_Fee: number | null;
    Facility_Non_Participating_Fee_ctrl_Fee: number | null;
}

export class Post_ProviderCptPlan {
    Provider_Cpt_Plan_Id: string;
    Practice_Code!: String|number | null;
    Provider_Code!: number | null;
    InsPayer_Id!: number | null;
    Insurance_State!: string |null;
    Location_Code!: number | null;
    Facility_Code!: number | null;
    Cpt_Plan!: string;
    Percentage_Higher!: number | null;
    self_pay!: string | null;
}

export class check_providercptinformation{
    Practice_Code!:String| number ;
    Provider_Code!: number ; 
    Location_Code!: number ;
    Location_State!: string;
}

export class get_providercptinformation{
    Provider_Code!: number ; 
    location_code!: number ;
    Location_State!: string;
    provid_FName: string;
    provid_LName: string;
}


export class ProviderFeeScheduleSearchVM {
    PracticeCode: number;
    ProviderCode: number;
    State: string;
    FacilityCode: number;
    LocationCode: number;
    InsuranceId: number
    InsuranceOrSelfPay: string;
    FaciltiyOrLocation: string;
}

export class CreateProviderCPTPlanVM extends ProviderFeeScheduleSearchVM {
    StandardOrPercentAge: string;
    PercentageHigher: number;
    Customize: boolean;
    ModificationAllowed: boolean;
    Computed: boolean;
}

export class SearchCriteria {
    HCPCS_code:string;
    ndc_code:string;
    drug_name:string
    practice_code:string;

}
export class SearchCriteriaDX
{
    Diag_Code:string;
    Diag_Description:string;
}


export class NDCModel
{
    NDC_ID:number
    PKG_Qty:string
    HCPCS_code:string;
    ndc_code:string;
    labeler_name:string;
    drug_name:string
    effectivefrom:any
    effectiveto:any
    qualifer:string
    practice_code:String| number;
    description: string;
    constructor(){
        this.NDC_ID=0;
    }
}
export class DXModel 
{
    diag_code:string
    Diag_Description:string
    Diag_Effective_Date:string;
    Diag_Expiry_Date:string;
    ICD_version:string;
    Gender_Applied_On:string 
}

