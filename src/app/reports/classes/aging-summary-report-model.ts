export class Aging_Summary_Analysis_Report_Result {
    Insurance: string;
    Aggregate_Claim_Amount: string;
    C_0_30__Days_Balance_by_Claim_Date: number;
    C_31_60__Days_Balance_by_Claim_Date: number;
    C_61_90__Days_Balance_by_Claim_Date: number;
    C_91_120__Days_Balance_by_Claim_Date: number;
    C_121_150__Days_Balance_by_Claim_Date: number;
    C_151_180__Days_Balance_by_Claim_Date: number;
    C___180__Days_Balance_by_Claim_Date: number;
    Total_Balance: number;
}

export class PracticesList {
    Id: number;
    Name: string;

}

export class AgingPatientSummary {
    Patient: string;
    Aggregate_Claim_Amount: string;
    C_0_30__Days_Balance_by_Claim_Date: number;
    C_31_60__Days_Balance_by_Claim_Date: number;
    C_61_90__Days_Balance_by_Claim_Date: number;
    C_91_120__Days_Balance_by_Claim_Date: number;
    C_121_150__Days_Balance_by_Claim_Date: number;
    C_151_180__Days_Balance_by_Claim_Date: number;
    C___180__Days_Balance_by_Claim_Date: number;
    Total_Balance: number;
}

export class FinancialAnalysisProvider {
    RENDERRING_PROVIDER: string;
    PROCEDURE_CODE: string;
    BILLED_UNITS: number;
    BILLED_CHARGE: number;
    INSURANCE_CHARGE: number;
    SELF_CHARGE: number;
    PAYMENTS: number;
    PATIENT_PAYMENTS: number;
    INSURANCE_PAYMENTS: number;
    CONTRACTUAL_ADJUSTMENTS: number;
    WRITEOFF_ADJUSTMENTS: number;
    DUE_AMOUNT: number;
    VISIT_COUNT: number;
    PATIENT_COUNT: number;
}

export class FinancialAnalysisCPT {
    PROCEDURE_CODE: string;
    BILLED_UNITS: number;
    BILLED_CHARGE: number;
    INSURANCE_CHARGE: number;
    SELF_CHARGE: number;
    PAYMENTS: number;
    PATIENT_PAYMENTS: number;
    INSURANCE_PAYMENTS: number;
    CONTRACTUAL_ADJUSTMENTS: number;
    WRITEOFF_ADJUSTMENTS: number;
    DUE_AMOUNT: number;
    VISIT_COUNT: number;
    PATIENT_COUNT: number;
}

