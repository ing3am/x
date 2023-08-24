import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalService } from 'src/Services/Config/local.service';
import { TrandoctypeService } from 'src/Services/OldBack/trandoctype.service';
import { PosService } from 'src/Services/POS/pos.service';
import { LocalStService } from './../../../../Services/Config/local-st.service';

@Component({
  selector: 'app-config-tran-types',
  templateUrl: './config-tran-types.component.html',
  styleUrls: ['./config-tran-types.component.scss'],
})
export class ConfigTranTypesComponent implements OnInit {

  @Output() editDocTranType: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() TranDocTypeFormToSend: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  TranDocTypeForm: FormGroup;

  trandoctype: any[]=[];
  trandoctype2: any[]=[];
  trandoctype3: any[]=[];
  trandoctype4: any[]=[];
  loading: boolean = false;

  storeConfig:any[]=[];

  constructor(
    private localStorage: LocalService,
    private localservice: LocalStService,
    private apiTranDocTypeService: TrandoctypeService,
    private apiPosService: PosService
  ) { }

  ngOnInit() {
    this.TranDocTypeForm = new FormGroup({
      ConfigDocTypeId: new FormControl(0),
      CompanyID: new FormControl(this.localStorage.getJsonValue('CIA')),
      StoreId: new FormControl(Number(this.localStorage.getJsonValue('storeid'))),
      SalesDocumentType: new FormControl('', [Validators.required]),
      CashDocumentType: new FormControl('', [Validators.required]),
      CreditMemoDocumentType: new FormControl('', [Validators.required]),
      SalesDocumentTypeFE: new FormControl(''),
      Inactive: new FormControl(false),
      CreatedBy: new FormControl(this.localservice.getUser()),
      ModifiedBy: new FormControl(this.localservice.getUser()),
      CreatedAt: new FormControl(new Date),
      ModifyDate: new FormControl(new Date)
    });

    this.loadData();
    
    //Escucha si el formulario tiene cambios y los envia al padre
    this.TranDocTypeForm.valueChanges.subscribe(() => {
      this.TranDocTypeFormToSend.emit(this.TranDocTypeForm);
    });

  }

  async loadData() {
    try {
      const storeId = await this.localStorage.getJsonValue('storeid');
  
      const res = await this.apiTranDocTypeService.getByCompany(await this.localStorage.getJsonValue('CIA'));
      for (const element of res) {
        if (element.TranType === 'SP') {
          this.trandoctype.push(element);
        } else if (element.TranType === 'CE') {
          this.trandoctype2.push(element);
        } else if (element.TranType === 'CM' && !element.FactE) {
          this.trandoctype3.push(element);
        } else if (element.TranType === 'SA') {
          this.trandoctype4.push(element);
        }
      }
  
      const docTypeRes : any = await this.apiPosService.getDocTypeByID(storeId);
      if (docTypeRes.result != null) {
        this.editDocTranType.emit(true);
        this.storeConfig.push({ value: 'DocType', res: docTypeRes.result });
        this.TranDocTypeForm.patchValue(docTypeRes.result);
      }
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }

  get g() { return this.TranDocTypeForm.controls; }

}
