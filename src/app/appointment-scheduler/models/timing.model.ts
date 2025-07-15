export class ProviderWorkingDayTime {
    PRACTICE_CODE: number;
    PROVIDER_CODE: number;
    LOCATION_CODE: number;
    weekday_id: string;
    dayNam: string;
    Time_From: string;
    Time_To: string;
    AMPMTIMEFROM: string;
    AMPMTIMEto: string;
    Break_time_From: string;
    Break_Time_To: string;
    Enable_Break: boolean;
    Day_on: boolean;
    time_slot_size: number;
    Provider_Working_Days_Time_Id: number
    hasBreakError?: boolean;
    constructor() {
    }
}

export class TimingSearchViewModel {
    practiceCode: number;
    providerCode: number;
    locationCode: number;
    dateFrom: string;
    dateTo: string;
    constructor() {
        this.providerCode = null,
            this.locationCode = null;
    }
}
export class ProviderSchedulesViewModel {
    PracticeCode: number;
    ProviderCode: number;
    LocationCode: number;
    DateFrom: string;
    DateTo: string;
    SrNo: number;
}

export class ProviderAppointmentRules {
    Rule_Id?: number;
    Practice_Code: number;
    Provider_code: number;
    Location_code: number;
    No_Appointments_Start_Time: string;
    No_Appointment_End_Time: string;

    constructor() {
        this.Provider_code = null;
        this.Location_code = null;
    }
}

export class ProviderAppointmentRuleViewModel {
    No_Appointments_Start_Date: string;
    No_Appointment_End_Date: string;
    No_Appointments_Start_Time: string;
    No_Appointment_End_Time: string;
}
