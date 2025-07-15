export class SelectedUsers{
    Id:any;
    UserName:any;
    Name: any
    FullName: any;
    constructor(private _ID?:any, private _um?:any, private n?:any, private fm?:any ){
        this.Id=_ID;
        this.UserName=_um;
        this.Name=n;
        this.FullName=fm;
    }
}

export class GetSelectedUsers{
    Id:any;
    UserName:any;
    Name: any
    FullName: any;
}


export class ClaimAssigneeModel{
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


export class claimAssigneedataforclaim{
    DOS:string;
    Claim_Total:number;
    Amt_Due:number;
    Amt_Paid:number;
    Attending_Physician:number;
    Billing_Physician:number;
    Provider_Name:string;
}


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


export class ReportforAccountasssignee{
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
    Created_Date:any;
}


export class Reportforclaimasssignee{
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
    Created_Date:any;
}

export class ClaimAssigneeNotes{
    Notes_ID: any;
    ClaimAssignee_notes_ID:any;
    Claim_notes:any;
    Name:any;
    Deleted:any;
    Created_By:any;
    Created_Date:any;
    Modified_By:any;
    Modified_Date:any;
    modification_allowed:any;
}


export class ClaimAssigneeNotifications{
    Status:string;
    Priority:string;
    Start_Date:string;
    Due_Date:string;
    AssignedBy_FullName:string;
    ClaimNo:number;
}

export class AccountAssigneeNotifications{
    Status:string;
    Priority:string;
    Start_Date:string;
    Due_Date:string;
    AssignedBy_FullName:string;
    PatientAccount:number;
}

export class Revenue_Codes
{revcode : string='';
description :string='';
}
