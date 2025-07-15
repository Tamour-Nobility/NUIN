
export class ClaimAssigneeForUser{
    Claim_AssigneeID:number;
    Status:string;
    Priority:string;
    Start_Date:string;
    Due_Date:string;
    Assignedto_UserId:number;
    Assignedto_UserName:string;
    Assignedto_FullName:string;
    AssignedBy_UserId:number;
    AssignedBy_UserName:string;
    AssignedBy_FullName:string;
    PracticeCode:number;
    PatientAccount:number;
    PatientFullName:string;
    Claim_notes:string;
    ClaimNo:number;
    Claim_AmtDue:number;
    Claim_AmtPaid:number;
    Claim_Claimtotal:number;
    Claim_DOS:string;
    Claim_AttendingPhysician:number;
    Claim_BillingPhysician:number;
    ProviderFullName:string;
    countentries:number;
}

export class GetAccountAssigneeModel{
    Account_AssigneeID:number;
    Status:string;
    Priority:string;
    Start_Date:string;
    Due_Date:string;
    Assignedto_UserId:number;
    Assignedto_UserName:string;
    Assignedto_FullName:string;
    AssignedBy_UserId:number;
    AssignedBy_UserName:string;
    AssignedBy_FullName:string;
    PracticeCode:number;
    PatientAccount:number;
    PatientFullName:string;
    Account_notes:string;
}
