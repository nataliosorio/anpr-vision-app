import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carSportOutline, locationOutline, statsChartOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { DashboardService, OccupancyData, ParkingData } from '../../services/dashboard.service';

@Component({
  selector: 'app-mini-dashboard',
  templateUrl: './mini-dashboard.component.html',
  styleUrls: ['./mini-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar, IonIcon, IonText]
})
export class MiniDashboardComponent implements OnInit {

  @Input() parkingId: number | null = null;

  occupancyData: OccupancyData | null = null;
  parkingData: ParkingData | null = null;
  loading = true;
  error: string | null = null;

  private dashboardService = inject(DashboardService);

  constructor() {
    addIcons({
      carSportOutline,
      locationOutline,
      statsChartOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    if (!this.parkingId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    // Cargar info del parqueadero
    this.dashboardService.getParkingInfo(this.parkingId).subscribe({
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
    this.dashboardService.getGlobalOccupancy(this.parkingId).subscribe({
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
