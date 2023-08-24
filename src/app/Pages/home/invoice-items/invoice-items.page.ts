import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LocalService } from 'src/Services/Config/local.service';
import { CurrenciesService } from 'src/Services/POS/currencies.service';
import { CustomerService } from 'src/Services/OldBack/customer.service';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { WarehseBinService } from 'src/Services/OldBack/warehse-bin.service';
import { PosService } from 'src/Services/POS/pos.service';
import { StoreinvoicedService } from 'src/Services/POS/storeinvoiced.service';
import { CalculatedService } from 'src/Services/Shared/calculated.service';
import { NativeService } from 'src/Services/Shared/native.service';
import { SelectCustomerPage } from 'src/app/components/Modals/select-customer/select-customer.page';
import { Customer } from 'src/theme/shared/Models/customers';

//POP-UPS
import { ShowItemDetailPage } from 'src/app/components/Modals/show-item-detail/show-item-detail.page';
import { InvoiceCommentPopupPage } from "src/app/components/Modals/invoice-comment-popup/invoice-comment-popup.page";
import { SaveInvoicePopupPage } from 'src/app/components/Modals/save-invoice-popup/save-invoice-popup.page'
import { ShowPrintPopupPage } from "src/app/components/Modals/show-print-popup/show-print-popup.page";
import { TranDocTypePopupPage } from 'src/app/components/Modals/tran-doc-type-popup/tran-doc-type-popup.page';
import { PaymentMethodPopupPage } from 'src/app/components/Modals/payment-method-popup/payment-method-popup.page';


@Component({
  selector: 'app-invoice-items',
  templateUrl: './invoice-items.page.html',
  styleUrls: ['./invoice-items.page.scss'],
})
export class InvoiceItemsPage implements OnInit {

  public addInvoiceForm: FormGroup;
  public dataSourceItem: MatTableDataSource<any>;

  loading = false;
  name = '';
  customers: Customer[];
  totalProduct: number = 0;
  totalQty: number = 0;
  optionsMask: any;
  formatDecimal = '1.2-2';

  currCurrCode: string = 'COP';
  currSymbol: string;
  configStore: any;

  totalQtysForItems: any[] = [];

  priceAfterTax: boolean = false;

  //
  InventoryAlert: number = 0;
  hideInventoryAlert: boolean = true;
  InvoiceAlert: number = 0;
  hideInvoiceAlert: boolean = true;
  CommentInvoice: number = 0;
  hideCommentInvoice: boolean = true;
  SavedInvoiceAlert: number = 0;
  hideSavedInvoiceAlert: boolean = true;
  //
  storeConfig: any[] = [];

  constructor(
    private apiStoreInvoicedService: StoreinvoicedService,
    private calculatedService: CalculatedService,
    private apiDatePipe: DatePipe,
    private router: Router,
    private apiItemwhsebinservice: WarehseBinService,
    private apiCustomerService: CustomerService,
    private apiPosService: PosService,
    private apiCurrenciesService: CurrenciesService,
    private localStorage: LocalService,
    private nativeService: NativeService,
    private modalController: ModalController,
    private localStService : LocalStService,
    private fb : FormBuilder

  ) {
    this.localStorage.getJsonValue('companies').then(async (res: any) => {
      await JSON.parse(res).forEach(async (a) => {

        if (a.CompanyID === await this.localStorage.getJsonValue('CIAM')) {
          this.formatDecimal = `1.${a.DecimalQty}-${a.DecimalQty}`;
          this.optionsMask = {
            thousands: a.DecimalSeparator === ',' ? '.' : ',',
            decimal: a.DecimalSeparator === ',' ? ',' : '.',
            precision: a.DecimalQty
          };
        }
        this.apiCurrenciesService.getByID(a.CompanyID, this.currCurrCode)
          .then((resp: any) => {
            this.currSymbol = resp[0].CurrSymbol;
          });
      });
    });
  }

  get f() { return this.addInvoiceForm.controls; }
  get g() { return this.addInvoiceForm.controls.invoicedtls['controls']; }
  get h() { return this.addInvoiceForm.controls.invoicetaxes['controls']; }

  ngOnInit() {
    this.calcularTotales();
  }

  async ionViewDidEnter() {

  }

  get arrayCustomer() {
    return this.addInvoiceForm.get("customer") as FormArray;
  }

  get arrayInvoiceLine() {
    return this.addInvoiceForm.get("invoicedtls") as FormArray;
  }

  get arrayInvoiceTax() {
    return this.addInvoiceForm.get("invoicetaxes") as FormArray;
  }

  async addInvoiceTaxFromLine(obj: any, i:any) {
        
    try {
      this.arrayInvoiceTax.push(
        this.fb.group({
          TaxLine: [obj.TaxLine],
          InvoiceNum: [this.addInvoiceForm.controls['InvoiceNum'].value],
          CompanyID: [await this.localStorage.getJsonValue('CIA')],
          TaxID: [obj.TaxID],
          RateCode: [obj.RateCode],
          Line: [obj.Line],
          Percent: [obj.Percent],
          TaxableAmount: [obj.TaxableAmount],
          DocTaxableAmount: [obj.DocTaxableAmount],
          TaxAmount: [obj.TaxAmount],
          DocTaxAmount: [obj.DocTaxAmount],
          CurrencyCode: [this.addInvoiceForm.controls['CurrencyCode'].value],
          TRM: [this.addInvoiceForm.controls['TRM'].value],
          Manual: [obj.Manual],
          TaxTypeID: [obj.TaxTypeID],
          Inactive: [false],
          CreatedBy: [await this.localStorage.getJsonValue('user')],
          CreatedAt: [this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')],
          ModifiedBy: [await this.localStorage.getJsonValue('user')],
          ModifyDate: [this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')],
          joindtls: ['']
        })
      )
      this.onChangeQtyLine(i)
    } catch (error) {
      console.log(error);
    }
  }

  async getStore() {
    try {
      this.loading = true
      await this.apiPosService.getByCompany()
        .then((response: any) => {
          if (response.success) {
            let storeid = this.localStorage.getJsonValue('storeid');
            response.result.forEach(item => {
              if (storeid == item.StoreId) {
                this.priceAfterTax = item.PriceAfterTax
              }
            });
          }
        })
        .catch()
    } catch (error) {
      this.loading = false;
      console.log(error)
    }
  }

  async loadConfigStore() {
    let storeid = await this.localStorage.getJsonValue('storeid');
    if (storeid && storeid != "") {
      this.loading = true;
      this.apiPosService.getByIDValitionContinue(storeid)
        .then((conf: any) => {
          if (conf.success) {
            this.apiPosService.getByID(storeid)
              .then((res: any) => {
                this.storeConfig.push({ value: 'Store', res: res });

                this.apiPosService.getDocTypeByID(storeid)
                  .then((res: any) => {
                    if (res.result != null) {
                      this.storeConfig.push({ value: 'DocType', res: res.result });
                    }
                    this.apiPosService.getInventoryByID(storeid)
                      .then((res: any) => {
                        if (res.result != null) {
                          this.storeConfig.push({ value: 'Inventory', res: res.result });
                          if (res.result.warehousecode != null) {
                            this.apiItemwhsebinservice.getByCompany(res.result.Warehousecode)
                              .then((res: any) => {
                                this.storeConfig.push({ value: 'WhseBin', res: res.result });
                              })
                              .catch((error: any) => {
                                this.loading = false;
                                console.log(error);
                              });
                          }
                        }

                        this.apiPosService.getBanksByID(storeid)
                          .then((res: any) => {
                            if (res.result != null) {
                              this.storeConfig.push({ value: 'Banks', res: res.result });
                            }
                            this.apiPosService.getPrinterID(storeid)
                              .then((res: any) => {
                                if (res.result != null) {
                                  this.storeConfig.push({ value: 'Printers', res: res.result });
                                  this.localStorage.setJsonValue('config', this.storeConfig);
                                  this.storeConfig.forEach(a => {
                                    if (a.value === 'DocType') {
                                      this.addInvoiceForm.controls["TranDocTypeID"].setValue(a.res.SalesDocumentType)
                                    }
                                  });
                                  this.customers = null;
                                  this.loading = true;
                                  this.apiCustomerService.getByCompany()
                                    .then(
                                      (res: any[]) => {
                                        this.customers = res;
                                      }).catch((err: any) => {
                                        console.log(err);
                                        this.customers = null;
                                        this.loading = false;
                                        if (err.error.Message === 'Authorization has been denied for this request.') {
                                          // CERRAR SESIÓN
                                        } else {
                                          this.nativeService.OnlyAlert('Notificación', err.error.Message, 'warning');
                                        }
                                      }
                                      )

                                }
                              })
                              .catch((error: any) => {
                                this.loading = false;
                                console.log(error);
                              })
                          })
                          .catch((error: any) => {
                            this.loading = false;
                            console.log(error);
                          })
                      })
                      .catch((error: any) => {
                        this.loading = false;
                        console.log(error);
                      })

                  })
                  .catch((error: any) => {
                    this.loading = false;
                    console.log(error);
                  })
              })
              .catch((err: any) => {
                this.loading = false;
                console.log(err);
              })
          }
          else {
            this.nativeService.OnlyAlert('Notificación', conf.message, 'warning');
            this.router.navigateByUrl('app/configuracionpos');
          }
        })
        .catch((err: any) => {
          this.loading = false;
          console.log(err);
        })

    }
  }

  async onChangeQtyLine(index) {
    try {

      this.loading = true;
      await this.calculatedService.calculatedPOSHeadLine(this.addInvoiceForm.value, index)
        .then((resp: any) => {
          if (resp.success) {
            const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
            const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;

            let dtls = resp.result.invoicedtls[index];
            let taxes = resp.result.invoicetaxes;


            currentinvcDtls.controls[index]['controls']['DocUnitPrice'].setValue(dtls.DocUnitPrice);
            currentinvcDtls.controls[index]['controls']['UnitPrice'].setValue(dtls.UnitPrice);
            currentinvcDtls.controls[index]['controls']['DocDiscount'].setValue(dtls.DocDiscount);
            currentinvcDtls.controls[index]['controls']['Discount'].setValue(dtls.Discount);
            currentinvcDtls.controls[index]['controls']['DocLineAmount'].setValue(dtls.DocLineAmount);
            currentinvcDtls.controls[index]['controls']['LineAmount'].setValue(dtls.LineAmount);
            currentinvcDtls.controls[index]['controls']['DocLineSubtotal'].setValue(dtls.DocLineSubtotal);
            currentinvcDtls.controls[index]['controls']['LineSubtotal'].setValue(dtls.LineSubtotal);
            currentinvcDtls.controls[index]['controls']['DocTaxBase'].setValue(dtls.DocTaxBase);
            currentinvcDtls.controls[index]['controls']['TaxBase'].setValue(dtls.TaxBase);
            currentinvcDtls.controls[index]['controls']['DocLineSubtotalTax'].setValue(dtls.DocLineSubtotalTax);

            currentinvcTaxs.controls.forEach(a => {
              taxes.forEach(b => {
                if (a['controls']['Line'].value === b.Line && a['controls']['TaxID'].value === b.TaxID && a['controls']['RateCode'].value === b.RateCode) {
                  a['controls']['TaxableAmount'].setValue(b.TaxableAmount);
                  a['controls']['DocTaxableAmount'].setValue(b.DocTaxableAmount);
                  a['controls']['DocTaxAmount'].setValue(b.DocTaxAmount);
                  a['controls']['TaxAmount'].setValue(b.TaxAmount);
                }
              });
            });

            this.addInvoiceForm.controls['DocInvoiceSubTotal'].setValue(resp.result.DocInvoiceSubTotal);
            this.addInvoiceForm.controls['InvoiceSubTotal'].setValue(resp.result.InvoiceSubTotal);
            this.addInvoiceForm.controls['DocDiscount'].setValue(resp.result.DocDiscount);
            this.addInvoiceForm.controls['Discount'].setValue(resp.result.Discount);
            this.addInvoiceForm.controls['DocWithHoldingAmount'].setValue(resp.result.DocWithHoldingAmount);
            this.addInvoiceForm.controls['WithHoldingAmount'].setValue(resp.result.WithHoldingAmount);
            this.addInvoiceForm.controls['DocTaxAmount'].setValue(resp.result.DocTaxAmount);
            this.addInvoiceForm.controls['TaxAmount'].setValue(resp.result.TaxAmount);
            this.addInvoiceForm.controls['DocInvoiceAmount'].setValue(resp.result.DocInvoiceAmount);
            this.addInvoiceForm.controls['InvoiceAmount'].setValue(resp.result.InvoiceAmount);
            this.addInvoiceForm.controls['DocInvoiceBal'].setValue(resp.result.DocInvoiceBal);
            this.addInvoiceForm.controls['InvoiceBal'].setValue(resp.result.InvoiceBal);

          }
          this.loading = false;
        }).catch((error: any) => {
          if (error.status === 504) {
            this.nativeService.OnlyAlert('Notificación', 'Tenemos problemas con la conexión, no puedo calcular los valores', 'warning');
          }
          this.loading = false;
        })
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  async deleteInvoiceLine(i) {
    const curreLineDtl = this.dataSourceItem.filteredData;
    const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
    const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;
    let j = 0;
    let aValue = 0;
    currentinvcTaxs.value.forEach(a => {
      if (currentinvcDtls.value[i]["Line"] === a['Line']) {
        aValue = a['Line'];
        currentinvcTaxs.removeAt(j);
        j = j - 1;
      }
      j++;
    });

    curreLineDtl.forEach(b => {
      if (b.ItemID === currentinvcDtls.controls[i]['controls']['ItemID'].value) {
        b.QtyInvoice = 0;
        if (b.IsInventoryable)
          b.Quantity += currentinvcDtls.controls[i]['controls']['Quantity'].value;
      }
    });

    currentinvcDtls.removeAt(i);
    if (currentinvcDtls.value.length === 0) {
      await this.apiStoreInvoicedService.getByID(await this.localStorage.getJsonValue('userID'), this.addInvoiceForm.value.OrderNum)
        .then(async (res: any) => {
          if (res.result !== null) {
            this.apiStoreInvoicedService.delete(await this.localStorage.getJsonValue('userID'), this.addInvoiceForm.value.OrderNum)
              .then((res: any) => {
                if (res.success) {
                  this.addInvoiceForm.controls["OrderNum"].setValue('');
                  this.nativeService.OnlyAlert('Notificación', res.message, 'info');
                  this.validateInventory();
                } else {
                  this.nativeService.OnlyAlert('Notificación', res.message, 'warning');
                  return;
                }
              })
              .catch(console.log)
          }
        })
        .catch(console.log)
    }
    this.nativeService.playAudio("delete");
    this.calcularTotales();
  }

  async clearInvoiceForm() {
    const curreLineDtl = this.dataSourceItem.filteredData;
    const curreInvoiceDtl = this.addInvoiceForm.get('invoicedtls') as FormArray;

    if (curreInvoiceDtl.length === 0) return;
    //ACA PREGUNTAMOS SI QUEREMOS LIMPIAR

    let response: any = await this.nativeService.AlertConfirm('Esta seguro?', 'de limpiar los registros, una vez realizado este proceso no se puede deshacer');

    if (response.isConfirmed) {

      this.loading = true;
      this.totalProduct = 0;
      this.totalQty = 0;
      this.validateInventory();

      let docType = '';


      this.addInvoiceForm = new FormGroup({
        itemsearch: new FormControl(''),
        OrderNum: new FormControl(''),
        ARInvoiceHeadId: new FormControl(0),
        CompanyID: new FormControl(await this.localStorage.getJsonValue('CIAM')),
        InvoiceNum: new FormControl(0),
        CustomerID: new FormControl(0),
        CustomerName: new FormControl(''),
        InvoiceRef: new FormControl(0),
        TranDocTypeID: new FormControl(docType),
        InvoiceDate: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        DueDate: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        LegalNumber: new FormControl(''),
        TermID: new FormControl('CONT'),
        PayMethodID: new FormControl(''),
        Contabilized: new FormControl(false),
        OpenInvoice: new FormControl(true),
        Comments: new FormControl(''),
        InvoiceSubTotal: new FormControl(0),
        DocInvoiceSubTotal: new FormControl(0),
        TaxAmount: new FormControl(0),
        DocTaxAmount: new FormControl(0),
        WithHoldingAmount: new FormControl(0),
        DocWithHoldingAmount: new FormControl(0),
        InvoiceAmount: new FormControl(0),
        DocInvoiceAmount: new FormControl(0),
        InvoiceBal: new FormControl(0),
        DocInvoiceBal: new FormControl(0),
        Discount: new FormControl(0),
        DocDiscount: new FormControl(0),
        PurchaseOrderID: new FormControl(0),
        SaleOrderID: new FormControl(0),
        CreatedBy: new FormControl(''),
        ModifiedBy: new FormControl(''),
        CreatedAt: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        ModifyDate: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        Process: new FormControl(false),
        CurrencyCode: new FormControl(''),
        TRM: new FormControl(1),
        Inactive: new FormControl(false),
        CMReasonCode_c: new FormControl(''),
        CMReasonDesc_c: new FormControl(''),
        DMReasonCode_c: new FormControl(''),
        DMReasonDesc_c: new FormControl(''),
        PaymentMeansID_c: new FormControl(''),
        PaymentMeansDescription: new FormControl(''),
        PaymentMeansCode_c: new FormControl(''),
        PaymentDurationMeasure: new FormControl(''),
        CalculationRate_c: new FormControl(0),
        DateCalculationRate_c: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        Emited: new FormControl(false),
        EmitionDate: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        Identification: new FormControl(''),
        storeinvoicedId: new FormControl(0),
        invoicedtls: new FormArray([]),
        invoicetaxes: new FormArray([]),
        customer: new FormArray([]),
        DecimalQty: new FormControl(this.optionsMask.precision),
        InvoiceDiscount: new FormArray([])
      });

      curreLineDtl.forEach(b => {
        b.QtyInvoice = 0;
      });

      this.loading = false;
      this.nativeService.OnlyAlert('Proceso terminado', 'Poof! proceso finalizado!', 'success').then(r => {
        this.loadConfigStore();
        this.closeInvoiceViewModal();
      });
    }
  }

  async qtysItemsForInvoiceSaved(){
    this.totalQtysForItems = []
    this.apiStoreInvoicedService.getByStoreIdAndCompanyAndUserID(await this.localStorage.getJsonValue('userID'))
    .then((res:any)=>{
      if(res.success){
        res.result.forEach(a => {
          let dtl = JSON.parse(a.DataJson);

          dtl.invoicedtls.forEach( e => {
            let search = false;

            this.totalQtysForItems.forEach( lineQty => {
              if (lineQty.ItemID === e.ItemID) {
                search = true,
                lineQty.Quantity = lineQty.Quantity + e.Quantity
              }
            });
            if (!search) {
              this.totalQtysForItems.push({
                ItemID: e.ItemID,
                Quantity: e.Quantity
              })
            }
          });

        });
      }
    })
    .catch(console.log);
  }



  async validateInventory() {

    this.loading = true;
    this.InventoryAlert = 2;
    this.hideInventoryAlert = false;
    //
    this.InvoiceAlert = 1;
    this.hideInvoiceAlert = true;
    //
    this.CommentInvoice = 1;
    this.hideCommentInvoice = true;
    //
    const curreLineDtl = this.dataSourceItem.filteredData;
    let totalQty = 0;
    let totalQtysForItems = []
    this.apiStoreInvoicedService.getByStoreIdAndCompanyAndUserID(await this.localStorage.getJsonValue('userID'))
      .then((res: any) => {
        if (res.success) {
          res.result.forEach(a => {
            let dtl = JSON.parse(a.DataJson);


            dtl.invoicedtls.forEach(e => {
              let search = false;

              totalQtysForItems.forEach(lineQty => {
                if (lineQty.ItemID === e.ItemID) {
                  search = true,
                    lineQty.Quantity = lineQty.Quantity + e.Quantity
                }

              });
              if (!search) {
                totalQtysForItems.push({
                  ItemID: e.ItemID,
                  Quantity: e.Quantity
                })
              }
            });

            curreLineDtl.forEach(c => {
              totalQtysForItems.forEach(totalItm => {
                if (c.ItemID === totalItm.ItemID) {
                  if (c.IsInventoryable) {
                    c.Quantity = c.QtyStock - totalItm.Quantity;
                  }
                }
              })
            });
          });

          this.SavedInvoiceAlert = res.result.length;
          this.hideSavedInvoiceAlert = false;

          if (res.result.length === 0) {
            this.hideSavedInvoiceAlert = true;
            curreLineDtl.forEach(c => {
              c.Quantity = c.QtyStock;
            });
          }
          this.loading = false;
        }
      })
      .catch(console.log);
  }

  calcularTotales() {
    const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
    const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;

    let subtotal = 0;
    let descuento = 0;
    let retenciones = 0;
    let impuestos = 0;
    let total = 0;

    this.totalProduct = 0;
    this.totalQty = 0;

    if (currentinvcDtls !== null) {
      this.totalProduct = currentinvcDtls.controls.length;
      currentinvcDtls.controls.forEach(a => {
        this.totalQty += a.value.Quantity
        subtotal += (a.value.DocUnitPrice * a.value.Quantity);
        descuento += a.value.DocDiscount;

        if (a.value.DocTaxBase > 0) {
          impuestos += (a.value.DocTaxBase);
        }
      });
    }

    if (currentinvcTaxs !== null) {
      currentinvcTaxs.controls.forEach(a => {
        if (a.value.TaxTypeID === 2 || a.value.TaxTypeID === "2") {
          retenciones += a.value.DocTaxAmount;
        }
      });
    }
    total = ((subtotal - descuento) + impuestos) - retenciones;

    this.addInvoiceForm.controls['DocInvoiceSubTotal'].setValue(subtotal);
    this.addInvoiceForm.controls['InvoiceSubTotal'].setValue(subtotal * Number(this.addInvoiceForm.controls['TRM'].value));
    this.addInvoiceForm.controls['DocDiscount'].setValue(descuento);
    this.addInvoiceForm.controls['Discount'].setValue(descuento * Number(this.addInvoiceForm.controls['TRM'].value));
    this.addInvoiceForm.controls['DocWithHoldingAmount'].setValue(retenciones);
    this.addInvoiceForm.controls['WithHoldingAmount'].setValue(retenciones * Number(this.addInvoiceForm.controls['TRM'].value));
    this.addInvoiceForm.controls['DocTaxAmount'].setValue(impuestos);
    this.addInvoiceForm.controls['TaxAmount'].setValue(impuestos * Number(this.addInvoiceForm.controls['TRM'].value));
    this.addInvoiceForm.controls['DocInvoiceAmount'].setValue(total);
    this.addInvoiceForm.controls['InvoiceAmount'].setValue(total * Number(this.addInvoiceForm.controls['TRM'].value));
    this.addInvoiceForm.controls['DocInvoiceBal'].setValue(total);
    this.addInvoiceForm.controls['InvoiceBal'].setValue(total * Number(this.addInvoiceForm.controls['TRM'].value));
  }

  upqty(e, i) {

    if (e.screenX === 0 && e.screenY === 0)
      return;


    const curreLineDtl = this.dataSourceItem.filteredData;
    const curreInvoiceDtl = this.addInvoiceForm.get('invoicedtls') as FormArray;

    let exit = false;
    curreLineDtl.forEach(b => {
      if (b.ItemID === curreInvoiceDtl.controls[i]['controls']['ItemID'].value) {
        if (b.IsInventoryable && b.Quantity <= 0) {
          exit = true;
          this.nativeService.OnlyAlert('Notificación', 'Este producto es de inventario y no tiene cantidades disponibles', 'info');
          return;
        }
      }
    });

    if (exit) return;

    let qty = curreInvoiceDtl.controls[i]['controls']['Quantity'].value;

    qty++;
    curreInvoiceDtl.controls[i]['controls']['Quantity'].setValue(
      qty
    );

    this.onChangeQtyLine(i);
    curreLineDtl.forEach(b => {
      if (b.ItemID === curreInvoiceDtl.controls[i]['controls']['ItemID'].value) {
        b.QtyInvoice = qty;
        if (b.IsInventoryable)
          b.Quantity--;
      }
    });
    this.nativeService.playAudio("success");
    this.calcularTotales();
  }

  downqty(e, i) {

    if (e.screenX === 0 && e.screenY === 0)
      return;

    const curreLineDtl = this.dataSourceItem.filteredData;
    const curreInvoiceDtl = this.addInvoiceForm.get('invoicedtls') as FormArray;

    let qty = curreInvoiceDtl.controls[i]['controls']['Quantity'].value;
    qty--;
    if (qty > 0) {
      curreInvoiceDtl.controls[i]['controls']['Quantity'].setValue(
        qty
      );

      this.onChangeQtyLine(i);
      curreLineDtl.forEach(b => {
        if (b.ItemID === curreInvoiceDtl.controls[i]['controls']['ItemID'].value) {
          b.QtyInvoice = qty;
          if (b.IsInventoryable)
            b.Quantity++;
        }
      });
      this.nativeService.playAudio("undo");
    }
    this.calcularTotales();
  }

  closeInvoiceViewModal() {
    this.modalController.dismiss(this.addInvoiceForm);
  }

  async SelectCustomer() {

    const modal = await this.modalController.create({
      component: SelectCustomerPage,
      cssClass: 'modal_invoice',
      componentProps: {
      },
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.addInvoiceForm.controls['CustomerName'].setValue(data.SearchWord);
      this.addInvoiceForm.controls['CustomerID'].setValue(data.CustomerID);
      this.addInvoiceForm.controls['Identification'].setValue(data.TerceroNum);
      this.addInvoiceForm.controls['PaymentMeansID_c'].setValue(data.PaymentMeansID_c);
      this.addInvoiceForm.controls['PaymentMeansCode_c'].setValue(data.PaymentMeansCode_c);

      this.arrayCustomer.push(new FormGroup({
        CompanyID: new FormControl(data.CompanyID),
        CustomerID: new FormControl(data.CustomerID),
        TerceroNum: new FormControl(data.TerceroNum),
        TypeID: new FormControl(data.TypeID),
        CheckDigit: new FormControl(data.CheckDigit),
        FirstName: new FormControl(data.FirstName),
        AnotherName: new FormControl(data.AnotherName),
        FirstLastName: new FormControl(data.FirstLastName),
        SecondLastName: new FormControl(data.SecondLastName),
        BusinessName: new FormControl(data.BusinessName),
        FiscalName: new FormControl(data.FiscalName),
        CIIUCode: new FormControl(data.CIIUCode),
        TaxResponsabilityID: new FormControl(data.TaxResponsabilityID),
        TermID: new FormControl(data.TermID),
        PayMethodID: new FormControl(data.PayMethodID),
        TaxApply: new FormControl(data.TaxApply),
        CountryID: new FormControl(data.CountryID),
        StateID: new FormControl(data.StateID),
        CityID: new FormControl(data.CityID),
        Address: new FormControl(data.Address),
        PhoneNum: new FormControl(data.PhoneNum),
        EMailAddress: new FormControl(data.EMailAddress),
        PaymentMeansID_c: new FormControl(data.PaymentMeansID_c),
        PaymentMeansCode_c: new FormControl(data.PaymentMeansCode_c)
      }));

    }
  }

  async lineDetail(i){
    const props = {
      pLine: i,
      pInvoicedtls: this.addInvoiceForm.controls.invoicedtls['controls'][i],
      pInvoicetaxes: this.addInvoiceForm.controls.invoicetaxes['controls'],
    };
  
    const data = await this.openModal(ShowItemDetailPage, props);
  
    if (data) {
      this.handleModalShowItemDetail(data);
    }
  }

  async handleModalShowItemDetail(response){
    this.addInvoiceForm.value.invoicetaxes = response.form.invoicetaxes;
    const curreLineDtl = this.dataSourceItem.filteredData;
    const curreInvoiceDtl = this.addInvoiceForm.get('invoicedtls') as FormArray;

    this.arrayInvoiceTax.clear(); 

    curreInvoiceDtl.controls.forEach((e: any,i: number) => {
      response.form.invoicetaxes.forEach((e2: any,i2: number) => {
        if(e.value.Line === e2.Line){          
          this.addInvoiceTaxFromLine(e2,i);
        }
      });
    });

    curreLineDtl.forEach(b => {
      if(b.ItemID === curreInvoiceDtl.controls[response.line]['controls']['ItemID'].value){
        b.QtyInvoice= curreInvoiceDtl.controls[response.line]['controls']['Quantity'].value;
        b.Quantity = curreInvoiceDtl.controls[response.line]['controls']['OnHandQty'].value - curreInvoiceDtl.controls[response.line]['controls']['Quantity'].value;
      }
    });
    let totalQtysForItems= [];
    await this.apiStoreInvoicedService.getByStoreIdAndCompanyAndUserID(await this.localStorage.getJsonValue('userID'))
    .then((res:any)=>{
      if(res.success){
        res.result.forEach(a => {
          let dtl = JSON.parse(a.DataJson);

          dtl.invoicedtls.forEach( e => {
            let search = false;

            totalQtysForItems.forEach( lineQty => {
              if (lineQty.ItemID === e.ItemID) {
                search = true,
                lineQty.Quantity = lineQty.Quantity + e.Quantity
              }

            });
            if (!search) {
              totalQtysForItems.push({
                ItemID: e.ItemID,
                Quantity: e.Quantity
              })
            }
          });


          curreLineDtl.forEach(b => {
            totalQtysForItems.forEach(e => {
              if (b.ItemID == e.ItemID) {
                b.Quantity = b.Quantity - e.Quantity
              }
            });
          })

        });
        this.loading = false;
      }
    })
    .catch(console.log);
      this.onChangeQtyLine(response.line);
  }

  async clicSaveInvoice(){
    const currentInvoice = this.addInvoiceForm.get("invoicedtls") as FormArray;
    if(currentInvoice.controls.length === 0){
      this.nativeService.OnlyAlert("Notificación","No tiene productos para guardar","warning");
      return;
    }
    this.nativeService.playAudio("success");
    const props = { addInvoiceForm: this.addInvoiceForm };
    const data = await this.openModal(SaveInvoicePopupPage, props);
    
    if (data) {
      this.handleModalInventorySaveInvoicePopupComponent(data);
      this.modalController.dismiss(3)
    }
  }
  
  async handleModalInventorySaveInvoicePopupComponent(response){

    this.validateInventory();
    this.qtysItemsForInvoiceSaved()
    if(response === 1){
      this.dataSourceItem.filter = "";
      const curreLineDtl = this.dataSourceItem.filteredData;
      curreLineDtl.forEach(b => {
          b.QtyInvoice=0;
        });

      let docType;
      this.storeConfig.forEach(a => {
        if(a.value === 'DocType'){
          docType = a.res.SalesDocumentType;
        }
      });
      
      this.addInvoiceForm = new FormGroup({
        itemsearch: new FormControl(''),
        OrderNum:new FormControl(''),
        ARInvoiceHeadId: new FormControl(0),
        CompanyID: new FormControl(await this.localStService.getSelectedCia()),
        InvoiceNum: new FormControl(0),
        CustomerID: new FormControl(0),
        CustomerName: new FormControl(''),
        InvoiceRef: new FormControl(0),
        TranDocTypeID: new FormControl(docType),
        InvoiceDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss'), Validators.required),
        DueDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss'), Validators.required),
        LegalNumber: new FormControl(''),
        TermID: new FormControl('CONT'),
        PayMethodID: new FormControl(''),
        Contabilized: new FormControl(false),
        OpenInvoice: new FormControl(true),
        Comments: new FormControl(''),
        InvoiceSubTotal: new FormControl(0),
        DocInvoiceSubTotal: new FormControl(0),
        TaxAmount: new FormControl(0),
        DocTaxAmount: new FormControl(0),
        WithHoldingAmount: new FormControl(0),
        DocWithHoldingAmount: new FormControl(0),
        InvoiceAmount: new FormControl(0),
        DocInvoiceAmount: new FormControl(0),
        InvoiceBal: new FormControl(0),
        DocInvoiceBal: new FormControl(0),
        Discount: new FormControl(0),
        DocDiscount: new FormControl(0),
        PurchaseOrderID: new FormControl(0),
        SaleOrderID: new FormControl(0),
        CreatedBy: new FormControl(await this.localStService.getUser()),
        ModifiedBy: new FormControl(await this.localStService.getUser()),
        CreatedAt: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
        ModifyDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
        Process: new FormControl(false),
        CurrencyCode: new FormControl(this.currCurrCode),
        TRM: new FormControl(1),
        Inactive: new FormControl(false),
        CMReasonCode_c: new FormControl(''), 
        CMReasonDesc_c: new FormControl(''),
        DMReasonCode_c: new FormControl(''),
        DMReasonDesc_c: new FormControl(''),
        PaymentMeansID_c: new FormControl(''),
        PaymentMeansDescription: new FormControl(''),
        PaymentMeansCode_c: new FormControl(''),
        PaymentDurationMeasure: new FormControl(''),
        CalculationRate_c: new FormControl(0),
        DateCalculationRate_c: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
        Emited: new FormControl(false),
        EmitionDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
        Identification: new FormControl(''),
        storeinvoicedId : new FormControl(0),
        invoicedtls: new FormArray([]),
        invoicetaxes: new FormArray([]),
        customer:new FormArray([]),
        DecimalQty: new FormControl(this.optionsMask.precision),
        InvoiceDiscount: new FormArray([])
      });
    }

  }

  async invoiceComment(){
    const currentInvoice = this.addInvoiceForm.get("invoicedtls") as FormArray;

    if (currentInvoice.controls.length != 0) {
      this.nativeService.playAudio("success");
      const props = { addInvoiceForm: this.addInvoiceForm };
      await this.nativeService.openModal(InvoiceCommentPopupPage, props);
    } else {
      this.nativeService.OnlyAlert('Notificación', 'Debes ingresar un producto antes de realizar esta opción', 'warning');
    }
  }

  async showPrint(e){
    const currentInvoice = this.addInvoiceForm.get("invoicedtls") as FormArray;
    let isInvoice = false
    if(currentInvoice.controls.length != 0){
      this.nativeService.playAudio("success");
      const props = { addInvoiceForm: this.addInvoiceForm, isInvoice: isInvoice }
      const data = await this.openModal(ShowPrintPopupPage, props)
      if (data) {
        //--------> maneja el retorno
      }
    } else {
      this.nativeService.OnlyAlert('Notificación', 'Debes ingresar un producto antes de realizar esta opción', 'warning');
    }
  }

  async openModal(component, props) {
    const modal = await this.modalController.create({
      component,
      componentProps: props,
      backdropDismiss: true
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
  
    if (data) {
      return data;
    }
  }

  async openModalSelectTranDocType(){
  let storeid = await this.localStorage.getJsonValue('storeid');
  let tranDoctype = this.addInvoiceForm.controls['TranDocTypeID'].value;
  let props = {
    storeid: storeid,
    tranDocType: tranDoctype
  }
  this.nativeService.AlertConfirm('Notificación','¿Está seguro que desea cambiar el tipo de documento?')
      .then((response) => {
        if (response['isConfirmed']) {
          this.nativeService.openModal(TranDocTypePopupPage, props).then( data =>{
            if (data) {
              this.handleModalSelectTranDocType(data)
            }
          })
        } else {
          this.nativeService.OnlyAlert('Proceso cancelado', 'Se cancelo el proceso!', 'warning');
        }
      })  
  }

  handleModalSelectTranDocType(resp){
    if (resp.res) {
      this.addInvoiceForm.controls['TranDocTypeID'].setValue(resp.data);
    }else{
      this.nativeService.OnlyAlert('Notificación',resp.message,'warning')
    }
  }
  
  
  async saveInvoice() {
    try {
      if(this.addInvoiceForm.value.CustomerID === '' || this.addInvoiceForm.value.CustomerID === 0){
        this.nativeService.OnlyAlert('Notificación','Debe seleccionar un cliente','warning');
        return;
      }

      //SET VALUES TO FIXED
      this.addInvoiceForm.controls["Discount"].setValue(
        Number(this.addInvoiceForm.value.Discount.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["DocDiscount"].setValue(
        Number(this.addInvoiceForm.value.DocDiscount.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["InvoiceAmount"].setValue(
        Number(this.addInvoiceForm.value.InvoiceAmount.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["DocInvoiceAmount"].setValue(
        Number(this.addInvoiceForm.value.DocInvoiceAmount.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["InvoiceBal"].setValue(
        Number(this.addInvoiceForm.value.InvoiceBal.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["DocInvoiceBal"].setValue(
        Number(this.addInvoiceForm.value.DocInvoiceBal.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["InvoiceSubTotal"].setValue(
        Number(this.addInvoiceForm.value.InvoiceSubTotal.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["DocInvoiceSubTotal"].setValue(
        Number(this.addInvoiceForm.value.DocInvoiceSubTotal.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["TaxAmount"].setValue(
        Number(this.addInvoiceForm.value.TaxAmount.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["DocTaxAmount"].setValue(
        Number(this.addInvoiceForm.value.DocTaxAmount.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["WithHoldingAmount"].setValue(
        Number(this.addInvoiceForm.value.WithHoldingAmount.toFixed(this.optionsMask.precision))
      )
      this.addInvoiceForm.controls["DocWithHoldingAmount"].setValue(
        Number(this.addInvoiceForm.value.DocWithHoldingAmount.toFixed(this.optionsMask.precision))
      )

      this.arrayInvoiceLine.controls.forEach(a=>{
        a['controls']["Discount"].setValue(
          Number(a['controls']['Discount'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["DocDiscount"].setValue(
          Number(a['controls']['DocDiscount'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["LineAmount"].setValue(
          Number(a['controls']['LineAmount'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["DocLineAmount"].setValue(
          Number(a['controls']['DocLineAmount'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["LineSubtotal"].setValue(
          Number(a['controls']['LineSubtotal'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["DocLineSubtotal"].setValue(
          Number(a['controls']['DocLineSubtotal'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["TaxBase"].setValue(
          Number(a['controls']['TaxBase'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["DocTaxBase"].setValue(
          Number(a['controls']['DocTaxBase'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["UnitPrice"].setValue(
          Number(a['controls']['UnitPrice'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["DocUnitPrice"].setValue(
          Number(a['controls']['DocUnitPrice'].value.toFixed(this.optionsMask.precision))
        );
      });
      this.arrayInvoiceTax.controls.forEach(a=>{
        a['controls']["TaxAmount"].setValue(
          Number(a['controls']['TaxAmount'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["DocTaxAmount"].setValue(
          Number(a['controls']['DocTaxAmount'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["TaxableAmount"].setValue(
          Number(a['controls']['TaxableAmount'].value.toFixed(this.optionsMask.precision))
        );
        a['controls']["DocTaxableAmount"].setValue(
          Number(a['controls']['DocTaxableAmount'].value.toFixed(this.optionsMask.precision))
        );
      });
      //
      const currentInvoice = this.addInvoiceForm.get("invoicedtls") as FormArray;

      
      if (this.addInvoiceForm.controls.itemsearch.value == "" || currentInvoice.controls.length > 0) {
        if (currentInvoice.controls.length === 0) {
          this.nativeService.OnlyAlert("Notificación", "No tiene productos para facturar", "warning");
          return;
        }
        this.loading = true;
        let userId = await this.localStorage.getJsonValue('userID');
        this.apiStoreInvoicedService.getByStoreIdAndCompanyAndUserID(userId)
          .then((res: any) => {            
            this.loading = false;
            this.nativeService.openModal(PaymentMethodPopupPage,{addInvoiceForm: this.addInvoiceForm}).then(data =>{
              // return Data
            })
          })
      
      }
    } catch (error) {
      console.log(error);
    }
  }
}
