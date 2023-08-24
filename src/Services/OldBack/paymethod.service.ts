import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class PaymethodService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER METODOS DE PAGO POR COMPAÑÍA INCLUYENDO LOS CREDITOS
  getByCompanyAll(id) {
    const url = `${this.config.getUrl()}/PayMethods/GetByCompanyAll?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER METODOS DE PAGO POR COMPAÑÍA
  getByCompany(id) {
    const url = `${this.config.getUrl()}/PayMethods/GetByCompany?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER METODOS DE PAGO POR COMPAÑÍA POR ID
  getByID(id) {
    const url = `${this.config.getUrl()}/PayMethods/GetByID?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR METODOS DE PAGO POR COMPAÑÍA
  add(item) {
    const url = `${this.config.getUrl()}/PayMethods/Add?companyid=${this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR METODOS DE PAGO POR COMPAÑÍA
  update(id, item) {
    const url = `${this.config.getUrl()}/PayMethods/Update?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }

  //ELIMINAR METODOS DE PAGO POR COMPAÑÍA POR ID
  delete(id) {
    const url = `${this.config.getUrl()}/PayMethods/Delete?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('delete', url);
  }

}
