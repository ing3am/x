import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigPrinterService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER CONFIGURACIÓN DE IMPRESIÓN PARA EL POS
  async getPrinterID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigPrinter/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }

  //GUARDAR CONFIGURACIÓN DE IMPRESIÓN POR TIENDA
  async addPrinters(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigPrinter/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //ACTUALIZAR CONFIGURACIÓN DE IMPRESIÓN POR TIENDA
  async updatePrinters(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigPrinter/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
}
