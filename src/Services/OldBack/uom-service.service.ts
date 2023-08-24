import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class UomServiceService {
  
  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER UNIDADES DE MEDIDA POR COMPAÑÍA
  getByCompany(id) {
    const url = `${this.config.getUrl()}/UOM/GetByCompany?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER UNIDADES DE MEDIDA POR COMPAÑÍA POR ID
  getByID(id) {
    const url = `${this.config.getUrl()}/UOM/GetByID?companyid=${
          this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR UNIDAD DE MEDIDA
  add(item) {
    const url = `${this.config.getUrl()}/UOM/Add?companyid=${
      this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR UNIDAD DE MEDIDA
  update(id, item) {
    const url = `${this.config.getUrl()}/UOM/Update?companyid=${
      this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }

}
