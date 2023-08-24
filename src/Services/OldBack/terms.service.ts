import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TermsService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER TÉRMINOS DE PAGO POR COMPAÑÍA
  getByCompany(id) {
    const url = `${this.config.getUrl()}/Terms/GetByCompany?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER TÉRMINO DE PAGO POR COMPAÑÍA POR ID
  getByID(id) {
    const url = `${this.config.getUrl()}/Terms/GetByID?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR TERMINOS DE PAGO
  add(item) {
    const url = `${this.config.getUrl()}/Terms/Add?companyid=${this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR TERMINOS DE PAGO
  update(id, item) {
    const url = `${this.config.getUrl()}/terms/Update?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('post', url, item);
  }
  
}
