export class ClaimPaymentsDetailRequest {
    PracCode: number;
    PaymentType: string;
    PaymentFrom: string;
    CheckNo: number;
    PatientName: string;
    InsuranceName: string;
    ReceivedDateFrom: Date;
    ReceivedDateTo: Date;
}

export class ClaimPaymentsDetail {
    paymentId: number;
    postedBy: string;
    paymentFrom: string;
    paymentType: string;
    checkNo: number;
    checkDate: Date;
    depositDate: Date;
    totalAmount: number;
    postedAmount: number;
}