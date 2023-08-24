import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { LedgerConceptService } from 'src/Services/Ledger/ledger-concept.service';
import { TaxresponsabilityService } from 'src/Services/OldBack/taxresponsability.service';
import { TerceroService } from 'src/Services/OldBack/tercero.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';
import { NativeService } from 'src/Services/Shared/native.service';
import { CustomerFormModels } from 'src/theme/shared/Models/CustomerForm';
import { Country } from 'src/theme/shared/Models/country';

@Component({
  selector: 'app-add-or-update-customer',
  templateUrl: './add-or-update-customer.page.html',
  styleUrls: ['./add-or-update-customer.page.scss'],
})
export class AddOrUpdateCustomerPage implements OnInit {


  loading = true;
  addTerceroForm: FormGroup;
  public resaleId: '';

  tittle = 'Crear Cliente';
  action: string = "create";
  typeId: any[];
  paymentmeanscode: any[];
  paymentmeansid: any[];
  countries: Country[] = [];
  states = []
  cities = []
  taxResponsability: any[] = [];

  constructor(
    public modalController: ModalController,
    private customerModule: CustomerFormModels,
    private ledgerConcept: LedgerConceptService,
    private loadCombos: LoadStaticCombosService,
    private localStorage: LocalService,
    private apiTerceroService: TerceroService,
    private localService: LocalStService,
    private taxResponsabilitiesService: TaxresponsabilityService,
    private nativeService: NativeService
  ) { }

  get f() { return this.addTerceroForm.controls; }

  ngOnInit() {
    this.addTerceroForm = this.customerModule.getInitializedFormNoAsync();
  }


  async ionViewDidEnter() {
    await this.getConcepts();
    await this.getTaxResponsabilities();
    this.typeId = this.loadCombos.getTypeDocumentsID();
    this.paymentmeanscode = await this.loadCombos.getPaymentMeansCode();
    this.paymentmeansid = await this.loadCombos.getPaymentMeansID();
    this.countries = await this.loadCombos.getCountriesAsync();

    this.onLoad();
  }

  async getConcepts() {
    await this.ledgerConcept.getByModule('customer')
      .then((r: any) => {
        const currentconceptsDtls = this.addTerceroForm.get('ListCustomerGL') as FormArray;
        r.result.forEach(async (e: any) => {
          currentconceptsDtls.push(new FormGroup({
            CustomerGLId: new FormControl(0),
            CompanyID: new FormControl(Number(await this.localService.getSelectedCia())),
            CustomerID: new FormControl(this.addTerceroForm.value.TerceroNum),
            AccountCodeRef: new FormControl(e.AccountCodeRef),
            AccountCode: new FormControl(e.AccountCode),
            AccountDescription: new FormControl(e.AccountDescription),
            BookID: new FormControl(e.BookID),
            Concept: new FormControl(e.Concept),
            Nature: new FormControl(e.Nature),
            Inactive: new FormControl(false),
            CreatedAt: new FormControl(new Date),
            ModifyDate: new FormControl(new Date),
            ModifiedBy: new FormControl(await this.localService.getUser()),
            CreatedBy: new FormControl(await this.localService.getUser())
          }))
        })
        this.addTerceroForm.updateValueAndValidity();
      }
      )
      .catch((error: any) => {
        console.log(error)
      })
  }

  async getTaxResponsabilities() {
    try {
      const res = await this.taxResponsabilitiesService.GetTaxResponsabilitiesByCompanyNgSelect(await this.localStorage.getJsonValue('CIA'));
      if (res !== null) {
        this.taxResponsability = res;
      }
    } catch (err: any) {
      this.loading = false;
      console.log(err);
    }
  }

  async onLoad() {
    try {
      if (this.resaleId) {
        this.loadCustomer(this.resaleId);
      } else {
        this.localStorage.getJsonValue('companies').then((res_company: any) => {
          JSON.parse(res_company).forEach(async a => {
            if (a.CompanyID.toString() == await this.localStorage.getJsonValue('CIA')) {
              this.addTerceroForm.controls['CompanyID'].setValue(a.CompanyID);
              this.addTerceroForm.controls['CountryID'].setValue(a.CountryID);
              this.addTerceroForm.controls['StateID'].setValue(a.StateID);
              this.addTerceroForm.controls['CityID'].setValue(a.CityID);
              this.addTerceroForm.controls['EMailAddress'].setValue(a.EmailFE ?? a.EMailAddress);
            }
          });
          this.loading = false;
        })
      }
    } catch (error) {
      console.error(error);
    }
  }

  async loadCustomer(id: any) {
    this.action = "edit";
    this.tittle = "Editar Cliente";
    this.loading = true;
    await this.apiTerceroService.getByID(id, false)
      .then((res: any[]) => {
        this.states = this.loadCombos.getStates(res[0].CountryID);
        this.cities = this.loadCombos.getCities(res[0].StateID);
        this.addTerceroForm.patchValue(res[0]);
        this.addTerceroForm.controls['PaymentMeansID_c'].setValue(Number(this.addTerceroForm.value.PaymentMeansID_c));
        this.addTerceroForm.controls.TaxResponsabilityID.setValue(res[0].TaxResponsabilityID.split(';'));
        this.loading = false;
      })
      .catch((error: any) => {
        this.loading = false;
        console.error(error)
      });
  }


  calcular() {
    try {
      const nit = this.addTerceroForm.controls['TerceroNum'].value;
      const isNitValid = Number.isInteger(parseFloat(nit)); // Validate a positive integer

      if (isNitValid) {
        const checkDigit = this.calcularDigitoVerificacion(nit);
        this.addTerceroForm.controls['CheckDigit'].setValue(checkDigit);
      }
    } catch (error) {
      this.nativeService.OnlyAlert('Notificación', error, 'error');
    }
  }

  calcularDigitoVerificacion(myNit) {
    myNit = myNit.replace(/\s|,|\.|-/g, "");

    if (isNaN(myNit)) {
      console.log(`La identificación '${myNit}' no es válida.`);
      return "";
    }

    const vpri = [0, 3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    const z = myNit.length;
    let x = 0;

    for (let i = 0; i < z; i++) {
      const y = parseInt(myNit.charAt(i));
      x += y * vpri[z - i];
    }

    const y = x % 11;
    return (y > 1) ? 11 - y : y;
  }
  closeInvoiceViewModal() {
    this.modalController.dismiss(0);
  }

  Save() {
    try {

      if (this.addTerceroForm.invalid) {
        return;
      }

      this.loading = true;
      let taxresp = '';

      this.addTerceroForm.value.TaxResponsabilityID.forEach((a: any) => {
        taxresp += a + ';';
      });
      const currenacctDtls = this.addTerceroForm.get('ListCustomerGL') as FormArray;
      currenacctDtls.controls.forEach((e: any) => {
        e.controls.CompanyID.setValue(this.addTerceroForm.value.CompanyID);
        e.controls.CustomerID.setValue(Number(this.addTerceroForm.value.TerceroNum));
      });
      this.addTerceroForm.controls['TaxResponsabilityID'].setValue(taxresp.substring(0, taxresp.length - 1));
      this.addTerceroForm.controls['TypeID'].setValue(Number(this.addTerceroForm.value.TypeID));
      if (this.action === "create") {
        this.apiTerceroService.add(this.addTerceroForm.value).then(
          (resp_customer: any) => {
            this.loading = false;
            if (resp_customer.success) {
              this.nativeService.OnlyAlert('Notificación', resp_customer.message, 'success').then(() => {
                this.addTerceroForm = this.customerModule.getInitializedFormNoAsync();
                this.closeInvoiceViewModal();
              })
            } else {
              this.addTerceroForm.controls['TaxResponsabilityID'].setValue(['R-99-PN']);
              this.nativeService.OnlyAlert('Notificación', resp_customer.message, 'warning');
            }
          }).catch((err: any) => {
            this.loading = false;
            this.nativeService.OnlyAlert('Notificación', err, 'error');
          });
      } else if (this.action === "edit") {
        this.apiTerceroService.update((this.addTerceroForm.value).TerceroNum, this.addTerceroForm.value).then(
          (res: any) => {
            this.loading = false;
            this.nativeService.OnlyAlert('Notificación', res.message, 'success').then(() => {
              this.addTerceroForm = this.customerModule.getInitializedFormNoAsync();
              this.closeInvoiceViewModal()
            })
          }).catch((err: any) => {
            this.loading = false;
            this.nativeService.OnlyAlert('Notificación', err, 'error');
          });
      }
    } catch (error) {
      this.nativeService.OnlyAlert('Notificación', error, 'error');
    }
  }

  help() {
    this.nativeService.OnlyAlert('Notificación', "Si el cliente tiene mas responsabilidades fiscales, debe realizar el proceso desde ERP.", 'warning');
  }

}
