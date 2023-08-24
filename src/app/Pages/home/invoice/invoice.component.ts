import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IonList, ModalController } from '@ionic/angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { StoresService } from 'src/Services/POS/stores.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { InvoiceFormModels } from 'src/theme/shared/Models/InvoiceForm';
import { ShowMessageService } from 'src/Services/Shared/show-message.service';
import { SelectTranDocTypeComponent } from 'src/app/components/Modals/select-tran-doc-type/select-tran-doc-type.component';
import { InvoiceCommentsComponent } from 'src/app/components/Modals/invoice-comments/invoice-comments.component';
import { CashRegisterService } from 'src/Services/POS/cash-register.service';
import { CustomerService } from 'src/Services/OldBack/customer.service';
import { NativeService } from 'src/Services/Shared/native.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {

  @ViewChild('slidingList') slidingList: IonList;

  //Configuración
  fatherComponent: boolean = false;
  formatDecimal: any;
  optionsMask: any;
  loading: boolean = false;
  MessageLoading: string = '';
  cashRegister: string = 'CAJA';
  cashrbycompany: any[];
  isManager: boolean = false;
  storeConfig: any[] = [];
  isMobile: boolean = false;

  //Listas
  customers: any[];
  cartItems: any;

  //Lista de item seleccionados
  listItemSelected: Array<any> = [];

  //Arrays
  addInvoiceForm: FormGroup;
  invoicedtls: FormArray
  invoicetaxes: FormArray;

  priceAfterTax: boolean = false;
  currCurrCode: string = 'COP';
  now: Date = new Date();

  constructor(
    // private processInvoiceService: ProcessInvoiceService,
    private localStorage: LocalService,
    private localService: LocalStService,
    public modalController: ModalController,
    private apiDatePipe: DatePipe,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private invoiceModule: InvoiceFormModels,
    private cashRegisterService: CashRegisterService,
    private storeService: StoresService,
    private router: Router,
    private nativeService: NativeService,
    private showMessageService: ShowMessageService,
  ) {

    this.localStorage.getJsonValue('cartItems').then((res: any) => {
      this.cartItems = res
    });

    this.optionsMask = {
      thousands: ',',
      decimal: ',',
      precision: 2
    };
    this.localStorage.getJsonValue('companies').then((res_company: any) => {
      JSON.parse(res_company).forEach(a => {
        if (a.CompanyID.toString() === this.localStorage.getJsonValue('CIA').toString()) {
          this.formatDecimal = `1.${a.DecimalQty}-${a.DecimalQty}`;
          this.optionsMask = {
            thousands: a.DecimalSeparator === ',' ? '.' : ',',
            decimal: a.DecimalSeparator === ',' ? ',' : '.',
            precision: a.DecimalQty
          };
        }
      });
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 480; // Ajusta el ancho máximo para determinar si es un dispositivo móvil
  }

  async ngOnInit() {
    this.loading = true;

    this.storeConfig = await this.localStorage.getJsonValue('config');

    this.addInvoiceForm = this.invoiceModule.getInitializedFormNoAsync();

    this.customers = await this.customerService.getByCompany();

    await this.getCashRegisterByStore()
    this.loading = false;
    // console.log(this.customers)
  }

  async ionViewDidEnter() {

  }

  createItem() {

  }

  enterKeyEvent(event) {

  }

  async setFocusAfterTimeout(control) {
    const input = document.getElementById(`${control}`) as HTMLInputElement;
    input.focus();
    input.select();
  }

  get arrayInvoiceLine() {
    return this.addInvoiceForm.get("invoicedtls") as FormArray;
  }

  get arrayInvoiceTax() {
    return this.addInvoiceForm.get("invoicetaxes") as FormArray;
  }

  get DiscountControl() {
    return this.addInvoiceForm.get("InvoiceDiscount") as FormArray;
  }

  get arrayCustomer() {
    return this.addInvoiceForm.get("customer") as FormArray;
  }

  get f() { return this.addInvoiceForm.controls; }
  get g() { return this.addInvoiceForm.controls.invoicedtls['controls']; }
  get h() { return this.addInvoiceForm.controls.invoicetaxes['controls']; }

  //#endregion detalle de la factura

  getListItems(items) {
    this.listItemSelected = items;
    console.log(this.listItemSelected);
    this.fatherComponent = true;
    this.addInvoiceLines();
  }

  showListItems() {
    this.fatherComponent = false;
  }

  addInvoiceLines() {
    try {

      const curreInvoiceDtl = this.addInvoiceForm.get('invoicedtls') as FormArray;

      this.arrayInvoiceLine.clear();

      this.listItemSelected.forEach((item, index) => {

        let warehousecode;
        let warehsebincode;
        this.storeConfig.forEach(a => {
          if (a.value === 'Inventory') {
            warehousecode = a.res.Warehousecode;
            warehsebincode = a.res.Warehsebincode;
          }
        });

        /*         let validators = [Validators.required, Validators.min(this.processInvoiceService.calculateMin(this.optionsMask.precision) )];
              if(item.IsInventoryable && !BackFlush){
                let qtyStock = item.QtyStock;
                this.totalQtysForItems.forEach(e => {
                  if(e.ItemID == item.ItemID){
                    qtyStock = qtyStock - e.Quantity
                  }
                });
                validators = [Validators.required, Validators.min(this.processInvoiceService.calculateMin(this.optionsMask.precision)),Validators.max(qtyStock)];
              }
        */

        this.arrayInvoiceLine.push(
          new FormGroup({
            ItemID: new FormControl(item.ItemID),
            ItemDescription: new FormControl(item.ItemDescription),
            Line: new FormControl(index + 1),
            CompanyID: new FormControl(item.CompanyID),
            InvoiceNum: new FormControl(this.addInvoiceForm.controls['InvoiceNum'].value),
            showButton: new FormControl(true),
            Quantity: new FormControl(item.QtyInvoice),
            OnHandQty: new FormControl(item.QtyStock),
            IsInventoryable: new FormControl(item.IsInventoryable),
            DiscountPercent: new FormControl(0),
            Discount: new FormControl(0),
            DocDiscount: new FormControl(0),
            UOMCode: new FormControl(item.UOMCode),
            UnitPrice: new FormControl(item.SalePrice),
            DocUnitPrice: new FormControl(item.SalePrice, Validators.required),
            LineSubtotal: new FormControl(item.SalePrice),
            DocLineSubtotal: new FormControl(item.SalePrice),
            DocLineSubtotalTax: new FormControl(0),
            LineAmount: new FormControl(item.SalePrice),
            DocLineAmount: new FormControl(item.SalePrice, Validators.required),
            TaxBase: new FormControl(0),
            DocTaxBase: new FormControl(0),
            LineComments: new FormControl(''),
            CurrencyCode: new FormControl(this.addInvoiceForm.controls['CurrencyCode'].value),
            TRM: new FormControl(this.addInvoiceForm.controls['TRM'].value),
            RemissionNum: new FormControl(0),
            RemissionLine: new FormControl(0),
            Warehousecode: new FormControl(warehousecode),
            Bincode: new FormControl(warehsebincode),
            BackFlush: new FormControl(item.ItemwarehouseBackFlush),
            Inactive: new FormControl(false),
            CreatedBy: new FormControl(this.addInvoiceForm.controls['CreatedBy'].value),
            CreatedAt: new FormControl(this.addInvoiceForm.controls['CreatedAt'].value),
            ModifiedBy: new FormControl(this.addInvoiceForm.controls['ModifiedBy'].value),
            ModifyDate: new FormControl(this.addInvoiceForm.controls['ModifyDate'].value)
          })
        );
      });



      /*        if(item.IsInventoryable && item.Quantity < 1){
               if(!item.Itemwarehouse.BackFlush){
                 this.showMessageService.showSimpleAlert("Notificación", "Este producto es de inventario y no tiene cantidades disponibles");
                 return;
               }
             }
       
             let agregar=true;
             let index = 0;
             curreInvoiceDtl.controls.forEach(a => {
               if(a.value.ItemID === item.ItemID){
                 agregar = false;
                 let qty = a['controls']['Quantity'].value + 1;
                 a['controls']['Quantity'].setValue(
                   qty
                 );
       
                 this.processInvoiceService.onChangeQtyLine(index, this.addInvoiceForm).then((res_onChange:any)=>{
       
                   curreLineDtl.forEach(b => {
                     if(b.ItemID === item.ItemID){
                       b.QtyInvoice= qty;
                       if(item.IsInventoryable)
                         b.Quantity--;
                     }
                   });
                 });
               }
               index++;
             });
       
             if(agregar){
               this.loading=true;
               let invoiceline = 0;
               this.arrayInvoiceLine.controls.forEach(a => {
                 if (invoiceline < a['controls']['Line'].value)
                   invoiceline = a['controls']['Line'].value;
               });
       
               let warehousecode;
               let warehsebincode;
               this.storeConfig.forEach(a => {
                 if(a.value === 'Inventory'){
                   warehousecode = a.res.Warehousecode;
                   warehsebincode = a.res.Warehsebincode;
                 }
               });
       
               let BackFlush = false;
               if(item.Itemwarehouse !== null){
                 BackFlush = item.Itemwarehouse.BackFlush;
               }
               let validators = [Validators.required, Validators.min(this.processInvoiceService.calculateMin(this.optionsMask.precision) )];
               if(item.IsInventoryable && !BackFlush){
                 let qtyStock = item.QtyStock;
                 this.totalQtysForItems.forEach(e => {
                   if(e.ItemID == item.ItemID){
                     qtyStock = qtyStock - e.Quantity
                   }
                 });
                 validators = [Validators.required, Validators.min(this.processInvoiceService.calculateMin(this.optionsMask.precision)),Validators.max(qtyStock)];
               }
       
       
               this.arrayInvoiceLine.push(
                 new FormGroup({
                   ItemID: new FormControl(item.ItemID),
                   ItemDescription : new FormControl(item.ItemDescription),
                   Line: new FormControl(invoiceline + 1),
                   CompanyID: new FormControl(this.addInvoiceForm.controls['CompanyID'].value),
                   InvoiceNum: new FormControl(this.addInvoiceForm.controls['InvoiceNum'].value),
                   showButton: new FormControl(true),
                   Quantity: new FormControl(1, validators),
                   OnHandQty : new FormControl(item.QtyStock),
                   IsInventoryable : new FormControl(item.IsInventoryable),
                   DiscountPercent: new FormControl(0),
                   Discount: new FormControl(0),
                   DocDiscount: new FormControl(0),
                   UOMCode: new FormControl(item.UOMCode),
                   UnitPrice: new FormControl(item.SalePrice),
                   DocUnitPrice: new FormControl(item.SalePrice, Validators.required),
                   LineSubtotal: new FormControl(item.SalePrice),
                   DocLineSubtotal: new FormControl(item.SalePrice),
                   DocLineSubtotalTax: new FormControl(0),
                   LineAmount: new FormControl(item.SalePrice),
                   DocLineAmount: new FormControl(item.SalePrice, Validators.required),
                   TaxBase: new FormControl(0),
                   DocTaxBase: new FormControl(0),
                   LineComments: new FormControl(''),
                   CurrencyCode: new FormControl(this.addInvoiceForm.controls['CurrencyCode'].value),
                   TRM: new FormControl(this.addInvoiceForm.controls['TRM'].value),
                   RemissionNum: new FormControl(0),
                   RemissionLine: new FormControl(0),
                   Warehousecode : new FormControl(warehousecode),
                   Bincode : new FormControl(warehsebincode),
                   BackFlush : new FormControl(BackFlush),
                   Inactive: new FormControl(false),
                   CreatedBy: new FormControl(this.addInvoiceForm.controls['CreatedBy'].value),
                   CreatedAt: new FormControl(this.addInvoiceForm.controls['CreatedAt'].value),
                   ModifiedBy: new FormControl(this.addInvoiceForm.controls['ModifiedBy'].value),
                   ModifyDate: new FormControl(this.addInvoiceForm.controls['ModifyDate'].value)
                 })
               );
       
               this.apiARInvoiceService.getLineTax(invoiceline+1, item.ItemID)
                   .then((r: any) => {
                     if(r.result.length === 0){
                       this.loading = false;
                       return;
                     }
                     r.result.forEach(e => {
                       this.addInvoiceTaxFromLine(e, index);
                       this.loading=false;
                     });
                   })
                   .catch(error => {
                     console.log(error);
                     this.loading=false;
                   });
       
               curreLineDtl.forEach(b => {
                 if(b.ItemID === item.ItemID){
                   b.QtyInvoice=1;
                   if(item.IsInventoryable)
                       b.Quantity--;
                 }
               });
             }
       
             this.totalItemQtys++;
             this.nativeService.playAudio("success");
             if(this.priceAfterTax){
               this.processInvoiceService.onChangeQtyLine(index, this.addInvoiceForm).then((res_onChange:any)=>{
                 this.addInvoiceForm = res_onChange;
               });
             }
             this.addInvoiceForm = this.processInvoiceService.calcularTotales(this.addInvoiceForm); */
    } catch (error) {
      console.log(error);
    }
  }

  clearListItems() {
    this.showMessageService.showComfirmAlert("Notificación", "¿Está seguro que desea eliminar los productos seleccionados?").then(
      async (result: boolean) => {
        if (result)
          this.listItemSelected = [];
        this.arrayInvoiceLine.clear();
      });
  }

  async getCashRegisterByStore() {
    try {
      const res = await this.cashRegisterService.getCashRegisterByStore();
      if (res.success) {
        this.cashrbycompany = res.result;
        const CurrentCashRegisterID = await this.localStorage.getJsonValue('cashRegisterID');
        this.cashRegister = this.cashrbycompany.find(element => element.CashRegisterID == CurrentCashRegisterID)?.Description || '';

        try {
          const isManager = await this.localStorage.getJsonValue('isManager');
          this.isManager = isManager == null || isManager == undefined || isManager == false ? false : true;
        } catch (error) {
          console.error(error);
          this.isManager = false;
        }
      }
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }


  async openMyModal(modalid) {

    var dataSendModal;
    var title;

    switch (modalid) {
      case 'selectCustomer':
        dataSendModal = this.customers;
        title = "SELECCIONE UN   CLIENTE";
        break;
      case 'selectCashR':
        if (!this.isManager) {
          return
        }
        dataSendModal = this.cashrbycompany;
        title = "SELECCIONE UNA CAJA";
        break;
      default:
        break;
    }




    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        title: title,
        items: dataSendModal,
        modalid: modalid
      },
    });

    modal.onDidDismiss().then(async (data) => {

      this.loading = false;
      if (data.data && data.data.data && data.data.role === 'selected') {
        switch (data.data.modalid) {
          case 'selectCustomer':
            const customer = data.data.data
            this.addInvoiceForm.controls['CustomerName'].setValue(customer.SearchWord);
            this.addInvoiceForm.controls['CustomerID'].setValue(customer.CustomerID);
            this.addInvoiceForm.controls['Identification'].setValue(customer.TerceroNum);

            this.arrayCustomer.removeAt(0);

            this.arrayCustomer.push(new FormGroup({
              CompanyID: new FormControl(customer.CompanyID),
              CustomerID: new FormControl(customer.CustomerID),
              TerceroNum: new FormControl(customer.TerceroNum),
              TypeID: new FormControl(customer.TypeID),
              CheckDigit: new FormControl(customer.CheckDigit),
              FirstName: new FormControl(customer.FirstName),
              AnotherName: new FormControl(customer.AnotherName),
              FirstLastName: new FormControl(customer.FirstLastName),
              SecondLastName: new FormControl(customer.SecondLastName),
              BusinessName: new FormControl(customer.BusinessName),
              FiscalName: new FormControl(customer.FiscalName),
              CIIUCode: new FormControl(customer.CIIUCode),
              TaxResponsabilityID: new FormControl(customer.TaxResponsabilityID),
              TermID: new FormControl(customer.TermID),
              PayMethodID: new FormControl(customer.PayMethodID),
              TaxApply: new FormControl(customer.TaxApply),
              CountryID: new FormControl(customer.CountryID),
              StateID: new FormControl(customer.StateID),
              CityID: new FormControl(customer.CityID),
              Address: new FormControl(customer.Address),
              PhoneNum: new FormControl(customer.PhoneNum),
              EMailAddress: new FormControl(customer.EMailAddress)
            }));
            break;
          case 'selectCashR':
            const cashr = data.data.data
            this.localStorage.setJsonValue('cashRegisterID', cashr.CashRegisterID);
            this.cashRegister = cashr.Description
            break;
          default:
            break;
        }
      }

    });

    await modal.present();
  }

  changeCashRegister() {

  }

  async getStore() {
    try {
      let response = await this.storeService.getByCompany();
      if (response.success) {
        let storeid = await this.localStorage.getJsonValue('storeid');
        response.result.forEach(item => {
          if (storeid == item.StoreId) {
            this.priceAfterTax = item.PriceAfterTax;
          }
        });
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  async printInvoice() {
    /*   this.printService.searchBluetoothPrinter().then(async (_: any) => {
        const modal = await this.modalController.create({
          component: ListPrintersPage,
          componentProps: {
            listPrinters: _,
          }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss()
        await this.printService.sendToBluetoothPrinter(data, this.addInvoiceForm.value)
      }) */
  }

  openModalSelectTranDocType() {

    this.showMessageService.showComfirmAlert("Notificación", "¿Está seguro que desea cambiar el tipo de documento?").then(
      async (result: boolean) => {
        if (result) {

          const modal = await this.modalController.create({
            component: SelectTranDocTypeComponent,
            componentProps: {
              title: "Seleccione tipo de documento",
              TranDocTypeID: this.addInvoiceForm.controls['TranDocTypeID'].value
            },
            cssClass: 'my-custom-modal-tranType',
            backdropDismiss: false
          });

          modal.onDidDismiss().then(async (data) => {
            let responseModal = data.data
            if (responseModal.res) {
              this.addInvoiceForm.controls['TranDocTypeID'].setValue(responseModal.data);
            } else
              this.showMessageService.showSimpleAlert("Notificación", responseModal.message);
          });

          await modal.present();

        }
      }
    );
  }

  async openModalInvoiceComments() {
    const modal = await this.modalController.create({
      component: InvoiceCommentsComponent,
      componentProps: {
        title: "Comentario de factura",
        comments: this.addInvoiceForm.controls['Comments'].value
      },
      cssClass: 'my-custom-modal-tranType',
      backdropDismiss: false
    });

    modal.onDidDismiss().then(async (responseModal) => {
      if (responseModal.data) {
        this.addInvoiceForm.controls['Comments'].setValue(responseModal.data.data);
      }
    });
    await modal.present();
  }
}
