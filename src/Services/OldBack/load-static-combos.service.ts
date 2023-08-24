import { Injectable } from '@angular/core';
import { TypeID } from 'src/app/models/type-id';
import { TaxType } from 'src/app/models/tax-type';
import { Terms } from 'src/app/models/terms';
import { PayMethod } from 'src/app/models/pay-method';
import { TaxTypeService } from './tax-type.service';
import { Country } from 'src/app/models/country';
import { TermsService } from './terms.service';
import { PaymethodService } from './paymethod.service';
import { UomServiceService } from './uom-service.service';
import { TrandoctypeService } from './trandoctype.service';
import { CashEquivalentService } from './cash-equivalent.service';
import { ListmiscService } from './listmisc.service';
import { CurrenciesService } from 'src/Services/POS/currencies.service';
import { CitiesService } from './cities.service';
import { CountriesService } from './countries.service';
import { StatesService } from './states.service';
import { CiiucodeService } from './ciiucode.service';
import { LocalService } from '../Config/local.service';
import { TaxresponsabilityService } from './taxresponsability.service';
import { PlanService } from './plan.service';
import { WarehseService } from './warehse.service';
import { PaymentsMeansIdService } from './payments-means-id.service';




@Injectable({
  providedIn: 'root'
})
export class LoadStaticCombosService {


  constructor(
    private taxTypeService: TaxTypeService,
    private apicountriesService: CountriesService,
    private apistetesService: StatesService,
    private apicitiesService: CitiesService,
    private apiciiucodesService: CiiucodeService,
    private termsService: TermsService,
    private paymethodService: PaymethodService,
    private currencyService: CurrenciesService,
    private uomService: UomServiceService,
    private trandoctypeService: TrandoctypeService,
    private cashequivalenteService: CashEquivalentService,
    private listmiscService: ListmiscService,
    private apiwarehouse: WarehseService,
    private localStorage: LocalService,
    private taxResponsabilitiesService: TaxresponsabilityService,
    private apiPlan : PlanService,
    private paymentMeansIdServ: PaymentsMeansIdService,
  ) { }

  taxtypes: TaxType[] = [];

  countries: Country[] = [];

  termsSales: Terms[] = [];

  paymethods: PayMethod[] = [];

  monedas: any[] = [];

  states: any[] = [];

  cities: any[] = [];

  codeciiu: any[] = [];

  trandoctype: any[] = [];

  cashequivalent: any[] = [];

  uoms: any[] = [];

  itemgroup: any[] = [];

  itemfamily: any[] = [];

  tipoimpuestodian: any[] = [];

  paymentmeanscode: any[] = [];

  cmreasoncode: any[] = [];

  dmreasoncode: any[] = [];

  plans: any[]=[];

  paymentmeansid: any[] = [
    { ID: '2', Type: 'Crédito' },
    { ID: '1', Type: 'Contado' }
  ];

  taxresponsabilities: any[] = [];

  regimetype: any[] = [
    { ID: '04', Description: 'Régimen Simple' },
    { ID: '05', Description: 'Régimen Ordinario' }
  ];

  TranType: any[] = [
    { TranType: 'SA', Description: 'Documentos de Venta' },
    { TranType: 'SP', Description: 'Documentos de Venta POS' },
    { TranType: 'CE', Description: 'Recibos de Caja' },
    { TranType: 'PM', Description: 'Pagos' },
    { TranType: 'CE', Description: 'Transferencias y Ajustes bancarios' },
    { TranType: 'GL', Description: 'Registros de contabilidad general' },
    { TranType: 'PR', Description: 'Facturas de Compra' },
    { TranType: 'CM', Description: 'Notas Crédito, disminuye los documentos de Venta' },
    { TranType: 'DM', Description: 'Nota débito, aumenta el valor de la cartera del cliente' },
  ]

  showinforms: any[] =
    [
      { ShowInFormID: 0, ShowInFormDescription: '- Seleccione uno -' },
      { ShowInFormID: 1, ShowInFormDescription: 'FACTURA' },
      { ShowInFormID: 2, ShowInFormDescription: 'RECIBO/PAGO' },
    ];

  calcinbasetos: any[] =
    [
      { CalcInBaseToID: 0, CalcInBaseToDescription: '-Seleccione un tipo de calculo-', Inactive: false },
      { CalcInBaseToID: 1, CalcInBaseToDescription: 'MANUAL' },
      { CalcInBaseToID: 2, CalcInBaseToDescription: 'VALOR LINEA' },
    ];

  typeDocumentsID: TypeID[] =
    [
      { ID: 11, Description: '11-REGISTRO CIVIL', Inactive: false },
      { ID: 12, Description: '12-TARJETA DE INDENTIDAD', Inactive: false },
      { ID: 13, Description: '13-CEDULA DE CIUDADANIA', Inactive: false },
      { ID: 21, Description: '21-TARJETA DE EXTRANJERIA', Inactive: false },
      { ID: 22, Description: '22-CEDULA DE EXTRANJERIA', Inactive: false },
      { ID: 31, Description: '31-NUMERO DE IDENTIFICACION TRIBUTARIA', Inactive: false },
      { ID: 41, Description: '41-PASAPORTE', Inactive: false },
      { ID: 42, Description: '42-DOCUMENTO DE IDENTIFICACION EXTRANJERO', Inactive: false },
      { ID: 43, Description: '43-SIN IDENTIFICACION DEL EXTERIOR O PARA USO DEFINIDO POR LA DIAN', Inactive: false },
      { ID: 44, Description: '44-DOCUMENTO DE IDENTIFICACION EXTRANJERO PERSONA JURIDICA', Inactive: false },
      { ID: 46, Description: '46-CARNE DIPLOMATICO', Inactive: false },
    ]

  cargos: any[] =
    [
      { ID: '0', Description: '- Seleccione el cargo -' },
      { ID: '1', Description: 'Gerente' },
      { ID: '2', Description: 'Contador' },
      { ID: '3', Description: 'Cartera' },
      { ID: '4', Description: 'Otro' },
    ];

  perfiles: any[] =
    [
      { ID: '0', Description: '- Seleccione el perfil -' },
      { ID: 'AOwner', Description: 'Administrador' },
      { ID: 'User', Description: 'Usuario' }
    ];

  formHorizontal: any[] = [
    { ruta: '/app/AR/factura/crearfactura' },
    { ruta: '/app/AR/factura/editarfactura' },
    { ruta: '/app/AR/factura/verfactura' },
  ];

  warehouses:any[]=[];

  //METODOS GET
  getTaxType() {
    this.taxtypes = [];
    this.taxTypeService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.taxtypes.push(a);
          });
        }
      })
      .catch();
    return this.taxtypes;
  }

  getCountries() {
    this.countries = [];
    this.apicountriesService.get()
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.countries.push(a);
          });
        }
      })
      .catch();
    return this.countries;
  }

  async getCountriesAsync() {
    this.countries = [];
    await this.apicountriesService.get()
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.countries.push(a);
          });
        }
      })
      .catch();
    return this.countries;
  }

  getStates(id: any) {
    this.states = [];
    this.apistetesService.getByCountry(id)
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.states.push(a);
          });
        }
      })
      .catch();
    return this.states;
  }

  async getStatesAsync(id: any) {
    this.states = [];
    await this.apistetesService.getByCountry(id)
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.states.push(a);
          });
        }
      })
      .catch();
    return this.states;
  }


  getCities(id: any) {
    this.cities = [];
    if(id != ""){
    this.apicitiesService.getByState(id)
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.cities.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    }
    return this.cities;
  }

  async getCitiesAsync(id: any) {
    this.cities = [];
    await this.apicitiesService.getByState(id)
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.cities.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.cities;
  }

  getCodeCiiu() {
    this.codeciiu = [];
    this.apiciiucodesService.get()
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.codeciiu.push(a);
          });
        }
      })
      .catch();
    return this.codeciiu;
  }

  getTypeDocumentsID() {
    return this.typeDocumentsID;
  }

  getShowCashReceipt() {
    return this.showinforms;
  }

  getCalculateTax() {
    return this.calcinbasetos;
  }

  getTranDocType(id, id2?) {
    this.trandoctype = [];
    this.trandoctypeService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive) {
              if (id !== '') {
                if (a.TranType === id)
                  this.trandoctype.push(a);
              }
              if (id2 !== '') {
                if (a.TranType === id2)
                  this.trandoctype.push(a);
              }
              else {
                this.trandoctype.push(a);
              }
            }
          });
        }
      })
      .catch();
    return this.trandoctype;
  }

  getTermsSales() {
    this.termsSales = [];
    this.termsService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.termsSales.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.termsSales;
  }

  async getTermsSalesAsync() {
    this.termsSales = [];
    await this.termsService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.termsSales.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.termsSales;
  }

  getUOM() {
    this.uoms = [];
    this.uomService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.uoms.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.uoms;
  }

  getTaxResponsabilities() {
    this.itemgroup = [];
    this.taxResponsabilitiesService.getByCompany(this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.taxresponsabilities.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.taxresponsabilities;
  }

  getItemGroup() {
    this.itemgroup = [];
    this.uomService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.itemgroup.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.itemgroup;
  }

  getItemFamily() {
    this.itemfamily = [];
    this.uomService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.itemfamily.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.itemfamily;
  }

  getPayMethod() {
    this.paymethods = [];
    this.paymethodService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.paymethods.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.paymethods;
  }

  getCargos() {
    return this.cargos;
  }

  getPerfiles() {
    return this.perfiles;
  }

  getCurrencies() {
    this.monedas = [];
    this.currencyService.getByCompany()
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.monedas.push(a);
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.monedas;
  }

  getTranType() {
    return this.TranType;
  }

  getFormHorizontal() {
    return this.formHorizontal;
  }

  getCashEquivalent() {
    this.cashequivalent = [];
    this.cashequivalenteService.getByCompany(
      this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive) {
              this.cashequivalent.push(a);
            }
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.cashequivalent;
  }

  getPaymentMeansCode() {
    this.paymentmeanscode = [];
    this.listmiscService.getMiscLists('MedioPagoDIAN')
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive) {
              this.paymentmeanscode.push(a);
            }
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.paymentmeanscode;
  }

  getTipoImpuestoDIAN() {
    this.tipoimpuestodian = [];
    this.listmiscService.getMiscLists('TipoImpuestoDIAN')
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive) {
              this.tipoimpuestodian.push(a);
            }
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.tipoimpuestodian;
  }

  getCMReasonCode() {
    this.cmreasoncode = [];
    this.listmiscService.getMiscLists('TipoOperacionNC')
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive) {
              this.cmreasoncode.push(a);
            }
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.cmreasoncode;
  }

  getDMReasonCode() {
    this.dmreasoncode = [];
    this.listmiscService.getMiscLists('TipoOperacionND')
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive) {
              this.dmreasoncode.push(a);
            }
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.dmreasoncode;
  }

  getPlans() {
    this.plans = [];
    this.apiPlan.getPlans()
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if (!a.Inactive)
              this.plans.push(a);
          });
        }
      })
      .catch();
    return this.plans;
  }

  getPaymentMeansID() {
    this.paymentmeansid = [];
    this.paymentMeansIdServ.getPaymentMeansID()
      .then((res: any) => {
        if (res !== null) {
          res.result.forEach(a => this.paymentmeansid.push(a));
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
    return this.paymentmeansid;
  }

  getRegimeType() {
    return this.regimetype;
  }

  getWarehouses(){
    this.warehouses=[];
    this.apiwarehouse.getByCompany()
    .then((res:any)=>{
      if (res !== null) {
        res.result.forEach(a =>{
          if(!a.Inactive)
          this.warehouses.push(a);
        });
      }
    })
    .catch(console.log)
    return this.warehouses;
  }

  getWarehousesByCompanyAndItemId(itemId){
    this.warehouses=[];
    this.apiwarehouse.GetByCompanyAndItemId(itemId)
    .then((res:any)=>{
      if (res !== null) {
        res.result.forEach(a =>{
          if(!a.Inactive)
          this.warehouses.push(a);
        });
      }
    })
    .catch(console.log)
    return this.warehouses;
  }

}