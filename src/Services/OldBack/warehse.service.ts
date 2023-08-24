import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class WarehseService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER ALMACENES COMPAÑÍA
  async getByCompany() {
    const url = `${this.config.getUrl()}/Warehouses/GetByCompany?companyid=${
      await this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER ALMACÉN POR COMPAÑIA y ITEMID
  async GetByCompanyAndItemId(itemId) {
    const url = `${this.config.getUrl()}/Warehouses/GetByCompanyAndItemId?companyid=${+
      await this.localStorage.getJsonValue('CIA')}&ItemId=${itemId}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER ALMACEN POR ID COMPAÑÍA
  async getByID(id) {
    const url = `${this.config.getUrl()}/Warehouses/GetByID?companyid=${+
      await this.localStorage.getJsonValue('CIA')}&Warehousecode=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR ALMACEN COMPAÑÍA
  async add(item) {
    const url = `${this.config.getUrl()}/Warehouses/Add?companyid=${
      await this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //GUARDAR ALMACEN COMPAÑÍA
  async update(Warehousecode,item) {
    const url = `${this.config.getUrl()}/Warehouses/Update?companyid=${
      await this.localStorage.getJsonValue('CIA')}&Warehousecode=${Warehousecode}`;
    return this.httpService.sendRequest('put', url, item);
  }

  //ELIMINAR ALMECEN COMPAÑÍA ID
  async delete(id) {
    const url = `${this.config.getUrl()}/Warehouses/Delete?companyid=${+
      await this.localStorage.getJsonValue('CIA')}&Warehousecode=${id}`;
    return this.httpService.sendRequest('delete', url);
  }
}
