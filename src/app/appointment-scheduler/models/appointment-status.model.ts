export class AppointmentStatus {
    Appointment_Status_Id: number;
    Appointment_Status_Description: string;
}

export class PracticeAppointmentStatus {
    PracAppSID: number;
    PracCode: number
    ProvdID: number
    LocID: number;
    AppStatusID: number;
    Appointment_Status_Description: string;
    constructor() {
        this.AppStatusID = null;
    }
}

export class PracticeAppointmentStatusCreateVM {
    PracticeCode: number;
    AppointmentStatusesId: number[];
}