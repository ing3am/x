import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class PosService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }

  //OBTENER TIENDAS DISPONIBLE COMPAÑÍA
  async getByCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`);
  }
  
  async getByCompanyLogin(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByCompany?companyid=${id}`);
  }

  //OBTENER VALIDACIÓN DE TIENDA
  async getByIDValitionContinue(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByIDValitionContinue?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }
  
  //OBTENER TIENDAS DISPONIBLE COMPAÑÍA
  async getByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/Stores/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }
  
  //GUARDAR TIENDA PARA LA COMPAÑÍA
  async add(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/Stores/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //ACTUALIZAR TIENDA PARA LA COMPAÑÍA
  async update(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/Stores/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
  
  //OBTENER CONFIGURACIÓN DE DOCUMENTOS PARA EL POS
  async getDocTypeByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigDocType/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }
  
  //GUARDAR CONFIGURACIÓN DE LOS DOCUMENTOS POR TIENDA
  async addDocType(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigDocType/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //ACTUALIZAR CONFIGURACIÓN DE LOS DOCUMENTOS POR TIENDA
  async updateDocType(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigDocType/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
  
  //OBTENER CONFIGURACIÓN DE INVENTARIO PARA EL POS
  async getInventoryByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigInventory/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }
  
  //GUARDAR CONFIGURACIÓN DEL INVENTARIO POR TIENDA
  async addInventory(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigInventory/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //ACTUALIZAR CONFIGURACIÓN DEL INVENTARIO POR TIENDA
  async updateInventory(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigInventory/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
  
  //OBTENER CONFIGURACIÓN DE BANCOS PARA EL POS
  async getBanksByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigBank/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }
  
  //GUARDAR CONFIGURACIÓN DE BANCOS POR TIENDA
  async addBanks(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigBank/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //ACTUALIZAR CONFIGURACIÓN DE BANCOS POR TIENDA
  async updateBank(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigBank/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
  
  //OBTENER CONFIGURACIÓN DE IMPRESIÓN PARA EL POS
  async getPrinterID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ConfigPrinter/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }
  
  //GUARDAR CONFIGURACIÓN DE IMPRESIÓN POR TIENDA
  async addPrinters(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ConfigPrinter/Add?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //ACTUALIZAR CONFIGURACIÓN DE IMPRESIÓN POR TIENDA
  async updatePrinters(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrlPos()}/ConfigPrinter/Update?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
  
  //OBTENER CONFIGURACIÓN DE DOCUMENTOS PARA EL POS
  async getUserStoreID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/UserStore/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`);
  }
  
  //GUARDAR CONFIGURACIÓN DE LOS DOCUMENTOS POR TIENDA
  async addUserStore(id, item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/UserStore/Add?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${id}`, JSON.stringify(item))
  }
  
  //PAGOS
  //GUARDAR FACTURA Y CREAR RECIBOS DE CAJA PARA LA COMPAÑÍA
  async createPOSInvoice(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/POSInvoice/CreatePOSInvoice?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  async contabilizedPOSInvoice(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/POSInvoice/ContabilizedPOSInvoice?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //GUARDAR FACTURA Y CREAR RECIBOS DE CAJA PARA LA COMPAÑÍA
  async getListPaymentMethods(invoicenum) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/POSInvoice/GetListPaymentMethods?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${this.localStorage.getJsonValue('storeid')}&invoicenum=${invoicenum}`);
  }
  
  async getByCompanyReportSummaryDaily(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ReportSummaryDaily/GetByCompany?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  async getCashBalance(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrlPos()}/ReportSummaryDaily/getCashBalance`, JSON.stringify(item))
  }
  
  async getValidateExists() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/CashRegister/ValidateExists?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}&userid=${await this.localStorage.getJsonValue('userID')}`);
  }
  
  async getCashRegisterByStore() {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/CashRegister/getCashRegisterByStore?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${await this.localStorage.getJsonValue('storeid')}`);
  }
  
  async getCashRegisterByID(cashrid) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/CashRegister/GetByID?companyid=${await this.localStorage.getJsonValue('CIA')}&cashrid=${cashrid}`);
  }
  
  async getCashRUserID(invoice) {
    return this.httpService.sendRequest('get', `${this.config.getUrlPos()}/ReportSummaryDaily/getCashRUserID?companyid=${await this.localStorage.getJsonValue('CIA')}&storeid=${this.localStorage.getJsonValue('storeid')}&invoicenum=${invoice}`);
  }
}
