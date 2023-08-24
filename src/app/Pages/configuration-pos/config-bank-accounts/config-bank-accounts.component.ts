import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { PaymethodService } from 'src/Services/OldBack/paymethod.service';
import { PosService } from 'src/Services/POS/pos.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';

@Component({
  selector: 'app-config-bank-accounts',
  templateUrl: './config-bank-accounts.component.html',
  styleUrls: ['./config-bank-accounts.component.scss'],
})
export class ConfigBankAccountsComponent implements OnInit {

  loading: boolean = false;
  @Output() editBanks: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() BanksFormToSend: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  BanksForm: FormGroup;

  storeConfig:any[]=[];
  
  cashequivalent = this.loadCombos.getCashEquivalent()

  constructor(
    private loadCombos: LoadStaticCombosService,
    private apiPosService: PosService,
    private localStorage: LocalService,
    private localservice: LocalStService,
    private paymethodService: PaymethodService
  ) { }

  async ngOnInit() {
    this.BanksForm = new FormGroup({
      ConfigBanksId: new FormControl(0),
      CompanyID: new FormControl(this.localStorage.getJsonValue('CIA')),
      StoreId: new FormControl(Number(this.localStorage.getJsonValue('storeid'))),
      CreditCard: new FormControl('', [Validators.required]),
      DebitCard: new FormControl('', [Validators.required]),
      Transfer: new FormControl('', [Validators.required]),
      Cash: new FormControl('', [Validators.required]),
      PayMethodID : new FormControl(''),
      CashEquivalentId : new FormControl(0),
      banksdtls:new FormArray([]),
      Inactive: new FormControl(false),
      CreatedBy: new FormControl(this.localservice.getUser()),
      ModifiedBy: new FormControl(this.localservice.getUser()),
      CreatedAt: new FormControl(new Date),
      ModifyDate: new FormControl(new Date)
    });

    this.paymethodService.getByCompanyAll(
      await this.localStorage.getJsonValue('CIA'))
      .then((res: any) => {
        if (res !== null) {
          res.forEach(a => {
            if(!a.Inactive){
                this.arrayPaymentLine.push(new FormGroup({
                  PayMethodID : new FormControl(a.PayMethodID),
                  PayMethodDescription : new FormControl(a.PayMethodDescription),
                  CashEquivalentId : new FormControl(0, Validators.required),
                }));
            }
          });
        }
      })
      .catch((error: any) => {
        console.error(error);
      });

    this.loadData();

    //Escucha si el formulario tiene cambios y los envia al padre
    this.BanksForm.valueChanges.subscribe(() => {
      this.BanksFormToSend.emit(this.BanksForm);
    });

  }

  get k() { return this.BanksForm.controls }
  get m() { return this.BanksForm.controls.banksdtls['controls']; }

  async loadData() {
    try {

      const storeId = await this.localStorage.getJsonValue('storeid');
      
      this.apiPosService.getBanksByID(storeId)
      .then((res: any) => {
        if (res.result != null) {
          this.editBanks.emit(true);
          this.storeConfig.push({value:'Banks', res:res.result});
          let result = res.result;
  
          result.forEach((a: any) => {
            this.arrayPaymentLine.controls.forEach((b: any) => {
              if (a.PayMethodID === b.get('PayMethodID').value) {
                b.get('CashEquivalentId').setValue(a.CashEquivalentId);
              }
            });
          });
          this.BanksForm.patchValue(res.result[0]);
        }
      })
      .catch((error: any) => {
        this.loading = false;
        console.log(error);
      });
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  get arrayPaymentLine() {
    return this.BanksForm.get("banksdtls") as FormArray;
  }

}
