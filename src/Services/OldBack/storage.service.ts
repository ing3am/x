import * as CryptoJS from 'crypto-js';

import { Injectable } from '@angular/core';

//const SecureStorage = require('secure-web-storage');
const SECRET_KEY = 'Amazonas1234.';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  /*public secureStorage = new SecureStorage(sessionStorage, {
    hash: function hash(key) {
      key = CryptoJS.SHA256(key, SECRET_KEY);

      return key.toString();
    },
    encrypt: function encrypt(data) {
      data = CryptoJS.AES.encrypt(data, SECRET_KEY);

      data = data.toString();

      return data;
    },
    decrypt: function decrypt(data) {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY);

      data = data.toString(CryptoJS.enc.Utf8);

      return data;
    }
  });*/

  encrypted(data) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  }

  decrypted(data) {
    try {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY);
      data = data.toString(CryptoJS.enc.Utf8);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}