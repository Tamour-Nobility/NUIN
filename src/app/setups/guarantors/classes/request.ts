export class RequestGuarantor {
    Status :string;
    Response=new Response;
}
export class Response {
    Guarantor_Code: number;
    Guarant_Lname: string;
    Guarant_Fname: string;
    Guarant_Mi: string
    Guarant_Address: string;
    Guarant_City: string;
    Guarant_State: string;
    Guarant_Zip: string;
    Guarant_Dob: string;
    Guarant_Ssn: string;
    Guarant_Gender: string;
    Guarant_Home_Phone: string;
    GUARANT_Work_Phone: string;
    GUARANT_Work_Phone_Ext: string;
    Exported: string;
    Deleted: string;
    created_by: string;
    created_date: string;
    modified_by: string;
    modified_date: string;
    Guarant_Type: string
}
export class SearchCriteria {
    Status :string;
    Response=new Response;
}