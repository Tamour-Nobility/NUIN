// export class LocationModel {
//     Status: string;
//     Response =new  Response;
// } 
export class LocationModel {
    Location_Code: number;
    Location_Name: string;
    Practice_Code: number;
    Location_Address: string;
    Location_City: string;
    Location_State: string;
    Location_Zip: string;
    Location_Short: string;
    Clia_Number: string;
    Clia_Expiry_Date: string;
    Phone_one: string;
    Phone_two: string;
    phone_type_one: string;
    phone_type_two: string;
    Deleted: boolean;
    Created_By: number;
    Created_Date: Date;
    Modified_By: number;
    Modified_Date: Date;
    Is_Active: boolean;
    Phone_Ext_One: string;
    Phone_Ext_Two: string;
    Location_ID: string;
    is_default: boolean;
    NPI: string;
}
export class SaveLocationRequest {
    Location_Code: number;
    Location_Name: string;
    Practice_Code: number;
    Location_Address: string;
    Location_City: string;
    Location_State: string;
    Location_Zip: string;
    Location_Short: string;
    Clia_Number: string;
    Clia_Expiry_Date: string;
    Phone_one: string;
    Phone_two: string;
    phone_type_one: string;
    phone_type_two: string;
    Deleted: boolean;
    Created_By: number;
    Created_Date: Date;
    Modified_By: number;
    Modified_Date: Date;
    Is_Active: boolean;
    Phone_Ext_One: string;
    Phone_Ext_Two: string;
    Location_ID: string;
    NPI: string;
    is_default: boolean;
}
