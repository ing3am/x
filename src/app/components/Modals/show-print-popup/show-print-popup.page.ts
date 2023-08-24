import { Component, OnInit } from '@angular/core';
import { BluetoothPrintService } from '../../../../Services/POS/bluetooth-print.service';
import { ARInvoiceService } from 'src/Services/OldBack/arinvoice.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LocalService } from 'src/Services/Config/local.service';
//import * as numeroaletras from 'numero-a-letras';
import { DomSanitizer } from '@angular/platform-browser';
import { TrandoctypeService } from 'src/Services/OldBack/trandoctype.service';
import { PosService } from 'src/Services/POS/pos.service';
import { NativeService } from 'src/Services/Shared/native.service';
import { TaxresponsabilityService } from 'src/Services/OldBack/taxresponsability.service';
import { UsersService } from 'src/Services/POS/users.service';


@Component({
  selector: 'app-show-print-popup',
  templateUrl: './show-print-popup.page.html',
  styleUrls: ['./show-print-popup.page.scss'],
})
export class ShowPrintPopupPage implements OnInit {

  public invoice:any;
  public tracker:boolean;
  public addInvoiceForm : FormGroup;
  public res : any;


  public printLogo:boolean=true;
  showText1:boolean=false;
  Text1:string='';
  showText2:boolean=false;
  Text2:string='';
  Text3:string='Sistema P.O.S';

  invoicedtls : any=[];
  invoicetaxes : any=[];
  company:any;
  formatDecimal: string;
  numberToLetter:string;
  isInvoice:boolean=true;
  textInvoice:string="FACTURA"
  resolutionInvoice:string='';
  storeCode:string='';
  storeId:number=0;

  databasePicture:any;
  listPayment:any;

  totalAmount=0;
  totalchange=0;

  storeConfig:any;

  trandoctype:any=[];
  loading: boolean = false;
  printerBlth: boolean = false;

  taxresponsabilities: any[] = [];
  taxresDesc:string =""

  cashrbycompany: any[];
  cashRegisterName: string = '';

  userName:string = "";

  orderNum:string ="none";

  constructor(
    private localStorage: LocalService,
    public modalActive:ModalController,
    private domSanitizer: DomSanitizer,
    private apiTranDocType : TrandoctypeService,
    private apiPosService : PosService,
    private fb: FormBuilder,
    private arService: ARInvoiceService,
    private blthPrint: BluetoothPrintService,
    private taxResponsabilitiesService: TaxresponsabilityService,
    private userService: UsersService,
    private nativeService: NativeService
  ) {
    
    this.localStorage.getJsonValue('companies').then(async (res: any) => {
      await JSON.parse(res).forEach(async (a) => {
        const ciaValue = await this.localStorage.getJsonValue('CIA');
        const storeIdlocal = await this.localStorage.getJsonValue('storeid')
        
        if (a.CompanyID.toString() === ciaValue.toString()) {          
          this.apiPosService.getByID(storeIdlocal.toString())
            .then((res: any) => {
              let picture = res.result.Logo !== null ? this.domSanitizer.bypassSecurityTrustHtml(res.result.Logo) : this.domSanitizer.bypassSecurityTrustHtml(a.Logo)
              if (picture['changingThisBreaksApplicationSecurity'] !== null)
                this.databasePicture = 'data:image/png;base64,' + picture['changingThisBreaksApplicationSecurity'].toString();
              else this.printLogo = false;
            })
            .catch((err: any) => {
              this.loading = false;
              console.log(err);
            })
            
          this.formatDecimal = `1.${a.DecimalQty}-${a.DecimalQty}`;
          this.company = a;
  
          //#region Tax Responsability
          var taxres = this.company.TaxResponsabilityID.split(';')
          this.taxResponsabilitiesService.getByCompany(await this.localStorage.getJsonValue('CIA'))
            .then((res: any) => {
              if (res !== null) {                
                res.forEach(a => {
                  if (!a.Inactive && a.TaxResponsabilityID != "R-99-PN" && a.TaxResponsabilityID != "ZZ") {
                    taxres.forEach(co => {
                      if (a.TaxResponsabilityID == co) {
                        this.taxresDesc += a.Description + "-"
                      }
                    });
                  }
                });
                this.taxresDesc = this.taxresDesc.slice(0, -1);
              }
            })
            .catch((error: any) => {
              console.error(error);
            });
          //#endregion
  
          //#region  CashRegisters
          this.apiPosService.getCashRegisterByStore()
            .then(async (res: any) => {
              if (res.success) {
                try {
                  this.cashrbycompany = res.result;
                  var CurrentCashRegisterID = await this.localStorage.getJsonValue('cashRegisterID');
                  this.cashrbycompany.forEach(element => {
                    if (element.CashRegisterID == CurrentCashRegisterID) {
                      this.cashRegisterName = element.Description
                    }
                  });
                } catch (error) {
                  console.error(error)
                }
                return;
              }
            }).catch((error: any) => {
              this.loading = false;
              console.error(error)
            });
        }
      })
    })

  }

  get arrayCustomer() {
    return this.addInvoiceForm.get("customer") as FormArray;
  }

  get arrayListPayment() {
    return this.addInvoiceForm.get("listPayment") as FormArray;
  }

  async ngOnInit() {
    
    try {
      if(this.res){
          if(this.res.success){
              this.addInvoiceForm.controls["LegalNumber"].setValue(this.res.result.ARInvoiceHead.LegalNumber);
              this.addInvoiceForm.controls["TranDocTypeID"].setValue(this.res.result.ARInvoiceHead.TranDocTypeID);
          }
      }
      this.storeConfig = await this.localStorage.getJsonValue('config');
      this.storeConfig.forEach(a => {
          if(a.value === 'Store'){
              this.storeCode = a.res.result.StoreCode;
              this.storeId = a.res.result.StoreId;
          }
          if(a.value === 'Printers'){
              this.printLogo = a.res.PrintLogo
              this.showText1 = a.res.PrintText1
              this.Text1 = a.res.Text1
              this.showText2 = a.res.PrintText2
              this.Text2 = a.res.Text2
              this.printerBlth = a.res.PrintBluetooth
          }
        });
  
        //#region CashRegister Cashier
  
        try {
          if (this.addInvoiceForm.getRawValue().InvoiceNum > 0) {
            this.loading = true;
            this.apiPosService.getCashRUserID(this.addInvoiceForm.getRawValue().InvoiceNum)
              .then(async (resgetCashRUserID: any) => {
                if (resgetCashRUserID.success) {
                  try {              
                    //#region  CashRegisters
                    this.apiPosService.getCashRegisterByStore()
                      .then(async (res: any) => {
                        if (res.success) {
                          try {
                            this.cashrbycompany = res.result;
                            var cashr = resgetCashRUserID.result.CashRegisterID
                            this.cashrbycompany.forEach(element => {
                              if (element.CashRegisterID == cashr) {
                                this.cashRegisterName = element.Description
                              }
                            });
                          } catch (error) {
                            console.error(error)
                          }
                          return;
                        }
                      }).catch((error: any) => {
                        this.loading = false;
                        console.error(error)
                      });
                    //#endregion
  
                    //#region  CashRegisters
                    this.userService.getUsersByCompany()
                      .then(async (res: any) => {
                        try {
                          this.loading = false
                          var usern = resgetCashRUserID.result.UserID
                          res.forEach(element => {
                            if (element.UserID == usern) {
                              this.userName = element.Name
                            }
                          });
                        } catch (error) {
                          console.error(error)
                        }
                        return;
  
                      }).catch((error: any) => {
                        this.loading = false;
                        console.error(error)
                      });
                    //#endregion
                  } catch (error) {
                    console.error(error)
                  }
                  return;
                }
              }).catch((error: any) => {
                this.loading = false;
                console.error(error)
              });
          } else {
            //this.userName = this.localStorage.getJsonValue('useName'); -------------------------------->
          }
        } catch (error) {
          console.error(error)
        }
  
        //#endregion
  
        try {
          this.orderNum = this.addInvoiceForm.getRawValue().OrderNum == "" || this.addInvoiceForm.getRawValue().OrderNum == undefined ? "none" : this.addInvoiceForm.getRawValue().OrderNum
        } catch (error) {
          this.orderNum = "none"
        }
  
        this.apiTranDocType.getByID(this.addInvoiceForm.getRawValue().TranDocTypeID)
          .then((res: any) => {
            this.trandoctype = res[0];
            //console.log(this.trandoctype)
            if (this.trandoctype.FactE || this.trandoctype.TestFE) {
              this.Text3 = "Representación Gráfica"
            }
            if (this.isInvoice) {
              this.resolutionInvoice = this.trandoctype.Resolution
            }
          })
          .catch(console.log);
  
  
      this.nativeService.playAudio("success");
      if(!this.isInvoice){
          this.textInvoice="PRE-FACTURA";
          this.resolutionInvoice="Sin valor fiscal";
      }
  
      this.invoicedtls = this.addInvoiceForm.controls.invoicedtls.value;
      this.invoicetaxes = this.addInvoiceForm.controls.invoicetaxes.value;
  
      /*this.numberToLetter=numeroaletras.NumeroALetras(this.addInvoiceForm.controls.DocInvoiceAmount.value,{
          plural: 'PESOS',
          singular: 'PESO',
          centPlural: 'CENTAVOS',
          centSingular: 'CENTAVO'
      });*/
      if(this.res !== undefined){
          this.listPayment = this.res.result.ListPaymentMethods;
          this.listPayment.forEach(a => {
              this.totalAmount += a.receipt;
              this.addPaymentLine(a)
          });
          this.totalchange = Number(this.totalAmount) - Number(this.addInvoiceForm.controls.DocInvoiceAmount.value);
          let item = this.res.result.ARInvoiceHead.Customer;
          let customer = new FormArray([new FormGroup({
              TerceroNum: new FormControl(item.TerceroNum),
              PhoneNum: new FormControl(item.PhoneNum)
          })]);
          this.addInvoiceForm.addControl('customer',customer);
      }
      if(this.tracker){
          this.apiPosService.getListPaymentMethods(this.addInvoiceForm.value.InvoiceNum)
          .then((res:any)=>{
              if(res.success){
                this.listPayment = res.result.ListPaymentMethods;
                this.listPayment.forEach(a => {
                this.totalAmount += a.receipt;
                this.addPaymentLine(a)
              });
              this.totalchange = Number(this.totalAmount) - Number(this.addInvoiceForm.controls.DocInvoiceAmount.value);
              }
          })
          .catch(console.error)
      }
  
      } catch (error) {
        console.log(error)
      }
  }

  addPaymentLine(e){
    try {
      this.arrayListPayment.push(
        this.fb.group({
          paymentdesc: [e.paymentdesc],
          receipt: [e.receipt],
        })
      )
    } catch (error) {
     // console.log(error)
      //Swal.fire('Notificación', error, 'warning');
    }
  }

  print(){
    if(this.printerBlth)
      this.printBlth();
    else
      this.printLocal();
  }

  printLocal(){
    const popupCenter = async ({w, h }) => {
      // Fixes dual-screen position                             Most browsers      Firefox
      const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
      const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
      // tslint:disable-next-line: max-line-length
      const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      // tslint:disable-next-line: max-line-length
      const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
      const systemZoom = width / window.screen.availWidth;
      const left = (width - w) / 2 / systemZoom + dualScreenLeft;
      const top = (height - h) / 2 / systemZoom + dualScreenTop;
      const newWindow = window.open(
        `
        scrollbars=yes,
        width=${w / systemZoom},
        height=${h / systemZoom},
        top=${top},
        left=${left}
        `
      );

      let body = document.getElementById("printinvoice").innerHTML;
      newWindow.document.write(`<html>`);
      newWindow.document.write(`<link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'><style>.receipt-template {
          width: 302px;
          margin: 0 auto;
      }

      @page{
        size: auto;
        margin: 1%;
      }
        
      body {
          margin: 0;
          font-family: "Arial";
      }
          
      .receipt-template .text-small {
          font-size: 10px;
      }
      
      .receipt-template .block {
          display: block;
      }
      
      .receipt-template .inline-block {
          display: inline-block;
      }
      
      .receipt-template .bold {
          font-weight: 700;
      }
      
      .receipt-template .italic {
          font-style: italic;
      }
      
      .receipt-template .align-right {
          text-align: right;
      }
      
      .receipt-template .align-center {
          text-align: center;
      }
      
      .receipt-template .main-title {
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          margin: 10px 0 5px 0;
          padding: 0;
      }
      
      .receipt-template .main-subtitle {
          font-size: 12px;
          font-weight: 400;
          text-align: center;
          margin: 10px 0 5px 0;
          padding: 0;
      }
      
      .receipt-template .heading {
          position: relation;
      }
      
      .receipt-template .title {
          font-size: 16px;
          font-weight: 700;
          margin: 10px 0 5px 0;
      }
      
      .receipt-template .sub-title {
          font-size: 12px;
          font-weight: 700;
          margin: 10px 0 5px 0;
      }
      
      .receipt-template table {
          width: 100%;
      }
      
      .receipt-template td,
      .receipt-template th {
          font-size: 12px;
      }
      
      .receipt-template .info-area {
          font-size: 12px;
          line-height: 1.222;
      }
      
      .receipt-template .listing-area {
          line-height: 1.222;
      }
      
      .receipt-template .listing-area table {}
      
      .receipt-template .listing-area table thead tr {
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          font-weight: 700;
      }
      
      .receipt-template .listing-area table tbody tr {
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
      }
      
      .receipt-template .listing-area table tbody tr:last-child {
          border-bottom: none;
      }
      
      .receipt-template .listing-area table td {
          vertical-align: top;
      }
      
      .receipt-template .info-area table {}
      
      .receipt-template .info-area table thead tr {
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
      }
      
      
      /*Receipt Heading*/
      
      .receipt-template .receipt-header {
          text-align: center;
      }
      
      .receipt-template .receipt-header .logo-area {
          max-width: 302px;
          height: 80px;
          margin: 0 auto;
      }
      
      .receipt-template .receipt-header .logo-area img.logo {
          display: inline-block;
          max-width: 100%;
          max-height: 100%;
      }
      
      .receipt-template .receipt-header .address-area {
          margin-bottom: 5px;
          line-height: 1;
      }
      
      .receipt-template .receipt-header .info {
          font-size: 12px;
      }
      
      .receipt-template .receipt-header .store-name {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          padding: 0;
      }
      
      
      /*Invoice Info Area*/
      
      .receipt-template .invoice-info-area {}
      
      
      /*Customer Customer Area*/
      
      .receipt-template .customer-area {
          margin-top: 10px;
      }
      
      
      /*Calculation Area*/
      
      .receipt-template .calculation-area {
          border-top: 2px solid #000;
          font-weight: bold;
      }
      
      .receipt-template .calculation-area table td {
          text-align: right;
      }
      
      .receipt-template .calculation-area table td:nth-child(2) {
          border-bottom: 1px dashed #000;
      }
      
      
      /*Item Listing*/
      
      .receipt-template .item-list table tr {}
      
      
      /*Barcode Area*/
      
      .receipt-template .barcode-area {
          margin-top: 10px;
          text-align: center;
      }
      
      .receipt-template .barcode-area img {
          max-width: 100%;
          display: inline-block;
      }
      
      
      /*Footer Area*/
      
      .receipt-template .footer-area {
          line-height: 1.222;
          font-size: 10px;
      }
      
      h1, h2, h3, h4, h5, h6 {
          margin: 0px;
      }
      
      h5 {
      font-size: 18px;
      }
      h1, h2, h3, h4, h5, h6 {
          color: #111;
          font-weight: 400;
      }
      
      h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
      margin-bottom: 0.5rem;
      font-weight: 500;
      line-height: 1.2;
      }
      /*Media Query*/
      .lineSpace{
        height: 4px !important;
      }
      
      @media print {
          .receipt-template {
              width: 100%;
          }
      }
      
      * {
      margin: 0px;
      padding: 0px;
      box-sizing: border-box;
      }
      
      
      @media all and (max-width: 215px) {}</style><body style="margin:15px">`);

      newWindow.document.write(body);
      newWindow.document.write('</body></html>');

      console.log(newWindow.document)

      if (window.focus) {
        newWindow.focus();
        await this.delay(100);
        newWindow.print();
        //newWindow.close();
      }
    }

    popupCenter({w:800,h:600});
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  closeInvoiceViewModal(){
    this.modalActive.dismiss(0);
  }

  iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  downloadPDF(pdf, InvNum) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = `Factura POS ${InvNum}.pdf`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  printBlth(){
    if(this.listPayment === undefined)
      this.listPayment = []

    //var isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);

    var ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
      this.triggerAppOpen();
    else
      this.GetInvoiceAnonymous();

  }

  fallbackToStore() {
    window.location.replace('market://details?id=com.myapp.package');
  };

  openApp() {
    let invoice = this.addInvoiceForm.value
    window.location.replace(`amazonasprinter://${invoice.CompanyID},${this.storeId},${invoice.InvoiceNum}`);
  };

  triggerAppOpen() {
    this.openApp();
    setTimeout(this.fallbackToStore, 250);
  };

  GetInvoiceAnonymous(){
    let invoice = this.addInvoiceForm.value
    this.arService.getByIDAnonymous(this.storeId,invoice.InvoiceNum)
    .then( (response: any) => {
      if(response.success){
        if(!this.blthPrint.connect(this.createTicket(response.result)))
          this.printLocal();
      }else{
        this.nativeService.OnlyAlert('',response.message,'error')
      }
    })
    .catch((err:any)=>{
      console.log(err);
      this.printLocal();
    })
  }

  addLine(line: any): string{
    let lineFormat: string = ``
    let producto = this.formatItem(line.ItemDescription,11).split(',')
    let cantidad = this.formatItem(line.Quantity.toString(),3).split(',')
    let total = line.DocLineSubtotal

    lineFormat += `${producto[0]} ${cantidad[0]} ${line.UOMCode}   $ ${total} \n`

    return lineFormat;
  }

  addLineTax(line: any): string{
    let lineFormat = `${this.formatItem(line.TaxID,9).split(',')[0]} ${this.formatItem(line.Percent.toString(),3).split(',')[0]} $${line.DocTaxableAmount}  $${line.DocTaxAmount}\n`
    return lineFormat;
  }

  addLinePayment(line: any): string{
    let lineFormat = `${this.formatItem(line.paymentdesc,15).split(",")[0]} $${line.receipt}\n`

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

  createTicket(data: any){
    try {
      let invoice = data

      let ticket = `\t${data.Company.Name}\t  \n`
      ticket += `\tNIT: ${data.Company.FiscalID}\t \n`
      ticket += `\tDireccion: \n`
      ticket += `\t${data.Company.Address}\t \n`
      ticket += `\tTelefono: ${data.Company.PhoneNum}\t \n`
      ticket += `===============================\n`
      ticket += `# Factura: \t\t${invoice.LegalNumber}  \n`
      ticket += `Fecha:${invoice.InvoiceDate.substring(0,10)} Hora:${invoice.InvoiceDate.substring(11)}\n`
      ticket += `Cliente: ${invoice.CustomerName} \t \n`
      ticket += `Identificacion: ${invoice.IdentificationNum}\t \n`
      // ticket += `Telefono: ${invoice.customer[0].PhoneNum}\t \n`
      ticket += `===============================\n`
      ticket += `Producto   Cnt  UDM  Valor \n`
      ticket += `===============================\n`
      invoice.invoicedtls.forEach((line,index)=>{
        ticket +=  this.addLine(line)
        // total += line.total;
      })
      ticket += `===============================\n`
      ticket += `Subtotal:........... $ ${invoice.DocInvoiceSubTotal.toString()}\n`
      ticket += `Descuento:.......... $ ${invoice.DocDiscount.toString()}\n`
      ticket += `Retenciones:........ $ ${invoice.DocWithHoldingAmount.toString()}\n`
      ticket += `Impuesto:........... $ ${invoice.DocTaxAmount.toString()}\n`
      ticket += `Total:.............. $ ${invoice.DocInvoiceAmount.toString()}\n`
      ticket += `===============================\n`
      // ticket += `Valor en letras: \n`
      // ticket += `${this.numberToLetter} \n`
      // ticket += `===============================\n`
      ticket += `Imp       %   Base   Impuesto \n`
      ticket += `===============================\n`
      if(this.invoicetaxes !== null){
        if(this.invoicetaxes.length > 0){
          this.invoicetaxes.forEach((line,index)=>{
            ticket +=  this.addLineTax(line)
            // total += line.total;
          })
        }else{
          ticket += `       Sin Impuestos\n`
        }
      }else{
        ticket += `       Sin Impuestos\n`
      }
      ticket += `===============================\n`
      ticket += `Metodo de pago  Valor\n`
      ticket += `===============================\n`
      if(data.listPayment !== null){
        let amt = 0;
        let change = 0;
        data.listPayment.forEach((line,index)=>{
          amt += Number(line.receipt);
          ticket +=  this.addLinePayment(line)
          // total += line.total;
        })
        change = data.DocInvoiceAmount - amt;

        ticket += `Total recibido:..... $${amt}\n`
        ticket += `Cambio:............. $${change}\n`
        ticket += `===============================\n`
      }else{
        ticket += `       Sin Pagos\n`
        ticket += `===============================\n`
      }
      ticket += `Comentarios: \n`
      if(data.Comments !== "" || data.Comments !== null){
        ticket += data.Comments + '\n';
      }else{
        ticket += `\n`
      }
      if(data.ConfigPrinter.PrintText1){
        ticket += `${data.ConfigPrinter.Text1}\n`
      }
      if(data.ConfigPrinter.PrintText2){
        ticket += `===============================\n`
        ticket += `${data.ConfigPrinter.Text2}\n`
      }
      ticket += `===============================\n`
      ticket += `${data.Resolution}\n`
      ticket += `===============================\n`
      ticket += `   Elaborado en Bythewave S.A.S\n`
      ticket += `   NIT 900665411-2 \n`
      ticket += `   amazonaserp.com\n`
      ticket += `\n\n\n`

      return ticket;
    } catch (error) {
      console.log(error)
      return '';
    }
  }

  printPreviw() {
    try {
      this.loading = true;
      const popupCenterLocal = ({ url, title, w, h }) => {

        var objbuilder = '';
        objbuilder += ('<object width="100%" height="100%" data="data:application/pdf;base64,');
        objbuilder += (url);
        objbuilder += ('"type="application/pdf" class="internal">');
        objbuilder += ('<embed src="data:application/pdf;base64,');
        objbuilder += (url);
        objbuilder += ('"type="application/pdf"/>');
        objbuilder += ('</object>');

        // Fixes dual-screen position                             Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
        // tslint:disable-next-line: max-line-length
        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        // tslint:disable-next-line: max-line-length
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft;
        const top = (height - h) / 2 / systemZoom + dualScreenTop;

        const newWindow = window.open(url, title,
          `
          scrollbars=yes,
          width=${w / systemZoom},
          height=${h / systemZoom},
          top=${top},
          left=${left}
          `
        );

        newWindow.document.write('<html><title>' + title + '</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
        newWindow.document.write(objbuilder);
        newWindow.document.write('</body></html>');

        if (window.focus) {
          newWindow.focus();
        }

      }
      let storecode = new FormControl(this.storeCode)
      this.addInvoiceForm.addControl('storecode',storecode);
      // this.addInvoiceForm.controls.customer.disable();
      let data = {...this.addInvoiceForm.value};
      delete data.customer;
      this.loading = false;

      let url = window.location.href;
      url = url.substring(url.indexOf('//') + 2);
      url = url.substring(0, url.indexOf('/'));

      var host : string = ""

      switch (url) {
        case 'pos.amazonaserp.com':
          host = "https://documentos.amazonaserp.com";
          break;
        case 'testpos.amazonaserp.com':
          host = "https://testdocumentos.amazonaserp.com";
          break;
        case 'localhost:5200':
          host = "https://localhost:44316";
          break;
      }


      window.open(`${host}/documents/ARDocuments/GetARInvoicePDFPOS?companyid=${data.CompanyID}&invoicenum=${data.InvoiceNum}&storeid=${this.storeId}`,'_blank');
    } catch (error) {
      console.log(error);
    }
  }

}
