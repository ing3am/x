import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { LocalService } from 'src/Services/Config/local.service';
import { PosInventoryService } from 'src/Services/Inventary/pos-inventory.service';
import { NativeService } from 'src/Services/Shared/native.service';
import { ShowMessageService } from 'src/Services/Shared/show-message.service';
import { InvoiceFormModels } from 'src/theme/shared/Models/InvoiceForm';
import { InvoiceItemsPage } from '../invoice-items/invoice-items.page';
import { Customer } from 'src/theme/shared/Models/customers';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CurrenciesService } from 'src/Services/POS/currencies.service';
import { PosService } from 'src/Services/POS/pos.service';
import { WarehseBinService } from 'src/Services/OldBack/warehse-bin.service';
import { CustomerService } from 'src/Services/OldBack/customer.service';
import { Router } from '@angular/router';
import { StoreinvoicedService } from 'src/Services/POS/storeinvoiced.service';
import { CalculatedService } from 'src/Services/Shared/calculated.service';
import { ARInvoiceService } from 'src/Services/OldBack/arinvoice.service';
import { DatePipe } from '@angular/common';
import { CreateItemsPage } from 'src/app/components/Modals/create-items/create-items.page';
import { OrderSavedPage } from 'src/app/components/Modals/order-saved/order-saved.page';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
})
export class ListItemsComponent implements OnInit, OnChanges, AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setFocusAfterTimeout('txtsearchItems');
  }

  @HostListener('window:load', ['$event'])
  onLoad() {
    this.setFocusAfterTimeout('txtsearchItems');
  }

  //#region 
  public rUser: boolean = false;
  public rPass: boolean = false;
  public loading: boolean = false;
  public companysbyuser: any[];
  public errorCompania: string = '';

  public loginrequest: {};
  storeConfig: any[] = [];
  //#endregion
  showPanelWindows: boolean = true;

  displayedColumns: string[] = ['SearchWord'];
  dataSource: MatTableDataSource<any>;
  //
  displayedColumnsItem: string[] = ['SearchWord'];
  public dataSourceItem: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  addInvoiceForm: FormGroup;
  invoicedtls: FormArray
  invoicetaxes: FormArray;
  rates: FormArray;
  submitted: boolean = false;
  disabled: boolean;
  optionsMask: any;
  formatDecimal: string;
  //
  resultsLength = 0;
  showRecordNotFound: boolean = false;
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
  showTable: boolean = false;
  enterTable: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 100]

  totalProduct: number = 0;
  totalQty: number = 0;

  options: any;

  showImgItem: boolean = false;

  selectedcashr: any = {
    CashRegisterID: 0,
  }
  public cashrbycompany: any[];
  cashRegisterName: string = 'CAJA';
  isManager: boolean = false;
  disabledSearch: boolean = false;

  result: any = [];
  pagesnumber: number = 0;
  limitsearch: number = 0;
  hidepagesbutton: boolean = false;

  customers: Customer[];
  customerSelect: boolean = false;
  changeCustomer: boolean = true;
  showDtl: boolean = true;
  //COMBOS
  currCurrCode: string = 'COP';
  currSymbol: string;
  //
  databasePicture: any;

  priceAfterTax: boolean = false;
  totalQtysForItems: any[] = [];

  //Descuentos
  InvoiceDiscount: FormArray;
  discountList: any[];

  //#endregion
  constructor(
    private apiStoreInvoicedService: StoreinvoicedService,
    private apiARInvoiceService: ARInvoiceService,
    private apiPosInventoryService: PosInventoryService,
    private calculatedService: CalculatedService,
    private apiDatePipe: DatePipe,
    private router: Router,
    private apiItemwhsebinservice: WarehseBinService,
    private apiCustomerService: CustomerService,
    private apiPosService: PosService,
    private apiCurrenciesService: CurrenciesService,
    private domSanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private localStorage: LocalService,
    private nativeService: NativeService,
    private invoiceModule: InvoiceFormModels,
    private modalController: ModalController,
    private fb : FormBuilder

  ) {
    this.dataSourceItem = new MatTableDataSource<any>([]);

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

  get arrayInvoiceLine() {
    return this.addInvoiceForm.get("invoicedtls") as FormArray;
  }

  get arrayCustomer() {
    return this.addInvoiceForm.get("customer") as FormArray;
  }

  get arrayInvoiceTax() {
    return this.addInvoiceForm.get("invoicetaxes") as FormArray;
  }

  get DiscountControl() {
    return this.addInvoiceForm.get("InvoiceDiscount") as FormArray;
  }

  get f() { return this.addInvoiceForm.controls; }
  get g() { return this.addInvoiceForm.controls.invoicedtls['controls']; }
  get h() { return this.addInvoiceForm.controls.invoicetaxes['controls']; }

  async ngOnInit() {
    this.addInvoiceForm = this.invoiceModule.getInitializedFormNoAsync();

    this.addInvoiceForm.controls.CompanyID.setValue(await this.localStorage.getJsonValue('CIAM'));

    await this.getStore();
    await this.loadConfigStore();
    await this.qtysItemsForInvoiceSaved();

    this.getCashRegisterByStore();

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
          // this.loading = false;
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
                                        this.dataSource = new MatTableDataSource<any>(res);
                                        this.dataSource.paginator = this.paginator;
                                        this.loadInventory(0);
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

  async loadInventory(page?: number) {

    this.hidepagesbutton = false
    try {
      this.loading = true;
      let storedid = 0;
      let warehousecode = '';
      let bincode = '';
      let showItemsWithoutInventory = true;

      this.storeConfig.forEach(a => {
        if (a.value === 'Inventory') {
          storedid = a.res.StoreId;
          warehousecode = a.res.Warehousecode;
          bincode = a.res.Warehsebincode;
          showItemsWithoutInventory = a.res.ShowItemsWithoutInventory;
        }
        if (a.value === 'Store') {
          this.showImgItem = a.res.result.ShowImgItem
        }
      });
      if (page == -1) {
        this.result = []
      }

      await this.apiPosInventoryService.getAllItemsNoImgPOS(storedid, warehousecode, bincode)
        .then((res: any) => {
          if (res.result.length < 499) {
            this.hidepagesbutton = true
          }
          this.result = []
          res.result.forEach(a => {
            a.SalePriceTax = a.Rate != 0 && a.TaxTypeID == 1 ? a.SalePrice * (1 + (a.Rate / 100)) : a.SalePrice
            if (a.IsInventoryable && a.Quantity <= 0) {
              if (!a.ItemwarehouseBackFlush) {
                if (!showItemsWithoutInventory) {
                  return;
                }
              }
            }
            a.QtyInvoice = 0;
            a.QtyStock = a.Quantity;
            this.result.push(a);
          });

          this.dataSourceItem = new MatTableDataSource<any>(this.result);
          this.dataSourceItem.paginator = this.paginator;
          const curreLineDtl = this.dataSourceItem.filteredData;
          const curreInvoiceDtl = this.addInvoiceForm.get('invoicedtls') as FormArray;



          curreInvoiceDtl.controls.forEach(a => {
            curreLineDtl.forEach(b => {
              if (b.ItemID === a['controls']['ItemID'].value) {
                b.QtyInvoice = a['controls']['Quantity'].value;
              }
            });
          });
          this.validateInventory();

          if (this.showImgItem) {
            try {
              this.apiPosInventoryService.getItemsImgsPOS(storedid).then((res: any) => {
                this.result.forEach(noimg => {
                  res.result.forEach(img => {
                    if (noimg.ItemID == img.ItemID) {
                      img.Picture = img.Picture
                      if (img.Picture !== null) {
                        if (img.Picture !== '') {
                          let picture = this.domSanitizer.bypassSecurityTrustHtml(img.Picture);
                          if (picture['changingThisBreaksApplicationSecurity'] !== undefined) {
                            this.databasePicture = 'data:image/png;base64,' + picture['changingThisBreaksApplicationSecurity'].toString();
                            noimg.Picture = this.databasePicture;
                            if (img.Picture === 'data:image/png;base64,')
                              noimg.Picture = null;
                          }
                        }
                      }
                    }
                  });
                });
              });
            } catch (error) {
              console.error(error)
            }
          }

        })
        .catch((err: any) => { console.log(err); this.loading = false; });


    } catch (error) {
      console.error(error);
    }

  }

  async openCarInvoice() {

    if (this.arrayInvoiceLine.length === 0) {
      this.nativeService.OnlyAlert('Notificación', 'No tiene productos para facturar', 'warning');
      return;
    }

    const modal = await this.modalController.create({
      component: InvoiceItemsPage,
      cssClass: 'modal_invoice',
      componentProps: {
        addInvoiceForm: this.addInvoiceForm,
        dataSourceItem: this.dataSourceItem
      },
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data === 3) {
      this.clearInvoiceAfterSave()
    }
  }

  async clearInvoiceAfterSave(){
    const curreLineDtl = this.dataSourceItem.filteredData;
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
    this.nativeService.OnlyAlert('Proceso terminado', '¡Factura Guardada!', 'success').then(async r => {
      this.addInvoiceForm.controls["itemsearch"].setValue('');
      this.dataSourceItem.filter = "";
      await this.loadConfigStore();
    });

  }

  async appyFilterItem(event, filterValue: string) {
    if (filterValue !== '') {
      this.showRecordNotFound = false;
      this.dataSourceItem.filter = filterValue.trim().toLowerCase();


      if (this.dataSourceItem.filteredData.length == 0)
        this.showRecordNotFound = true;
      else
        this.showRecordNotFound = false;

      if (event != null) {
        if (event.key != null) {
          if (event.key === "Enter" || event.keyCode === 13) {
            if (this.dataSourceItem.filteredData.length > 0) {
              this.addInvoiceLine(this.dataSourceItem.filteredData[0], 0);
              this.dataSourceItem.filter = "";
              this.addInvoiceForm.controls["itemsearch"].setValue('');
            }
            if (this.dataSourceItem.filteredData.length == 0) {
              this.showRecordNotFound = true;
            }
          }
        }
      }
    }
    else {
      this.dataSourceItem.filter = "";
    }
  }

  async qtysItemsForInvoiceSaved() {
    this.totalQtysForItems = []
    this.apiStoreInvoicedService.getByStoreIdAndCompanyAndUserID(await this.localStorage.getJsonValue('userID'))
      .then((res: any) => {
        if (res.success) {
          res.result.forEach(a => {
            let dtl = JSON.parse(a.DataJson);

            dtl.invoicedtls.forEach(e => {
              let search = false;

              this.totalQtysForItems.forEach(lineQty => {
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
          // this.loading = false;
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
      .then(async (res: any) => {
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

  async addInvoiceLine(item, i) {
    try {

      const curreLineDtl = this.dataSourceItem.filteredData;
      const curreInvoiceDtl = this.addInvoiceForm.get('invoicedtls') as FormArray;
      if (item.IsInventoryable && item.Quantity <= 0) {
        if (!item.ItemwarehouseBackFlush) {
          this.nativeService.OnlyAlert('Notificación', 'Este producto es de inventario y no tiene cantidades disponibles', 'info');
          return;
        }
      }

      let agregar = true;
      let index = 0;
      curreInvoiceDtl.controls.forEach(a => {
        if (a.value.ItemID === item.ItemID) {
          agregar = false;
          let qty = a['controls']['Quantity'].value + 1;
          a['controls']['Quantity'].setValue(
            qty
          );
          this.onChangeQtyLine(index);
          curreLineDtl.forEach(b => {
            if (b.ItemID === item.ItemID) {
              b.QtyInvoice = qty;
              if (item.IsInventoryable)
                b.Quantity--;
            }
          });
        }
        index++;
      });

      if (agregar) {
        this.loading = true;
        let invoiceline = 0;
        this.arrayInvoiceLine.controls.forEach(a => {
          if (invoiceline < a['controls']['Line'].value)
            invoiceline = a['controls']['Line'].value;
        });

        let warehousecode;
        let warehsebincode;
        this.storeConfig.forEach(a => {

          if (a.value === 'Inventory') {
            warehousecode = a.res.Warehousecode;
            warehsebincode = a.res.Warehsebincode;
          }
        });


        let BackFlush = false;
        if (item.Itemwarehouse !== null) {
          BackFlush = item.ItemwarehouseBackFlush;
        }
        let validators = [Validators.required, Validators.min(this.calculateMin(this.optionsMask.precision))];
        if (item.IsInventoryable && !BackFlush) {
          let qtyStock = item.QtyStock;
          this.totalQtysForItems.forEach((e: any) => {
            if (e.ItemID == item.ItemID) {
              qtyStock = qtyStock - e.Quantity
            }
          });
          validators = [Validators.required, Validators.min(this.calculateMin(this.optionsMask.precision)), Validators.max(qtyStock)];
        }

        this.arrayInvoiceLine.push(
          new FormGroup({
            ItemID: new FormControl(item.ItemID),
            ItemDescription: new FormControl(item.ItemDescription),
            Line: new FormControl(invoiceline + 1),
            CompanyID: new FormControl(await this.localStorage.getJsonValue('CIAM')),
            InvoiceNum: new FormControl(this.addInvoiceForm.controls['InvoiceNum'].value),
            showButton: new FormControl(true),
            Quantity: new FormControl(1, validators),
            OnHandQty: new FormControl(item.QtyStock),
            IsInventoryable: new FormControl(item.IsInventoryable),
            DiscountPercent: new FormControl(0),
            Discount: new FormControl(0),
            DiscountType: new FormControl('DT2'),
            DiscountAmt: new FormControl(0),
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
            BackFlush: new FormControl(BackFlush),
            Inactive: new FormControl(false),
            CreatedBy: new FormControl(await this.localStorage.getJsonValue('user')),
            CreatedAt: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
            ModifiedBy: new FormControl(await this.localStorage.getJsonValue('user')),
            ModifyDate: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'))
          })
        );

        await this.apiARInvoiceService.getLineTax(invoiceline + 1, item.ItemID)
          .then((r: any) => {
            if (r.result.length === 0) {
              this.loading = false;
              return;
            }
            r.result.forEach(async e => {
              await this.addInvoiceTaxFromLine(e, index);
              this.loading = false;
            });
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
          });

        curreLineDtl.forEach(b => {
          if (b.ItemID === item.ItemID) {
            b.QtyInvoice = 1;
            if (item.IsInventoryable)
              b.Quantity--;
          }
        });
      }
      this.loading = false;
      this.nativeService.playAudio("success");
      if (this.priceAfterTax) {
        this.onChangeQtyLine(index);
      }
      this.calcularTotales();
    } catch (error) {
      console.log(error);
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

          } else {

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

  async addInvoiceTaxFromLine(obj: any, i) {
    try {
      this.arrayInvoiceTax.push(new FormGroup({
        TaxLine: new FormControl(obj.TaxLine),
        InvoiceNum: new FormControl(this.addInvoiceForm.controls['InvoiceNum'].value),
        CompanyID: new FormControl(await this.localStorage.getJsonValue('CIAM')),
        TaxID: new FormControl(obj.TaxID),
        RateCode: new FormControl(obj.RateCode),
        Line: new FormControl(obj.Line),
        Percent: new FormControl(obj.Percent),
        TaxableAmount: new FormControl(obj.TaxableAmount),
        DocTaxableAmount: new FormControl(obj.DocTaxableAmount),
        TaxAmount: new FormControl(obj.TaxAmount),
        DocTaxAmount: new FormControl(obj.DocTaxAmount),
        CurrencyCode: new FormControl(this.addInvoiceForm.controls['CurrencyCode'].value),
        TRM: new FormControl(this.addInvoiceForm.controls['TRM'].value),
        Manual: new FormControl(obj.Manual),
        TaxTypeID: new FormControl(obj.TaxTypeID),
        Inactive: new FormControl(false),
        CreatedBy: new FormControl(await this.localStorage.getJsonValue('user')),
        CreatedAt: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        ModifiedBy: new FormControl(await this.localStorage.getJsonValue('user')),
        ModifyDate: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss')),
        joindtls: new FormControl('')
      }));

      this.onChangeQtyLine(i)
    } catch (error) {
      console.log(error);
    }
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
      this.nativeService.OnlyAlert('Proceso terminado', 'Poof! proceso finalizado!', 'success').then(async r => {
        this.addInvoiceForm.controls["itemsearch"].setValue('');
        this.dataSourceItem.filter = "";
        await this.loadConfigStore();
      });
    }
  }

  async createItem() {

    const modal = await this.modalController.create({
      component: CreateItemsPage,
      cssClass: 'customer_modal',
      componentProps: {
      },
      backdropDismiss: false
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
    }
  }

  getCashRegisterByStore() {
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
            try {
              this.isManager = await this.localStorage.getJsonValue('isManager') == null || await this.localStorage.getJsonValue('isManager') == undefined || await this.localStorage.getJsonValue('isManager') == false ? false : true;
            } catch (error) {
              console.error(error)
              this.isManager = false
            }
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

  ngOnChanges(changes: SimpleChanges) {

  }

  setFocusAfterTimeout(control) {
    const input = document.getElementById(`${control}`) as HTMLInputElement;
    //input.focus();
    // input.select();
  }

  enterKeyEvent(event) {
    console.log(event);
    // if (this.filteredItems && this.filteredItems.length > 0) {
    //   const firstItem = this.filteredItems[0];
    //   this.selectedItem(event, 0, firstItem);
    // }
  }

  selectedItem(item, i) {
    this.addInvoiceLine(this.dataSourceItem.filteredData[i], i);
    this.addInvoiceForm.controls["itemsearch"].setValue('');
    this.dataSourceItem.filter = "";
  }

  calculateMin(numDecimal): number {
    if (numDecimal === 0) return 1;
    else {
      let min = "0."
      let i = 1;
      while (i != (numDecimal + 1)) {
        numDecimal === i ? min += "1" : min += "0"
        i++;
      }
      return Number(min)
    }
  }

  ngAfterViewInit() {

    this.loadInventory();

    this.renderer.listen(this.elRef.nativeElement, 'click', (event) => {

      if (event.target.id === 'CustomerName')
        return;
      if (event.target.id === "SalesType")
        return;
      if (event.target.id === "btnInvoicesAlert")
        return;

      this.setFocusAfterTimeout("txtsearchItems")
    });
  }

  async orderSaved(){
    const currentInvoice = this.addInvoiceForm.get("invoicedtls") as FormArray;
    if(currentInvoice.controls.length > 0){
      this.nativeService.OnlyAlert("Notificación","Tiene ventas pendientes por terminar","warning");
      return;
    }
    this.nativeService.playAudio("success");
    this.nativeService.openModal(OrderSavedPage,{ addInvoiceForm: this.addInvoiceForm })
    .then((res)=>{
      if (res) {
        this.handleModalSaveInvoicePopupComponent(res)
        if (res === 3) {
          this.validateInventory()
        }
      }
    })
  }


  async handleModalSaveInvoicePopupComponent(response){
    this.validateInventory();

    if(response.val === 1){

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
        CompanyID: new FormControl(await this.localStorage.getJsonValue('CIA')),
        InvoiceNum: new FormControl(0),
        CustomerID: new FormControl(0),
        CustomerName: new FormControl(''),
        InvoiceRef: new FormControl(0),
        TranDocTypeID: new FormControl(docType),
        InvoiceDate: new FormControl(''),
        DueDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
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
        CreatedAt: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
        ModifyDate: new FormControl(this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')),
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
      this.addInvoiceForm.patchValue(response.form.value);
      response.form.value.invoicedtls.forEach(a => {
        this.arrayInvoiceLine.push(
          new FormGroup({
            Line: new FormControl(a.Line),
            CompanyID: new FormControl(a.CompanyID),
            InvoiceNum: new FormControl(a.InvoiceNum),
            showButton: new FormControl(false),
            ItemID: new FormControl(a.ItemID),
            ItemDescription: new FormControl(a.ItemDescription),
            Quantity: new FormControl(a.Quantity),
            OnHandQty: new FormControl(a.OnHandQty),
            DiscountPercent: new FormControl(a.DiscountPercent),
            Discount: new FormControl(a.Discount),
            DiscountType: new FormControl(a.DiscountType),
            DiscountAmt: new FormControl(a.DocDiscount),
            DocDiscount: new FormControl(a.DocDiscount),
            UOMCode: new FormControl(a.UOMCode),
            UnitPrice: new FormControl(a.UnitPrice),
            DocUnitPrice: new FormControl(a.DocUnitPrice),
            LineSubtotal: new FormControl(a.LineSubtotal),
            DocLineSubtotal: new FormControl(a.DocLineSubtotal),
            DocLineSubtotalTax: new FormControl(0),
            LineAmount: new FormControl(a.LineAmount),
            DocLineAmount: new FormControl(a.DocLineAmount),
            TaxBase: new FormControl(a.TaxBase),
            DocTaxBase: new FormControl(a.DocTaxBase),
            LineComments: new FormControl(a.LineComments),
            CurrencyCode: new FormControl(a.CurrencyCode),
            RemissionNum: new FormControl(a.RemissionNum),
            RemissionLine: new FormControl(0),
            Warehousecode : new FormControl(a.Warehousecode),
            Bincode : new FormControl(a.Bincode),
            TRM: new FormControl(a.TRM),
            Inactive: new FormControl(a.Inactive),
            ModifiedBy: new FormControl(a.ModifiedBy),
            ModifyDate: new FormControl(a.ModifyDate)
          })
        )

        const curreLineDtl = this.dataSourceItem.filteredData;
        curreLineDtl.forEach(b => {
          if(b.ItemID === a.ItemID){
            b.QtyInvoice= a.Quantity;
          }
        });
      });
      if(response.form.value.invoicetaxes !== null){
        response.form.value.invoicetaxes.forEach(b => {
          this.arrayInvoiceTax.push(
            this.fb.group({
              TaxLine: [b.TaxLine],
              InvoiceNum: [b.InvoiceNum],
              CompanyID: [b.CompanyID],
              TaxID: [b.TaxID],
              RateCode: [b.RateCode],
              Line: [b.Line],
              Percent: [b.Percent],
              TaxableAmount: [b.TaxableAmount],
              DocTaxableAmount: [b.DocTaxableAmount],
              TaxAmount: [b.TaxAmount],
              DocTaxAmount: [b.DocTaxAmount],
              CurrencyCode: [b.CurrencyCode],
              TRM: [b.TRM],
              Manual: [b.Manual],
              TaxTypeID: [b.TaxTypeID as number],
              Inactive: [false]
            }))
        });
      }
      response.form.value.invoicedtls.forEach((e,i) => {
        this.onChangeQtyLine(i)
      });
    }
  }
}
