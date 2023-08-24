import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ArcashreceiptsService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //CANCELAR RECIBO DE CAJA
  async cancele(item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/ARCashReceipts/Cancel?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
}
