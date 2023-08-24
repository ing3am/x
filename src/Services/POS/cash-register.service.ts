import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  async getValidateExists() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/CashRegister/ValidateExists?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}&userid=${await this.localStorage.getJsonValue('userID')}`);
  }

  async getCashRegisterByStore() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/CashRegister/getCashRegisterByStore?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}`);
  }

  async getCashRegisterByID(cashrid) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/CashRegister/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&cashrid=${cashrid}`);
  }
}
