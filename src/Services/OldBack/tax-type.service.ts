import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TaxTypeService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService : HttpService
  ) { }

  //OBTENER TIPO DE IMPUESTO POR COMPAÑÍA
  getByCompany(id) {
    const url = `${this.config.getUrl()}/TaxTypes/GetByCompany?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }
  
  //OBTENER TIPO DE IMPUESTO POR COMPAÑÍA
  getByID(id) {
    const url = `${this.config.getUrl()}/TaxTypes/GetByID?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER TIPO DE IMPUESTO POR COMPAÑÍA
  add(item) {
    const url = `${this.config.getUrl()}/TaxTypes/Add?companyid=${this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //OBTENER TIPO DE IMPUESTO POR COMPAÑÍA
  update(id, item) {
    const url = `${this.config.getUrl()}/TaxTypes/Update?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }

}
