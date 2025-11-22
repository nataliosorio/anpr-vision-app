import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  carSportOutline,
  colorPaletteOutline,
  timeOutline,
  locationOutline,
  calendarOutline,
  personOutline,
  cashOutline,
  checkmarkCircleOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { VehicleService } from '../services/vehicle.service';
import { VehicleWithStatusDto } from '../models/vehicle.model';
import { DashboardService } from '../../home/services/dashboard.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.page.html',
  styleUrls: ['./vehicle-details.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    FormsModule
  ]
})
export class VehicleDetailsPage implements OnInit {

  vehicleId!: number;
  vehicle: VehicleWithStatusDto | null = null;
  parkingInfo: any = null;
  loading = true;
  error: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private dashboardService = inject(DashboardService);

  constructor() {
    addIcons({
      arrowBackOutline,
      carSportOutline,
      colorPaletteOutline,
      timeOutline,
      locationOutline,
      calendarOutline,
      personOutline,
      cashOutline,
      checkmarkCircleOutline,
      closeCircleOutline
    });
  }

  ngOnInit() {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.vehicleId) {
      this.loadVehicleDetails();
      this.loadParkingInfo();
    } else {
      this.error = 'ID de vehículo no válido';
      this.loading = false;
    }
  }

  private loadVehicleDetails() {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      this.error = 'Usuario no autenticado';
      this.loading = false;
      return;
    }

    const clientId = parseInt(userIdStr, 10);
    this.vehicleService.getVehiclesWithStatusByClientId(clientId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Buscar el vehículo específico por ID
          this.vehicle = response.data.find(v => v.id === this.vehicleId) || null;
          if (!this.vehicle) {
            this.error = 'Vehículo no encontrado';
          }
        } else {
          this.error = 'Error al cargar datos del vehículo';
        }
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading vehicle details:', err);
        this.error = 'Error al cargar detalles del vehículo';
        this.loading = false;
      }
    });
  }

  private loadParkingInfo() {
    // Obtener parkingId de localStorage
    const parkingIdStr = localStorage.getItem('parkingId');
    if (parkingIdStr) {
      const parkingId = parseInt(parkingIdStr, 10);
      this.dashboardService.getParkingInfo(parkingId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.parkingInfo = response.data;
          }
        },
        error: (err: Error) => {
          console.error('Error loading parking info:', err);
          // No mostrar error, solo continuar sin info del parqueadero
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
