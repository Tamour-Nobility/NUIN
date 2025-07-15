import { SelectListViewModel } from '../../../models/common/selectList.model';

export class InsPayerGroup {
    Id: number;
    Name: string;

}

export class InsModel {
    ObjResponse: response;
    Response: response[];
    Status: string;
    constructor() {
        this.Response = [];
        this.ObjResponse = new response();
    }
}
export class response {

    Insurance_Id: number;
    InsPayer_Id: number | null;
    InsurancePayerDescription: string;
    Insurance_Address: string;
    Insurance_City: string;
    Insurance_State: string;
    Insurance_Zip: string;
    Insurance_CardCategory: string;
    Insurance_Phone_Type1: string;
    Insurance_Phone_Type2: string;
    Insurance_Phone_Type3: string;
    Insurance_Phone_Number1: string;
    Insurance_Phone_Number2: string;
    Insurance_Phone_Number3: string;
    Insurance_Department: number | null;
    Deleted: boolean | null;
    Created_By: number | null;
    Created_Date: string;
    Modified_By: number | null;
    Modified_Date: string;
    Is_Sec_Attach_Need: boolean | null;
    IS_SEC_Paper: boolean | null;
    InActive: boolean | null;
    EPSDT_WorkerInfo: string;
    Sub_Method: string;
    Time_From: string;
    Time_To: string;
    STOP_SUBMISSION: string;
    ClaimFilingLimit: string;
    AppealFilingLimit: string;
    InsurancePayer: SelectListViewModel;
    Created_By_Name: string;
    Modified_By_Name: string;
    /**
     *
     */
    constructor() {
        this.InsurancePayer = new SelectListViewModel();
    }

}