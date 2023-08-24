import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatedService {

  constructor(
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  calculatedARInvoiceHeadLine(obj, i) {
    return this.httpService.sendRequest('post', `${this.config.getUrlCalculated()}/CalculatedARInvoiceHead/CalculatedARInvoiceHeadLine?i=${i}`, JSON.stringify(obj))
  }

  calculatedARInvoiceHeadTotal(obj) {
    return this.httpService.sendRequest('post', `${this.config.getUrlCalculated()}/CalculatedARInvoiceHead/CalculatedARInvoiceHeadTotal`, JSON.stringify(obj))
  }

  calculatedPOSHeadLine(obj, i) {
    return this.httpService.sendRequest('post', `${this.config.getUrlCalculated()}/CalculatedPOS/CalculatedPOSLine?i=${i}`, JSON.stringify(obj))
  }

  calculatedPOSTotal(obj) {
    return this.httpService.sendRequest('post', `${this.config.getUrlCalculated()}/CalculatedPOS/CalculatedPOSTotal`, JSON.stringify(obj))
  }
}
