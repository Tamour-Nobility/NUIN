export class Pager {
    Page: number;
    PageSize: number;
    SortOrder: string;
    SortBy: string;
    SearchString: string;
    constructor(Page?: number, PageSize?: number, SortOrder?: string, SortBy?: string, SearchString?: string) {
        this.Page = Page;
        this.PageSize = PageSize;
        this.SortOrder = SortOrder;
        this.SortBy = SortBy;
        this.SearchString = SearchString;
    }
}
export class PagingResponse {
    TotalRecords: number;
    FilteredRecords: number;
    data: any[];
    constructor(TotalRecords?: number) {
        this.data = [];
        this.TotalRecords = TotalRecords;
    }
}