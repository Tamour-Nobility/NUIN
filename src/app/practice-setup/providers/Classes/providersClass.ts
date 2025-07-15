
export class ProviderModel {
    Provider_Code: number;
    Practice_Code: number;
    Provid_FName: string;
    Provid_MName: string;
    Provid_LName: string;
    Provid_UPIN: number;
    Provid_State_License: string;
    License_No: number;
    Site_Id: string;
    DEA_No: string;
    DEA_Expiry_Date: string;
    Date_Of_Birth: string;
    Email_Address: string;
    SSN: number;
    Taxonomy_Code: string;
    Provider_Id: number;
    Provider_Title: string;
    Patient_Statement: boolean;
    Created_By: number;
    Created_Date: Date;
    Modified_By: number;
    Authorize_Comments: string;
    Modified_Date: Date;
    Gender: string;
    Sent_To_Collection_Agency: boolean;
    Status_Authorize: boolean;
    Authorized_By: number;
    Authorized_Date: Date;
    Is_Active: boolean;
    WCB_Rating_Code: number;
    WCB_Authorization_No: number;
    Stop_Submission: boolean;
    Phone_One: string;
    Phone_Two: string;
    Phone_Three: string;
    Phone_Type_One: string;
    Phone_Type_Two: string;
    Phone_Type_Three: string;
    Is_Billing_Physician: boolean;
    Setup_Info_Send: boolean;
    NPI: string;
    Deleted: boolean;
    First_DOS: Date;
    Old_Billing: boolean;
    Old_Billing_Date: Date;
    Temination: boolean;
    Termination_Date: Date;
    Dormant_Day: Date;
    SPECIALIZATION_CODE: string;
    Phone_Four: string;
    Phone_Type_Four: string;
    Pt_Overpayment_Auth: string;
    Phone_Ext_One: string;
    Phone_Ext_Two: string;
    Phone_Ext_Three: string;
    Phone_Ext_Four: string;
    MDOS_Automation: boolean;
    MDOS_Automation_date: Date;
    SPI: string;
    Provider_Is_Attending_Physician: boolean;
    Provider_Display_Name: string;
    ADDRESS: string;
    CITY: string;
    STATE: string;
    ZIP: string;
    Provider_Color: string;
    Arrived_Color: string;
    Provid_Middle_Name: string;
    Address_Line2: string;
    Direct_Email_Address: string;
    Direct_Email_Password: string;
    Epcs: boolean;
    Provider_Address: string;
    License_State: string;
    Is_Billable: boolean;
    EPCS_Agreement: boolean;
    Billing_Rate: number;
    Medicare_Status: boolean;
    Pointer_setting: boolean;
    Is_Bill_Provider: boolean;
    Is_Credentialing: boolean;
    STOP_SUBMISSION_REASONS: string;
    federal_taxid: string;
}

export class SaveProviderModel {
    Provider_Code: number;
    Practice_Code: number;
    Provid_FName: string;
    Provid_MName: string;
    Provid_LName: string;
    Provid_UPIN: number;
    Provid_Tax_Id: string;
    Provid_State_License: string;
    License_No: number;
    Site_Id: string;
    DEA_No: string;
    DEA_Expiry_Date: string;
    Date_Of_Birth: string;
    Email_Address: string;
    SSN: number;
    Taxonomy_Code: string;
    Provider_Id: number;
    Provider_Title: string;
    Patient_Statement: boolean;
    Created_By: number;
    Created_Date: Date;
    Modified_By: number;
    Authorize_Comments: string;
    Modified_Date: Date;
    Gender: string;
    Sent_To_Collection_Agency: boolean;
    Status_Authorize: boolean;
    Authorized_By: number;
    Authorized_Date: Date;
    Is_Active: boolean;
    WCB_Rating_Code: number;
    WCB_Authorization_No: number;
    Stop_Submission: boolean;
    Phone_One: string;
    Phone_Two: string;
    Phone_Three: string;
    Phone_Type_One: string;
    Phone_Type_Two: string;
    Phone_Type_Three: string;
    Is_Billing_Physician: boolean = true;
    Setup_Info_Send: boolean;
    NPI: string;
    Deleted: boolean;
    First_DOS: Date;
    Old_Billing: boolean;
    Old_Billing_Date: Date;
    Temination: boolean;
    Termination_Date: Date;
    Dormant_Day: Date;
    SPECIALIZATION_CODE: string;
    Phone_Four: string;
    Phone_Type_Four: string;
    Pt_Overpayment_Auth: string;
    Phone_Ext_One: string;
    Phone_Ext_Two: string;
    Phone_Ext_Three: string;
    Phone_Ext_Four: string;
    MDOS_Automation: boolean;
    MDOS_Automation_date: Date;
    SPI: string;
    Provider_Is_Attending_Physician: boolean;
    Provider_Display_Name: string;
    ADDRESS: string;
    CITY: string;
    STATE: string;
    ZIP: string;
    Provider_Color: string;
    Arrived_Color: string;
    Provid_Middle_Name: string;
    Address_Line2: string;
    Direct_Email_Address: string;
    Direct_Email_Password: string;
    Epcs: boolean;
    Provider_Address: string;
    federal_taxid: string;
    License_State: string;
    Is_Billable: boolean;
    EPCS_Agreement: boolean;
    Billing_Rate: number;
    Medicare_Status: boolean;
    Pointer_setting: boolean;
    Is_Bill_Provider: boolean;
    Is_Credentialing: boolean;
    STOP_SUBMISSION_REASONS: string;
    grp_taxonomy_id: number;
    GroupNo: number;
    group_npi: string;
    federal_taxidnumbertype:string = 'EIN';
    constructor() {
        this.DEA_Expiry_Date = "";
        this.Date_Of_Birth = "";
    }
}

export class Specilization {

    SPECIALIZATION_CODE: string;
    SPECIALIZATION_NAME: string;
}

export class WCBRating {
    WCBRatingCode: string;
    Description: string;
}

export class SpecialtyGroups {
    GROUP_NO: number;
    GROUP_NAME: string;
}

export class SpecialtyCategory {
    CAT_NO: number;
    CATEGORY_NAME: string;
    CAT_LEVEL: number;
    PRECEEDING_CAT: number;
    TAXONOMY_CODE: string;
}

export class VendorLists{
    Id:number;
    Name:string;
}