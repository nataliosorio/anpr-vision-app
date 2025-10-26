import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async showToast(message: string, duration = 2000, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  async showAlert(message: string, header: string = '¡Ups!') {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  async presentLoading(message = 'Cargando...') {
    const loader = await this.loadingCtrl.create({
      message,
      spinner: 'crescent'
    });
    await loader.present();
    return loader;
  }
}
