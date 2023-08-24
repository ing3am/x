import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LocalService } from 'src/Services/Config/local.service';
import { TrandoctypeService } from 'src/Services/OldBack/trandoctype.service';
import { PosService } from 'src/Services/POS/pos.service';

@Component({
  selector: 'app-select-tran-doc-type',
  templateUrl: './select-tran-doc-type.component.html',
  styleUrls: ['./select-tran-doc-type.component.scss'],
})
export class SelectTranDocTypeComponent implements OnInit {

  @Input() title = "";
  @Input() TranDocTypeID = "";

  loading: boolean = false;
  Form: FormGroup;
  listTranDocType: any[];
  trandoctype: any[] = [];
  storeConfig: any[] = [];

  constructor(
    private modalController: ModalController,
    private apiPosService: PosService,
    private trandoctypeService: TrandoctypeService,
    private localStorage: LocalService,
  ) { }

  async ngOnInit() {

    this.loading = true;

    this.Form = new FormGroup({
      TranDocTypeID: new FormControl(this.TranDocTypeID, Validators.required)
    });

    await this.trandoctypeService.getByCompany(
      await this.localStorage.getJsonValue('CIA'))
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

    await this.apiPosService.getDocTypeByID(await this.localStorage.getJsonValue('storeid'))
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

  closeModal() {
    this.modalController.dismiss({ res: true, message: "Proceso éxitoso.", data: this.Form.controls['TranDocTypeID'].value });
  }


  dismiss() {
    this.modalController.dismiss({ res: false, message: "Proceso cancelado." });
  }

}
