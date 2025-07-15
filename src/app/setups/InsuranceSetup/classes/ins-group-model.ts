export class groupModel {
    Response = new response;
    Status: string;
}
class response {
    Insgroup_Id: number;
    Insgroup_Name: string;
    Created_By: number;
    Created_Date: string;
    Modified_By: number;
    Modified_Date: string;
    Deleted: string;
    Created_By_Name: string;
    Modified_By_Name: string;
}