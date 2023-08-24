import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { HttpService } from '../Shared/http.service';
import { LocalService } from '../Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class PosInvoiceService {
  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //GUARDAR FACTURA Y CREAR RECIBOS DE CAJA PARA LA COMPAÑÍA
  async createPOSInvoice(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/POSInvoice/CreatePOSInvoice?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  async contabilizedPOSInvoice(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/POSInvoice/ContabilizedPOSInvoice?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }

  //GUARDAR FACTURA Y CREAR RECIBOS DE CAJA PARA LA COMPAÑÍA
  async getListPaymentMethods(invoicenum) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/POSInvoice/GetListPaymentMethods?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}&invoicenum=${invoicenum}`);
  }
}
