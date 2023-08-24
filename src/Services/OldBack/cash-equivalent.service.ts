import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalStService } from '../Config/local-st.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class CashEquivalentService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER INFORMACIÓN DE EFECTIVO Y EQUIVALENTE COMPAÑÍA
  getByCompany(id) {
    const url = `${this.config.getUrl()}/CashEquivalents/GetByCompany?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER INFORMACIÓN DE EFECTIVO Y EQUIVALENTE COMPAÑÍA Y ID
  getByID(id) {
    const url = `${this.config.getUrl()}/CashEquivalents/GetByID?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR EFECTIVO Y EQUIVALENTE
  add(item) {
    const url = `${this.config.getUrl()}/CashEquivalents/Add?companyid=${this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR EFECTIVO Y EQUIVALENTE
  update(id, item) {
    const url = `${this.config.getUrl()}/CashEquivalents/Update?companyid=${
      this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }

  //ELIMINAR EFECTIVO Y EQUIVALENTE
  delete(id) {
    const url = `${this.config.getUrl()}/CashEquivalents/Delete?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('delete', url);
  }
}
