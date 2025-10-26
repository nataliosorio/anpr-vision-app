import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { home } from 'ionicons/icons';
import { HomePage } from '../home/home.page';
import { VehiclePage } from '../../vehicle/vehicle.page';

@Component({
  selector: 'app-my-vehicle',
  templateUrl: './my-vehicle.page.html',
  styleUrls: ['./my-vehicle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, VehiclePage]
})
export class MyVehiclePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
