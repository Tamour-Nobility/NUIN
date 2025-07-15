import { SelectListViewModel } from '../../../models/common/selectList.model';

export class InsuranceNameViewModel {
    InsuranceNameId: number;
    InsuranceGroupId: number;
    InsuranceGroupName: string;
    InsuranceNameDescription: string;
    Deleted: boolean;
    Created_By: number;
    Created_By_Name: string;
    Created_Date: Date;
    Modified_By: number;
    Modified_By_Name: string;
    Modified_Date: Date;
}

export class InsuranceNameModelViewModel {
    Insname_Id: number;
    Insgroup_Id: number;
    Insname_Description: string;
    Deleted: boolean;
    Created_By: number;
    Created_Date: Date;
    Modified_By: Date;
    Modified_Date: Date;
    InsuranceGroup: SelectListViewModel;
    constructor() {
        this.InsuranceGroup = new SelectListViewModel();
    }
}