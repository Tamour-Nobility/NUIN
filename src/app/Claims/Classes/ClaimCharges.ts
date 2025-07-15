import { SelectListViewModel } from "../../../app/models/common/selectList.model";
export class ClaimCharges {
    Description: string = "";
    amt: string;
    Drug_Code: string;
    IsAnesthesiaCpt:boolean
    claimCharges = new claimCharges();
    NDCCodeList: SelectListViewModel[] = [];
}
export class claimCharges {
    claim_charges_id: number
    Claim_No: number
    Sequence_No: number
    Procedure_Code: string;
    Alternate_Code: string; // Add this new property
    DOE: string
    Dos_From: string
    Dos_To: string
    POS: number
    DX_Pointer1: number
    DX_Pointer2: number
    DX_Pointer3: number
    DX_Pointer4: number
    Modi_Code1: string
    Modi_Code2: string
    Modi_Code3: string
    Modi_Code4: string
    Units: number
    Include_In_Edi: boolean
    Include_In_Sdf: boolean
    Unit_Time_Day: string
    PTL_Status: boolean
    Deleted: boolean
    Created_By: number
    Created_Date: string
    Modified_By: number
    Modified_Date: string
    Start_Time: string
    Stop_Time: string
    Drug_Code: string
    Revenue_Code: string
    isRevenue_CodeDisabled:boolean=true
    Weight: string
    Condition_Indicator: string
    Notes: string;
    Amount: string;
    
    NDC_Quantity: number
    NDC_Qualifier: string
    NDC_Service_Description: string
    Contractual_Amt: number
    Emergency_Related: string
    IsRectify: boolean
    Accession_No: string
    Batch_No: string
    Batch_Date: string
    Cpt_Type: string
    Authorized_Cpt: string
    Actual_amount: number
    Pointer_Flag: string
    NDCList: SelectListViewModel[];
    NDCCodeList: any[];
    Physical_Modifier:string
    constructor() {
        this.NDCList = [];
    }
    
}
export class NDC {
    ID: string;
    Name: string;
    Meta?: any;
}
export class charges {
    Status: string;
    Response: CCharges;
}
class CCharges {
    POS: number;
    Charges: string;
    Description: string;
    DefaultUnits: number;
    Revenue_Code:string;
    IsAnesthesiaCpt: boolean;
    NDCCodeList: SelectListViewModel[] = [];

}
class NDCCodeList {
    ID: string;
    Name: string;
    Meta?: any;
}