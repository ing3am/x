import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LocalService } from 'src/Services/Config/local.service';
import { PosService } from 'src/Services/POS/pos.service';
import { LoadStaticCombosService } from 'src/Services/Shared/load-static-combos.service';

@Component({
  selector: 'app-config-store',
  templateUrl: './config-store.component.html',
  styleUrls: ['./config-store.component.scss'],
})
export class ConfigStoreComponent implements OnInit {

  @Output() StoreFormToSend: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  StoreForm: FormGroup;

  loading: boolean = false;

  countries = this.loadCombos.getCountries();
  states = this.loadCombos.getStates('');
  cities = this.loadCombos.getCities('');

  //
  constructor(
    private loadCombos: LoadStaticCombosService,
    private localStorage: LocalService,
    private apiPosService: PosService) {
  }


  async ngOnInit(): Promise<void> {
    try {

      this.StoreForm = new FormGroup({
        StoreId: new FormControl(0),
        StoreCode: new FormControl({ value: '', disabled: true }),
        Name: new FormControl(),
        CompanyID: new FormControl(),
        CountryID: new FormControl(),
        StateID: new FormControl(),
        CityID: new FormControl(),
        Address: new FormControl(),
        PhoneNum: new FormControl(),
        EMailAddress: new FormControl(),
        Users: new FormControl(),
        PriceAfterTax: new FormControl(false),
        ShowImgItem: new FormControl(false)
      });

      this.loadData();

      // Escucha si el formulario tiene cambios y los envía al padre
      this.StoreForm.valueChanges.subscribe(() => {
        this.StoreFormToSend.emit(this.StoreForm);
      });

      this.StoreForm.controls['CountryID'].valueChanges.subscribe(async checked => {
        if (checked) {
          this.states = this.loadCombos.getStates(checked);
          this.cities = this.loadCombos.getCities('');
        }
        this.StoreForm.updateValueAndValidity();
      });

      this.StoreForm.controls['StateID'].valueChanges.subscribe(checked => {
        if (checked) {
          this.cities = this.loadCombos.getCities(checked);
        }
        this.StoreForm.updateValueAndValidity();
      });
    } catch (error) {
      console.log(error);
    }
  }

  async loadData() {
    try {
      const storeid = await this.localStorage.getJsonValue('storeid');
      if (storeid) {
        this.loading = true;
        const res: any = await this.apiPosService.getByID(storeid);
        this.StoreForm.patchValue(res.result);
        this.loading = false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  get f() { return this.StoreForm.controls }

}
