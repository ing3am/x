import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class BireportsService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  async getAmountValuesGroupPOS(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/BI/GetAmountValuesGroupPOS?companyid=${await this.localStorage.getJsonValue('CIA')}`, item);
  }

}
