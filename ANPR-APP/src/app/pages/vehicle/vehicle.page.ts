import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonImg
} from '@ionic/angular/standalone';

interface ParkingSpace {
  id: string;
  number: string;
  type: 'car' | 'motorcycle' | 'bicycle' | 'disabled';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  icon: string;
  occupiedSince?: Date;
  reservedUntil?: Date;
  vehiclePlate?: string;
}

interface VehicleFilter {
  type: string;
  name: string;
  icon: string;
  available: number;
  total: number;
}

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.page.html',
  styleUrls: ['./vehicle.page.scss'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonImg]
})
export class VehiclePage implements OnInit{

// Información del parqueadero
  parkingName: string = 'Centro Comercial Plaza';
  parkingAddress: string = 'Calle 123 #45-67, Bogotá';
  operatingHours: string = '24 horas';
  securityFeatures: string = 'Cámaras, Seguridad 24/7';
  paymentMethods: string = 'Efectivo, Tarjeta, App';

  // Estadísticas generales
  totalSpots: number = 120;
  occupiedSpots: number = 78;
  availableSpots: number = 42;
  hourlyRate: number = 3500;
  averageStay: string = '2h 30m';

  // Vista y filtros
  viewMode: 'grid' | 'list' = 'grid';
  selectedVehicleType: string = 'all';
  selectedSpace: ParkingSpace | null = null;
  reservationDuration: number | null = null;

  // Datos de espacios
  parkingSpaces: ParkingSpace[] = [];
  vehicleFilters: VehicleFilter[] = [];

  constructor() {}

  ngOnInit() {
    this.initializeParkingData();
    this.updateVehicleFilters();
  }

  initializeParkingData() {
    // Generar datos de espacios de parqueo
    this.parkingSpaces = [];

    // Espacios para carros (1-80)
    for (let i = 1; i <= 80; i++) {
      const random = Math.random();
      let status: 'available' | 'occupied' | 'reserved' | 'maintenance' = 'available';
      let occupiedSince: Date | undefined;

      if (random < 0.6) {
        status = 'occupied';
        occupiedSince = new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000);
      } else if (random < 0.7) {
        status = 'reserved';
      } else if (random < 0.75) {
        status = 'maintenance';
      }

      this.parkingSpaces.push({
        id: `car-${i}`,
        number: `A${i.toString().padStart(2, '0')}`,
        type: 'car',
        status,
        icon: 'car-outline',
        occupiedSince,
        vehiclePlate: status === 'occupied' ? `ABC-${Math.floor(Math.random() * 999)}` : undefined
      });
    }

    // Espacios para motos (81-110)
    for (let i = 81; i <= 110; i++) {
      const random = Math.random();
      let status: 'available' | 'occupied' | 'reserved' | 'maintenance' = 'available';
      let occupiedSince: Date | undefined;

      if (random < 0.4) {
        status = 'occupied';
        occupiedSince = new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000);
      } else if (random < 0.5) {
        status = 'reserved';
      }

      this.parkingSpaces.push({
        id: `moto-${i}`,
        number: `M${(i-80).toString().padStart(2, '0')}`,
        type: 'motorcycle',
        status,
        icon: 'bicycle-outline',
        occupiedSince,
        vehiclePlate: status === 'occupied' ? `M${Math.floor(Math.random() * 999)}AB` : undefined
      });
    }

    // Espacios para bicicletas (111-120)
    for (let i = 111; i <= 120; i++) {
      const random = Math.random();
      let status: 'available' | 'occupied' | 'reserved' | 'maintenance' = 'available';

      if (random < 0.2) {
        status = 'occupied';
      }

      this.parkingSpaces.push({
        id: `bike-${i}`,
        number: `B${(i-110).toString().padStart(2, '0')}`,
        type: 'bicycle',
        status,
        icon: 'trail-sign-outline',
        occupiedSince: status === 'occupied' ? new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000) : undefined
      });
    }

    // Actualizar contadores
    this.updateCounters();
  }

  updateVehicleFilters() {
    const carSpaces = this.parkingSpaces.filter(s => s.type === 'car');
    const motoSpaces = this.parkingSpaces.filter(s => s.type === 'motorcycle');
    const bikeSpaces = this.parkingSpaces.filter(s => s.type === 'bicycle');
    const allSpaces = this.parkingSpaces;

    this.vehicleFilters = [
      {
        type: 'all',
        name: 'Todos',
        icon: 'apps-outline',
        available: allSpaces.filter(s => s.status === 'available').length,
        total: allSpaces.length
      },
      {
        type: 'car',
        name: 'Automóviles',
        icon: 'car-outline',
        available: carSpaces.filter(s => s.status === 'available').length,
        total: carSpaces.length
      },
      {
        type: 'motorcycle',
        name: 'Motocicletas',
        icon: 'bicycle-outline',
        available: motoSpaces.filter(s => s.status === 'available').length,
        total: motoSpaces.length
      },
      {
        type: 'bicycle',
        name: 'Bicicletas',
        icon: 'trail-sign-outline',
        available: bikeSpaces.filter(s => s.status === 'available').length,
        total: bikeSpaces.length
      }
    ];
  }

  updateCounters() {
    this.occupiedSpots = this.parkingSpaces.filter(s => s.status === 'occupied').length;
    this.availableSpots = this.parkingSpaces.filter(s => s.status === 'available').length;
  }

  // Métodos de interfaz
  refreshData() {
    this.initializeParkingData();
    this.updateVehicleFilters();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  selectVehicleType(type: string) {
    this.selectedVehicleType = type;
    this.selectedSpace = null;
  }

  selectSpace(space: ParkingSpace) {
    if (space.status === 'available') {
      this.selectedSpace = space;
      this.reservationDuration = null;
    }
  }

  getFilteredSpaces(): ParkingSpace[] {
    if (this.selectedVehicleType === 'all') {
      return this.parkingSpaces;
    }
    return this.parkingSpaces.filter(space => space.type === this.selectedVehicleType);
  }

  getSelectedFilterName(): string {
    const filter = this.vehicleFilters.find(f => f.type === this.selectedVehicleType);
    return filter ? filter.name.toLowerCase() : 'espacios';
  }

  // Métodos de estado
  getOccupationPercentage(): number {
    return Math.round((this.occupiedSpots / this.totalSpots) * 100);
  }

  getStatusClass(): string {
    const percentage = this.getOccupationPercentage();
    if (percentage >= 95) return 'full';
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    return 'low';
  }

  getStatusIcon(): string {
    const percentage = this.getOccupationPercentage();
    if (percentage >= 95) return 'close-circle-outline';
    if (percentage >= 80) return 'warning-outline';
    if (percentage >= 60) return 'alert-circle-outline';
    return 'checkmark-circle-outline';
  }

  getStatusText(): string {
    const percentage = this.getOccupationPercentage();
    if (percentage >= 95) return 'Completo';
    if (percentage >= 80) return 'Alta ocupación';
    if (percentage >= 60) return 'Ocupación media';
    return 'Disponible';
  }

  getSpaceClass(space: ParkingSpace): string {
    return space.status;
  }

  getSpaceStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupado';
      case 'reserved': return 'Reservado';
      case 'maintenance': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  }

  getTimeOccupied(occupiedSince: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - occupiedSince.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  }

  // Métodos de reserva
  getEstimatedCost(): number {
    if (!this.reservationDuration) return 0;
    return this.hourlyRate * this.reservationDuration;
  }

  makeReservation() {
    if (!this.selectedSpace || !this.reservationDuration) return;

    // Simular reserva
    this.selectedSpace.status = 'reserved';
    this.selectedSpace.reservedUntil = new Date(Date.now() + (this.reservationDuration * 60 * 60 * 1000));

    // Actualizar contadores
    this.updateCounters();
    this.updateVehicleFilters();
    
    // Limpiar selección
    this.selectedSpace = null;
    this.reservationDuration = null;

    // Aquí podrías mostrar un toast o modal de confirmación
    console.log('Reserva realizada exitosamente');
  }

  showMap() {
    // Implementar navegación al mapa del parqueadero
    console.log('Mostrar mapa del parqueadero');
  }

}
