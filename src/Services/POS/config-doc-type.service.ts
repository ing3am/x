import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigDocTypeService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER CONFIGURACIÓN DE DOCUMENTOS PARA EL POS
  async getDocTypeByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigDocType/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }

  //GUARDAR CONFIGURACIÓN DE LOS DOCUMENTOS POR TIENDA
  async addDocType(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigDocType/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //ACTUALIZAR CONFIGURACIÓN DE LOS DOCUMENTOS POR TIENDA
  async updateDocType(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigDocType/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }

  //OBTENER CONFIGURACIÓN DE INVENTARIO PARA EL POS
  async getInventoryByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigInventory/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }

  //GUARDAR CONFIGURACIÓN DEL INVENTARIO POR TIENDA
  async addInventory(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigInventory/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //ACTUALIZAR CONFIGURACIÓN DEL INVENTARIO POR TIENDA
  async updateInventory(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigInventory/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
}
