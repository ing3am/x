import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService
  ) { }

  //OBTENER TODOS LOS PAISES
  get() {
    const url = `${this.config.getUrl()}/Countries/Get`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER PAIS POR ID
  getByID(id) {
    const url = `${this.config.getUrl()}/Countries/GetByID?id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //ACTUALIZAR PAIS POR COMPAÑÍA POR ID
  update(id, item) {
    const url = `${this.config.getUrl()}/Countries/Update?id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }

  //ACTUALIZAR PAIS POR COMPAÑÍA POR ID
  delete(item) {
    const url = `${this.config.getUrl()}/Countries/Delete`;
    return this.httpService.sendRequest('put', url, item);
  }
}
