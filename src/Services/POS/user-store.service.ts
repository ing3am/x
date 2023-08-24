import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }
  
  //AGREGAR USUARIO POR COMPAÑÍA POR ID
  async getByCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/UserStore/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`)
  }

  //OBTENER CONFIGURACIÓN DE DOCUMENTOS PARA EL POS
  async getUserStoreID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/UserStore/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }

  //GUARDAR CONFIGURACIÓN DE LOS DOCUMENTOS POR TIENDA
  async addUserStore(id, item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/UserStore/Add?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
}
