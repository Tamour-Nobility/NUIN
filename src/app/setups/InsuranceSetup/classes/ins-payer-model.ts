import { SelectListViewModel } from "../../../models/common/selectList.model";
export class InsurancePayerModelVM {
    Inspayer_Id: number;
    Inspayer_Description: string;
    Inspayer_Plan: string;
    Inspayer_State: string;
    Submission_type: string;
    Timely_Filing_Days: number;
    Edisetup_Required: boolean;
    Erasetup_Required: boolean;
    Is_Part_A: boolean;
    Is_RTA_Payer: boolean;
    Insgroup_Id: number;
    Insgroup_name: string;
    Insname_Id: number;
    Insname_Description: string;
    Inspayer_835_Id: any;
    Inspayer_837_Id: any;
    InsuranceGroups: SelectListViewModel[];
    InsuranceNames: SelectListViewModel[];
    Insurance_Type_Code:string;
    /**
     *
     */
    constructor() {
        this.InsuranceGroups = [];
        this.InsuranceNames = [];
    }
}

export class InsPayerSearchModel {
    InsuranceGroupId: number;
    InsuranceNameId: number;
    InsurancePayer_Id: number;
    InsurancePayer_State: string;
}

export class InsurancePayerViewModel {
    Inspayer_Id: number;
    Insname_Id: number;
    Inspayer_Description: string;
    Inspayer_Plan: string;
    Inspayer_State: string;
    Inspayer_837_Id: string;
    Inspayer_835_Id: string;
    Inspayer_Referral_Id: string;
    Deleted: boolean;
    Created_By: number;
    Created_Date: Date;
    Modified_By: number;
    Modified_Date: Date;
    Submission_type: string;
    Is_Sec_Paper: boolean;
    Electronic_Corrected_Claims: boolean;
    Electronic_Late_Filing: boolean;
    Timely_Filing_Days: number;
    Is_RTA_Payer: boolean;
    Restricted_Calls: string;
    SERVER_ID: number;
    Is_Part_A: boolean;
    Ivr_Server_Id: number;
    Edisetup_Required: boolean;
    Erasetup_Required: boolean;
    EFTSETUPREQUIRED: boolean;
    Npi_Type: number;
    MU_Category: number;
    InsPayer_Description_old: string;
    Is_Nonpar_Era: boolean;
    Is_Nonpar_CS: boolean;
    Acknowledgement_Type: string;
    InsPayer_Eligibility_Id: string;
    InsPayer_Claim_Status_Id: string;
    InsuranceNameDescription: string;
    Created_By_Name: string;
    Modified_By_Name: string;
    Insurance_Type_Code : string;
}
export class InsuranceTypeCode {
    InsuranceTypeCode : string;
}