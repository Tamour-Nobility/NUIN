export class responseFacility{
    Status :string;
    response=new Response;
}
export class Response {
    Facility_Code: number;
    Facility_Name: string;
    Facility_Address: string;
    Facility_City: string;
    Facility_State: string;
    Facility_ZIP: string;
    Facility_Contact_Name: string;
    Facility_Phone: string;
    Facility_Type: string;
    Created_By: string;
    Created_Date: string;
    Modified_By: string;
    Modified_Date: string;
    MTBC_Code: number;
    NPI: string;
    facility_id_number: string;
    IS_DEMO: boolean;
    STOP_IN_SUBMISSION: boolean;
    Practice_Code: String| number;
}
export class saveFacilityModel {
    Status :string;
    Response=new Response;
}