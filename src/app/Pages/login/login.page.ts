import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/Services/api.service';
import { LocalStService } from 'src/Services/Config/local-st.service';
import { LocalService } from 'src/Services/Config/local.service';
import { User } from 'src/theme/shared/Models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { UserStoreService } from 'src/Services/POS/user-store.service';
import { StoresService } from 'src/Services/POS/stores.service';
import { CashRegisterService } from 'src/Services/POS/cash-register.service';
import { ShowMessageService } from 'src/Services/Shared/show-message.service';
import { UserSecurityService } from 'src/Services/OldBack/user-security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  public loading: boolean = false;

  public companysbyuser: any[];
  public storesbycompany: any[];
  public cashrbycompany: any[];
  storeidpublic = 0;
  companyidpublic = 0;

  constructor(
    private router: Router,
    private service: ApiService,
    private localStorage: LocalService,
    private usersecurity: UserSecurityService,
    private userStoreService: UserStoreService,
    private storesService: StoresService,
    private localstservice: LocalStService,
    private domSanitizer: DomSanitizer,
    private modalController: ModalController,
    private cashRegisterService: CashRegisterService,
    private showMessageService: ShowMessageService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  get f() { return this.loginForm.controls; }

  async logins() {
    if (this.loginForm.value.email === '' && this.loginForm.value.password === '') {
      this.showMessageService.showSimpleAlert("Notificación", "Debe ingresar un usuario y una contraseña");
      return;
    }

    this.localstservice.doLogout();
    this.loading = true;

    try {
      const res = await this.service.AskForToken(this.loginForm.value);
      await this.loadsession(res['AccessToken']);
    } catch (error) {

      if (error.error && error.error.Message === "No se encontro un token valido.") {
        console.log(error)
        try {
          const res = await this.service.token(this.loginForm.value);
          let saveToken = res;
          const saveTokenRes = await this.service.SaveToken(res, this.loginForm.value);
          if (saveTokenRes === "Proceso exitoso!") {
            await this.loadsession(saveToken['access_token']);
          }
        } catch (error) {
          this.showMessageService.showSimpleAlert("Notificación", error.error ? error.error.Message : error);
        }
      } else {
        this.showMessageService.showSimpleAlert("Notificación", error.error ? error.error.Message : error);
      }
    } finally {
      this.loading = false;
    }
  }

  async loadsession(token) {
    try {
      this.localstservice.setToken(token);

      const userData = await this.service.getUserData(this.loginForm.value);
      const user_response: User = userData;
      this.localStorage.setJsonValue('userID', user_response.UserID);
      this.localStorage.setJsonValue('CIAM', userData.CompanyMasterID);
      this.localStorage.setJsonValue('user', user_response.EMailAddress);

      const res = await this.service.getCompaniesByUser(await this.localStorage.getJsonValue('CIAM'), await this.localStorage.getJsonValue('userID'));

      if (res[0].Logo !== null) {
        let picture = this.domSanitizer.bypassSecurityTrustHtml(res[0].Logo);
        let logoCompany = 'data:image/png;base64,' + picture['changingThisBreaksApplicationSecurity'].toString();
        this.localStorage.setJsonValue('logo', logoCompany);
      }

      this.localstservice.storageCompaniesByUser(res);
      this.companysbyuser = res;

      if (this.companysbyuser.length === 0) {
        this.loading = false;
        this.showMessageService.showSimpleAlert("Notificación", 'No tiene ninguna empresa asociada');
        return;
      } else if (this.companysbyuser.length > 1) {
        if (this.companyidpublic > 0) {
          this.localstservice.setSelectedCIA(this.companyidpublic);
          this.getByCompanyLogin(this.companyidpublic);
        } else {
          this.openMyModal('selectCompany');
        }
      } else {
        this.localstservice.setSelectedCIA(this.companysbyuser[0].CompanyID);

        const res1 = await this.userStoreService.getByCompany();
        if (res1.success) {
          if (res1.result.length === 0) {
            this.showMessageService.showSimpleAlert("Notificación", 'No tienes acceso a la tienda');
            this.loading = false;
            return;
          }
          const id = this.storeidpublic == 0 ? res1.result[0].StoreId : this.storeidpublic;
          this.getByCompanyLogin(await this.localStorage.getJsonValue('CIA'), id);
        } else {
          this.showMessageService.showSimpleAlert("Notificación", res1.message);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      this.showMessageService.showSimpleAlert("Notificación", error);
    }
  }

  async getByCompanyLogin(companyid, storeid?, resallow?) {
    try {
      const res = await this.storesService.getByCompanyLogin(companyid);
      this.storesbycompany = res.result;
      this.loading = false;

      if (this.storesbycompany.length === 0) {
        this.showMessageService.showSimpleAlert("Notificación", "No tiene ninguna tienda asociada");
        return;
      }

      if (this.storesbycompany.length > 1) {
        if (this.storeidpublic > 0) {
          this.ValidateExists(this.storeidpublic);
        } else {
          this.openMyModal('selectStore');
        }
      } else {
        if (storeid !== undefined && resallow !== undefined) {
          this.ValidateExists(storeid);
        } else {
          this.ValidateExists(this.storesbycompany[0].StoreId);
        }
      }
    } catch (error) {
      this.loading = false;
      const errorMessage = error.status === 401 ? error.error : error.error.Message;
      this.showMessageService.showSimpleAlert("Notificación", errorMessage);
      return;
    }
  }

  async openMyModal(modalid) {

    var dataSendModal;
    var title;

    switch (modalid) {
      case 'selectCompany':
        dataSendModal = this.companysbyuser;
        title = "SELECCIONE UNA EMPRESA";
        break;
      case 'selectStore':
        dataSendModal = this.storesbycompany;
        title = "SELECCIONE UNA TIENDA";
        break;
      case 'selectCashR':
        dataSendModal = this.cashrbycompany;
        title = "SELECCIONE UNA CAJA";
        break;

      default:
        break;
    }

    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        title: title,
        items: dataSendModal,
        modalid: modalid
      },
      cssClass: 'LoginModalModalid',
    });

    modal.onDidDismiss().then(async (data) => {
      this.loading = false;
      if (data.data && data.data.data && data.data.role === 'selected') {
        switch (data.data.modalid) {
          case 'selectCompany':
            this.localstservice.setSelectedCIA(data.data.data.CompanyID);
            this.localStorage.setJsonValue('CompanyName', data.data.data.Name);
            this.getByCompanyLogin(data.data.data.CompanyID);
            break;
          case 'selectStore':
            this.ValidateExists(data.data.data.StoreId);
            break;
          case 'selectCashR':
            if (data.data.data.CashRegisterID !== 0) {
              this.localStorage.setJsonValue('cashRegisterID', data.data.data.CashRegisterID);
              this.localStorage.setJsonValue('isManager', true);
              this.usersecurity
                .getUserSecurityByCompanyByID(await this.localstservice.getUserID())
                .then((resUserS: any) => {
                  this.loading = false;
                  this.localStorage.setJsonValue('allow', JSON.stringify(resUserS));
                  sessionStorage.setItem('NeedTask', 'false');
                  this.router.navigateByUrl("/app/home");
                })
                .catch((error: any) => {
                  this.loading = false;
                  this.showMessageService.showSimpleAlert("Notificación", error.error.Message);
                });
            }
            break;
        }
      }
      else {
        this.localstservice.deleteToken();
      }
    });

    await modal.present();
  }

  async ValidateExists(id) {
    this.localStorage.setJsonValue('storeid', id);

    try {
      const store = this.storesbycompany.find(element => element.StoreId === id);

      if (store) {
        this.localStorage.setJsonValue('StoreName', store.Name);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const res = await this.cashRegisterService.getValidateExists();

      if (!res.success) {
        if (res.result === null) {
          this.showMessageService.showSimpleAlert("Notificación", res.Message);
          this.companyidpublic = 0;
          this.storeidpublic = 0;
        } else {
          this.cashrbycompany = res.result;
          this.openMyModal('selectCashR');
        }
      } else {
        this.localStorage.setJsonValue('cashRegisterID', res.result.CashRegisterID);
        const resUserS = await this.usersecurity.getUserSecurityByCompanyByID(await this.localstservice.getUserID());
        this.loading = false;
        this.localStorage.setJsonValue('allow', JSON.stringify(resUserS));
        sessionStorage.setItem('NeedTask', 'false');
        this.router.navigateByUrl("/app/home");
      }
    } catch (error) {
      this.loading = false;
      console.error(error);
    }
  }
}
