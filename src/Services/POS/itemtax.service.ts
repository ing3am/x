import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ItemtaxService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }
  //OBTENER IMPUESTOS DE PRODUCTOS COMPAÑÍA

  async getByCompany(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/ItemTaxes/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
  //GUARDAR PRODUCTOS COMPAÑÍA ID
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/ItemTaxes/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //ACTUALIZAR PRODUCTOS COMPAÑÍA ID
  async update(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/ItemTaxes/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`, JSON.stringify(item))
  }
  
  //ELIMINAR PRODUCTOS COMPAÑÍA ID
  async delete(itemid, taxid, rateid) {
    return this.httpService.sendRequest('delete', `${this.config.getUrl()}/ItemTaxes/Delete?companyid=${await this.localStorage.getJsonValue('CIA')}&itemId=${itemid}&taxId=${taxid}&rateCode=${rateid}`);
  }
}
