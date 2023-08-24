import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShowMessageService {

  constructor(
    private toasController: ToastController,
    private alertController: AlertController) { }

  async showToast(_message: string, _duration: number, _position: "top" | "bottom" | "middle") {
    const toast = await this.toasController.create({
      message: _message,
      duration: _duration,
      position: _position,
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  async showSimpleAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ["OK"]
    });
    alert.present();
    let result = await alert.onDidDismiss();
  }

  async showSimpleAlertIMG(title: string, message: string, path: string) {
    const alert = await this.alertController.create({
      header: title,
      message: `<div>
                <img src="${path}" alt="Image" />
                <p>${message}</p>
                </div> `,
      buttons: ["OK"]
    });
    alert.present();
    let result = await alert.onDidDismiss();
  }

  async showComfirmAlert(title: string, message: string) {
    let result = false;
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            result = false;
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            result = true;
          }
        }
      ]
    });
    alert.present();
    let result2 = await alert.onDidDismiss();
    return result;
  }

}
