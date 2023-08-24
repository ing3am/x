import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { LocalService } from 'src/Services/Config/local.service';
import { TrandoctypeService } from 'src/Services/OldBack/trandoctype.service';
import { PosService } from 'src/Services/POS/pos.service';

@Component({
  selector: 'app-tran-doc-type-popup',
  templateUrl: './tran-doc-type-popup.page.html',
  styleUrls: ['./tran-doc-type-popup.page.scss'],
})
export class TranDocTypePopupPage implements OnInit {

  loading: boolean = false;
  Form: FormGroup;
  tranDocType: any;
  listTranDocType: any[];
  trandoctype: any[] = [];
  storeConfig: any[] = [];
  storeid: any;

  constructor(
    private modalActive: ModalController,
    private apiPosService: PosService,
    private trandoctypeService: TrandoctypeService,
    private localStorage: LocalService,
    private navParams: NavParams
  ) { }

  async ngOnInit() {
    this.storeid = this.navParams.get('storeid');
    this.tranDocType = this.navParams.get('tranDocType');
    this.loading = true;

    this.Form = new FormGroup({
      TranDocTypeID: new FormControl(this.tranDocType, Validators.required)
    });
    let cia = await this.localStorage.getJsonValue('CIA')

    await this.trandoctypeService.getByCompany(cia)
      .then((res: any) => {
        if (res !== null) {       
          res.forEach(a => {
            if (!a.Inactive) {
              if (a.TranType === 'SP')
                this.trandoctype.push(a);
              if (a.TranType === 'SA')
                this.trandoctype.push(a);
              else {
                this.trandoctype.push(a);
              }
            }
          });
          this.loading = false;
        }
      })
      .catch();

    await this.apiPosService.getDocTypeByID(this.storeid)
      .then((res: any) => {
        if (res.result != null) {
          this.storeConfig.push({ value: 'DocType', res: res.result });

          let docType;
          let docTypeFe;
          this.storeConfig.forEach(a => {
            if (a.value === 'DocType') {
              docType = a.res.SalesDocumentType;
              docTypeFe = a.res.SalesDocumentTypeFE;
            } 
          });

          this.listTranDocType = [];
          this.trandoctype.forEach(tranType => {
            if (tranType.TranDocTypeID == docType || tranType.TranDocTypeID == docTypeFe) {
              this.listTranDocType.push(tranType);
            }
          });
        }
      })
      .catch((error: any) => {
        this.loading = false;
        console.log(error);
      })
  }

  get f() { return this.Form.controls; }

  handSuccessfullSave() {
    this.modalActive.dismiss({ res: true, message: "Proceso éxitoso.", data: this.Form.controls['TranDocTypeID'].value });
  }

  dismiss() {
    this.modalActive.dismiss({ res: false, message: "Proceso cancelado." });
  }
}
