import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar, IonIcon, IonText, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carSportOutline, locationOutline, statsChartOutline, checkmarkCircleOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { DashboardService, OccupancyData, ParkingData } from '../../services/dashboard.service';

@Component({
  selector: 'app-mini-dashboard',
  templateUrl: './mini-dashboard.component.html',
  styleUrls: ['./mini-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar, IonIcon, IonText, IonButton]
})
export class MiniDashboardComponent implements OnInit {

  @Input() parkingIds: number[] = [];
  @Input() parkingId: number | null = null; // Mantener para compatibilidad

  occupancyData: OccupancyData | null = null;
  parkingData: ParkingData | null = null;
  loading = true;
  error: string | null = null;

  // Estado del carrusel
  currentParkingIndex: number = 0;
  get currentParkingId(): number | null {
    if (this.parkingIds.length > 0) {
      return this.parkingIds[this.currentParkingIndex];
    }
    return this.parkingId;
  }

  get hasMultipleParkings(): boolean {
    return this.parkingIds.length > 1;
  }

  get parkingIndicator(): string {
    if (this.parkingIds.length <= 1) return '';
    return `${this.currentParkingIndex + 1}/${this.parkingIds.length}`;
  }

  private dashboardService = inject(DashboardService);

  constructor() {
    addIcons({
      carSportOutline,
      locationOutline,
      statsChartOutline,
      checkmarkCircleOutline,
      chevronBackOutline,
      chevronForwardOutline
    });
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    const targetParkingId = this.currentParkingId;

    if (!targetParkingId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    // Cargar info del parqueadero
    this.dashboardService.getParkingInfo(targetParkingId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.parkingData = response.data;
        }
      },
      error: (err: Error) => {
        console.error('Error loading parking info:', err);
        this.error = 'Error al cargar información del parqueadero';
        this.loading = false;
      }
    });

    // Cargar ocupación
    this.dashboardService.getGlobalOccupancy(targetParkingId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.occupancyData = response.data;
        }
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading occupancy:', err);
        this.error = 'Error al cargar ocupación';
        this.loading = false;
      }
    });
  }

  // Navegación del carrusel
  nextParking() {
    if (this.parkingIds.length > 1) {
      this.currentParkingIndex = (this.currentParkingIndex + 1) % this.parkingIds.length;
      this.loadDashboardData();
    }
  }

  previousParking() {
    if (this.parkingIds.length > 1) {
      this.currentParkingIndex = this.currentParkingIndex === 0
        ? this.parkingIds.length - 1
        : this.currentParkingIndex - 1;
      this.loadDashboardData();
    }
  }

  get occupancyPercentage(): number {
    return this.occupancyData ? (this.occupancyData.occupied / this.occupancyData.total) : 0;
  }

  get occupancyColor(): string {
    const percentage = this.occupancyPercentage;
    if (percentage < 0.5) return 'success'; // Verde
    if (percentage < 0.8) return 'warning'; // Amarillo
    return 'danger'; // Rojo
  }
}
