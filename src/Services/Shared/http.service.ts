import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  sendRequest(type: any, URL: string, data?: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + sessionStorage.getItem('fgh0x01b4#8')
    })
    let promise;
    switch (type) {
      case 'get':
        promise = new Promise((resolve, reject) => {
          this.http.
            get<any>(URL, { headers })
            .toPromise()
            .then((res: any) => {
              resolve(res)
            }, (error) => {
              reject(error)
            })
        })
        break;
      case 'post':
        promise = new Promise((resolve, reject) => {
          this.http.
            post<any>(URL,data,{ headers })
            .toPromise()
            .then((res: any) => {
              resolve(res)
            }, (error) => {
              reject(error)
            })
        })

        break;

      case 'put':
        promise = new Promise((resolve, reject) => {
          this.http.
            put<any>(URL,data,{ headers })
            .toPromise()
            .then((res: any) => {
              resolve(res)
            }, (error) => {
              reject(error)
            })
        })

        break;
      case 'delete':
        promise = new Promise((resolve, reject) => {
          this.http.
            delete<any>(URL,{ headers })
            .toPromise()
            .then((res: any) => {
              resolve(res)
            }, (error) => {
              reject(error)
            })
        })

        break;
      case 'patch':
        promise = new Promise((resolve, reject) => {
          this.http.
            patch<any>(URL,data,{ headers })
            .toPromise()
            .then((res: any) => {
              resolve(res)
            }, (error) => {
              reject(error)
            })
        })
        break;

      default:
        break;
    }
    return promise;
  }
}
