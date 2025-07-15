

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
    Id: number;
    Name: string;
    CompanyId: number;
    OfficeId: number;
}

export class officeDepartmentDropdown {

    OfficeList: dropdownClass[];
    DepartmentList: dropdownClass[];
    tempOfficeList: dropdownClass[];
    tempDepartmentList: dropdownClass[];
    constructor() {
        this.OfficeList = [];
        this.DepartmentList = [];
        this.tempOfficeList = [];
        this.tempDepartmentList = [];

    }

}





