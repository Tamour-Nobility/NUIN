import { ERASearchResponseModel } from './era-search-response.model';

export class ERAClaimDetailsResponse {
    era: ERASearchResponseModel;
    eraClaims: ERAClaim[];
    /**
     *
     */
    constructor() {
        this.era = new ERASearchResponseModel();
        this.eraClaims = [];
    }
}

export class EraSummaryDetailsResponse {
    era: ERASearchResponseModel;
    eraClaims: ERASummaryClaimDetails[];
    checkTotal: ClaimsTotal;
    glossary: ERAADJCODEGLOSSAR[];
    constructor() {
        this.era = new ERASearchResponseModel();
        this.eraClaims = [];
        this.checkTotal = new ClaimsTotal();
        this.glossary = [];
    }
}

export class ERAADJCODEGLOSSAR {
    ADJCODE1: string;
    DESCRIPTION: string;
}
export class ERASummaryClaimDetails {
    claims: ERAClaim[];
    claimsTotal: ClaimsTotal;
    constructor() {
        this.claims = [];
        this.claimsTotal = new ClaimsTotal();
    }
};

export class ClaimsTotal {
    BILLEDAMOUNT: number;
    ALLOWEDAMOUN: number;
    DEDUCTAMOUNT: number;
    COINSAMOUNT: number;
    COPAYAMOUNT: number;
    OTHERADJUSTMENT: number;
    PROVIDERPAID: number;
};

export class ERAClaim {
    ERAID: number;
    CLAIMNO: string;
    PATIENTNAME: string;
    INSUREDNAME: string;
    CLAIMSTATUS: string;
    CLAIMPAYMENTAMOUNT: string;
    CLAIMADJAMT: string;
    CLAIMADJCODES: string;
    CLAIMREMARKCODES: string;
    MEMBERIDENTIFICATION_: string;
    INSUREDMEMBERIDENTIFICATION_: string;
    PATIENTACCOUNTNUMBER: string;
    RENNDERINGPROVIDER: string;
    RENDERINGNPI: string;
    PAYERCLAIMCONTROLNUMBERICN_: string;
    PATIENTRESPONSIBILITY: string;
    PATIENTRESPONSIBILITYREASONCODE: string;
    PATIENTGROUP_: string;
    BEGINSERVICEDATE: Date;
    ENDSERVICEDATE: Date;
    PAIDUNITS: string;
    PROCCODE: string;
    MODI: string;
    BILLEDAMOUNT: string;
    ALLOWEDAMOUNT: string;
    PRTYPE: string;
    ADJCODE1: string;
    ADJCODE2: string;
    ADJCODE3: string;
    ADJAMT1: string;
    ADJAMT2: string;
    ADJUCODE1: string;
    ADJUCODE2: string;
    ADJUCODE3: string;
    PROVIDERPAID: string;
    PATFIRSTNAME: string;
    PATLASTNAME: string;
    PATACCOUNT?: number;
    CLAIMPOSTEDSTATUS: string;
    POSTEDDATE: Date;
    // Not Mapped
    DEDUCTAMOUNT: number;
    COINSAMOUNT: number;
    COPAYAMOUNT: number;
    OTHERADJUSTMENT: number;
}