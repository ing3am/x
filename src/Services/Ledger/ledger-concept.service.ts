import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class LedgerConceptService {

  constructor(
    private config: ConfigService,
    private httpService: HttpService,
    private localStorage: LocalService
  ) { }

  // Obtener conceptos dependiendo del módulo envíado
  async getByModule(model) {
    return this.httpService.sendRequest('post', `${this.config.getUrlGl()}/LedgerConcept/GetConceptsByModule?companyid=${await this.localStorage.getJsonValue('CIA')}&Module=${model}`, JSON.stringify({}));
  }
}
