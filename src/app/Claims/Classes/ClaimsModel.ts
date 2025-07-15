import { SelectListViewModel,SelectListViewModelForProvider } from "../../../app/models/common/selectList.model";
import { AdmissionDetails, Admission_Detail, ClaimsUbDropdowns, UbClaimDropdowns } from "../ub04/Classes/ubclasses";



export class ClaimViewModel {
    PatientAccount: number;
    PracticeCode: number;
    ClaimModel: ClaimModel;
    Patient_Address: string;
    PTLReasonDetail: string = "";
    PTLReasonDoctorFeedback: string = "";
    PTLReasons: SelectListViewModel[];
    PatientInsuranceList: PatientInsuranceList[];
    claimInusrance: claimInusrance[];
    AttendingPhysiciansList: SelectListViewModel[];
    BillingPhysiciansList: SelectListViewModelForProvider[];
    PracticeLocationsList: SelectListViewModel[];
    ReferralPhysiciansList: SelectListViewModel[];
    UbClaimDropdown:ClaimsUbDropdowns;
    Admission_Details:Admission_Detail;
    POSList: POSList[];
    ClaimDiagnosisList: ClaimDiagnosisList[];
    claimCharges: claimCharges[];
    claimPayments: claimPayments[];
    claimNotes = new claimNotes;
    ClaimDate: string;
    DX1Description: string;
    DX1ExpiryDate: string;
    DX1EffectiveDate: string;
    DX2Description: string;
    DX2ExpiryDate: string;
    DX2EffectiveDate: string;
    DX3Description: string;
    DX3ExpiryDate: string;
    DX3EffectiveDate: string;
    DX4Description: string;
    DX4ExpiryDate: string;
    DX4EffectiveDate: string;
    DX5Description: string;
    DX5ExpiryDate: string;
    DX5EffectiveDate: string;
    DX6Description: string;
    DX6ExpiryDate: string;
    DX6EffectiveDate: string;
    DX7Description: string;
    DX7ExpiryDate: string;
    DX7EffectiveDate: string;
    DX8Description: string;
    DX8ExpiryDate: string;
    DX8EffectiveDate: string;
    DX9Description: string;
    DX9ExpiryDate: string;
    DX9EffectiveDate: string;
    DX10Description: string;
    DX10ExpiryDate: string;
    DX10EffectiveDate: string;
    DX11Description: string;
    DX11ExpiryDate: string;
    DX11EffectiveDate: string;
    DX12Description: string;
    DX12ExpiryDate: string;
    DX12EffectiveDate: string;
    ResubmissionCodes: SelectListViewModel[]
    constructor() {
        this.AttendingPhysiciansList = [];
        this.BillingPhysiciansList = [];
        this.POSList = [];
        this.ReferralPhysiciansList = [];
        this.PatientInsuranceList = [];
        this.POSList = [];
        this.PTLReasons = [];
        this.Admission_Details=new Admission_Detail();
        this.UbClaimDropdown= new ClaimsUbDropdowns();
        // this.ClaimDiagnosisList = [];
        this.claimInusrance = [];
        this.claimPayments = [];
        this.claimCharges = [];
        this.ClaimModel = new ClaimModel();
        this.ResubmissionCodes = [];
    }
}
export class PatientInsuranceList {
    InsurancePayerName: string = "";
    PatientInsuranceResponse = new PatientInsuranceResponse;
}
export class claimCharges {
    Description: string = "";
    amt: string;
    Drug_Code: string;
    IsAnesthesiaCpt:boolean;
    claimCharges = new ClaimCharges;
    NDCCodeList: SelectListViewModel[] = [];
}
export class claimInusrance {
    InsurancePayerName: string = "";
    SubscriberName: string;
    Status277: string = "";
    claimInsurance = new ClaimInusrance;
}
export class claimPayments {
    InsurancePayerName: string = "";
    claimPayments = new ClaimPaymentsList;
}
export class PTLReasons {
    ID: number;
    Name: string;
}
export class ClaimModel {
    Claim_No: number;
    Patient_Account: number;
    Bill_Date: string;
    DOS: string;
    Claim_Type:string;
    Location_Code: number;
    Attending_Physician: number;
    Billing_Physician: number;
    Supervising_Physician: number;
    Referring_Physician: number;
    Resource_Physician: any;
    PA_Number: any;
    Additional_Claim_Info: string;
    Referral_Number: any;
    ICN_Number: string;
    Is_Corrected: boolean;
    Facility_Code: number;
    Facility_Name: string;
    Hospital_From: string;
    Hospital_To: string;
    Pri_Status: string;
    Sec_Status: string;
    Oth_Status: string;
    Pat_Status: string;
    Attach_Type_Code: number;
    Claim_Status: string;
    Claim_Status_Date: string;
    Current_Visit: string;
    Allowed_Visit: string;
    Accident_Auto: boolean;
    Accident_Other: boolean;
    Employment: boolean;
    Accident_Emergency: string;
    Accident_Time: string;
    Accident_Date: string;
    Accident_State: string;
    Spinal_Manipulation_Condition_Code: string;
    Spinal_Manipulation_Description: string;
    Spinal_Manipulation_Xray_Availability: string;
    Phy_Exam_Code: string;
    Phy_Exam_Desc: string;
    Start_Care_Date: string;
    Last_Seen_Date: string;
    Current_Illness_Date: string;
    X_Ray_Date: string;
    Pri_Ins_Payment: number;
    Sec_Ins_Payment: number;
    Oth_Ins_Payment: number;
    Patient_Payment: number;
    Adjustment: number;
    Amt_Due: number;
    Amt_Paid: number;
    Claim_Total: number;
    DX_Code1: string;
    DX_Code2: string;
    DX_Code3: string;
    DX_Code4: string;
    DX_Code5: string;
    DX_Code6: string;
    DX_Code7: string;
    DX_Code8: string;
    DX_Code9: string;
    DX_Code10: string;
    DX_Code11: string;
    DX_Code12: string;
    AA: number;
    Pos: string;
    REBILL_DATE: string;
    PTL_Status: boolean;
    Delay_Reason_Code: string;
    Ref_Date: string;
    Add_CLIA_Number: string;
    Special_Program_Code: string;
    Print_Center: string;
    Injury_Date: string;
    Injury_Time: number;
    Epsdt_Services: string;
    HCFA_Note: string;
    Patient_Payment_Plan: string;
    Patient_Statement: string;
    Include_In_Sdf: string;
    Is_Self_Pay: boolean = false;
    Deleted: string;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    scan_no: string;
    resolve: string;
    practice_code:string;
    Reference_Number: string;
    Scan_Date: string;
    Response_Code: string;
    Condition_Code: string;
    Reference_Claim_No: string;
    Map_Claim_History: string;
    Weight: string;
    Archive: string;
    Arbitration: string;
    Last_Seen_Physician: string;
    Is_Draft: boolean;
    Draft_Patient_Account: string;
    Copay_Owed: string;
    Copay_Waived: string;
    Claims_Status_Code: string;
    Coded_By: string;
    Stop_Submission: string;
    Additional_Estatement: string;
    Last_statement_Sent_date: string;
    Last_Work_Date: string;
    BATCH_NO: string;
    Batch_Date: string;
    Plan_Code: string;
    Linked_Claims: string;
    Authorization_Req: string;
    PROMISED_AMT_WAIVE: string;
    PROMISED_AMT_WAIVE_DATE: string;
    PROMISED_AMT_WAIVE_BY: string;
    PROMISED_AMT: number;
    PROMISED_AMT_DATE: string;
    PROMISED_AMT_ENTERED_BY: string;
    DWC_ID: string;
    DWC_DETAIL_ID: string;
    Advance_Pat_Payment: string;
    PA_TRACKING_ID: string;
    Created_From: string;
    Modified_From: string;
    RSCode: number;
}
export class patientInsurance {
    InsurancePayerName: string = "";
    SubscriberName: string;
    patientInsurance = new PatientInsuranceResponse;
}
export class PatientInsuranceResponse {
    Patient_Insurance_Id: number;
    Patient_Account: number;
    Insurance_Id: number;
    Pri_Sec_Oth_Type: string;
    INSURANCE_NAME: string;
    Co_Payment: string;
    Deductions: number;
    Policy_Number: string;
    Group_Number: string;
    Effective_Date: string;
    Termination_Date: string;
    Subscriber: number;
    Relationship: string;
    Eligibility_Status: string;
    Eligibility_S_No: number;
    Eligibility_Enquiry_Date: string;
    Access_Carolina_Number: string;
    Is_Capitated_Patient: string;
    IS_Active:any
    Allowed_Visits: number;
    SubscriberID: number;
    SUBSCRIBER_NAME: string;
    Remaining_Visits: number;
    Visits_Start_Date: string;
    Visits_End_Date: string;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    Deleted: boolean;
    CCN: string;
    Group_Name: string;
    Created_From: string;
    MCR_Sec_Payer: string;
    MCR_Sec_Payer_Code: number;
    Eligibility_Difference: string;
    Filing_Indicator_Code: string;
    Filing_Indicator: string;
    Plan_type: string;
    coverage_description: string;
    Co_Payment_Per: number;
    Plan_Name: string;
    Plan_Name_Type: string;
    IsDeleted: boolean;
    PayerDescription: string;
    SubscriberName: string;

}
export class PTLReasonDetail {

}
export class PTLReasonDoctorFeedback {

}
export class AttendingPhysiciansList {
    Id: number;
    Name: string;
}
export class BillingPhysiciansList {
    Id: number;
    Name: string;
}
export class PracticeLocationsList {
    Id: number;
    Name: string;
}

export class ReferralPhysiciansList {
    Id: number;
    Name: string;
}

export class ClaimDiagnosisList {

}

export class ClaimPaymentsList {
    claim_payments_id: number;
    Claim_No: string;
    Payment_No: string;
    Payment_Type: string;
    Payment_Source: string;
    Date_Entry: string;
    Date_Entry_Original: string;
    hoursSinceAdded:number;
    Date_Adj_Payment: string;
    Date_Filing: string;
    Amount_Approved: number;
    Amount_Paid: number;
    Adj_Write_Off_Type: string;
    Amount_Adjusted: string;
    Details: string;
    Reject_Type: string;
    Reject_Amount: number;
    Paid_Proc_Code: string;
    Charged_Proc_Code: string;
    Units: string;
    Insurance_Id: number;
    Check_No: string;
    Cheque_Date: string;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    Deleted: boolean;
    EOB_CODE: string;
    ERA_CATEGORY_CODE: string;
    ERA_ADJUSTMENT_CODE: string;
    ICN: string;
    ERA_Rejection_CATEGORY_CODE: string;
    MODI_CODE1: string;
    MODI_CODE2: string;
    ENTERED_FROM: string;
    Sequence_No: string;
    Contractual_Amt: number;
    BATCH_NO: string;
    BATCH_DATE: string;
    DEPOSITSLIP_ID: number;
    IsRectify: string;
    modified_from: string;
    DepositDate: string;
    constructor(){
        this.hoursSinceAdded=0;
    }
}
export class Insurancemodel {
    InsurancePayerName: string = "";
    SubscriberName: string;
    Status277: string = "";
    claimInsurance = new ClaimInusrance;
    constructor() {
        this.claimInsurance = new ClaimInusrance;
    }
}
export class ClaimInusrances {
    InsurancePayerName: string = "";
    ClaimInusrance = new ClaimInusrance;
}
export class ClaimInusrance {
    Claim_Insurance_Id: number;
    Patient_Account: number;
    Claim_No: number;
    Insurance_Id: number;
    Pri_Sec_Oth_Type: string;
    Co_Payment: string;
    Deductions: number;
    Policy_Number: string;
    Group_Number: string;
    Effective_Date: string;
    Termination_Date: string;
    Subscriber: number;
    SubscriberName: string;
    Relationship: string;
    Is_Capitated_Claim: boolean;
    Allowed_Visits: number;
    Remaining_Visits: number;
    Visits_Start_Date: string;
    Visits_End_Date: string;
    Deleted: boolean;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    CCN: string;
    Group_Name: string;
    Print_Center: boolean;
    Corrected_Claim: boolean;
    ICN: string;
    Late_Filing: boolean;
    Late_Filing_Reason: string;
    MCR_SEC_Payer: string;
    MCR_SEC_Payer_Code: number;
    Notes: string;
    Send_notes: boolean;
    Certification_Number: string;
    Certification_Action: string;
    Certification_Issue_Date: string;
    Certification_Expiry_Date: string;
    Rej_Code: string;
    Response_Date: string;
    Send_Appeal: boolean;
    Admission_Type_Code: string;
    Admission_Source_Code: string;
    Patient_Status_Code: string;
    Filing_Indicator_Code: string;
    Filing_Indicator: string;
    Plan_type: string;
    Coverage_Description: string;
    Reconsideration: boolean;
    Medical_Notes: boolean;
    Claim_Status_Request: boolean;
    Co_Payment_Per: number;
    Plan_Name: string;
    PLAN_NAME_TYPE: string;
    Co_Insurance: string;
    Returned_Hcfa: boolean;
    Appeal_Required: boolean;
    Access_Carolina_Number: string;
}
export class ClaimCharges {
    claim_charges_id: number
    Claim_No: number
    Sequence_No: number
    Procedure_Code: string
    Alternate_Code: string
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
    isRevenue_CodeDisabled:boolean=true;
    Weight: string
    Condition_Indicator: string
    Amount: string;
    Notes: string
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
    NDCList: SelectListViewModel[] = [];
    NDCCodeList: SelectListViewModel[] = [];
    Physical_Modifier:string
}
export class NDC {
    ID: string;
    Name: string;
    Meta?: any;
}
export class claimChargess {
    InsurancePayerName: string = "";
    claimCharges = new claimCharges;
}
export class claimNotes {
    Response:response;
    Status:string;
    constructor () {
        this.Response=new response;
    }
}
class response {
     Claim_No: number ;
         Note_Id: number ;
         Note_Detail: string ;
         Scan_No: string ;
         Note_State: string ;
         No_of_Days: number ;
         Deleted: boolean ;
         Created_By: string ;
         Created_Date: string ;
         Modified_By: string ;
         Modified_Date: string ;
         Claim_Notes_Id: number ;
         Scan_Date: string ;
         Page_No: number ;
         SENT_APPEAL_ID: number ;
         Proposal_Amount: string ;
         Depositslip_Id: string ;
         IsAuto_Note:boolean
}
export class CPTRequest {
    ProviderCode: string;
    ProcedureCode: string;
    LocationCode: string;
    ModifierCode: string;
    FacilityCode: string;
    IsSelfPay: string;
    InsuranceID: string;
    PracticeCode: string;
    PracticeState: string;
    Alternate_Code: string;
    Dos_From:any;
}
export class POSList {
    POS_Code: string;
    POS_Name: string;
}
