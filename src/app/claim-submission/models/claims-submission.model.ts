export class ClaimSearchViewModel {
    DOSFrom: string;
    DOSTo: string;
    PatientAccount: number[];
    Provider: number[];
    icd9: boolean;
    type: string;
    status: string;
    insurance: number[];
    location: number[];
    PracticeCode: number;
    billedTo:string;
    /**
     *
     */
    constructor() {
        this.status = "unprocessed";
        this.location = [];
        this.PatientAccount = [];
        this.Provider = [];
        this.insurance = [];
    }
}
export class ClaimSearchResponseViewModel {
    Claim_No: number;
    Name: number;
    dos: Date;
    pri_ins: string;
    policy_number: string;
    Provider: string;
    Payerid: string;
    facility: string;
    claim_total: number;
    date_created: Date;
    cpt: string;
    Patient_Account: number;
}

export class BatchViewModel {
    batch_id: number;
    batch_name: string;
    provider_id: number;
    date: Date;
    file_generated: boolean;
    file_path: string;
    downloaded_by: string;
    downloaded_date: Date;
    practice_id: number;
    deleted: boolean;
    created_user: number;
    date_created: Date;
    modified_user: number;
    date_modified: Date;
    client_date_created: Date;
    client_date_modified: Date;
    system_ip: string;
    batch_lock: boolean;
    batch_status: string;
    date_uploaded: Date;
    uploaded_user: number;
    date_processed: Date;
    response_file_path: string;
    batch_status_detail: string;
    batch_type: string;
}

export class BatchCreateViewModel {
    BatchId: number;
    BatchName: string;
    ProviderCode: number;
    Date: Date;
    DateStr: string;
    BatchType: string;
    PracticeCode: number;
    submission_type: 'Electronic';
    batch_claim_type: 'P';
    /**
     *
     */
    constructor() {
        // this.BatchType = 'P';
    }
}

export class BatchListRequestViewModel {
    PracticeCode: number;
    ProviderCode: number;
    prac_type: string
}
export class BatchListResponseViewModel {
    TotalBatch: number;
    Batches: BatchListViewModel[];
    /**
     *
     */
    constructor() {
        this.Batches = [];
    }
}
export class BatchListViewModel {
    batch_id: number;
    batch_name: string;
    claimsTotal: number;
    batch_lock: boolean;
    practice_id: number;
    provider_id: number;
    date_created: Date;
    Submission_Type: string;
    On_Hold: boolean
}

export class AddInBatchRequestViewModel {
    ClaimIds: number[];
    ClaimInsuranceIds:number[];
    BatchId: number;
    PracticeCode: number;
    type: string;
    /**
     *
     */
    constructor() {
        this.ClaimIds = [];
    }
}

export class LockBatchRequestViewModel {
    BatchId: number;
    UserId: number;
}
export class HoldBatchRequestViewModel {
    BatchId: number;
    holdStatus: boolean;
}

export class BatchErrorsRequestModel {
    practiceCode: number;
    bactchId: number;
    providerCode: number;
    dateFrom: string;
    dateTo: string;
    batch_type: string
}
export class BatchExceptionRequestModel {
    practiceCode: number;
    bactchId: number;
    providerCode: number;
    dateFrom: string;
    dateTo: string;
    batch_type: string
}
export class BatchFileException {
    Error_Id: number;
    Batch_Id: number;
    Batch_Name: string;
    Claim_No: number;
    Error_Date: Date;

}
export class BatchFileErrors {
    Error_Id: number;
    Batch_Id: number;
    Batch_Name: string;
    Patient_Account: number
    Claim_No: number;
    DOS: Date;
    Patient_Name: string;
    Errors: string;
    provider_id: number;
    Error_Date: Date;
    ErrorsArray: string[];
    First_Name: string;
    Last_Name: string;
}

export class BatchesHistoryRequestModel {
    Practice_Code: number;
    Provider_Code: number;
    Date_From: string;
    Date_To: string;
    Date_Type: string = null;
    Prac_type: string = null;
    Sub_type: string = null;
}

export class BatchesHistoryResponseModel {
    Batch_Id: number;
    Batch_Name: string;
    File_Generated: boolean;
    File_Path: string;
    Batch_Lock: boolean;
    Batch_Status: string;
    Process_Date: Date;
    Response_File_Path: string;
    Batch_Type: string;
    Uploaded_Date: Date;
    Uploaded_User_Id: number;
    Uploaded_User_Name: string;
    Created_User_Id: number;
    Created_Date: Date;
    Created_User_Name: string;
    Modified_User_Id: number;
    Modified_Date: Date;
    Modified_User_Name: string;
    Provider_Code: number;
    Provid_FName: string;
    Provid_LName: string;
}

export class BatchDetails {
    Batch_Details_Id: number;
    Batch_id: number;
    Claim_No: number;
    DOS: Date;
    Billed_Amount: number;
}

export class CustomValue {
    ID: number;
    Column_Name: string;
    Table_Name: string;
    Operator: string;
    Custom_Values: string;
    ErrorMessage: string;
    Practice_Code: string;
    Table_Name2: string;
  }