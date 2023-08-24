import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class CiiucodeService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER INFORMACIÓN CIIU CODE COMPAÑÍA
  get() {
    const url = `${this.config.getUrl()}/CIIUCodes/Get`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER INFORMACIÓN CIIU CODE COMPAÑÍA {ID}
  getByID(id) {
    const url = `${this.config.getUrl()}/CIIUCodes/GetByID?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR CODIGO CIIU COMPAÑIA
  add(item) {
    const url = `${this.config.getUrl()}/CIIUCodes/Add?companyid=${this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR CODIGO CIIU COMPAÑIA
  update(id, item) {
    const url = `${this.config.getUrl()}/CIIUCodes/Update?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('post', url, item);
  }

}
