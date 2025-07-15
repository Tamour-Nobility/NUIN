import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
private _paymentModel =new Subject<any>();
paymentModel =this._paymentModel.asObservable()

private _message =new Subject<any>();
message =this._message.asObservable()
  constructor() { }

  sendData(data:any){
    this._paymentModel.next(data)
  }
  sendMessage(message:any){
    this._message.next(message)
  }
  
}
