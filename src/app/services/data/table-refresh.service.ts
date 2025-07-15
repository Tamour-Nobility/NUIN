import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableRefreshService {
  refresh: Subject<any>;
  constructor() {
    this.refresh = new Subject();
  }
}
