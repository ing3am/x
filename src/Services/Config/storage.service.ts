import * as CryptoJS from 'crypto-js';

import { Injectable } from '@angular/core';

const SECRET_KEY = 'Amazonas1234.';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  generatekey(name){
    name = CryptoJS.SHA256(name, SECRET_KEY);
    return name.toString();
  }

  encrypted(data) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  }

  decrypted(data) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  }

}