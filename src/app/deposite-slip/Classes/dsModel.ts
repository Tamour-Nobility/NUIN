export class dsModel{
    Status:string;
    Response=new dsRequest;
}
export class searchModel{
    Status:string;
    Response=new DWCRequest;
}
export class DWCRequest {
    DWC_DepositSlip_ID: number;
    practice_code: string;
    from_date: string;
    to_date: string;
    check_No: string;
    BATCH_NO: string;
    By: string;
    AdvanceOption: string;
    TimeFrame: string;
    Method: string;
}

export class dsRequest {
    DWC_DepositSlip_ID: number;
    Payment_Date: string;
    Payment_Method: string;
    Insurance_id: number;
    check_No: string;
    Paid_Amount: string;
    Created_By: string;
    Created_Date: string;
    Modified_By: string;
    Modified_Date: string;
    Location_Code: number;
    REASON: string;
    PAYMENT_SOURCE: string;
    PAY_SOURCE: string;
    PAYMENT_TYPE: string;
    BATCH_NO: string;
    BATCH_DATE: string;
    Practice_Code: number;
    NOTES: string;
    REF_BATCH_NO: string;
    REG_BATCH: boolean;
    Paid_Amount_Other: string;
    TimeFrame:string;
}