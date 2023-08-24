import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { ArcashreceiptsService } from 'src/Services/OldBack/arcashreceipts.service';
import { ARInvoiceService } from 'src/Services/OldBack/arinvoice.service';
import { PaymethodService } from 'src/Services/OldBack/paymethod.service';
import { TrandoctypeService } from 'src/Services/OldBack/trandoctype.service';
import { PosService } from 'src/Services/POS/pos.service';
import { StoreinvoicedService } from 'src/Services/POS/storeinvoiced.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';
import { NativeService } from 'src/Services/Shared/native.service';

@Component({
  selector: 'app-payment-method-popup',
  templateUrl: './payment-method-popup.page.html',
  styleUrls: ['./payment-method-popup.page.scss'],
})
export class PaymentMethodPopupPage implements OnInit {
  addInvoiceForm : FormGroup;
  addCashReceiptForm: FormGroup;
  arcashreceiptdtl: FormArray;
  InvoiceDiscount: FormArray;
  arcashreceipttax: FormArray;

  formatDecimal:string='';
  selectedNameMethod:String='';
  cashSelected:boolean=false;
  showSelectedPayment:boolean=false;
  optionsMask: any;
  loading:boolean=false;
  paymethod = [];
  currency = this.loadcombos.getCurrencies();
  trandoctype = this.loadcombos.getTranDocType('SP');
  cashequivalent = this.loadcombos.getCashEquivalent()

  listPaymentMethod:any=[];
 
  position = 'bottom-right';
  InvoiceBalanceHeader = 0;
  InvoiceBalance = 0;
  fullpayment:boolean=true;
  titleTotal='Faltan : ';

  constructor(
    //private indexedDBService : IndexedDBService,
    private localStorage: LocalService,
    //private modalService: NgbModal,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private apiARInvoiceService: ARInvoiceService,
    private apiArcashreceiptsService: ArcashreceiptsService,
    private localService: LocalStService,
    private loadcombos: LoadStaticCombosService,
    public modalActive:ModalController,
    private apiStoreInvoicedService : StoreinvoicedService,
    private apiPosService : PosService,
    private paymethodService: PaymethodService,
    private apiDatePipe : DatePipe,
    private tranDocTypeService : TrandoctypeService,
    //private toastyService: ToastyService,
    private nativeService : NativeService,
    private navParams: NavParams
  ) {}

  async ngOnInit(){
    this.addCashReceiptForm = new FormGroup({
      CashReceiptNum: new FormControl(0),
      CompanyID: new FormControl(await this.localStorage.getJsonValue('CIA')),
      CustomerID: new FormControl('', Validators.required),
      CustomerName: new FormControl(''),
      TranDocTypeID: new FormControl('RC', Validators.required),
      PayMethodID: new FormControl('', Validators.required),
      TranDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss'), Validators.required),
      CashEquivalentId: new FormControl('', Validators.required),
      CashReceiptAmount: new FormControl(0),
      DocCashReceiptAmount: new FormControl(0, Validators.min(1)),
      CashReceiptBalance: new FormControl(0),
      DocCashReceiptBalance: new FormControl(0, Validators.min(0)),
      AppliedAmt: new FormControl(0),
      DocAppliedAmt: new FormControl(0, Validators.min(0)),
      Process: new FormControl(false),
      UnidentifiedAmount: new FormControl(false),
      AdvanceAmount: new FormControl(false),
      CurrencyCode: new FormControl('COP', Validators.required),
      TRM: new FormControl(1),
      LegalNumber: new FormControl(''),
      Comentarios: new FormControl(this.addInvoiceForm.value.Comments),
      CreatedAt: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
      ModifyDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
      ModifiedBy: new FormControl(this.localService.getUser()),
      CreatedBy: new FormControl(this.localService.getUser()),
      arcashreceiptdtl: new FormArray([]),
      InvoiceDiscount: new FormArray([]),
    });
    this.InvoiceBalance = this.addInvoiceForm.value.DocInvoiceBal;
    this.InvoiceBalanceHeader = this.addInvoiceForm.value.DocInvoiceBal;
    this.loading = true;
    const CIA = await this.localStorage.getJsonValue('CIA')
    this.apiPosService.getBanksByID(await this.localStorage.getJsonValue('storeid'))
      .then((res: any) => {
        if (res.success) {
          this.paymethodService.getByCompanyAll(CIA)
          .then((res1:any)=>{
            this.loading = false;
            res1.forEach(b => {
              res.result.forEach(a => {
                if (!b.Inactive) {
                  if (a.PayMethodID === b.PayMethodID && a.CashEquivalentId > 0)
                    this.paymethod.push(b);
                }
              });
            });
          })
          .catch(error => console.log(error));
        }else{
          this.loading =false;
          this.nativeService.OnlyAlert('Notificación',res.message,'warning');
        }
      })
      .catch(error => console.log(error));
  }

  get f() { return this.addInvoiceForm.controls; }

  closeInvoiceViewModal(){
    this.modalActive.dismiss(0);
  }

  selectedMethod(e,o){
    this.paymethod.forEach(a => {
      a["Inactive"]=false;
    });

    o.Inactive = true;
    this.cashSelected = o.PayMethodID == 'EFEC' ? true :false;
    this.selectedNameMethod = " - " + o.PayMethodDescription;
    this.showSelectedPayment = true;
  }

  addPaymentMethod(){
    if(this.addCashReceiptForm.value.DocCashReceiptAmount <= 0){
      this.nativeService.OnlyAlert('Notificación','Debe ingresar un monto válido','info');
      return;
    }

    if(this.InvoiceBalance<0){
      this.nativeService.OnlyAlert('Notificación','No se puede realizar mas abonos','info');
      return;
    }

    let amountTotal = 0;
    let amountApplied = 0;
    this.listPaymentMethod.forEach(a => {
      amountApplied += a.receipt;
    });

    if(this.addCashReceiptForm.value.DocCashReceiptAmount < (this.addInvoiceForm.value.DocInvoiceAmount-amountApplied))
      amountTotal = this.addCashReceiptForm.value.DocCashReceiptAmount;
      else{
        amountTotal = this.addInvoiceForm.value.DocInvoiceAmount-amountApplied;
      }

    this.paymethod.forEach(a => {
      if(a["Inactive"]){
          this.listPaymentMethod.push({
            paymentid:a["PayMethodID"],
            paymentdesc:a["PayMethodDescription"],
            receipt:this.addCashReceiptForm.value.DocCashReceiptAmount,
            amount: amountTotal,
            storeid:Number(this.localStorage.getJsonValue('storeid')),
            username:this.localStorage.getJsonValue('useName'),
            UserID:this.localStorage.getJsonValue('userID'),
            CashRegisterID:this.localStorage.getJsonValue('cashRegisterID'),
            IsCredit:a["IsCredit"],
        })
      }
    });
    let valueApplied = 0;
    this.listPaymentMethod.forEach(a => {
      valueApplied += a.receipt;
    });
    this.fullpayment =false;
    this.addCashReceiptForm.controls['DocCashReceiptAmount'].setValue(0);
    this.InvoiceBalance=this.addInvoiceForm.value.DocInvoiceAmount - valueApplied;
    if (this.InvoiceBalance < 0) {
      this.titleTotal = 'Cambio : ';
    } else if (this.InvoiceBalance == 0) {
      this.titleTotal = 'Pago completo : ';
    }
  }

  deletepaymethod(i){
    try {
      this.listPaymentMethod.splice(i,1);

      let valueApplied = 0;
    this.listPaymentMethod.forEach(a => {
      valueApplied += a.receipt;
    });

    this.addCashReceiptForm.controls['DocCashReceiptAmount'].setValue(0);
    this.InvoiceBalance=this.addInvoiceForm.value.DocInvoiceAmount - valueApplied;

    if (this.InvoiceBalance < 0) {
      this.titleTotal = 'Cambio : ';
    } else if (this.InvoiceBalance == 0) {
      this.titleTotal = 'Pago completo : ';
    } else if (this.InvoiceBalance > 0) {
      this.titleTotal = 'Faltan : ';
    } 

    if(this.listPaymentMethod.length === 0)
      this.fullpayment = true;

    } catch (error) {

    }
  }

  checkoutWithFullPaid(){
    this.addInvoiceForm.enable();
    if (this.addInvoiceForm.invalid)
      return;
    this.loading=true;

    this.tranDocTypeService.GetAvailableConcecutiveByTranType(this.localStorage.getJsonValue('CIA'), "CE").then((data:any) => {
      let curAvailableConcecutive = 1;
      if(data.success){
        curAvailableConcecutive = data.result;
      }
      if(curAvailableConcecutive <= 0){
        /*Swal.fire({
          title: 'Notificación',
          text: 'Los consecutivos disponibles para generar los recibos de caja concluyeron, si continúa con el proceso no se generara en automático el recibo de caja ¿Está seguro que desea continuar?',
          type: 'question',
          showCloseButton: true,
          showCancelButton: true
        }).then((willDelete) => {
          if (willDelete.dismiss) {
            Swal.fire('Proceso cancelado', 'Se cancelo el proceso!', 'warning');
            this.loading=false;
            return;
          } else {
            this.checkoutWithFullPaidProcess();  
          }
        });*/
      }else{
        this.checkoutWithFullPaidProcess();
      }
      return true;
    }).catch((error) => {
      console.log(error);
      this.checkoutWithFullPaidProcess();
    });
  }


  calcular() {
    var totalCash = 0;
    (<HTMLInputElement>document.getElementById("change")).value = 0 + "";
    this.listPaymentMethod.forEach(element => {
      if (element.paymentid = "EFEC") {
        totalCash += element.amount
      }
    });
    if (this.listPaymentMethod.length > 0) {
      var change = (parseFloat((<HTMLInputElement>document.getElementById("cash")).value) - totalCash);
      (<HTMLInputElement>document.getElementById("change")).value = change < 0 ? 'Valor Negativo' : Number(change).toLocaleString("en-CO")
    }
  }

  checkoutWithFullPaidProcess(){
    this.paymethod.forEach(a => {
      if(a["Inactive"]){
          this.listPaymentMethod.push({
            paymentid:a["PayMethodID"],
            paymentdesc:a["PayMethodDescription"],
            amount:this.addInvoiceForm.value.DocInvoiceAmount,
            IsCredit:a["IsCredit"],
            receipt:this.addInvoiceForm.value.DocInvoiceAmount,
            storeid:Number(this.localStorage.getJsonValue('storeid')),
            username:this.localStorage.getJsonValue('useName'),
            UserID:this.localStorage.getJsonValue('userID'),
            CashRegisterID:this.localStorage.getJsonValue('cashRegisterID')
        })
      }
    });

    let valueApplied = 0;
    this.listPaymentMethod.forEach(a => {
      valueApplied += a.receipt;
    });
    this.InvoiceBalance=this.addInvoiceForm.value.DocInvoiceAmount - valueApplied;

    this.apiARInvoiceService.getConsecutive()
    .then((resp: any) => {
      if (resp.Status) {
        //
        this.addInvoiceForm.removeControl('customer');
        //
        this.addInvoiceForm.controls['InvoiceNum'].setValue(Number(resp.Result));
        this.addInvoiceForm.controls['Process'].setValue(true);
        this.addInvoiceForm.controls['Comments'].setValue(this.addCashReceiptForm.controls['Comentarios'].value);
        //
        let pOSCreateInvoice = {
          ARInvoiceHead : this.addInvoiceForm.value,
          ListPaymentMethods :this.listPaymentMethod,
          StoreID :this.localStorage.getJsonValue('storeid') == null ? 0 : this.localStorage.getJsonValue('storeid')
        };
        //SERVICIO DE CREACIÓN DE FACTURA
        this.apiPosService.createPOSInvoice(pOSCreateInvoice)
        .then((res:any)=>{
          if(res.success){
            try {
              var uvtBool = res.module.split(";")[1]
              if (uvtBool == 1) {
                /*this.addToast({
                  title: "",
                  msg: "Se cambio el tipo documento de la factura, debido a que supero el tope de UVTs",
                  timeout: 12000,
                  showClose: false,
                  theme: 'bootstrap',
                  position: 'top-bottom',
                  type: 'info'
                });*/
              }
            } catch (error) {
              console.error(error)
            }          

            this.apiStoreInvoicedService.delete(this.localStorage.getJsonValue('userID'),this.addInvoiceForm.value.OrderNum).then(()=>{
              //this.showPrint(res);
            }).catch(console.log)

            this.modalActive.dismiss(1);
            this.loading = false;
          }
          else{
            this.loading=false;
            this.nativeService.OnlyAlert('Notificación',res.message,'warning');
            this.closeInvoiceViewModal();
          }
        })
        .catch(console.log)
      }
    });

  }

}
