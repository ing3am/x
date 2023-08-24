import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER TIENDAS DISPONIBLE COMPAÑÍA
  async getByCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`);
  }

  getByCompanyLogin(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByCompany?companyid=${id}`);
  }

  //OBTENER VALIDACIÓN DE TIENDA
  async getByIDValitionContinue(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByIDValitionContinue?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }

  //OBTENER TIENDAS DISPONIBLE COMPAÑÍA
  async getByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }

  //GUARDAR TIENDA PARA LA COMPAÑÍA
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/Stores/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //ACTUALIZAR TIENDA PARA LA COMPAÑÍA
  async update(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/Stores/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
  
}
