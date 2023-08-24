import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { WarehseBinService } from 'src/Services/OldBack/warehse-bin.service';
import { PosService } from 'src/Services/POS/pos.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';

@Component({
  selector: 'app-config-invetaries',
  templateUrl: './config-invetaries.component.html',
  styleUrls: ['./config-invetaries.component.scss'],
})
export class ConfigInvetariesComponent implements OnInit {

  loading: boolean = false;
  @Output() editInventory: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() InventoryFormToSend: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  InventoryForm: FormGroup;

  storeConfig:any[]=[];

  warehousesbin: any[];
  warehouses: any[] = this.loadCombos.getWarehouses();

  constructor(
    private loadCombos: LoadStaticCombosService,
    private localStorage: LocalService,
    private localservice: LocalStService,
    private apiPosService: PosService,
    private apiItemwhsebinservice: WarehseBinService
  ) { }

 ngOnInit() {

    this.InventoryForm = new FormGroup({
      ConfigInventoryId: new FormControl(0),
      CompanyID: new FormControl(this.localStorage.getJsonValue('CIA')),
      StoreId: new FormControl(Number(this.localStorage.getJsonValue('storeid'))),
      ShowItemsWithoutInventory: new FormControl(false),
      Warehousecode: new FormControl('', [Validators.required]),
      Warehsebincode: new FormControl(''),
      Inactive: new FormControl(false),
      CreatedBy: new FormControl(this.localservice.getUser()),
      ModifiedBy: new FormControl(this.localservice.getUser()),
      CreatedAt: new FormControl(new Date),
      ModifyDate: new FormControl(new Date)
    });

    this.loadData();

    //Escucha si el formulario tiene cambios y los envia al padre
    this.InventoryForm.valueChanges.subscribe(() => {
      this.InventoryFormToSend.emit(this.InventoryForm);
    });

  }

  get h() { return this.InventoryForm.controls }

  async loadData() {
    try {
      const storeId = await this.localStorage.getJsonValue('storeid');
      const res: any = await this.apiPosService.getInventoryByID(storeId);
  
      if (res.result != null) {

        if (res.result.Warehousecode != null) {
          const warehouseBinsRes = await this.apiItemwhsebinservice.getByCompany(res.result.Warehousecode);
          this.warehousesbin = warehouseBinsRes.result;
        }

        this.editInventory.emit(true);
        this.InventoryForm.patchValue(res.result);
      }
  
      this.loading = false;
    } catch (error) {
      this.loading = false;
      console.log(error);
    }
  }
  

  
  selectedWhseCode(event) {
    this.apiItemwhsebinservice.getByCompany(event.target.value)
      .then((res: any) => {
        this.warehousesbin = res.result;
      })
      .catch(console.log);
  }

}
