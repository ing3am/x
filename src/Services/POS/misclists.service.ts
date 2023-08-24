import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../Shared/http.service';


@Injectable({
  providedIn: 'root'
})
export class MisclistsService {

  constructor(
    private config: ConfigService,
    private httpService: HttpService
  ) { }
  //OBTENER LISTAS MISCELÁNEAS POR TABLAS
  async get(tableName) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/MiscLists/Get?TableName=${tableName}`);
  }
  //
  async getByWhere(entity, fields, where, group?, order?) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/MiscLists/GetByWhere?Entity=${entity}&Fields=${fields}&Where=${where}&group=${group}&order=${order}`);
  }
}