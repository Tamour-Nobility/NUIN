export class SelectListViewModel {
    Id: any;
    Name: any;
    IdStr: any;
    Meta?: any;
    Is_Active:boolean;
    constructor(private _Id?: any, private _Name?: any, private _IdStr?: any, private _Meta?: any, private _Is_Active?:boolean) {
        this.Id = _Id;
        this.Name = _Name;
        this.IdStr = _IdStr;
        this.Meta = _Meta;
        this.Is_Active = _Is_Active;
    }
}
export class SelectListViewModelForProvider {
    Id: any;
    Name: any;
    IdStr: any;
    Meta?: any;
    Is_Active:boolean;
    SPECIALIZATION_CODE:any;
    provider_State:any;
    constructor(private _Id?: any, private _Name?: any, private _IdStr?: any, private _Meta?: any , private _SPECIALIZATION_CODE?:any , private _provider_State?:any,private _Is_Active?:boolean ) {
        this.Id = _Id;
        this.Name = _Name;
        this.IdStr = _IdStr;
        this.Meta = _Meta;
        this.Is_Active = _Is_Active;
        this.SPECIALIZATION_CODE=_SPECIALIZATION_CODE;
        this.provider_State=_provider_State;

    }
}
export class TagListViewModel {
    Id: any;
    Name: any;
    constructor(private _Id: any, private _Name: any) {
        this.Id = _Id;
        this.Name = _Name;
    }
}