
export class LoginViewModel {
    Username: string;
    Password: string;
}
export class AccessViewModel {
    userid: number;
    code: string;
}
export class CurrentUserViewModel {
    exp: number;
    iat: number;
    nbf: number;
    unique_name: string;
    role: string;
    userId: number;
    Practices: UserPracticeViewModel[]
    selectedPractice: UserPracticeViewModel;
    RolesAndRights: UserRolesAndRights[];
    Menu: string[]
    constructor() {
        this.Practices = [];
        this.selectedPractice = new UserPracticeViewModel();
        this.RolesAndRights = [];
        this.Menu = [];
    }

}
export class UserPracticeViewModel {
    PracticeCode: number
    PracticeName: string;
    Billing_Type:string;
    Division:number;
    ClaimNotePopUp:boolean;
}
export class UserRolesAndRights {
    UserId: number;
    UserName: string;
    Email: string;
    ModuleId: number;
    ModuleName: string;
    SubModuleId: number;
    SubModuleName: string;
    PropertyId: number;
    PropertyName: string;
    Route: string;
    RoleId:number;
    RoleName:string;
}


export class CountAssignedtasks{
    Claim_AssigneeID:number;
    Status:string;
    UserId:number;
    Name:string;
    UserName:string;
    Claim_no:number;
    Created_By:string;
    Practice_Code:number;
    due_date:string;
    Deleted:any;
    Created_Date:string;
    FirstName:string;
    LastName:string;
}