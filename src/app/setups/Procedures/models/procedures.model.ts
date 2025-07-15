import { SelectListViewModel } from '../../../models/common/selectList.model';

export class ProcedureViewModel {
    ProcedureCode: string;
    ProcedureDescription: string;
    ProcedureDefaultCharge: number;
    ProcedureDefaultModifier: string = null;
    ProcedurePosCode: string= null;
    ProcedureTosCode: string;
    EffectiveDate: Date;
    GenderAppliedOn: string =null;
    AgeCategory: string =null;
    AgeRangeCriteria: string =null;
    AgeFrom: number;
    AgeTo: number;
    Deleted: boolean;
    CreatedBy: number;
    CreatedDate: Date;
    ModifiedBy: number;
    ModifiedDate: Date;
    ProcedureEffectiveDate: Date;
    IncludeInEDI: boolean = true;
    clia_number: boolean;
    CategoryId: number = 0;
    MxUnits: number;
    LongDescription: string;
    Comments: string;
    TimeMin: number;
    Qualifier: string;
    CPTDosage: string;
    NOC: boolean;
    ComponentCode: number;
    Alternate_Code: string;
    oldProcCode: string = '';
    oldAlternateCode: string = '';
}

export class ProceduresSearchViewModel {
    ProcedureCode: string;
    ProcedureDescription: string;
}

export class ProcedureDropdownListViewModel {
    Modifiers: SelectListViewModel[];
    POS: SelectListViewModel[];
    Category: SelectListViewModel[];
    constructor() {
        this.Modifiers = [];
        this.POS = [];
        this.Category = [];
    }
}