export class PatientSearchRequest {
    PracticeCode: number;
    PatientAccount: number;
    FirstName: string;
    LastName: string;
    SSN: string;
    ClaimNo: number;
    PolicyNo: string;
    HomePhone: string;
    ZIP: string;
    IncludePTLClaims: boolean;
    SearchAllAssignedPractices: string;
    inActive: boolean;
    setupType: string;
    IncludePTLPatients: boolean;
    dob: string;
    dateType: string = null;
    dateFrom: string;
    dateTo: string;

}

export class SearchResponse {
    Practice_Code: number;
    Patient_Account: number;
    First_Name: string;
    Last_Name: string;
    SSN: string;
    ClaimNo: number;
    Date_Of_Birth: string;
    PTL_STATUS: boolean;
}