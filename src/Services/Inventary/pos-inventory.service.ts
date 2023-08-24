import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class PosInventoryService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER ROLES POR COMPAÑÍA
  async getByInventoyForStore(id, warehouse, bincode) {
    const url = `${this.config.getUrlPos()}/POSInventory/GetByInventoyForStore?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}`;
    return this.httpService.sendRequest('get', url);
  }

  async getByInventoyForStoreLimit(id, warehouse, bincode, limit) {
    const url = `${this.config.getUrlPos()}/POSInventory/GetByInventoyForStoreLimit?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}&Limit=${limit}`;
    return this.httpService.sendRequest('get', url);
  }

  async getByInventoryForStoreLimit(id, warehouse, bincode, limit) {
    const url = `${this.config.getUrlPos()}/POSInventory/GetByInventoryForStoreLimit?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}&Limit=${limit}`;
    return this.httpService.sendRequest('get', url);
  }

  async getAllItemsNoImgPOS(id, warehouse, bincode) {
    const url = `${this.config.getUrl()}/ItemBin/GetAllItemsNoImgPOS?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}`;
    return this.httpService.sendRequest('get', url);
  }

  async getItemsImgsPOS(id) {
    const url = `${this.config.getUrl()}/ItemBin/GetItemsImgsPOS?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`;
    return this.httpService.sendRequest('get', url);
  }
}
