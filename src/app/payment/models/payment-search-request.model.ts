import { ClaimCharges } from '../../Claims/Classes/ClaimCharges'
import { claimInusrance } from '../../Claims/Classes/ClaimsModel'

export class PaymentSearchRequest {
    PaymentFrom: string;
    CheckNo: number;
    Facility: string;
    FacilityId: string;
    practice_code: string;
    PostedBy: string;
    BatchNo: number;
    PaymentId: number;
    PatientName: string;
    InsuranceName: string;
    InsuranceId: string;
    PaymentType: string;
    PaymentStatus: string;
    PaymentDateFrom: string;
    PaymentDateTo: string;
    
}


export class PatientPayment{
    batchNo:number 
    paymentTypeID:number
    patientName:string
    facilityID:number
    depositDate:Date
    amount:number
    patientAccount:number
    checkDate:Date
    checkNo:string
    prac_code:string
}
export class InsurancePayment{
    batchNo:number 
    InsuranceID:number
    PaymentTypeID:number
    facilityID:number
    depositDate:Date
    EOBDate:Date
    ReceivedDate:Date
    amount:number
    checkDate:Date
    checkNo:string
    NOtes:string
    prac_code:string
}

export class PaymentData{
Amount: string
PostedAmount:string
BatchNo: string
CheckDate: Date
CheckNo: string
ReceivedDate: Date
DepositDate: Date
EOBDate: Date
FacilityID: string
InsuranceID:string
PatientAccount: string
PatientName: string
PaymentTypeID: string
Notes:string
Facility_Name:string
Ins_name:string


constructor(psr) {
        this.PaymentTypeID = psr.PaymentType;
        this.CheckNo = psr.CheckNo;
        this.FacilityID = psr.Facility;
       // this.PostedBy = psr.PostedBy;
    }


}

export class ClaimsPaymentDetailModel{

    claims_no:number
    batch_no:number
    patientAccount:number
    userID:number
    PostedAmount:number;

    practiceCode:number
    ClaimModel: ClaimModel;
    claimPayments: claimPayments[];
    claimCharges: ClaimCharges[];
    claimInusrance: claimInusrance[];

    constructor(){
        this.claimPayments=[]

    }



}
export class ClaimModel {
    Claim_No: number;
    Patient_Account: number;
    Bill_Date: string;
    DOS: string;
    Location_Code: number;
    Attending_Physician: number;
    Billing_Physician: number;
    Supervising_Physician: number;
    Referring_Physician: number;
    PA_Number: string;
    Referral_Number: string;
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
    Accident_Auto: string;
    Accident_Other: string;
    Employment: string;
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
    Injury_Time: string;
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
export class claimPayments {
    InsurancePayerName: string = "";
    claimPayments:ClaimPaymentsList;
    constructor() {
        this.claimPayments = new ClaimPaymentsList();
    }
    
}
export class ClaimPaymentsList {
    claim_payments_id: number;
    Claim_No: number;
    Payment_No: number;
    Payment_Type: string;
    Payment_Source: string;
    Date_Entry: string;
    Date_Adj_Payment: string;
    Date_Filing: string;
    Amount_Approved: number;
    Amount_Paid: number;
    Amount_Adjusted: string;
    Adj_Write_Off_Type: string;
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
    DEPOSITSLIP_ID: string;
    IsRectify: string;
    modified_from: string;
    DepositDate: string;
    isfromPosting:boolean;
    constructor(){
        this.isfromPosting=false
    }
}
export class ClaimsDetails{
    claim_no:number;
    Patient_Account:number
    pri_status:string;
    Pat_Status:string;
    DOS:Date;
    Sec_Status:string;
    Oth_Status:string;
}

export class patientBasedClaim{
    practiceCode:number;
    PatientAccount:string;
    FacilityCode:string;
    Balance:number;

    constructor(){
        this.PatientAccount=null
        this.FacilityCode=null
        this.Balance=0
    }
}
export class insBasedClaim{
    practiceCode:number;
    InsId:string;
    FacilityCode:string;
    dateTo:Date;
    dateFrom:Date;
    Balance:number;

    constructor(){
        this.InsId=null
        this.FacilityCode=null
        this.Balance=0
    }
}

export class PostedClaims{
    claimId:number

    constructor(claimsIDs:any){
        this.claimId=claimsIDs;
    }
}

export class ClaimsPost{
    batchNo:number
    claimNo:string
    postAmount:number;
    
}
