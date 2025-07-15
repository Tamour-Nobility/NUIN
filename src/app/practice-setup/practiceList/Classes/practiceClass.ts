import { Specilization } from '../../providers/Classes/providersClass';

//---import { NgModel } from "@angular/forms";

export class PracticeModel {
    Status: string;
    Response = new pracmodel;
}
export class pracmodel {

    PracticeModel = new Response;
    PracticeLocations: practicelocation[];
    PracticeFacilities: practiceFacilites[];
    ProvidersList: ProvidersList[];
    ProvidersComboFillingList: ProvidersComboFillingList[];
    LocationComboFillingList: LocationComboFillingList[];
    PracticeTypeComboFillingList: PracticeTypeComboFillingList[];
    CategoryList: CategoryList[];
    SpecialInstructionHistory: SpecialInstructionHistory[];
    PracticeVendors: PracticeVendors[];
    specializations: Specilization[];
    constructor() {
        this.PracticeLocations = [];
        this.PracticeFacilities = [];
        this.ProvidersList = [];
        this.ProvidersComboFillingList = [];
        this.LocationComboFillingList = [];
        this.PracticeTypeComboFillingList = [];
        this.CategoryList = [];
        this.SpecialInstructionHistory = [];
        this.PracticeVendors = [];
        this.specializations = [];
    }
}
class SpecialInstructionHistory {

}

class PracticeTypeComboFillingList {

}
class LocationComboFillingList {
    Location_Code: number;
    Location_Name: string;
    Location_ID: string;
}
class ProvidersList {

}
class ProvidersComboFillingList {

}
class PracticeVendors {
    PracticeVendorId: number;
    PracticeId: number;
    VendorId: number;
}
class practiceFacilites {

}
class Response {
    Practice_Code: number;
    Prac_Name: string;
    Prac_Type: string;
    Prac_Address: string;
    Prac_State: string;
    PRAC_License_Number: string;
    Prac_City: string;
    Prac_Zip: string;
    Prac_URL: string;
    Prac_Phone: string;
    Prac_Alternate_Phone: string;
    Prac_Tax_Id: string;
    Patient_Billing: string;
    Agreement_Date: string;
    Billing_Percentage: number;
    Billing_Type:string;
    Old_Billing_Percentage: string;
    Old_Billing_Percentage_From: string;
    Old_Billing_Percentage_To: string;
    Client_Billing_Percentage: string;
    Office_Manager: string;
    Email_Address: string;
    County: string;
    Location_Number: string;
    Is_Active: boolean;
    Mailing_Address: string;
    Mailing_City: string;
    Mailing_State: string;
    Mailing_Zip: string;
    EMR_Name: string;
    Patient_billing_Note: string;
    Is_Patient_Billing_Authentication_Required: string;
    Noshow_Charges: boolean;
    Phone_Type: string;
    Commencement_Date: string;
    Company_Id: number;
    Office_Id: string;
    Open_Date: string;
    Email_Contact_Person: string;
    Created_By: number;
    Created_Date: Date;
    Modified_By: string;
    Modified_Date: string;
    Deleted: boolean;
    Agreement_View: string;
    NPI: string;
    Invoice_Practice_Name: string;
    Invoice_Email_Address1: string;
    Invoice_Email_Address2: string;
    Invoice_Email_Address3: string;
    Invoice_Prac_Address: string;
    Invoice_Prac_State: string;
    Invoice_Prac_City: string;
    Invoice_Prac_Zip: string;
    Invoice_Fax: string;
    Invocie_Fax_Type: string;
    Practice_Pat_Bill_Name: string;
    Pat_Bill_Prac_Address: string;
    Pat_Bill_Prac_State: string;
    Pat_Bill_Prac_City: string;
    Pat_Bill_Prac_Zip: string;
    Practice_Aliases: string;
    Prac_Phone_Ext: string;
    Practice_Key: string;
    Prac_Category: string;
    Practice_Avg_Collection: string;
    Credentialing_Status: string;
    Signed_Addendum: string;
    Practice_Blocked: string;
    Block_Date: string;
    Block_Reason: string;
    TAXONOMY_CODE: string;
    Termination_Notice: string;
    Termination_Notice_Date: string;
    Termination_Date: string;
    Check_Bounce_Penalty: string;
    Is_Resource_Enabled: string;
    FTP_ENABLE: boolean;
    Unblock_Reason: string;
    practice_attention: string;
    practice_invoicecode: string;
    FTP_Settings: string;
    Ioupolicy_Effective_Date: string;
    Iou_Policy: string;
    Upgraded_Commencement_Date: string;
    Prac_Address_Pt_Billing: string;
    Prac_Address_Line2: string;
    Send_Detailed_Statement: string;
    Is_Claim_Submission_Allowed: string;
    Stop_Late_Filing: string;
    Transition_Date: string;
    Default_Provider_Rate: string;
    ICD_Status: string;
    Last_Known_Medicare_Revalidation_Date: string;
    Next_revalidation_date: string;
    Last_Known_Medicaid_Certification_Date: string;
    Next_Certification_Date: string;
    Contact_Person_Phone: string;
    FTP_Path: string;
    Contact_Person_Ext: string;
    prac_doing_business: string;
    GroupNo: number;
    // EFSDate: string;
    isAutofillClaimDetails:boolean;
    EFS: boolean;
    Prac_Soft:any;
}
class practicelocation {

}
export class GetPracticeResponse {
    Practice_Code: number;
    Prac_Name: string;
    Prac_Type: string;
    Prac_Address: string;
    Prac_State: string;
    PRAC_License_Number: string;
    Prac_City: string;
    Prac_Zip: string;
    Prac_URL: string;
    Prac_Phone: string;
    Prac_Alternate_Phone: string;
    Prac_Tax_Id: string;
    Patient_Billing: string;
    Agreement_Date: string;
    Billing_Percentage: string;
    Old_Billing_Percentage: string;
    Old_Billing_Percentage_From: string;
    Old_Billing_Percentage_To: string;
    Client_Billing_Percentage: string;
    Office_Manager: string;
    Email_Address: string;
    County: string;
    Location_Number: string;
    Is_Active: boolean;
    Mailing_Address: string;
    Mailing_City: string;
    Mailing_State: string;
    Mailing_Zip: string;
    EMR_Name: string;
    Patient_billing_Note: string;
    Is_Patient_Billing_Authentication_Required: string;
    Noshow_Charges: boolean;
    Phone_Type: string;
    Commencement_Date: string;
    Company_Id: string;
    Office_Id: number;
    Open_Date: string;
    Email_Contact_Person: string;
    Created_By: number;
    Created_Date: Date;
    Modified_By: number;
    Modified_Date: Date;
    Deleted: boolean;
    Agreement_View: string;
    NPI: string;
    Invoice_Practice_Name: string;
    Invoice_Email_Address1: string;
    Invoice_Email_Address2: string;
    Invoice_Email_Address3: string;
    Invoice_Prac_Address: string;
    Invoice_Prac_State: string;
    Invoice_Prac_City: string;
    Invoice_Prac_Zip: string;
    Invoice_Fax: string;
    Invocie_Fax_Type: string;
    Practice_Pat_Bill_Name: string;
    Pat_Bill_Prac_Address: string;
    Pat_Bill_Prac_State: string;
    Pat_Bill_Prac_City: string;
    Pat_Bill_Prac_Zip: string;
    Practice_Aliases: string;
    Prac_Phone_Ext: string;
    Practice_Key: string;
    Prac_Category: string;
    Practice_Avg_Collection: string;
    Credentialing_Status: string;
    Signed_Addendum: string;
    Practice_Blocked: string;
    Block_Date: Date;
    Block_Reason: string;
    TAXONOMY_CODE: string;
    Termination_Notice: string;
    Termination_Notice_Date: Date;
    Termination_Date: Date;
    Check_Bounce_Penalty: string;
    Is_Resource_Enabled: boolean;
    FTP_ENABLE: boolean;
    Unblock_Reason: string;
    practice_attention: string;
    practice_invoicecode: string;
    FTP_Settings: string;
    Ioupolicy_Effective_Date: string;
    Iou_Policy: string;
    Upgraded_Commencement_Date: string;
    Prac_Address_Pt_Billing: string;
    Prac_Address_Line2: string;
    Send_Detailed_Statement: string;
    Is_Claim_Submission_Allowed: string;
    Stop_Late_Filing: string;
    Transition_Date: Date;
    Default_Provider_Rate: string;
    ICD_Status: string;
    Last_Known_Medicare_Revalidation_Date: string;
    Next_revalidation_date: string;
    Last_Known_Medicaid_Certification_Date: string;
    Next_Certification_Date: string;
    Contact_Person_Phone: string;
    FTP_Path: string;
    Contact_Person_Ext: string;
}

export class ComboFillingList {
    Id: number;
    Name: string;
}

export class PracticeNotesModel {
    Status: string;
    practiceNotesList = new PracticeNotesList;
    constructor() {
        this.practiceNotesList.CREATED_BY = "";
        this.practiceNotesList.PRACTICE_Code = 0;
        this.practiceNotesList.NOTE_CONTENT = "";
        this.practiceNotesList.NOTE_USER = "";
        this.practiceNotesList.Deleted = false;
        this.practiceNotesList.Practice_Notes_Id = 0;
    }

}
export class PracticeNotesList {
    PRACTICE_Code: number;
    NOTE_DATE: string;
    NOTE_CONTENT: string;
    NOTE_USER: string;
    Deleted: boolean;
    CREATED_BY: string;
    CREATED_DATE: string;
    MODIFIED_BY: string;
    MODIFIED_DATE: string;
    Practice_Notes_Id: number;
    constructor() {
        this.CREATED_BY = "";
        this.PRACTICE_Code = 0;
        this.NOTE_CONTENT = "";
        this.NOTE_USER = "";
        this.Deleted = false;
        this.Practice_Notes_Id = 0;
        this.CREATED_DATE = "01/01/2018";
        this.MODIFIED_BY = "";
        this.MODIFIED_DATE = "";
        this.NOTE_DATE = "";
    }
}
export class PracticeNotes {
    Status: string;
    Response = new Practice_Notes;
}
export class Practice_Notes {
    PRACTICE_Code: number;
    Practice_Notes: number;
    NOTE_DATE: string;
    NOTE_CONTENT: string;
    NOTE_USER: string;
    Deleted: boolean;
    CREATED_BY: string;
    CREATED_DATE: string;
    MODIFIED_BY: string;
    MODIFIED_DATE: string;
    Practice_Notes_Id: number;
    constructor() {
        this.CREATED_BY = "";
        this.PRACTICE_Code = 0;
        this.NOTE_CONTENT = "";
        this.NOTE_USER = "";
        this.Deleted = false;
        this.Practice_Notes_Id = 0;
        this.CREATED_DATE = "01/01/2018";
        this.MODIFIED_BY = "";
        this.MODIFIED_DATE = "";
        this.NOTE_DATE = "";

    }
}

export class Provider_Working_Days_Time {
    Provider_Code: number;
    Practice_Code: number;
    WorkDay_Option_Id: number;
    Location_Code: number;
    Weekday_Id: number;
    Time_From: string;
    Time_To: string;
    Break_Time_From: string;
    Break_Time_To: string;
    Enable_Break: string;
    Date_From: string;
    Created_By: string;
    Created_Date: string;
    Modified_By: string;
    Modified_Date: string;
    Day_On: boolean;
    Provider_Working_Days_Time_Id: string;
    Date_To: string;
    WeekofMonth: string;
    is_advanced_time: string;
    Time_slot_size: string;
    Template_Id: string;
}
export class ProviderPayer {
    InsPayer_Id: number;
    Provider_Code: number;
    Provider_Payer_Group: number;
    Type: string;
    Payer_Description: string;
    Insurance_Name: string;
    Credentialing_Effective_Date: string;
    Status: string;

}

export class ProviderNotes {
    Provider_Code: number;
    Note_Date: string;
    Note_User: string;
    Note_Content: string;
    Deleted: boolean;
    Created_By: number;
    CREATED_DATE: string;
    Modified_By: number;
    Modified_Date: string;
    Provider_Notes_Id: number;
}


export class ProviderNotesModel {
    Status: string;
    Response: ProviderNotes[];
    constructor() {
        this.Response = [];
        this.Status = "";
    }
}

export class ProviderResources {
    Resource_Id: number;
    Provider_Code: number;
    Insurance_Name: string;
    User_Id: string;
    Password: string;
    URL: string;
    ARU: string;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    Deleted: boolean;
    In_Active: boolean;
    Expiry_Days: number;
    Modified_Expiry_Date_By: string;
    Login_Type: string;
    InsPayer_Id: number;
    InsName_Id: number
}


export class SpecialInstruction {
    Practice_Code: number;
    Question_Id: number;
    Special_Instruction: string;
    Deleted: boolean;
    Created_By: number;
    Created_Date: string;
    Modify_By: number;
    Modify_Date: string;
    Reference_Instruction_ID: number;
    Status: string;
    Expired: string;
    Expired_Date: string;
    Template_ID: number;
    Category_Id: number;
    Special_Instruction_Id: number;
}
export class CategoryList {
    Id: number;
    Name: string;
}

export class SpecialInstructionModel {
    objSpecialInstruction: SpecialInstruction;
    listSpecialInstruction: SpecialInstruction[];
    listCategoryList: CategoryList[];
    listMainSpecialInstruction: SpecialInstruction[];
    listQuestion: CategoryList[];
    constructor() {
        this.listSpecialInstruction = [];
        this.listCategoryList = [];
        this.objSpecialInstruction = new SpecialInstruction();
        this.listQuestion = [];
        this.listMainSpecialInstruction = [];
    }

}

export class PracticeSynchronization {
    PracticeId: number;
    vendorId: number;
}


export class ReportingModel {
    ID: number;
    Practice_Code: number;
    Practice_Alias: string;
    Manager_ID: number;
    TeamLead_ID: number;
    BillingAssociate_ID: number;
    Shift: string;
    Division_ID: number;
    PHD_POCid:number;
}

