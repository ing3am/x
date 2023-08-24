import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LocalService } from 'src/Services/Config/local.service';
import { TaxresponsabilityService } from "../../../Services/OldBack/taxresponsability.service";

@Injectable({
    providedIn: 'root'
})

export class CustomerFormModels {

    addTerceroForm: FormGroup;

    constructor(
        private taxResponsabilitiesService : TaxresponsabilityService,
        private localStorage : LocalService,
        private formBuilder: FormBuilder,
    ) {        
    }   
    
    getInitializedFormNoAsync(){
        this.addTerceroForm = new FormGroup({
            TerceroID: new FormControl(0),
            CompanyID: new FormControl(''),
            TerceroNum: new FormControl('', [Validators.required,Validators.maxLength(10)]),
            IsCustomer: new FormControl(true),
            IsSupplier: new FormControl(false),
            IsEmployee: new FormControl(false),
            TypeID: new FormControl('', [Validators.required,Validators.min(1)]),
            TypeIDDesc: new FormControl(''),
            CheckDigit: new FormControl(0),
            FirstName: new FormControl(''),
            AnotherName: new FormControl(''),
            FirstLastName: new FormControl(''),
            SecondLastName: new FormControl(''),
            BusinessName: new FormControl(''),
            FiscalName: new FormControl(''),
            CIIUCode: new FormControl(''),
            TaxResponsabilityID: new FormControl(['R-99-PN']),
            TermID: new FormControl('CONT'),
            TermID_2: new FormControl(''),
            PayMethodID: new FormControl('EFEC'),
            PayMethodID_2: new FormControl(''),
            TaxApply: new FormControl(''),
            CountryID: new FormControl('',Validators.required),
            StateID: new FormControl('',Validators.required),
            CityID: new FormControl('',Validators.required),
            Address: new FormControl('', Validators.maxLength(100)),
            PhoneNum: new FormControl('', Validators.maxLength(50)),
            RegimeTypeID: new FormControl(''),
            PaymentMeansCode_c: new FormControl('1',Validators.required),
            PaymentMeansID_c: new FormControl(1,Validators.required),
            EMailAddress: new FormControl("",[Validators.required,Validators.maxLength(100), Validators.email]),
            EMailAddress2: new FormControl('', [Validators.maxLength(100), Validators.email]),
            EMailAddress3: new FormControl('', [Validators.maxLength(100), Validators.email]),
            EMailAddress4: new FormControl('', [Validators.maxLength(100), Validators.email]),
            ShipToAddress:new FormControl('', Validators.maxLength(100)),
            CreatedBy: new FormControl(''),
            ModifiedBy : new FormControl(''),
            CreatedAt : new FormControl(new Date),
            ListCustomerGL:this.formBuilder.array([]),
            });
        return (this.addTerceroForm)  
    }
    getInitializedForm(){
        const promise = new Promise(async (resolve, reject) => {
            try {
                let company:any[]=[];
                this.localStorage.getJsonValue('companies').then((_companies : any)=>{
                    JSON.parse(_companies).forEach(a => {
                        company.push(a);
                    });
                    this.addTerceroForm = new FormGroup({
                        TerceroID: new FormControl(0),
                        CompanyID: new FormControl(company[0].CompanyID),
                        TerceroNum: new FormControl('', [Validators.required,Validators.maxLength(10)]),
                        IsCustomer: new FormControl(true),
                        IsSupplier: new FormControl(false),
                        IsEmployee: new FormControl(false),
                        TypeID: new FormControl('', [Validators.required,Validators.min(1)]),
                        CheckDigit: new FormControl(0),
                        FirstName: new FormControl(''),
                        AnotherName: new FormControl(''),
                        FirstLastName: new FormControl(''),
                        SecondLastName: new FormControl(''),
                        BusinessName: new FormControl(''),
                        FiscalName: new FormControl(''),
                        CIIUCode: new FormControl(''),
                        TaxResponsabilityID: new FormControl(['R-99-PN']),
                        TermID: new FormControl('CONT'),
                        TermID_2: new FormControl(''),
                        PayMethodID: new FormControl('EFEC'),
                        PayMethodID_2: new FormControl(''),
                        TaxApply: new FormControl(''),
                        CountryID: new FormControl(company[0].CountryID,Validators.required),
                        StateID: new FormControl(company[0].StateID,Validators.required),
                        CityID: new FormControl(company[0].CityID,Validators.required),
                        Address: new FormControl('', Validators.maxLength(100)),
                        PhoneNum: new FormControl('', Validators.maxLength(50)),
                        RegimeTypeID: new FormControl(''),
                        PaymentMeansCode_c: new FormControl('1',Validators.required),
                        PaymentMeansID_c: new FormControl(1,Validators.required),
                        EMailAddress: new FormControl(company[0].EmailFE ?? company[0].EMailAddress, [Validators.required,Validators.maxLength(100), Validators.email]),
                        EMailAddress2: new FormControl('', [Validators.maxLength(100), Validators.email]),
                        EMailAddress3: new FormControl('', [Validators.maxLength(100), Validators.email]),
                        EMailAddress4: new FormControl('', [Validators.maxLength(100), Validators.email]),
                        ShipToAddress:new FormControl('', Validators.maxLength(100)),
                        CreatedBy: new FormControl(''),
                        ModifiedBy : new FormControl(''),
                        CreatedAt : new FormControl(new Date),
                        ListCustomerGL: new FormArray([]),
                        });

                    resolve(this.addTerceroForm)    
                })
            } catch (error) {
                reject(error);
            }
        });
        return promise;

    }
    
}