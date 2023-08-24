import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { PaymethodService } from 'src/Services/OldBack/paymethod.service';
import { PosService } from 'src/Services/POS/pos.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';

@Component({
  selector: 'app-config-printers',
  templateUrl: './config-printers.component.html',
  styleUrls: ['./config-printers.component.scss'],
})
export class ConfigPrintersComponent implements OnInit {

  loading: boolean = false;
  @Output() editPrinter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() printFormFormToSend: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  printForm: FormGroup;

  storeConfig:any[]=[];

  constructor(
    private loadCombos: LoadStaticCombosService,
    private apiPosService: PosService,
    private localStorage: LocalService,
    private localservice: LocalStService,
    private paymethodService: PaymethodService
  ) { }

  ngOnInit() {
    this.printForm = new FormGroup({
      ConfigPrinterId: new FormControl(0),
      CompanyID: new FormControl(this.localStorage.getJsonValue('CIA')),
      StoreId: new FormControl(Number(this.localStorage.getJsonValue('storeid'))),
      PrintLogo: new FormControl(false),
      PrintText1: new FormControl(false),
      Text1: new FormControl(),
      PrintText2: new FormControl(false),
      Text2: new FormControl(),
      Inactive: new FormControl(false),
      CreatedBy: new FormControl(this.localservice.getUser()),
      ModifiedBy: new FormControl(this.localservice.getUser()),
      CreatedAt: new FormControl(new Date),
      ModifyDate: new FormControl(new Date),
      PrintBluetooth: new FormControl(false)
    });

    this.loadData();

    //Escucha si el formulario tiene cambios y los envia al padre
    this.printForm.valueChanges.subscribe(() => {
      this.printFormFormToSend.emit(this.printForm);
    });

  }

  get l() { return this.printForm.controls; }

  async loadData() {
    try {

      const storeId = await this.localStorage.getJsonValue('storeid');
      
      this.apiPosService.getPrinterID(storeId)
      .then((res: any) => {
        if (res.result != null) {
          this.editPrinter.emit(true);
          this.printForm.patchValue(res.result);
        }
        this.loading = false;
      })
      .catch((error: any) => {
        this.loading = false;
        console.log(error);
      })
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

}
