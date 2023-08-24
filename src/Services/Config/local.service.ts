import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private securityData : StorageService) { }
  // Set the json data to local 
  async setJsonValue(name: string, value: any) {
    let nameSecurity = this.securityData.generatekey(name);
    await Storage.set( { key: nameSecurity, value: this.securityData.encrypted(JSON.stringify( value )) } );
  }
  // Get the json value from local 
  async getJsonValue(name: string) {
    let nameSecurity = this.securityData.generatekey(name);
    const ret = await Storage.get( { key: nameSecurity } );
    let dataReturn = '';
    if(ret.value !== null){
      dataReturn = this.securityData.decrypted(ret.value);
      return JSON.parse(dataReturn);
    }
    return dataReturn;
  }
  //Delete Key specific
  async DeleteJsonValue(name: string) {
    let nameSecurity = this.securityData.generatekey(name);
    await Storage.remove( { key: nameSecurity } );
  }
  // Clear the local 
  async clearJsonValue() {
    const keysStorage = await Storage.keys();
    const keys = keysStorage.keys;
    for (let i = 0; i < keys.length; i++ ) {
      await Storage.remove( { key: keys[i] } );
    }
  }

  async getKeys(){
    return await Storage.keys();
  }
}