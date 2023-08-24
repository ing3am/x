import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserSecurityService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }
  
  //OBTENER SEGURIDAD DE USUARIO POR COMPAÑÍA POR ID
  async getUserSecurityByCompanyByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/UserSecurity/GetUserSecurityByCompanyByID?companyid=${await this.localStorage.getJsonValue('CIA')}&userid=${id}`)
  }
  //AGREGAR SEGURIDAD POR COMPAÑÍA POR ID
  postUserSecurity(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/UserSecurities/PostUserSecurity`, JSON.stringify(item))
  }
  //ACTUALIZAR SEGURIDAD POR COMPAÑÍA POR ID
  putUserSecurity(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/UserSecurities/PutUserSecurity/${id}`, JSON.stringify(item))
  }
}
