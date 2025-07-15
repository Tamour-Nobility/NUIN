import { PatientInsuranceResponse } from '../../Claims/Classes/ClaimsModel';
import { zipdata } from './patientInsClass';

export class patientModel {
    Patient_Account: number;
    Last_Name: string;
    First_Name: string;
    MI: string;
    SSN: string = null;
    Date_Of_Birth: string;
    Gender: number;
    Marital_Status: string
    Address_Type: number;
    Address: string;
    City: string = null;
    State: string = null;
    ZIP: string;
    Home_Phone: string;
    Business_Phone: string;
    Financial_Guarantor: string;
    Financial_Guarantor_Name: string;
    Gurantor_Relation: number;
    Email_Address: string;
    Eligibility_Status: string;
    Location_Code: number;
    Expiry_Date: string;
    Chart_Id: string;
    Move_Collection: number;
    Practice_Code: number;
    Patient_Payment_Plan: number;
    Patient_Statement: number;
    Patient_Type: string;
    Scan_No: string;
    as: boolean;
    PTL_Web_Appearnce_Days: string;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    Deleted: string;
    PTL_STATUS: boolean;
    PTL_Date: string;
    Scan_Date: string;
    Provider_Code: string;
    alternate_id: number;
    Notes: string;
    Cell_Phone: string;
    Ext: string;
    Referring_Physician: number;
    Address_To_Guarantor: string;
    Special_Billing_Note: string;
    CREATED_FROM: string;
    ALTERNATE_PHONE: string;
    Terminated: string;
    Primary_Phone: string;
    Ethnicities: number;
    Race: number;
    Languages: number;
    IsDeceased: boolean;
    Hold_Pt_Billing:boolean=false;
    DeathDate: string;
    Hold_pt_until:string=null;
    DeathCause: string;
    Chk_Hospice: string;
    Father_Cell: string;
    Father_FName: string;
    Father_LName: string;
    Mother_Cell: string;
    Mother_FName: string;
    Mother_LName: string;
    Spouse_Cell: string;
    Spouse_Fname: string;
    Spouse_Lname: string;
    Registration_Complete_Date: string;
    Prac_Address_PT_Billing: string;
    RACE2: string;
    Address_Line2: string;
    Blood_Type: string;
    Primary_Care_Physician: string;
    Is_Self_Pay: string;
    Patient_Category: string;
    Adjuster_Name: string;
    Adjuster_Phone: string;
    Inactivation_Date: string;
    Family_Id: string;
    Fam_Relation: string;
    FamilyBit: string;
    GuarantorBit: string;
    Family_Name: string;
    Address_To_Family: string;
    ChronicCare: string;
    Risk_Level: string;
    Country: string;
    IsDisable: string;
    PrimaryInsuranceName: string;
    SecondaryInsuranceName: string;
    OtherInsuranceName: string;
    GenderList: Gender[];
    MaritalStatusList: MaritalStatu[];
    EthiniciesList: ethnicity[];
    RaceList: Race[];
    LanguageList: Language[];
    AddressTypeList: AddressType[];
    RelationshipList: Relationship[];
    provider: Provider[];
    practice_Locations: Practice_Locations[];
    Referral_Physicians: Referral_Physicians[];
    InsuranceList: PatientInsuranceModel[];
    Insurance_Payers: Insurance_Payers[];
    ProviderList: any[];
    PracticeLocationsList: PracticeLocationsList[];
    PatientInsuranceList: PatientInsuranceResponse[];
    emailnotonfile: boolean;
    PicturePath: string;
    ZipCodeCities: zipdata[];
    constructor() {
        this.Date_Of_Birth = "";
        this.InsuranceList = [];
        this.PatientInsuranceList = [];
        this.ZipCodeCities = [];
    }
}
class Gender {
    GenderId: string;
    Name: string;
    Deleted: string;
}
class MaritalStatu {
    MaritalStatusId: string;
    Name: string;
    Deleted: string;
}
class ethnicity {
    ethnicity_id: string;
    ethnicity_code: string;
    ethnicity_description: string;
    deleted: string;
}
class Language {
    LanguageId: string;
    Name: string;
    Deleted: string;
}
class AddressType {
    AddressType1: string;
    Name: string;
    Deleted: string;
}
class Relationship {
    RelationshipId: string;
    Name: string;
    Deleted: string;
}
class Provider {

}
class Practice_Locations {

}
class Referral_Physicians {
    Referral_Code: number;
    Referral_Fname: string;
    Referral_Lname: string;
    In_Active: any;
}
class Insurance_Payers {

}
class Race {
    RaceId: string;
    Name: string;
    Deleted: string;
}
export class PatientInsuranceModel {
    Patient_Insurance_Id: number;
    Patient_Account: number;
    Insurance_Id: number;
    Pri_Sec_Oth_Type: string;
    Co_Payment: string;
    Deductions: string;
    Policy_Number: string;
    Group_Number: string;
    Effective_Date: string;
    Termination_Date: string;
    Subscriber: number;
    Relationship: string;
    Eligibility_Status: string;
    Eligibility_S_No: number;
    Eligibility_Enquiry_Date: string;
    Access_Carolina_Number: string;
    Is_Capitated_Patient: string;
    Allowed_Visits: number;
    Remaining_Visits: number;
    Visits_Start_Date: string;
    Visits_End_Date: string;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    Deleted: boolean;
    CCN: string;
    Group_Name: string;
    Created_From: string;
    MCR_Sec_Payer: string;
    MCR_Sec_Payer_Code: number;
    Eligibility_Difference: string;
    Filing_Indicator_Code: string;
    Filing_Indicator: string;
    Plan_type: string;
    coverage_description: string;
    Co_Payment_Per: number;
    Plan_Name: string;
    Plan_Name_Type: string;
    PayerDescription: string;
    SubscriberName: string;
}

class ProviderList {
    Id : any;
Is_Active : boolean;
}
class PracticeLocationsList {

}

export class PatientAppoinments {
    APPOINTMENT_ID: number;
    DATE: string;
    TIME: string;
    DURATION: number | null;
    STATUS: string;
    PREVIOUS_BALANCE: number | null;
    APPOINTMENT_TYPE: string;
    NOTES: string;
    FACILITY: string;
    ATTENDING_PHYSICIAN: string;
    BILLING_PHYSICIAN: string;
    REFFERRING_PHYSICIAN: string;

}

