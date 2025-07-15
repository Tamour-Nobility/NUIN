import { SelectListViewModel } from '../../models/common/selectList.model';


export class Company {
    CompanyId: number;
    CompanyName: string;
    IsActive: boolean;
}

export class Department {
    DepartmentId: number;
    DepartmentName: string;
    CompanyId: number;
    OfficeId: number;
    Deleted: boolean | null;
    CreatedBy: number | null;
    CreatedDate: string | null;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
    CompanyName: string;
    OfficeName: string;
}

export class Office {
    OfficeId: number;
    CompanyId: number;
    OfficeName: string;
    Address: string;
    PhoneNo: string;
}

export class Shift {
    ShiftId: number;
    ShiftName: string;
}


export class Designation {
    DesignationId: number;
    DesignationName: string;
    Deleted: boolean | null;
    CreatedBy: number | null;
    CreatedDate: string | null;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
    DepartmentID: number | null;
    Department_Head: boolean | null;
}

export class Team {
    TeamId: number;
    TeamName: string;
    TeamSupervisor: string;
    TeamLead: string;
    TeamBackupLead: string;
    TeamShift: number;
    CompanyId: number;
    Company: number;
    OfficeId: number;
    DepartmentId: number;
    CreatedBy: number | null;
    CreatedDate: string | null;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
    Deleted: boolean | null;
    TeamType: string;
    DepartmentName: string;
    CompanyName: string;
    OfficeName: string;
}

export class dropdownClass {
    TeamId: number;
    CompanyId: number;
    OfficeId: number;
    ShiftId: number;
    DepartmentId: number;
    constructor() {
        this.TeamId = 0;
        this.CompanyId = 0;
        this.OfficeId = 0;
        this.ShiftId = 0;
        this.DepartmentId = 0;
    }
}

export class Module {
    Module_Id: number;
    Module_Name: string;
    SubModules: any[];
    CreatedBy: number;
    CreatedDate: Date;
    ModifiedBy: number;
    ModifiedDate: Date;
    Deleted: boolean;
    CreatedByString: string;
    ModifiedByString: string;
    constructor() {
        this.Module_Id = 0;
        this.Module_Name = '';
        this.SubModules = [];
    }
}

export class Role {
    RoleId: number;
    RoleName: string;
    CreatedBy: number;
    CreatedDate: Date;
    ModifiedBy: number;
    ModifiedDate: Date;
    Deleted: boolean;
    constructor() {
    }
}

export class SubModuleProperties {
    Property_Id: number;
    Property_Name: string;
    Sub_Module_Id: number;
    Sub_Module_Name: string;
    CreatedBy: number;
    CreatedDate: Date;
    ModifiedBy: number;
    ModifiedDate: Date;
    Deleted: boolean;
    subModule: SubModule;
    ModuleId: number;
    ModuleName: string;
    /**
     *
     */
    constructor() {
        this.subModule = new SubModule();
    }
}

export class SubModule {
    Sub_Module_Id: number;
    Module_Id: number;
    Sub_Module_Name: string;
    Module_Name: string;
    CreatedBy: number;
    CreatedDate: Date;
    ModifiedBy: number;
    ModifiedDate: Date;
    Deleted: boolean;
    module: Module;
    IsDefaultPropertiesCheck: boolean;
    constructor() {
        this.module = new Module();
    }
}

export class RoleModuleProperty {
    Role_Id: number;
    Module_Id: number;
    Property_Id: number;
    CREATED_BY: number;
    CREATED_DATE: Date;
    Sub_Module_Id: number;
    /**
     *
     */
    constructor(private _roleId: number,
        private _moduleId: number,
        private _subModuleId: number,
        private _propertyId: number
    ) {
        this.Role_Id = _roleId;
        this.Module_Id = _moduleId;
        this.Property_Id = _propertyId;
        this.Sub_Module_Id = _subModuleId;

    }
}

export class RoleModulePropertyCreateViewModel {
    Properties: RoleModuleProperty[];
    RoleId: number;
    /**
     *
     */
    constructor(private _properties: RoleModuleProperty[], private _roleId: number) {
        this.Properties = _properties;
        this.RoleId = _roleId;
    }
}

export class UserModulePropertyCreateViewModel {
    Properties: UserModuleProperty[];
    UserId: number;
    /**
     *
     */
    constructor(private _properties: UserModuleProperty[], private _userId: number) {
        this.Properties = _properties;
        this.UserId = _userId;
    }
}

export class UserModuleProperty {
    User_Id: number;
    Module_Id: number;
    Property_Id: number;
    CREATED_BY: number;
    CREATED_DATE: Date;
    Sub_Module_Id: number;
    /**
     *
     */
    constructor(private _userId: number,
        private _moduleId: number,
        private _subModuleId: number,
        private _propertyId: number
    ) {
        this.User_Id = _userId;
        this.Module_Id = _moduleId;
        this.Property_Id = _propertyId;
        this.Sub_Module_Id = _subModuleId;

    }
}

export class User {
    UserId: number;
    Password: string;
    ConfirmPassword: string;
    IsEmployee: boolean;
    Email: string;
    CompanyId: number;
    CompanyName: string;
    FirstName: string;
    LastName: string;
    MiddleInitial: string;
    IsActive: boolean;
    Address: string;
    City: string;
    State: string;
    PostalCode: string;
    CreatedBy: number;
    CreatedDate: Date;
    ModifiedBy: number;
    ModifiedDate: Date;
    PasswordChangeDate: Date;
    IsDeleted: boolean;
    RoleId: number;
    Practices: SelectListViewModel[];
    UserName: string;
    ModfiedByString: string;
    CreatedByString: string;
    Empid:any;
    constructor() {
        this.Practices = [];
    }
}

export class ResetPasswordViewModel {
    UserId: number;
    Password: string;
    ConfirmPassword: string
}

export class ResetPasswordForUserViewModel {
    UserId: number;
    UserName: String;
    OldPassword: string;
    Password: string;
    ConfirmPassword: string
}


export class EmployeeViewModel {
    Employee_Id: number = 0;
    FirstName: string = "";
    LastName: string = "";
    MiddleInitial: string;
    Nic_Number: string;
    Date_Of_Birth: string;
    Gender: string;
    GenderId: number;
    Marital_Status: string;
    MaritalStatusId: number;
    Permanent_Address: string;
    Permanent_City: string;
    Permanent_State: string;
    Permanent_Postal_Code: string;
    Personal_Contact_Number: string;
    Home_Contact_Number: string;
    Emergency_Contact_Number: string;
    Email_Personal: string;
}
export class EmployeeSelectListsViewModel {
    Genders: SelectListViewModel[];
    MaritalStatus: SelectListViewModel[];
    constructor() {
        this.Genders = [];
        this.MaritalStatus = [];
    }
}

export class UserStatusChangeViewModel {
    UserId: number;
    Status: boolean;
    ModifiedBy: number;
    ModifiedDate: Date;

    constructor(private _UserId: number,
        private _status: boolean,
        private _modifiedBy?: number,
        private _modifiedDate?: Date) {
        this.UserId = _UserId;
        this.Status = _status;
        this.ModifiedBy = _modifiedBy;
        this.ModifiedDate = _modifiedDate;
    }
}

export class EmployeeCreateViewModel {
    Employee_Id: number;
    UserId: number;
    Nic_Number: string;
    Date_Of_Birth: Date;
    GenderId: number;
    MaritalStatusId: number;
    Permanent_Address: string;
    Permanent_City: string;
    Permanent_State: string;
    Permanent_Postal_Code: string;
    Personal_Contact_Number: string;
    Home_Contact_Number: string;
    Emergency_Contact_Number: string;
    Email_Personal: string;
}

export class UserSelectListsViewModel {
    Companies: SelectListViewModel[];
    Roles: SelectListViewModel[];
    Practices: SelectListViewModel[];
    constructor(private _companies?: SelectListViewModel[],
        private _roles?: SelectListViewModel[],
        private _practices?: SelectListViewModel[]) {
        this.Companies = _companies;
        this.Roles = _roles;
        this.Practices = _practices;

    }
}