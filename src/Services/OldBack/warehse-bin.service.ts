import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class WarehseBinService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER ALMACENES COMPAÑÍA
  async getByCompany(Warehousecode) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Warehousebins/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}&Warehousecode=${Warehousecode}`);
  }

  //OBTENER ALMACEN POR ID COMPAÑÍA
  async getByID(Warehousebincode, binCode) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Warehousebins/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&Warehousebincode=${Warehousebincode}&binCode=${binCode}`);
  }
  //GUARDAR ALMACEN COMPAÑÍA
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Warehousebins/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  //GUARDAR ALMACEN COMPAÑÍA
  async update(Warehousecode, Bincode, item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Warehousebins/Add?companyid=${await this.localStorage.getJsonValue('CIA')}&Bincode=${Bincode}&Warehousecode=${Warehousecode}`, JSON.stringify(item))
  }
  //ELIMINAR ALMECEN COMPAÑÍA ID
  async delete(Warehousebincode, binCode) {
    return this.httpService.sendRequest('delete', `${this.config.getUrl()}/Warehousebins/Delete?companyid=${await this.localStorage.getJsonValue('CIA')}&Warehousebincode=${Warehousebincode}&binCode=${binCode}`);
  }
}
