import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER CLIENTES POR COMPAÑÍA {ID}
  async getByCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Customers/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`);
  }
  //ACTUALIZAR CLIENTES POR COMPAÑÍA {ID}
  async update(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/Customers/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`, JSON.stringify(item))
  }
  //GUARDAR CLIENTES POR COMPAÑÍA {ID}
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Customers/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

}
