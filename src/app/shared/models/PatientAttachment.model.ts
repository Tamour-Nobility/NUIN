
export class PatientAttachmentModel {
    Patient_Attachment_Id: number;
    Attachment_TypeCode_Id: string;
    Attachment_TypeCode_Description: string;
    Patient_Account: number;
    FileName: string;
    FilePath: string;
    CreatedBy: number;
    CreatedByUsername: string;
    CreatedDate: Date;
    ModifiedBy?: number;
    ModifiedByUsername?: string;
    ModifiedDate?: Date;
}
export class PatientNote {
    Patient_Notes_Id: number;
    Patient_Account: number;
    Ptn_Note_Id: number;
    Ptn_Scan_No: string;
    Ptn_Note_Content: string;
    Ptn_Created_By: number;
    Ptn_Created_Date: string;
    Ptn_Modified_By: number;
    Ptn_Modified_Date: string;
    Ptn_Deleted: boolean;
    Scan_Date: string;
    Page_no: number;
    Created_From: string;
    Modified_from: string;
    IsAuto_Note: boolean;

}