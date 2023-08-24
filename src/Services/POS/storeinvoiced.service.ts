import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class StoreinvoicedService { 

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER INFORMACIÓN DE LA ORDEN POR EMPRESA Y TIENDA
  async getByStoreIdAndCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/StoreInvoiced/GetByStoreIdAndCompany?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}`);
  }

  //OBTENER INFORMACIÓN DE LA ORDEN POR EMPRESA,TIENDA Y USUARIO
  async getByStoreIdAndCompanyAndUserID(userid) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/StoreInvoiced/GetByStoreIdAndCompanyAndUserID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}&userid=${userid}`);
  }

  //OBTENER INFORMACIÓN DE LA ORDEN POR EMPRESA,TIENDA,USUARIO Y ORDEN
  async getByID(userid, ordernum) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/StoreInvoiced/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}&userid=${userid}&ordernum=${ordernum}`);
  }

  //GUARDAR REGISTRO
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/StoreInvoiced/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //ACTUALIZAR REGISTRO
  async update(item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/StoreInvoiced/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}`, JSON.stringify(item))
  }

  //ELIMINAR REGISTRO
  async delete(userid, ordernum) {
    return this.httpService.sendRequest('delete', `${this.config.getUrlPos()}/StoreInvoiced/Delete?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}&userid=${userid}&ordernum=${ordernum}`);
  }
}
