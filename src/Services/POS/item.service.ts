import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER PRODUCTOS COMPAÑÍA
  async getByCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Items/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`);
  }
  
  //OBTENER PRODUCTOS COMPAÑÍA POR {ID}
  async getByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Items/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
  
  //GUARDAR PRODUCTOS COMPAÑÍA ID
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Items/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //ACTUALIZAR PRODUCTOS COMPAÑÍA ID
  async update(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/Items/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`, JSON.stringify(item))
  }
  
  //ELIMINAR PRODUCTOS COMPAÑÍA ID
  async delete(id) {
    return this.httpService.sendRequest('delete', `${this.config.getUrl()}/Items/Delete?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
}
