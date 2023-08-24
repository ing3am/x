import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from 'src/Services/Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER INFORMACIÓN CIUDAD COMPAÑÍA
  get() {
    const url = `${this.config.getUrl()}/Cities/Get`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER INFORMACIÓN CIUDADES COMPAÑÍA {ID}
  getByID(id) {
    const url = `${this.config.getUrl()}/Cities/GetByID?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER INFORMACIÓN CIUDADES COMPAÑÍA {ID}
  getByState(id) {
    const url = `${this.config.getUrl()}/Cities/GetByState?stateid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR CIUDAD COMPAÑIA
  add(item) {
    const url = `${this.config.getUrl()}/Cities/Add?companyid=${this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR CIUDADES COMPAÑIA
  update(id, item) {
    const url = `${this.config.getUrl()}/Cities/Update?companyid=${
      this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('post', url, item);
  }

}
