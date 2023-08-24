import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsMeansIdService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService
  ) { }

  getPaymentMeansID() {
    const url = `${this.config.getUrl()}/PaymentMeans/Get`;
    return this.httpService.sendRequest('get', url);
  }
}
