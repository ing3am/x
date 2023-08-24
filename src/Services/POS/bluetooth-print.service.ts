import { Injectable } from '@angular/core';
import { NativeService } from 'src/Services/Shared/native.service';

@Injectable({
  providedIn: 'root'
})
export class BluetoothPrintService {

  private _navigator: any;
  private _device: any;
  private _characteristics: any;
  private _printer: boolean = false;
  index = 0;
  data: any;

  constructor(
    private nativeService: NativeService
  ) { 
    this._navigator = navigator;
  }

  printer(){
    this._printer = true;
  }

  connect(ticket: string){
    var zpl = ticket; // whatever your label is
    localStorage.setItem("ticket",zpl)
    // zpl += "1234567890QWERTYUIOPASDFGHJKLÑZXCVBNMÁÉÍÓÚáéíóú{}[]¡!¿?+-*#$%&/()=:;-_^`@ \n\n"
    // console.log("Request bluetooth service");
    console.log(this._navigator)
    console.log(this._navigator.bluetooth)
    // if(this._navigator.bluetooth != ){

    // }else{

    // }
    this._navigator.bluetooth.requestDevice({
      filters: [{
        services: ['000018f0-0000-1000-8000-00805f9b34fb']
      }]
    })
    .then( device => {
      console.log(device)
      return device.gatt?.connect();
    })
    .then(server => {
      console.log("getting service - control");
      return server?.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
    })
    .then(service => {
      console.log("Getting characteristics");
      return service?.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
    })
    .then(characteristic => {
      try {
        var maxChunk = 300;
      var j = 0;

      if ( zpl.length > maxChunk ) {
        for ( var i = 0; i < zpl.length; i += maxChunk ) {
          var subStr;
          if ( i + maxChunk <= zpl.length ) {
            subStr = zpl.substring(i, i + maxChunk);

          } else {
            subStr = zpl.substring(i, zpl.length);
          }

          setTimeout(writeStrToCharacteristic, 250 * j, subStr);
          j++;
        }
      } else {
        writeStrToCharacteristic(zpl);
      }

      function writeStrToCharacteristic (str: any) {
        let buffer = new ArrayBuffer(str.length);
        let dataView = new DataView(buffer);
        for (var i = 0; i <str.length; i++) {
          dataView.setUint8( i, str.charAt(i).charCodeAt() );
        }
        console.log('accessing the device');
        console.log('Buffer: ', buffer)
        console.log('DataView: ', dataView)
        return characteristic?.writeValue(buffer);
      }
      } catch (error) {
        console.log(error)
      }
    })
    .catch( error => {
      console.log('Error Bluetooth',error);
      let message = error.toString().substring(15)
      if(message === "Bluetooth adapter not available."){
        this.nativeService.OnlyAlert("Ups!","Al parecer el dispositivo del que intentas imprimir no tiene bluetooth","warning")
      }
      return false;
    });
    return true;
  }

  getTicket(): string{
    let invoice = {
      head: {
        cliente: "Amazonas Demostración",
        NIT: "1726382-6",
        fecha: new Date,
        comentario: "comentario de la factura"
      },
      detail: [
        {
          producto: "Leche",
          cantidad: 2,
          precio: 20000,
          total: 40000
        },
        {
          producto: "Huevos",
          cantidad: 1,
          precio: 15000,
          total: 15000
        },
        {
          producto: "Vainilla",
          cantidad: 100,
          precio: 10000,
          total: 10000
        },
        {
          producto: "Tornillo de ensamble 2.0 referencia mecánica",
          cantidad: 100,
          precio: 10000,
          total: 20850.9
        },
        {
          producto: "Milo con leche",
          cantidad: 1,
          precio: 2500,
          total: 2500
        },
        {
          producto: "Pan de jamon y queso",
          cantidad: 1,
          precio: 800,
          total: 800
        },
        {
          producto: "Empanadas de queso",
          cantidad: 10,
          precio: 700,
          total: 7000
        }
      ]
    }
    let total = 0;
    let ticket = `\t${invoice.head.cliente}\t  \n`
    ticket += `\t NIT: ${invoice.head.NIT}\t \n`
    ticket += `\t Direccion: Calle 66 # 123\t \n`
    ticket += `\t Telefono: 4277054\t \n`
    ticket += `===============================\n`
    ticket += `N° Factura: POS24 \t \n`
    ticket += `Fecha: ${invoice.head.fecha.getDate()}/${invoice.head.fecha.getMonth() + 1}/${invoice.head.fecha.getFullYear()} \n`
    ticket += `Cliente: Anamaria Palacios \t \n`
    ticket += `Identificacion: 1000408573\t \n`
    ticket += `Telefono: 3016115935\t \n`
    ticket += `===============================\n`
    ticket += `Producto   \t\tCnt   \tValor \n`
    ticket += `===============================\n`
    invoice.detail.forEach((line,index)=>{
      ticket +=  this.addLine(line)
      total += line.total;
    })
    ticket += `===============================\n`
    ticket += `Total:        \t$ ${total.toString()}\n`
    ticket += `===============================\n`
    ticket += `Comentarios: el cliente devuelve una empanada porque le salio un pelo. \n`
    ticket += `===============================\n`
    ticket += `Resolucion # 1876401514006557 fecha de autorizacion 15/07/2021 prefijo SF desde el numero 1 hasta el 1000, vigencia de 6 meses \n`
    ticket += `===============================\n`
    ticket += `Elaborado en Amazonas ERP POS NIT ${invoice.head.NIT}`
    ticket += `\n\n\n`
    return ticket;
  }
  
  getHeadTicket(){

  }

  getDetailTicket(){

  }

  addLine(line: any): string{
    let lineFormat: string = ``
    console.log(line.cantidad.toString())
    let producto = this.formatItem(line.producto,11).split(',')
    let cantidad = this.formatItem(line.cantidad.toString(),3).split(',')
    let total = line.total

    if (producto.length > 1) {
      lineFormat += `${producto[0]} \t ${cantidad[0]} \t  ${total} \n`

      // for (let index = 1; index < producto.length; index++) {
      //   lineFormat += `${producto[index]} \n`
      // }
    }else{
      lineFormat += `${producto[0]} \t ${cantidad[0]} \t  ${total}  \n`
    }
    return lineFormat;
  }

  formatItem(item: string, long: number): string{
    let itemFormat: string = ``;

    if(item.length > long){

      itemFormat += `${item.substring(0,long)},`
      let allLetters = item.substring(long);
      let cant = 0;
      for (let index = 0; index < allLetters.length; index++) {
        cant ++;
        itemFormat += allLetters[index]

        if(cant == long){
          cant = 0
          itemFormat += `,`
        }
      }

    }else if(item.length < long){
      for (let index = item.length; index < long; index++) {
        item += " "
      }
      itemFormat = item
    }else
      itemFormat = item

    return itemFormat;
  }

}
