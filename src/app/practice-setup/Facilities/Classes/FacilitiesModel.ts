// export class PracticeFacility {
//     PracticeFacilityCode: number;
//     FacilityCode: number;
//     Name: string;
//     Address: string;
//     NPI: string;
//     Zip:string;
//     City: string;
//     State:string;
//     Phone: string;
//     Facility_Contact_Name:string;
//     Facility_Type:string;
// }


// public partial class GetPracticeFacilites_Result
// {
//     public long PracticeFacilityCode { get; set; }
//     public long FacilityCode { get; set; }
//     public string Name { get; set; }
//     public string City { get; set; }
//     public string Phone { get; set; }
//     public string Address { get; set; }
// }


export class PracticeFacilityModel{
    Status :string;
    Response:PracticeFacility[];
    constructor (){
        this.Response=[];
    }
}


export class GetPracticeFacilites
{
    PracticeFacilityCode:number;
    FacilityCode:number;
    resp:PracticeFacility;

    constructor (){
        this.resp=new PracticeFacility;
}
}

export class PracticeFacility {
    PracticeFacilityCode:number;
    Facility_Code: number;
    Facility_Name: string;
    Name:string;
    City:string;
    Facility_Address: string;
    Facility_City: string;
    Facility_State: string;
    Facility_ZIP: string;
    Facility_Contact_Name: string;
    Phone:string;
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
    isDefault:boolean;
    POS:string;
    PracticeCode:number;
    FacilityCode:number;    
}




