export class NpmAlertModel {
    Type: string;
    AlertID : number ;
    EffectiveFrom: string;
    Priority: string;
    EffectiveTo: string;
    ApplicableFor: string;
    AlertMessage: string;
    Demographics: boolean;
    ClaimSummary: boolean;
    Claim: boolean;
    ClaimText: string;
    AddNewClaim: boolean;
    AddNewPayment: boolean;
    Patient_Account:number;
    Inactive : boolean;
}

export class LoginAlertModel{
    Type: string;
    AlertID : number ;
    EffectiveFrom: string;
    Priority: string;
    EffectiveTo: string;
    ApplicableFor: string;
    AlertMessage: string;
    Login: string;
    Inactive : boolean;
}