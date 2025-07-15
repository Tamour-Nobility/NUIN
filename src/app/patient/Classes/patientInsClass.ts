export class InsuranceSearchReponseModel {
    Insgroup_Name: string;
    Inspayer_Description: string;
    Inspayer_Id: number;
    Insurance_Id: number;
    Insname_Description: string;
    Insurance_Address: string;
    Insurance_Zip: string;
    Insurance_City: string;
    Insurance_State: string;
    InsPayerID : number
}
export class InsuranceModel {
    PracticeCode: string;
    PayerId: string;
    PayerDescription: string;
    NameId: string;
    InsuranceName: string;
    InsuranceId: string;
    GroupName: string;
    InsuranceAddress: string;
    State: string;
    City: string;
    ZIP: string;
    SearchFrom: string;
    GroupList: GroupNameListModel[];
    emcNo: string;
    setupType: string;
}

class GroupNameListModel {
    id: number;
    Name: string;
}

export class zipdata {
    CityName: string;
    State: string;
}