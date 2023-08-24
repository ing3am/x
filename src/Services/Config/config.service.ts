import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  IP = 'http://192.168.12.37:44353/';
  TOKEN_URI = 'Token';
  API_URI = 'general';
  PUBLIC_URI = 'public';

  NOTIFICATION_URI = 'notificationservice'; 

  currentUser = {};

  constructor() { }

  getUrlNotification(){
    return this.IP  + this.NOTIFICATION_URI;
  }

  getUrl() {
    return this.IP + this.API_URI;
  }

  getToken() {
    return this.IP + this.TOKEN_URI;
  }

  getPublic() {
    return this.IP + this.PUBLIC_URI;
  }

  getUrlPos(){
    return this.IP + 'posservice'
  }

  getUrlGl(){
    return this.IP + 'ledger'
  }

  getUrlAr(){
    return this.IP + 'arservice'
  }

  getUrlCalculated(){
    return this.IP + 'calculatedservice'
  }
}
