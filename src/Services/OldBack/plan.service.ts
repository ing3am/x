import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService
  ) { }

  //OBTENER LINEAS DE FACTURA
  getPlans() {
    const url = `${this.config.getUrl()}/Plans/Get`;
    return this.httpService.sendRequest('get', url);
  }
}
