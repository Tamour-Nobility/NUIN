import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardRefreshService {
    refresh: Subject<any>;
    constructor() {
        this.refresh = new Subject();
    }
}
