import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class ReportSummaryDailyService {
  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  async getByCompanyReportSummaryDaily(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ReportSummaryDaily/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  async getCashBalance(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ReportSummaryDaily/getCashBalance`, JSON.stringify(item))
  }

  async getCashRUserID(invoice) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ReportSummaryDaily/getCashRUserID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}&invoicenum=${invoice}`);
  }
}
