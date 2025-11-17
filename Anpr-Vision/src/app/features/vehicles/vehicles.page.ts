import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonSearchbar,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  searchOutline,
  carSportOutline,
  bicycleOutline,
  locationOutline,
  timeOutline,
  calendarOutline,
  statsChartOutline,
  ribbonOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  eyeOutline,
  filterOutline,
  carOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { VehicleService } from './services/vehicle.service';
import { VehicleWithStatusDto } from './models/vehicle.model';

interface Vehicle {
  id: number;
  plateNumber: string;
  type: string; // 'Auto', 'Moto', etc.
  color: string;
  isInside: boolean;
  typeVehicleId: number;
  clientId: number;
  client: string;
  // Additional fields for compatibility
  currentlyParked: boolean; // mapped from isInside
  brand?: string;
  model?: string;
  image?: string;
}

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonSearchbar
  ]
})
export class VehiclesPage implements OnInit {

  vehicles: Vehicle[] = [];

  filteredVehicles: Vehicle[] = [];
  searchTerm: string = '';
  showFilters: boolean = false;

  private router = inject(Router);
  private toastController = inject(ToastController);
  private vehicleService = inject(VehicleService);

  constructor() {
    addIcons({
      arrowBackOutline,
      searchOutline,
      carSportOutline,
      bicycleOutline,
      locationOutline,
      timeOutline,
      calendarOutline,
      statsChartOutline,
      ribbonOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      eyeOutline,
      filterOutline,
      carOutline,
      informationCircleOutline
    });
  }

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      console.error('No userId found in localStorage');
      this.showToast('Usuario no autenticado', 'danger');
      return;
    }

    const clientId = parseInt(userIdStr, 10);
    this.vehicleService.getVehiclesWithStatusByClientId(clientId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.vehicles = response.data.map(dto => this.mapDtoToVehicle(dto));
          this.filteredVehicles = [...this.vehicles];
        } else {
          this.showToast(response.message || 'Error al cargar vehículos', 'danger');
        }
      },
      error: (err: Error) => {
        console.error('Error loading vehicles:', err);
        this.showToast(err.message || 'Error al cargar vehículos', 'danger');
      }
    });
  }

  private mapDtoToVehicle(dto: VehicleWithStatusDto): Vehicle {
    return {
      id: dto.id,
      plateNumber: dto.plate,
      type: dto.typeVehicle || 'Vehículo',
      color: dto.color,
      isInside: dto.isInside,
      typeVehicleId: dto.typeVehicleId,
      clientId: dto.clientId,
      client: dto.client || '',
      currentlyParked: dto.isInside,
      brand: '',
      model: '',
      image: ''
    };
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  onSearchChange(event: any) {
    const value = event.detail.value?.toLowerCase() || '';
    this.searchTerm = value;

    if (!value) {
      this.filteredVehicles = [...this.vehicles];
      return;
    }

    this.filteredVehicles = this.vehicles.filter(vehicle =>
      vehicle.plateNumber.toLowerCase().includes(value) ||
      vehicle.type.toLowerCase().includes(value) ||
      vehicle.color.toLowerCase().includes(value) ||
      vehicle.client.toLowerCase().includes(value)
    );
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  getVehicleIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'auto': return 'car-sport-outline';
      case 'moto': return 'bicycle-outline';
      case 'camioneta': return 'car-outline';
      default: return 'car-sport-outline';
    }
  }

  getVehicleTypeName(type: string): string {
    switch (type.toLowerCase()) {
      case 'auto': return 'Automóvil';
      case 'moto': return 'Motocicleta';
      case 'camioneta': return 'Camioneta';
      default: return type;
    }
  }

  getMembershipColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'oro': return 'gold';
      case 'plata': return 'silver';
      case 'bronce': return 'bronze';
      default: return 'basic';
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const dateObj = new Date(date);
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `Hace ${minutes} min`;
    } else if (hours < 24) {
      return `Hace ${hours}h`;
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return `Hace ${days} días`;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short'
      };
      if (dateObj.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
      }
      return dateObj.toLocaleDateString('es-CO', options);
    }
  }

  formatFullDate(date: Date): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewVehicleHistory(vehicle: Vehicle) {
    this.router.navigate(['/history'], {
      queryParams: { plateNumber: vehicle.plateNumber }
    });
  }

  viewVehicleDetails(vehicle: Vehicle) {
    this.router.navigate(['/vehicle-detail', vehicle.id]);
  }
  get totalVehicles(): number {
  return this.vehicles.length;
}

get totalParked(): number {
  return this.vehicles.filter(v => v.currentlyParked).length;
}

get totalWithMembership(): number {
  return 0; // No tenemos datos de membresía del API
}


  private async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }
}
