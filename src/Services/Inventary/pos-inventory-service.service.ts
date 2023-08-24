import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class PosInventoryServiceService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private http: HttpClient,
    private httpService : HttpService
  ) { }

  //OBTENER ROLES POR COMPAÑÍA
  getByInventoyForStore(id,warehouse,bincode) {
    const url = `${this.config.getUrlPos()}/POSInventory/GetByInventoyForStore?companyid=${this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}`;
    return this.httpService.sendRequest('get', url);
  }

  getByInventoyForStoreLimit(id,warehouse,bincode,limit) {
    const url = `${this.config.getUrlPos()}/POSInventory/GetByInventoyForStoreLimit?companyid=${this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}&Limit=${limit}`;
    return this.httpService.sendRequest('get', url);
  }

  getByInventoryForStoreLimit(id,warehouse,bincode,limit) {
    const url = `${this.config.getUrlPos()}/POSInventory/GetByInventoryForStoreLimit?companyid=${this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}&Limit=${limit}`;
    return this.httpService.sendRequest('get', url);
  }

  getAllItemsNoImgPOS(id,warehouse,bincode) {
    const url = `${this.config.getUrl()}/ItemBin/GetAllItemsNoImgPOS?companyid=${this.localStorage.getJsonValue('CIA')}&storeid=${id}&Warehousecode=${warehouse}&Bincode=${bincode}`;  
    return this.httpService.sendRequest('get', url);
  }

  getItemsImgsPOS(id) {
    const url = `${this.config.getUrl()}/ItemBin/GetItemsImgsPOS?companyid=${this.localStorage.getJsonValue('CIA')}&storeid=${id}`;   
    return this.httpService.sendRequest('get', url);
  }
}
