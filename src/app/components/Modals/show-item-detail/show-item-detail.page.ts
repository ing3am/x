import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { ShepherdService } from 'angular-shepherd';
import { TaxType } from 'src/app/models/tax-type';
import { Terms } from 'src/app/models/terms';
import { ARInvoiceService } from 'src/Services/OldBack/arinvoice.service';
import { CurrenciesService } from 'src/Services/POS/currencies.service';
import { CustomerService } from 'src/Services/OldBack/customer.service';
import { ItemService } from 'src/Services/POS/item.service';
import { ItemtaxService } from 'src/Services/POS/itemtax.service';
import { LoadStaticCombosService } from 'src/Services/OldBack/load-static-combos.service';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { MisclistsService } from 'src/Services/POS/misclists.service';
import { TaxService } from 'src/Services/POS/tax.service';
import { TourService } from 'src/Services/POS/tour.service';
import { WarehseBinService } from 'src/Services/OldBack/warehse-bin.service';
//import Swal from 'sweetalert2';
//import { TaxSearchComponent } from 'src/app/Pages/pop-up/tax-search/tax-search.component';
import { ModalController, NavParams  } from '@ionic/angular';
import { NativeService } from 'src/Services/Shared/native.service';
import { TaxSearchPage } from '../tax-search/tax-search.page';


@Component({
  selector: 'app-show-item-detail',
  templateUrl: './show-item-detail.page.html',
  styleUrls: ['./show-item-detail.page.scss'],
})
export class ShowItemDetailPage implements OnInit {

  selected = new FormControl(0);
  addInvoiceForm : FormGroup;
  public pInvoicedtls: FormArray;
  public pInvoicetaxes:FormArray;
  public pLine:number=0;

  invoicedtls: FormArray;
  invoicetaxes: FormArray;
  rates: FormArray;
  submitted: boolean = false;
  disabled: boolean;
  optionsMask: any;
  formatDecimal: string;
  //
  resultsLength = 0;
  //
  showTable: boolean = false;
  enterTable: boolean = false;
  loading: boolean = false;
  pageSizeOptions: number[] = [5, 10, 25, 100]

  options: any;

  showDtl: boolean = true;
  //COMBOS
  //uoms: any[] = this.loadCombos.getUOM();
  //
  currCurrCode: string = 'COP';
  currSymbol: string;
  // Descuentos
  InvoiceDiscount: FormArray;

  warehouses: any[];
  warehousesbin: any[];
  showWareHouses: boolean = false;
  constructor(
    private navParams: NavParams,
    private localStorage: LocalService,
    private taxService: TaxService,
    private fb: FormBuilder,
    private apiARInvoiceService: ARInvoiceService,
    private apiCustomerService: CustomerService,
    private apiItemService: ItemService,
    private apiItemTaxService: ItemtaxService,
    private router: Router,
    private localService: LocalStService,
    private loadCombos: LoadStaticCombosService,
    //private modalService: NgbModal,
    private _route: ActivatedRoute,
    //private shepherdService: ShepherdService,
    private tourService: TourService,
    private apiMiscLists: MisclistsService,
    private apiCurrenciesService: CurrenciesService,
    //public modalActive:NgbActiveModal,
    private apiItemwhsebinservice: WarehseBinService,
    private modalController: ModalController,
    private nativeService: NativeService

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
      });
    });

    this.pLine = this.navParams.get('pLine');
    this.pInvoicedtls = this.navParams.get('pInvoicedtls');
    this.pInvoicetaxes = this.navParams.get('pInvoicetaxes');
  }

  ngOnInit() {
    this.addInvoiceForm = new FormGroup({
      CompanyID : new FormControl(''),
      InvoiceNum:new FormControl(0),
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
      CurrencyCode: new FormControl(this.currCurrCode),
      TRM: new FormControl(1),
      invoicedtls : this.fb.array([]),
      invoicetaxes: this.fb.array([]),
      InvoiceDiscount: this.fb.array([])
    });

    this.addInvoiceForm.controls.invoicedtls['controls'][0] = this.pInvoicedtls;
    this.addInvoiceForm.controls.invoicetaxes['controls'] = this.pInvoicetaxes;
    this.addInvoiceForm.controls.invoicetaxes['controls'].forEach(a => {
      if(a['controls']['Line'].value !== this.pInvoicedtls.controls['Line'].value){
        a['controls']['Visible'] = new FormControl(false);
      }else{
        a['controls']['Visible']= new FormControl(true);
      }
      });
    this.calcularTotales();
    this.playAudio("success");
    this.warehouses = this.loadCombos.getWarehousesByCompanyAndItemId(this.pInvoicedtls.controls['ItemID'].value);  
    this.getWareHouseBin(this.pInvoicedtls.controls['Warehousecode'].value);
   }

  get f() { return this.addInvoiceForm.controls; }
  get h() { return this.addInvoiceForm.controls.invoicedtls['controls']; }
  get arrayInvoiceTax() {return this.addInvoiceForm.get("invoicetaxes") as FormArray;}


  //------------METODOS---------------

  onChangeQtyLine(index) {
    try {
      const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
      const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;
      currentinvcDtls.controls[index]['controls']['UnitPrice'].setValue(
        currentinvcDtls.controls[index]['controls']['DocUnitPrice'].value * currentinvcDtls.controls[index]['controls']['TRM'].value
      );

      currentinvcDtls.controls[index]['controls']['Discount'].setValue(
        currentinvcDtls.controls[index]['controls']['DocDiscount'].value * currentinvcDtls.controls[index]['controls']['TRM'].value
      )
      if (currentinvcDtls.controls[index].value.Quantity > 0) {
        currentinvcDtls.controls[index]['controls']['DocLineAmount'].setValue(
          ((currentinvcDtls.controls[index].value.DocUnitPrice) *
            (currentinvcDtls.controls[index].value.Quantity)) - (currentinvcDtls.controls[index].value.DocDiscount)
        );
        currentinvcDtls.controls[index]['controls']['LineAmount'].setValue(
          ((currentinvcDtls.controls[index].value.DocUnitPrice) *
            (currentinvcDtls.controls[index].value.Quantity)) - (currentinvcDtls.controls[index].value.DocDiscount) * Number(currentinvcDtls.controls[index].value.TRM)
        );

        currentinvcDtls.controls[index]['controls']['DocLineSubtotal'].setValue(
          (currentinvcDtls.controls[index].value.DocUnitPrice) * (currentinvcDtls.controls[index].value.Quantity)
        );
        currentinvcDtls.controls[index]['controls']['LineSubtotal'].setValue(
          ((currentinvcDtls.controls[index].value.DocUnitPrice) * (currentinvcDtls.controls[index].value.Quantity)) * Number(currentinvcDtls.controls[index].value.TRM)
        );
      } else {
        currentinvcDtls.controls[index]['controls']['DocLineAmount'].setValue(0);
        currentinvcDtls.controls[index]['controls']['LineAmount'].setValue(0);
      }
      let impuestos = 0;
      let retencion = 0;

      currentinvcTaxs.controls.forEach(a => {
        if (a['controls']['TaxTypeID'].value === 2 || a['controls']['TaxTypeID'].value === "2") {
          if (a['controls']['Line'].value === currentinvcDtls.controls[index]['controls']['Line'].value) {
            if (!a['controls']['Manual'].value) {
              a['controls']['TaxableAmount'].setValue(currentinvcDtls.controls[index]['controls']['LineAmount'].value * Number(a['controls']['TRM'].value));
              a['controls']['DocTaxableAmount'].setValue(currentinvcDtls.controls[index]['controls']['DocLineAmount'].value);
            }
            retencion += a['controls']['DocTaxableAmount'].value * (a['controls']['Percent'].value / 100);
            a['controls']['DocTaxAmount'].setValue(a['controls']['DocTaxableAmount'].value * (a['controls']['Percent'].value / 100));
            a['controls']['TaxAmount'].setValue(a['controls']['DocTaxAmount'].value * Number(a['controls']['TRM'].value));
          }
        }
      });

      currentinvcTaxs.controls.forEach(a => {
        if (a['controls']['TaxTypeID'].value === 1 || a['controls']['TaxTypeID'].value === "1") {
          if (a['controls']['Line'].value === currentinvcDtls.controls[index]['controls']['Line'].value) {
            if (!a['controls']['Manual'].value) {
              a['controls']['TaxableAmount'].setValue(currentinvcDtls.controls[index]['controls']['LineAmount'].value * Number(a['controls']['TRM'].value));
              a['controls']['DocTaxableAmount'].setValue(currentinvcDtls.controls[index]['controls']['DocLineAmount'].value);
            }
            impuestos += a['controls']['DocTaxableAmount'].value * (a['controls']['Percent'].value / 100);
            a['controls']['DocTaxAmount'].setValue(a['controls']['DocTaxableAmount'].value * (a['controls']['Percent'].value / 100));
            a['controls']['TaxAmount'].setValue(a['controls']['DocTaxAmount'].value * Number(a['controls']['TRM'].value));
          }
        }
      });

      currentinvcDtls.controls[index]['controls']['DocTaxBase'].setValue(impuestos);
      currentinvcDtls.controls[index]['controls']['TaxBase'].setValue(impuestos * Number(currentinvcDtls.controls[index]['controls']['TRM'].value));
      this.calcularTotales();

    } catch (error) {
      console.log(error);
    }
  }

  focusoutTaxLine(i, ctrl) {
    try {
      const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;
      let obj = null
      currentinvcTaxs.controls.forEach((a,ind) => {
        if(i === ind){
          obj = a['value']
           a['controls']['TaxAmount'].setValue((ctrl['TaxableAmount'].value) * (ctrl['Percent'].value / 100))
           a['controls']['DocTaxAmount'].setValue((ctrl['DocTaxableAmount'].value) * (ctrl['Percent'].value / 100))
           a['controls']['Manual'].setValue(true)
        }
      })
      console.log(obj)

      currentinvcTaxs.removeAt(i);

      let arTax: any = {
        TaxLine: 0,
        CompanyID: this.addInvoiceForm.controls['CompanyID'].value,
        Line: obj.Line,
        TaxID: obj.TaxID,
        RateCode: obj.RateCode,
        Percent: obj.Percent,
        TaxTypeID: obj.TaxTypeID,
        TaxableAmount: obj.TaxableAmount,
        DocTaxableAmount: obj.DocTaxableAmount,
        TaxAmount: obj.TaxAmount,
        DocTaxAmount: obj.DocTaxAmount,
        Manual: true,
        TRM: this.addInvoiceForm.controls['TRM'].value,
        CurrencyCode: this.addInvoiceForm.controls['CurrencyCode'].value,
        Inactive: false,
        CreatedAt: new Date,
        CreatedBy: '',
        ModifiedBy: '',
        ModifyDate: new Date
      };
      this.addInvoiceTaxFromLine(arTax, this.pLine);
       ctrl['TaxAmount'].setValue((ctrl['TaxableAmount'].value) * (ctrl['Percent'].value / 100))
       ctrl['DocTaxAmount'].setValue((ctrl['DocTaxableAmount'].value) * (ctrl['Percent'].value / 100))
       ctrl['Manual'].setValue(true);
       this.onChangeQtyLine(0);
    } catch (error) {
      console.log(error);
    }
  }

  deleteTaxLine(index: number, ctrl: any) {
    try {
      const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
      const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;

      let impuestos = 0;

      currentinvcDtls.controls.forEach(a => {
        if (a['controls']['Line'].value === ctrl.Line.value) {
          if (ctrl.TaxTypeID.value === 1 || ctrl.TaxTypeID.value === "1") {
            let currTax = a['controls']['DocTaxBase'].value;
            currTax = currTax - ctrl.DocTaxAmount.value;
            a['controls']['DocTaxBase'].setValue(currTax);
            a['controls']['TaxBase'].setValue(currTax * Number(a['controls']['TRM'].value));
            currentinvcTaxs.removeAt(index);
          }
          if (ctrl.TaxTypeID.value === 2 || ctrl.TaxTypeID.value === "2") {
            let currWitHoding = a['controls']['DocLineAmount'].value;
            currWitHoding = currWitHoding + ctrl.DocTaxAmount.value;
            a['controls']['LineAmount'].setValue(currWitHoding * Number(a['controls']['TRM'].value));
            a['controls']['DocLineAmount'].setValue(currWitHoding);
            //
            currentinvcTaxs.removeAt(index);
            //
            currentinvcTaxs.controls.forEach(b => {
              if (b['controls']['Line'].value === a['controls']['Line'].value) {
                if (!b['controls']['Manual'].value) {
                  b['controls']['TaxableAmount'].setValue(a['controls']['LineAmount'].value);
                  b['controls']['DocTaxableAmount'].setValue(a['controls']['DocLineAmount'].value);
                }
                impuestos += b['controls']['DocTaxableAmount'].value * (b['controls']['Percent'].value / 100);
                b['controls']['TaxAmount'].setValue(b['controls']['TaxableAmount'].value * (b['controls']['Percent'].value / 100));
                b['controls']['DocTaxAmount'].setValue(b['controls']['DocTaxableAmount'].value * (b['controls']['Percent'].value / 100));
              }
            });
            a['controls']['DocTaxBase'].setValue(impuestos);
            a['controls']['TaxBase'].setValue(impuestos * Number(a['controls']['TRM'].value));
          }
        }
      });
      this.calcularTotales();
    } catch (error) {
      console.log(error);
    }
  }

  async openSearchTaxAtLinePopUp(){
    const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
    const props = {
      line: currentinvcDtls.controls[0]['controls']['Line'].value,
      pos: this.pLine,
      taxdetailvisible: true
    }
    const data = await this.nativeService.openModal(TaxSearchPage,props)
        if (data) {
          this.handleModalAddTaxLineComponent(data)
        }
  }


  handleModalAddTaxLineComponent(response) {
    if (response.val) {
      let agregar = true;
      const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;

      currentinvcTaxs.controls.forEach(a => {
        if (a['controls'].Line.value === response.LineNumber) {
          if (a['controls'].TaxID.value === response.TaxID) {
            if (a['controls'].RateCode.value === response.RateCode) {
              if (a['controls'].Percent.value === response.Percent) {
                //Swal.fire('Notificación', 'Este impuesto ya está asignado', 'info');
                agregar = false;
                return;
              }
            }
          }
        }
      });
      if (agregar) {
        let arTax: any = {
          TaxLine: 0,
          CompanyID: this.addInvoiceForm.controls['CompanyID'].value,
          Line: response.LineNumber,
          TaxID: response.TaxID,
          RateCode: response.RateCode,
          Percent: response.Percent,
          TaxTypeID: response.taxtype[0]['TaxTypeID'],
          TaxableAmount: 0,
          DocTaxableAmount: 0,
          TaxAmount: 0,
          DocTaxAmount: 0,
          Manual: false,
          TRM: this.addInvoiceForm.controls['TRM'].value,
          CurrencyCode: this.addInvoiceForm.controls['CurrencyCode'].value,
          Inactive: false,
          CreatedAt: new Date,
          CreatedBy: '',
          ModifiedBy: '',
          ModifyDate: new Date
        };
        this.addInvoiceTaxFromLine(arTax, this.pLine);
      }
    }
  }

  addInvoiceTaxFromLine(obj: any, i) {
    try {
      this.arrayInvoiceTax.push(
        this.fb.group({
          Visible : [true],
          TaxLine: [obj.TaxLine],
          InvoiceNum: [this.addInvoiceForm.controls['InvoiceNum'].value],
          CompanyID: [this.localService.getSelectedCia()],
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
          CreatedBy: [this.localService.getUser()],
          CreatedAt: [new Date],
          ModifiedBy: [this.localService.getUser()],
          ModifyDate: [new Date],
          joindtls: ['']
        })
      )
      this.onChangeQtyLine(0);
    } catch (error) {
      console.log(error);
    }
  }

   deleteLine(i){

   }
 
   closeInvoiceViewModal() {
    this.saveModal()
    this.modalController.dismiss(this.addInvoiceForm.value);
  }
 
   saveModal(){
     var legendValue = document.querySelector('#my-legend').textContent.trim();
     const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
     currentinvcDtls.controls[0]['controls']['ItemDescription'].setValue(legendValue);
     this.calcularTotales()
     this.handSuccessfullSave(this.addInvoiceForm.value,this.pLine);
   }

   handSuccessfullSave(form,line){
    let linedtl = this.addInvoiceForm.controls['invoicedtls']['controls'][0].value;
    if(linedtl.IsInventoryable && !linedtl.BackFlush){
      if(linedtl.Quantity > linedtl.OnHandQty){
        //Swal.fire('Notificación','La cantidad ingresada, supera la cantidad disponible','warning');
        return;
      }
    }
    this.modalController.dismiss({form,line});
  }
  
   playAudio(status) {
    let audio = new Audio();
    if(status==="success")
      audio.src = "../../../assets/audio/success.mp3";
    if(status==="delete")
      audio.src = "../../../assets/audio/delete.mp3";
    if(status==="undo")
      audio.src = "../../../assets/audio/undo.mp3";

    audio.load();
    audio.play();
  }

   calcularTotales(){
    const currentinvcDtls = this.addInvoiceForm.get('invoicedtls') as FormArray;
    const currentinvcTaxs = this.addInvoiceForm.get('invoicetaxes') as FormArray;

    let subtotal = 0;
    let descuento = 0;
    let retenciones = 0;
    let impuestos = 0;
    let total = 0;
    let line = 0;
    if (currentinvcDtls !== null) {
      currentinvcDtls.controls.forEach( a => {
        line = a.value.Line
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
          if(line === a.value.Line){
            retenciones += a.value.DocTaxAmount;
          }
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

  getWareHouseBin(wareHouseCode){
    this.apiItemwhsebinservice.getByCompany(wareHouseCode)
    .then((res: any) => {
      this.warehousesbin = res.result;
      if(this.warehouses.length > 0)
        this.showWareHouses = true;
    })
    .catch(console.log);
  }

}
