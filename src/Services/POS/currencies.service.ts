import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  constructor(
    private config: ConfigService,
    private localStorage: LocalService,
    private httpService: HttpService
  ) { }

  //OBTENER TODOS LAS MONEDAS POR COMPAÑÍA
  async getByCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Currencies/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`);
  }

  //OBTENER TODOS LAS MONEDAS POR COMPAÑÍA
  async getByID(cia, currencycode) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Currencies/GetByID?companyid=${cia}&currencycode=${currencycode}`);
  }

  //GUARDAR MONEDA POR COMPAÑÍA
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Currencies/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //ACTUALIZAR MONEDA POR COMPAÑÍA
  async update(id, item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Currencies/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`, JSON.stringify(item))

  }

  //ELIMINAR MONEDA POR COMPAÑÍA
  async delete(id) {
    return this.httpService.sendRequest('delete', `${this.config.getUrl()}/Currencies/Delete?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }

}
