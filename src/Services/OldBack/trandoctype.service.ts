import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TrandoctypeService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER TIPOS DE DOCUMENTO POR COMPAÑÍA
  async getByCompany(id) {
    const url = `${this.config.getUrl()}/TranDocTypes/GetByCompany?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER TIPOS DE DOCUMENTO POR COMPAÑÍA POR ID
  async getByID(id) {
    const url = `${this.config.getUrl()}/TranDocTypes/GetByID?companyid=${
      await this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //AGREGAR UN NUEVO TIPO DE DOCUMENTO POR COMPAÑÍA
  async add(item) {
    const url = `${this.config.getUrl()}/TranDocTypes/Add?companyid=${
      await this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR UN NUEVO TIPO DE DOCUMENTO POR COMPAÑÍA
  async update(id, item) {
    const url = `${this.config.getUrl()}/TranDocTypes/Update?companyid=${
      await this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }

  //OBTENER RESOLUCIÓN DIAN
  async getResolucion(nit) {
    const url = `${this.config.getUrl()}/TranDocTypes/GetResolucion?companyid=${await this.localStorage.getJsonValue('CIA')}&nit=${nit}`;
    return this.httpService.sendRequest('get', url);
  }

  //Validar cuantos consecutivos quedan según el tipo de documento
  async GetAvailableConcecutiveByTranType(companyId, tranType) {
    const url = `${this.config.getUrl()}/TranDocTypes/GetAvailableConcecutiveByTranType?companyId=${companyId}&tranType=${tranType}`;
    return this.httpService.sendRequest('get', url);
  }

}
