export class claimPaymentModel {
    Status: string;
    Response: claimPayments[];
    constructor() {
        this.Response = [];
    }
}
export class claimPayment {
    InsurancePayerName: string = "";
    claimPayments = new claimPayments;
    constructor() {
        this.claimPayments = new claimPayments();
    }
}
export class claimPayments {
    [x: string]: any;
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
    Amount_Adjusted: any;
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
    DOS_From :string;
    Dos_To: string;
    Alternate_Code:String;
    T_payment_id:number;
}
export class EnteredFrom {
    EfId: number;
    EfName: string;
}

export interface AutoNotePayment {
    field: string;
    autoNote: string;
  }