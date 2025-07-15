export class claimNotes {
    Response:response;
    Status:string;
    constructor () {
        this.Response=new response;
    }
}
class response {
     Claim_No: number ;
         Note_Id: number ;
         Note_Detail: string ;
         Scan_No: string ;
         Note_State: string ;
         No_of_Days: number ;
         Deleted: boolean ;
         Created_By: string ;
         Created_Date: string ;
         Modified_By: string ;
         Modified_Date: string ;
         Claim_Notes_Id: number ;
         Scan_Date: string ;
         Page_No: number ;
         SENT_APPEAL_ID: number ;
         Proposal_Amount: string ;
         Depositslip_Id: string ;
         IsAuto_Note:boolean;
}