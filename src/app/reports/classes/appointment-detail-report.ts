export class AppointmentdetailReport {
    PATIENT: string;
    ADDRESS: string;
    CITY: string;
    STATE: string;
    ZIP: string;
    APPTDATE: string;
    TIMEFROM: string;
    APPTTYPE: string;
    HOME_PHONE: string;
    BUSINESS_PHONE: string;
}

export class MissingAppointmentdetailReport {
    PATIENT: string;
    ADDRESS: string;
    CITY: string;
    STATE: string;
    ZIP: string;
    APPTDATE: string;
    TIMEFROM: string;
    APPTTYPE: string;
    APPSTATUS: string;
    HOME_PHONE: string;
    BUSINESS_PHONE: string;
}

export class PatientStatementReport{
    PATIENT_ACCOUNT : number;
    CLAIM_NO : number;
    PATIENT_NAME : string;
    PRACTICE_CODE : number;
    PRAC_NAME : string;
    GUARANTO_LAST_NAME : string;
    GUARANT_FNAME : string;
    GUARANT_ADDRESS : string;
    GUARANT_CITY : string;
    GUARANT_STATE : string;
    GUARANTOR_DOB :Date;
    GURANTOR_HOME_PHONE : string;
    PROVIDER_NAME : string;
    AMOUNT_DUE : number;
    CLAIM_TOTAL : number;
    DOS : Date;
    PATIENT_ADDRESS : string;
    PATIENT_CITY : string;
    PATIENT_HOME_PHONE : string;
    PATIENT_STATE : string;
    PATIENT_DOB : Date;
    AGINGDAYS : number;
    MAX_STATEMENT_DATE : Date;
    COUNT_STATEMENT : number;
    LAST_PATIENT_PAYMENT_DATE : Date;
    PAT_STATUS: string;
    PATIENT_ZIP :string;
    GUARANT_ZIP :string;
}