import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { ArcashreceiptsService } from 'src/Services/OldBack/arcashreceipts.service';

@Component({
  selector: 'app-void-invoice',
  templateUrl: './void-invoice.component.html',
  styleUrls: ['./void-invoice.component.scss'],
})
export class VoidInvoiceComponent implements OnInit {

  @Input() title = "";
  @Input() invoice: any;

  loading: boolean = false;
  crCancelationForm: FormGroup;

  constructor(
    private localService: LocalStService,
    private apiDatePipe: DatePipe,
    private localStorage: LocalService,
    private apiArcashreceiptsService: ArcashreceiptsService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.crCancelationForm = new FormGroup({
      CashReceiptNum: new FormControl(this.invoice.LegalNumber),
      CancellationDate: new FormControl(this.apiDatePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'), Validators.required),
      CancellationComments: new FormControl('', Validators.required),
      User: new FormControl(''),
      FromPOS: new FormControl(true),
      StoreId: new FormControl('')
    });
  }

  async ionViewDidEnter() {
    this.crCancelationForm.controls['User'].setValue(await this.localService.getUser());
    this.crCancelationForm.controls['StoreId'].setValue(await this.localStorage.getJsonValue('storeid'));
  }

  async cancel() {
    if (this.crCancelationForm.invalid) {
      return;
    }

    this.apiArcashreceiptsService.cancele(this.crCancelationForm.value)
      .then((res: any) => {
        this.modalController.dismiss({
          response: res
        });
      })
      .catch((error: any) => {
        this.modalController.dismiss({ error: error.error.Message });
      });
  }

}
