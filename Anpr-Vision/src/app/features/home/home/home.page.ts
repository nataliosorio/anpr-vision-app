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
  IonBadge,
  MenuController,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  settingsOutline,
  createOutline,
  carSportOutline,
  timeOutline,
  locationOutline,
  cashOutline,
  receiptOutline,
  calendarOutline,
  chevronForwardOutline,
  notificationsOutline,
  cardOutline,
  personOutline,
  searchOutline,
  ribbonOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  eyeOutline,
  chevronBackOutline,
  flashOutline
} from 'ionicons/icons';
import { VehicleService } from '../../vehicles/services/vehicle.service';
import { VehicleWithStatusDto } from '../../vehicles/models/vehicle.model';
import { MiniDashboardComponent } from '../components/mini-dashboard/mini-dashboard.component';

interface HistoryItem {
  id: number;
  plateNumber: string;
  parkingName: string;
  entryDate: Date;
  exitDate: Date;
  duration: string;
  cost: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'detection' | 'payment' | 'alert' | 'info';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonBadge,
    MiniDashboardComponent
  ]
})
export class HomePage implements OnInit {

  username: string = 'Usuario';
  parkingId: number | null = null;

  // Vehículos parqueados
  parkedVehicles: VehicleWithStatusDto[] = [];
  currentVehicleIndex: number = 0;

  // Notificaciones recientes
  recentNotifications: Notification[] = [
    {
      id: 1,
      title: 'Vehículo detectado',
      message: 'Tu vehículo ABC-123 fue detectado en Centro Comercial Andino',
      timestamp: new Date(Date.now() - 85 * 60000),
      read: false,
      type: 'detection'
    },
    {
      id: 2,
      title: 'Pago confirmado',
      message: 'Pago de $15.000 procesado exitosamente',
      timestamp: new Date('2025-11-11T17:50:00'),
      read: true,
      type: 'payment'
    }
  ];

  private router = inject(Router);
  private menuController = inject(MenuController);
  private modalController = inject(ModalController);
  private toastController = inject(ToastController);
  private vehicleService = inject(VehicleService);

  constructor() {
    addIcons({
      menuOutline,
      settingsOutline,
      createOutline,
      carSportOutline,
      timeOutline,
      locationOutline,
      cashOutline,
      receiptOutline,
      calendarOutline,
      chevronForwardOutline,
      chevronBackOutline,
      notificationsOutline,
      cardOutline,
      personOutline,
      searchOutline,
      ribbonOutline,
      alertCircleOutline,
      checkmarkCircleOutline,
      eyeOutline,
      flashOutline
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadParkingId();
    this.loadParkedVehicles();
  }

  loadUserData() {
    this.username = localStorage.getItem('username') || 'Usuario';
  }

  loadParkingId() {
    // Intentar obtener de rolesByParking en localStorage
    const rolesByParkingStr = localStorage.getItem('rolesByParking');
    if (rolesByParkingStr) {
      try {
        const rolesByParking = JSON.parse(rolesByParkingStr);
        if (Array.isArray(rolesByParking) && rolesByParking.length > 0) {
          // Tomar el primer parkingId disponible
          this.parkingId = rolesByParking[0].parkingId;
          // Guardar en localStorage para acceso rápido
          if (this.parkingId) {
            localStorage.setItem('parkingId', this.parkingId.toString());
          }
        }
      } catch (error) {
        console.error('Error parsing rolesByParking:', error);
      }
    }
    // Si no hay rolesByParking o parkingId, queda null
  }

  loadParkedVehicles() {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;

    const clientId = parseInt(userIdStr, 10);
    this.vehicleService.getVehiclesWithStatusByClientId(clientId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.parkedVehicles = response.data.filter(v => v.isInside);
          // Extraer parkingId del primer vehículo si existe
          if (this.parkedVehicles.length > 0 && this.parkedVehicles[0].parkingId) {
            this.parkingId = this.parkedVehicles[0].parkingId;
            // Guardar en localStorage para futuras sesiones
            localStorage.setItem('parkingId', this.parkingId.toString());
          }
        }
      },
      error: (err: Error) => {
        console.error('Error loading parked vehicles:', err);
      }
    });
  }

  get unreadNotifications(): number {
    return this.recentNotifications.filter(n => !n.read).length;
  }

  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  // Navigation methods
  async openMenu() {
    await this.menuController.open();
  }

  openProfile() {
    this.router.navigate(['/profile']);
  }

  // Current parking actions
  viewCurrentParkingDetails() {
    this.router.navigate(['/vehicles']);
  }

  selectVehicle(index: number) {
    this.currentVehicleIndex = index;
    this.showToast(`Vehículo ${this.parkedVehicles[index].plate} seleccionado`);
  }

  get currentParkedVehicle(): VehicleWithStatusDto | null {
    return this.parkedVehicles.length > 0 ? this.parkedVehicles[this.currentVehicleIndex] : null;
  }

  searchNearbyParking() {
    this.router.navigate(['/search-parking']);
  }

  // History actions
  viewFullHistory() {
    this.router.navigate(['/history']);
  }

  // Notifications actions
  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  // Quick actions
  goToMyVehicle() {
    this.router.navigate(['/vehicles']);
  }

  goToPayments() {
    this.router.navigate(['/payments']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }
}
