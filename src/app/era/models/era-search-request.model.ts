export class ERASearchRequestModel {
    practiceCode: number;
    checkNo: string;
    checkAmount: string;
    dateFrom: string;
    dateTo: string;
    dateType: string = 'check';
    icnNo: string;
    patientAccount: string;
    status: string = 'u';
}