export class StatmentDownloadRequest {
    PracticeCode: number;
    PatientAccount: number;
    Message:any;
    ExcludedClaimsIds: number[];
    constructor(private _PatientAccount?: number, private _ExcludedClaimsIds: number[] = []) {
        this.PatientAccount = _PatientAccount;
        this.ExcludedClaimsIds = _ExcludedClaimsIds;
    }
}