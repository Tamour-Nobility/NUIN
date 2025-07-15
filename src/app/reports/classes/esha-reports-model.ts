export class CreditBalanceReport {
    PATIENT_NAME: string;
    PATIENT_ACCOUNT: number;
    BILL_TO: string;
    LAST_CHARGE_DATE: Date;
    LAST_PAYMENT_DATE: Date;
    LAST_STATEMENT_DATE: Date;
    LAST_CLAIM_DATE: Date;
    BALANCE: number
}


export class EshaPatientAgingReport {
    PRACTICE_CODE: number;
    PRAC_NAME: string;
    PATIENT_NAME: string;
    PATIENT_ACCOUNT: number;
    POLICY_NUMBER: string;
    BALANCE: number;
    Current: number;
    C30_Days: number;
    C60_Days: number;
    C90_Days: number;
    C120_Days: number;
}

export class EshaPlanAgingReport {
    PRACTICE_CODE: number;
    PRAC_NAME: string;
    GROUP_NAME: string;
    AGING_PAYER: string;
    BALANCE:number;
    Current: number;
    C30_Days: number;
    C60_Days: number;
    C90_Days: number;
    C120_Days: number;
}