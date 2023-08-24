import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ListmiscService {

  constructor(
    private config: ConfigService,
    private httpService : HttpService
  ) { }

  //TABLA MISC
  getMiscLists(tableName) {
    const url = `${this.config.getUrl()}/MiscLists/Get?TableName=${tableName}`;
    return this.httpService.sendRequest('get', url);
  }
}
