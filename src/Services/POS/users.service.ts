import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../Config/config.service';
import { LocalService } from '../Config/local.service';
import { HttpService } from '../Shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private httpService: HttpService
  ) { }
  //AGREGAR USUARIO POR COMPAÑÍA POR ID
  async getUsersByCompany() {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Users/getUsersByCompany?id=${await this.localStorage.getJsonValue('CIA')}`);
  }
  
  //AGREGAR USUARIO POR COMPAÑÍA MASTER POR ID
  async getUsersByCompanyMaster() {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Users/getUsersByCompanyMaster?id=${await this.localStorage.getJsonValue('CIA')}`);
  }
  
  //INVITAR USUARIO POR COMPAÑÍA POR ID
  async invite(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Users/Invite?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //AGREGAR USUARIO POR COMPAÑÍA POR ID
  async addUser(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Users/AddUser?companyid=${await this.localStorage.getJsonValue('CIA')}`, JSON.stringify(item))
  }
  
  //EDITAR USUARIOS COMPAÑÍA
  async putUser(id, item) {
    return this.httpService.sendRequest('put', `${this.config.getUrl()}/Users/PutUser?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`, JSON.stringify(item))
  }
  
  //OBTENER USUARIOS COMPAÑÍA Y ID
  async getUserByCompanyByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Users/GetUserDataByCompanyByID?companyid=${await this.localStorage.getJsonValue('CIA')}&id=${id}`);
  }
  
  //OBTENER USUARIOS COMPAÑÍA Y ID
  async getUserDataByMail(email) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Users/GetUserDataByMail?email=${email}`);
  }
  
  //EDITAR USUARIOS COMPAÑÍA
  async changePassword(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Users/ChangePassword`, JSON.stringify(item))
  }
  
}
