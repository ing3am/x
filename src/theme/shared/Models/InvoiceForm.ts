import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';

@Injectable({
  providedIn: 'root'
})

export class InvoiceFormModels {
  addInvoiceForm: FormGroup;

  cia: any;
  user: any;

  currCurrCode = 'COP';

  constructor(
    private localService: LocalStService,
    private LocalStorage: LocalService,
    private datePipe: DatePipe,
  ) {

  }

  getInitializedFormNoAsync() {
    this.addInvoiceForm = new FormGroup({
      itemsearch: new FormControl(''),
      CompanyID: new FormControl(this.cia),
      LocalInvoiceID: new FormControl('1'),
      OrderNum: new FormControl(''),
      ARInvoiceHeadId: new FormControl(0),
      InvoiceNum: new FormControl(0),
      CustomerID: new FormControl(0),
      CustomerName: new FormControl(''),
      InvoiceRef: new FormControl(''),
      TranDocTypeID: new FormControl(''),
      InvoiceDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'), Validators.required),
      DueDate: new FormControl(new Date, Validators.required),
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
      CreatedBy: new FormControl(this.user),
      ModifiedBy: new FormControl(this.user),
      CreatedAt: new FormControl(new Date),
      ModifyDate: new FormControl(new Date),
      Process: new FormControl(false),
      CurrencyCode: new FormControl(this.currCurrCode, [Validators.required]),
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
      CalculationRate_c: new FormControl(''),
      DateCalculationRate_c: new FormControl(new Date),
      Emited: new FormControl(false),
      EmitionDate: new FormControl(new Date),
      DecimalQty: new FormControl(0),
      Identification: new FormControl(''),
      storeinvoicedId: new FormControl(0),
      invoicedtls: new FormArray([]),
      invoicetaxes: new FormArray([]),
      customer: new FormArray([]),
      listPayment: new FormArray([])
    });
    return this.addInvoiceForm;
  }

  getInitializedForm() {
    const promise = new Promise(async (resolve, reject) => {
      try {
        this.localService.getSelectedCia().then((res: any) => {
          this.cia = res;
          this.localService.getUser().then(async (res: any) => {
            this.user = res;
            this.addInvoiceForm = new FormGroup({
              itemsearch: new FormControl(''),
              CompanyID: new FormControl(this.cia),
              LocalInvoiceID: new FormControl('1'),
              OrderNum: new FormControl(''),
              ARInvoiceHeadId: new FormControl(0),
              InvoiceNum: new FormControl(0),
              CustomerID: new FormControl(0),
              CustomerName: new FormControl(''),
              InvoiceRef: new FormControl(''),
              TranDocTypeID: new FormControl(await this.LocalStorage.getJsonValue('TranDocTypeID')),
              InvoiceDate: new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'), Validators.required),
              DueDate: new FormControl(new Date, Validators.required),
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
              CreatedBy: new FormControl(this.user),
              ModifiedBy: new FormControl(this.user),
              CreatedAt: new FormControl(new Date),
              ModifyDate: new FormControl(new Date),
              Process: new FormControl(false),
              CurrencyCode: new FormControl(this.currCurrCode, [Validators.required]),
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
              CalculationRate_c: new FormControl(''),
              DateCalculationRate_c: new FormControl(new Date),
              Emited: new FormControl(false),
              EmitionDate: new FormControl(new Date),
              DecimalQty: new FormControl(0),
              Identification: new FormControl(''),
              storeinvoicedId: new FormControl(0),
              invoicedtls: new FormArray([]),
              invoicetaxes: new FormArray([]),
              customer: new FormArray([]),
              listPayment: new FormArray([])
            });
            resolve(this.addInvoiceForm);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
    return promise;

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

  InvoiceLinePush(item) {
    this.arrayInvoiceLine.push(
      new FormGroup({
        ItemID: new FormControl(item.ItemID, [Validators.required]),
        ItemDescription: new FormControl(item.ItemDescription),
        Line: new FormControl(item.Line),
        CompanyID: new FormControl(this.addInvoiceForm.controls['CompanyID'].value),
        InvoiceNum: new FormControl(this.addInvoiceForm.controls['InvoiceNum'].value),
        showButton: new FormControl(item.showButton),
        Quantity: new FormControl(item.Quantity),
        OnHandQty: new FormControl(item.OnHandQty),
        IsInventoryable: new FormControl(item.IsInventoryable),
        DiscountPercent: new FormControl(item.DiscountPercent),
        Discount: new FormControl(item.Discount),
        DocDiscount: new FormControl(item.DocDiscount),
        UOMCode: new FormControl(item.UOMCode),
        UnitPrice: new FormControl(item.UnitPrice),
        DocUnitPrice: new FormControl(item.DocUnitPrice),
        LineSubtotal: new FormControl(item.LineSubtotal),
        DocLineSubtotal: new FormControl(item.DocLineSubtotal),
        DocLineSubtotalTax: new FormControl(item.DocLineSubtotalTax),
        LineAmount: new FormControl(item.LineAmount),
        DocLineAmount: new FormControl(item.DocLineAmount),
        TaxBase: new FormControl(item.TaxBase),
        DocTaxBase: new FormControl(item.DocTaxBase),
        LineComments: new FormControl(item.LineComments),
        CurrencyCode: new FormControl(this.addInvoiceForm.controls['CurrencyCode'].value),
        TRM: new FormControl(this.addInvoiceForm.controls['TRM'].value),
        RemissionNum: new FormControl(item.RemissionNum),
        RemissionLine: new FormControl(item.RemissionLine),
        Warehousecode: new FormControl(item.Warehousecode),
        Bincode: new FormControl(item.Bincode),
        BackFlush: new FormControl(item.BackFlush),
        Inactive: new FormControl(item.Inactive),
        CreatedBy: new FormControl(this.addInvoiceForm.controls['CreatedBy'].value),
        CreatedAt: new FormControl(this.addInvoiceForm.controls['CreatedAt'].value),
        ModifiedBy: new FormControl(this.addInvoiceForm.controls['ModifiedBy'].value),
        ModifyDate: new FormControl(this.addInvoiceForm.controls['ModifyDate'].value),
      })
    );
  }

  InvoiceTaxPush(item) {
    this.arrayInvoiceTax.push(
      new FormGroup({
        TaxLine: new FormControl(item.TaxLine),
        CompanyID: new FormControl(this.addInvoiceForm.controls['CompanyID'].value),
        InvoiceNum: new FormControl(this.addInvoiceForm.controls['InvoiceNum'].value),
        TaxID: new FormControl(item.TaxID),
        RateCode: new FormControl(item.RateCode),
        Line: new FormControl(item.Line),
        Percent: new FormControl(item.Percent),
        TaxableAmount: new FormControl(item.TaxableAmount),
        DocTaxableAmount: new FormControl(item.DocTaxableAmount),
        TaxAmount: new FormControl(item.TaxAmount),
        DocTaxAmount: new FormControl(item.DocTaxAmount),
        CurrencyCode: new FormControl(this.addInvoiceForm.controls['CurrencyCode'].value),
        TRM: new FormControl(this.addInvoiceForm.controls['TRM'].value),
        Manual: new FormControl(item.Manual),
        TaxTypeID: new FormControl(item.TaxTypeID),
        Inactive: new FormControl(false),
        CreatedBy: new FormControl(this.addInvoiceForm.controls['CreatedBy'].value),
        CreatedAt: new FormControl(this.addInvoiceForm.controls['CreatedAt'].value),
        ModifiedBy: new FormControl(this.addInvoiceForm.controls['ModifiedBy'].value),
        ModifyDate: new FormControl(this.addInvoiceForm.controls['ModifyDate'].value),
        joindtls: new FormControl('')
      })
    )
  }

}