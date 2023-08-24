import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from 'src/Services/Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER TOURS POR ID
  async getByID(module) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Tours/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&userid=${await this.localStorage.getJsonValue('userID')}&module=${module}`);
  }
  
  //GUARDAR TOUR GENERADO
  async add(tour) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Tours/add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(tour))
  }
  
}