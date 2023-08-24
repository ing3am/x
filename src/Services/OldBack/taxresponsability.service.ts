import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TaxresponsabilityService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService,
    private localStorage : LocalService
  ) { }

  //OBTENER RESPONSABILIDAD FISCAL POR COMPAÑÍA
  getByCompany(id) {
    const url = `${this.config.getUrl()}/TaxResponsabilities/GetByCompany?companyid=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER RESPONSABILIDAD FISCAL POR COMPAÑÍA PARA CONTROL NG SELECT
  async GetTaxResponsabilitiesByCompanyNgSelect(id) {
    const url = `${this.config.getUrl()}/TaxResponsabilities/GetTaxResponsabilitiesByCompanyNgSelect?id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER RESPONSABILIDAD FISCAL POR COMPAÑÍA POR ID
  getByID(id) {
    const url = `${this.config.getUrl()}/TaxResponsabilities/GetByID?companyid=${
      this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR RESPONSABILIDAD FISCAL POR COMPAÑÍA
  add(item) {
    const url = `${this.config.getUrl()}/TaxResponsabilities/Add?companyid=${
      this.localStorage.getJsonValue('CIA')}`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR RESPONSABILIDAD FISCAL POR COMPAÑÍA
  update(id, item) {
    const url = `${this.config.getUrl()}/TaxResponsabilities/Update/?companyid=${
      this.localStorage.getJsonValue('CIA')}&id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }
}
