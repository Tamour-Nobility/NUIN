export class DiagnosisRequest {
    Description: string;
    DiagnoseCode: string;
    Diag_Expiry_Date: string;
    Diag_Effective_Date: string;
    Version: string;
}
export class DiagnosisResponse {
    TOTAL_PAGES: number;
    Diag_Chk: boolean;
    Diag_Code: string;
    Diag_Description: string;
    Diag_Expiry_Date: string;
    Diag_Effective_Date: string;
    ROW: number;
    Isfound: any;
}
export class ClaimDiagnosisRequest {
    claimNo: string;
    isClaimEdit: number;
    patientAccount: string;
    DOS: string;
}
export class Diagnosis {
    id: number;
    Code: string;
    Description: string;
    Diag_Expiry_Date: string;
    Diag_Effective_Date: string;
    Deleted: boolean;
    AddorUpdate:boolean = false;
}
export class Diag {
    Diagnosis = new Diagnosis();
}
export class claimDiagnosis {
    Diagnosis = new Diagnosis;
    constructor() {
        this.Diagnosis = new Diagnosis();
    }
}