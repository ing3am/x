import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService
  ) { }


  //OBTENER TODOS LOS ESTADOS POR COMPAÑÍA
  get() {
    const url = `${this.config.getUrl()}/States/Get`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER TODOS LOS ESTADOS POR COMPAÑÍA POR ID
  getByID(id) {
    const url = `${this.config.getUrl()}/States/GetByID?id=${id}`;
    return this.httpService.sendRequest('get', url);
  }

  //OBTENER TODOS LOS ESTADOS POR PAIS POR COMPAÑÍA POR ID
  getByCountry(countryid) {
    const url = `${this.config.getUrl()}/States/GetByCountry?countryid=${countryid}`;
    return this.httpService.sendRequest('get', url);
  }

  //GUARDAR ESTADOS POR COMPAÑÍA POR ID
  add(item) {
    const url = `${this.config.getUrl()}/States/Add`;
    return this.httpService.sendRequest('post', url, item);
  }

  //ACTUALIZAR ESTADOS POR COMPAÑÍA POR ID
  update(id, item) {
    const url = `${this.config.getUrl()}/States/Update?id=${id}`;
    return this.httpService.sendRequest('put', url, item);
  }

  //ELIMINAR ESTADOS POR COMPAÑÍA POR ID
  delete(item) {
    const url = `${this.config.getUrl()}/Countries/Delete`;
    return this.httpService.sendRequest('delete', url, item);
  }

}
