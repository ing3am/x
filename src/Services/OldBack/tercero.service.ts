import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TerceroService {

  constructor(
    private config: ConfigService,
    private httpService: HttpService,
    private localStorage: LocalService
  ) { }

  //OBTENER TERCERO COMPAÑÍA
  getByCompany(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Terceros/GetByCompany?companyid=${id}`);
  }
  //OBTENER TERCERO COMPAÑÍA POR ID
  async getByID(id, cmd) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Terceros/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}&cmd=${cmd}`);
  }
  //GUARDAR TERCERO COMPAÑÍA
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Terceros/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  //GUARDAR TERCERO COMPAÑÍA
  async update(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/Terceros/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`, JSON.stringify(item))
  }
}
