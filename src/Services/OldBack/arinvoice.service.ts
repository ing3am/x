import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class ARInvoiceService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  async getByCompanyPOS(trantype, filter) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/ARInvoiceHeads/GetByCompanyPOS?companyid=${await this.localStorage.getJsonValue('CIA')}&trantype=${trantype}&startdate=${filter.startdate}&enddate=${filter.enddate}&storeid=${filter.storeID}`);
  }

  async getByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/ARInvoiceHeads/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }

  async getLineTax(invoiceLine, itemId) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/ARInvoiceHeads/GenerateLineTax?companyid=${await this.localStorage.getJsonValue('CIA')}&InvoiceLine=${invoiceLine}&ItemID=${itemId}`);
  }

  async getByIDAnonymous(storeid, invoicenum) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/POSInvoice/GetPosInvoiceAnonymous?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${storeid}&invoicenum=${invoicenum}`);
  }

  async getConsecutive() {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/ARInvoiceHeads/GetConsecutive?companyid=${await this.localStorage.getJsonValue('CIA')}`);
  }
  
  
}