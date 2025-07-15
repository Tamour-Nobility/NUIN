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


export class AccountAssigneeModel{
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

export class AccountAssigneeNotes{
    Notes_ID_AL: any;
    AccountAssignee_notes_ID:any;
    Account_notes:any;
    Name:any;
    Deleted:any;
    Created_By:any;
    Created_Date:any;
    Modified_By:any;
    Modified_Date:any;
    modification_allowed:any;
}


export class EditAccountAssigneeModel{
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


