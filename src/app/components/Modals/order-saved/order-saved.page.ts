import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController } from '@ionic/angular';
import { LocalService } from 'src/Services/Config/local.service';
import { StoreinvoicedService } from 'src/Services/POS/storeinvoiced.service';
import { NativeService } from 'src/Services/Shared/native.service';

@Component({
  selector: 'app-order-saved',
  templateUrl: './order-saved.page.html',
  styleUrls: ['./order-saved.page.scss'],
})
export class OrderSavedPage implements OnInit {

  displayedColumns: string[] = ['OrderNum'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  //@Input() addInvoiceForm;

  public addInvoiceForm : FormGroup;

  formatDecimal:string='';
  showOrderDetails:boolean=false;
  OrderNumSelected:string='';
  listInvoiceSaved:any[]=[];
  showTable:boolean=false;
  resultsLength = 0;
  enterTable=false;

  CustomerName:string='';
  //Descuentos
  InvoiceDiscount: FormArray;

  constructor(
    private apiStoreInvoicedService : StoreinvoicedService,
    private localStorage: LocalService,
    private apiDatePipe : DatePipe,
    private fb: FormBuilder,
    public modalActive: ModalController,
    private nativeService: NativeService,
    
  ) { }

  ngOnInit() {
    this.loadInvoiceData()
  }

  async loadInvoiceData() {
    try {
      this.apiStoreInvoicedService.getByStoreIdAndCompanyAndUserID(await this.localStorage.getJsonValue('userID'))
      .then((res)=>{
        if (res.success) {
        this.listInvoiceSaved = res.result;
  
        this.listInvoiceSaved.forEach(a => {
          a.SelectedInvoice = false;
        });
  
        this.dataSource = new MatTableDataSource<any>(res.result);
      } else {
        this.nativeService.OnlyAlert('Notificación', res.message, 'warning');
        this.closeInvoiceViewModal();
      }
      })
    } catch (error) {
      console.log(error);
    }
  }
  
  get f() { return this.addInvoiceForm.controls; }

  closeInvoiceViewModal(){
    this.modalActive.dismiss(3);
  }

  applyFilter(event, filterValue: string) {
    try {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {
      console.log(error);
    }

  }

  get arrayInvoiceLineItem() {
    return this.addInvoiceForm.get("invoicedtls") as FormArray;
  }

  get arrayInvoiceTax() {
    return this.addInvoiceForm.get("invoicetaxes") as FormArray;
  }

  focusout() {
    try {
      if (!this.enterTable)
        this.showTable = false;
    } catch (error) {
      this.nativeService.OnlyAlert('Notificación', error, 'warning');
    }
  }

  mouseenterTableCustomer() {
    this.enterTable = true;
  }

  mouseleaveTableCustomer() {
    this.enterTable = false;
  }

  async deleteInvoiceSaved(o){
    this.apiStoreInvoicedService.delete(await this.localStorage.getJsonValue('userID'),o)
      .then((res:any)=>{
        if(res.success){
            this.nativeService.OnlyAlert('Proceso terminado', 'Poof! proceso finalizado!', 'success');
            this.showOrderDetails = false;
            this.ngOnInit();
        }else{
          this.nativeService.OnlyAlert('Notificación',res.message,'warning');
          return;
        }
      })
      .catch(console.log)
  }

  async deleteHoldingOrder(o){
    if(0 != null){
      this.nativeService.AlertConfirm('Esta seguro?','de eliminar este registro, una vez realizado este proceso no se puede deshacer')
      .then((response) => {
        if (response['isConfirmed']) {
          this.deleteInvoiceSaved(o)
        } else {
          this.nativeService.OnlyAlert('Proceso cancelado', 'Se cancelo el proceso!', 'warning');
        }
      });
    }else{
      this.nativeService.OnlyAlert('Info','No se pudo eliminarla orden','info')
    }
  }

  selectedInvoice(e,d){

    this.addInvoiceForm = new FormGroup({
      itemsearch: new FormControl(''),
      OrderNum:new FormControl(0),
      ARInvoiceHeadId: new FormControl(0),
      CompanyID: new FormControl(''),
      InvoiceNum: new FormControl(0),
      CustomerID: new FormControl(''),
      CustomerName: new FormControl(''),
      InvoiceRef: new FormControl(0),
      TranDocTypeID: new FormControl(''),
      InvoiceDate: new FormControl(''),
      DueDate: new FormControl(''),
      LegalNumber: new FormControl(''),
      TermID: new FormControl('0'),
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
      InvoiceDiscount: new FormArray([])
    });
    this.OrderNumSelected = d.OrderNum;
    let invoice = JSON.parse(d.DataJson);

    if(invoice.EmitionDate == '')
      invoice.EmitionDate = this.apiDatePipe.transform(new Date(),'yyyy-MM-ddTHH:mm:ss')
    if(invoice.TermID == '0')
      invoice.TermID = 'CONT'

    this.addInvoiceForm.patchValue(invoice);
    this.addInvoiceForm.controls['storeinvoicedId'].setValue(d.storeinvoicedId);
    this.CustomerName = this.addInvoiceForm.value.CustomerName;
    invoice.invoicedtls.forEach(a => {
      this.arrayInvoiceLineItem.push(
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
          DiscountAmt: new FormControl(a.DiscountAmt),
          DocDiscount: new FormControl(a.DocDiscount),
          UOMCode: new FormControl(a.UOMCode),
          UnitPrice: new FormControl(a.UnitPrice),
          DocUnitPrice: new FormControl(a.DocUnitPrice),
          LineSubtotal: new FormControl(a.LineSubtotal),
          DocLineSubtotal: new FormControl(a.DocLineSubtotal),
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
    });
    if(invoice.invoicetaxes !== null){
      invoice.invoicetaxes.forEach(b => {
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

    this.dataSource.data.forEach(a => {
      a.SelectedInvoice =false;
    });

    d.SelectedInvoice = true;
    this.showOrderDetails = true;
  }

  saveModal(){
    this.handSuccessfullSave(1,this.addInvoiceForm);
  }

  handSuccessfullSave(val:number,form:any){
    this.modalActive.dismiss({val, form});
  }
}
