export class DateRangeViewModel {
    BeginDate: Date;
    BeginDateStr: string;
    EndDate: Date;
    EndDateStr: string;
}
export class BatchUploadRequest {
    BatcheIds: number[];
    constructor() {
        this.BatcheIds = [];
    }
}

export class CSIBatchUploadRequest {
    BatcheIds: number[];
    constructor() {
        this.BatcheIds = [];
    }
}

export class CSIClaimBatchUploadRequest {
    BatcheIds: number[];
    ClaimNo:any;
    InsuranceId:any;
    constructor() {
        this.BatcheIds = [];
        this.ClaimNo='';
        this.InsuranceId=''
    }
}