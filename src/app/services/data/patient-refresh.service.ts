import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientRefreshService {

  refresh: Subject<any>;
    constructor() {
        this.refresh = new Subject();
    }
}
