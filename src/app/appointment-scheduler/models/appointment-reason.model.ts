export class AppointmentReason {
    Reason_Id: number;
    Reason_Description: number;
    Reason_Color: number;
}

export class PracticeAppointmentReasonViewModel {
    PracAppReasonID: number;
    ReasonId: number;
    Description: string;
    ReasonColor: string;
}

export class PracticeAppointmentReasonCreateVM {
    PracticeCode: number;
    ProviderCode: number;
    LocationCode: number;
    ReasonsIds: number[]
    /**
     *
     */
    constructor() {
        this.ReasonsIds = [];
    }
}