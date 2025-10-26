import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { BarChartComponent } from 'src/app/components/bar-chart/bar-chart.component';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule,BarChartComponent]
})
export class DashboardPage implements OnInit {

  constructor(private toastController: ToastController) { }



  ngOnInit() {
  }


  async mostrarNotificacion() {
  const toast = await this.toastController.create({
    message: '¡Nuevo pedido recibido!',
    duration: 3000,
    color: 'success',
    position: 'top',
    icon: 'notifications'
  });

  await toast.present();
}
}
