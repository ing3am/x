import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigBankService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER CONFIGURACIÓN DE BANCOS PARA EL POS
  async getBanksByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigBank/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }

  //GUARDAR CONFIGURACIÓN DE BANCOS POR TIENDA
  async addBanks(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigBank/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //ACTUALIZAR CONFIGURACIÓN DE BANCOS POR TIENDA
  async updateBank(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigBank/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
}
