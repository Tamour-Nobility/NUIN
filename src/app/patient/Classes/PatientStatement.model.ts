export class PatientStatementRequest {
    statementRequest: StatementRequest[];
    Format: string;
    PracticeCode: number;
    Confirmation: boolean;
    constructor() {
        this.statementRequest = [];
        this.Confirmation = false;
    }
}
export class StatementRequest {
    PatientAccount: number;
    ExcludedClaimsIds: number[];
    constructor(private _PatientAccount?: number, private _ExcludedClaimsIds: number[] = []) {
        this.PatientAccount = _PatientAccount;
        this.ExcludedClaimsIds = _ExcludedClaimsIds;
    }
}

export class MessageModel{

     Message_ID  :number;

    Messages :string;

    PracticeCode:any; 

    Deleted :boolean;

    Created_By :number;

   Created_Date:Date;

     Modified_By :Number;

     Modified_Date :Date;


}

export class MessageModelnew{

    Message_ID  :number;

   Messages :string;

   PracticeCode:number; 

   Deleted :boolean;

   Created_By :number;

  Created_Date:Date;

    Modified_By :Number;

    Modified_Date :Date;


}