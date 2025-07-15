export class ReportRequestModel {
       practiceCode: number;
       dateTo: string;
       dateFrom: string;
       locationCode?: number[];
       month: string;
       dateType: string;
       dataType: string;
       pagedRequest: PagedRequest;
   
       /**
        *
        */
       constructor() {
           this.locationCode = [];
           this.pagedRequest = new PagedRequest();
       }
   }
   
   export class PagedRequest {
       isExport: boolean ;
       page: number ;
       size: number ;
   }
   