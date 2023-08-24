import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../Config/config.service';
import { LocalService } from 'src/Services/Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService,
    public router: Router
  ) { }


  //#region TAX
  async getTaxRatesByTax(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Taxes/GetTaxRatesByTax?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
  
  //OBTENER IMPUESTOS POR COMPAÑÍA
  async getByCompany(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Taxes/GetByCompany?companyid=${id}`);
  }
  
  //OBTENER IMPUESTOS POR COMPAÑÍA POR ID
  async getByTaxType(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Taxes/GetByTaxType?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
  
  //OBTENER IMPUESTOS POR ID
  async getByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Taxes/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
  
  //ACTUALIZAR IMPUESTO
  async update(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/Taxes/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`, JSON.stringify(item))
  }
  
  //ELIMINAR IMPUESTO
  async delete(id) {
    return this.httpService.sendRequest('delete', `${this.config.getUrl()}/Taxes/Delete?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
  
  //GUARDAR IMPUESTOS
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Taxes/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
}