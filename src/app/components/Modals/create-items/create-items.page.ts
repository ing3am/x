import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { LedgerConceptService } from 'src/Services/Ledger/ledger-concept.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';
import { NativeService } from 'src/Services/Shared/native.service';

@Component({
  selector: 'app-create-items',
  templateUrl: './create-items.page.html',
  styleUrls: ['./create-items.page.scss'],
})
export class CreateItemsPage implements OnInit {

  public storeConfig: any[] = [];

  imageFile: { link: string, file: any, name: string };

  addItemForm: FormGroup;
  itemwhseForm: FormArray;
  taxdtls: FormArray;
  addAdjustForm: FormGroup;
  addItemAsjust: FormArray;


  selected = new FormControl(0);
  optionsMask: any;
  formatDecimal: any;
  submitted = false;
  serverErrorMessages: string;
  SecurityForms: any;

  loading: boolean = false;

  noshowPictury: boolean = true;

  uoms: any[] = this.loadCombos.getUOM();

  constructor(
    private localStorage: LocalService,
    private loadCombos: LoadStaticCombosService,
    private router: Router,
    private localstservice: LocalStService,
    public ledgerConcept: LedgerConceptService,
    public modalController: ModalController,
    private apiDatePipe: DatePipe,
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
  }

  ngOnInit() {
    this.addItemForm = new FormGroup({
      CompanyID: new FormControl(this.localstservice.getSelectedCia()),
      ItemID: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      ItemDescription: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      StoresID: new FormControl(this.localStorage.getJsonValue('storeid') == null ? null : this.localStorage.getJsonValue('storeid')),
      GroupCode: new FormControl(0),
      FamilyCode: new FormControl(''),
      UOMCode: new FormControl('', Validators.required),
      IsInventoryable: new FormControl(0),
      Quantity: new FormControl(0),
      Cost: new FormControl(0),
      SalePrice: new FormControl(0),
      Tax: new FormControl(0),
      Picture: new FormControl(''),
      BarCode: new FormControl(''),
      GLTransactionID: new FormControl(''),
      GLAccountingCode: new FormControl(''),

      taxdtls: new FormArray([]),
      ItemGLs: new FormArray([]),
      itemwhseForm: new FormArray([])
    })

    console.log(this.uoms);
  }

  get f() { return this.addItemForm.controls; }

  async Save() {

  }

  readItemPicture(e) {
    try {
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      var pattern = /image-*/;
      var reader = new FileReader();
      if (!file.type.match(pattern)) {
        this.nativeService.OnlyAlert('Información', 'El formato seleccionado es invalido.', 'info');
        return;
      }
      //ARCHIVO DE 2MB
      if (file.size > 250000) {
        this.nativeService.OnlyAlert('Notificación', 'La imagen seleccionada supera el tamaño maximo permitido [2 MB].', 'warning');
        return;
      }

      reader.onload = this._readItemPictureLoaded.bind(this);
      reader.readAsDataURL(file);
    } catch (error) {
      console.log('readItemPicture', error);
    }

  }

  _readItemPictureLoaded(e) {
    try {
      let reader = e.target;
      this.addItemForm.controls['Picture'].setValue(reader.result);
    } catch (error) {
      console.log('_readItemPictureLoaded', error);
    }
  }

  closeInvoiceViewModal() {
    this.modalController.dismiss(0);
  }

}
