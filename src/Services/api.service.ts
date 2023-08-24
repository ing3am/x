import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './Shared/http.service';
import { ConfigService } from './Config/config.service';
import { LocalService } from './Config/local.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private localStorage: LocalService,
    private config: ConfigService,
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  //REGISTRO DE USUARIOS
  register(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Account/signup`, JSON.stringify(item))
  }
  //REGISTRO DE USUARIOS
  DecodeAccess(token) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Users/DecodeAccess?token=${token}`)
  }
  //PREGUNTO POR TOKEN
  AskForToken(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Public/AskForAccess`, JSON.stringify(item))
  }
  //GUARDAR TOKEN
  SaveToken(item, loginrequest) {
    let TokenCompany = { Companies: '', AccessToken: item.access_token, EmailAddress: loginrequest.email, ExpiresIn: item['.expires'], Password: loginrequest.password };
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Public/SaveAccess`, JSON.stringify(TokenCompany))
  }
  //GENERAR TOKEN
  token(loginrequest) {
    var userData = "username=" + loginrequest.email + "&password=" + loginrequest.password + "&grant_type=password";
    var newTokenHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'No-Auth': 'True' });
    const promise = new Promise((resolve, reject) => {
      const apiURL = `${this.config.getToken()}`;
      this.http
        .post<any[]>(apiURL, userData, { headers: newTokenHeader })
        .toPromise()
        .then((res: any) => {
          // Success
          resolve(res);
        },
          err => {
            // Error
            reject(err);
          }
        );
    });
    return promise;
  }
  //GENERAR INFORMACIÓN DE USUARIOs
  getUserData(loginrequest) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Users/GetUserData`, JSON.stringify(loginrequest))
  }
  getUserDataByID(id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Users/GetUserDataByCompanyByID?companyid=${this.localStorage.getJsonValue('CIA')}&id=${id}`)
  }
  //CAMBIAR CONTRASEÑA
  ChangePassword(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Users/ChangePassword`, JSON.stringify(item))
  }
  //CAMBIAR CONTRASEÑA
  MailConfirm(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Users/MailConfirm`, JSON.stringify(item))
  }
  //CAMBIAR CONTRASEÑA
  passwordRecovery(item) {
    return this.httpService.sendRequest('post', `${this.config.getUrl()}/Users/PasswordRecovery`, JSON.stringify(item))
  }
  //OBTENER INFORMACIÓN DE COMPAÑÍA POR USUARIO
  getCompaniesByUser(company, id) {
    return this.httpService.sendRequest('get', `${this.config.getUrl()}/Companies/GetByUser?companyid=${company}&id=${id}`)
  }
}
