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
  chevronForward
} from 'ionicons/icons';
import { VehicleService } from '../../vehicles/services/vehicle.service';
import { VehicleWithStatusDto } from '../../vehicles/models/vehicle.model';

interface CurrentParking {
  plateNumber: string;
  entryTime: Date;
  parkingName: string;
  parkingAddress: string;
  accumulatedCost: number;
  spotNumber: string;
  image?: string;
}

interface HistoryItem {
  id: number;
  plateNumber: string;
  parkingName: string;
  entryDate: Date;
  exitDate: Date;
  duration: string;
  cost: number;
}

interface Membership {
  type: string;
  expiryDate: Date;
  benefits: string[];
  color: string;
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
    IonBadge
  ]
})
export class HomePage implements OnInit {

  username: string = 'Karol';

  // Vehículos parqueados
  parkedVehicles: VehicleWithStatusDto[] = [];
  currentVehicleIndex: number = 0;

  // Membresía activa
  activeMembership: Membership | null = {
    type: 'Oro',
    expiryDate: new Date('2025-12-12'),
    benefits: ['20% descuento', 'Reservas prioritarias', 'Soporte 24/7'],
    color: 'gold'
  };

  // Historial reciente (últimos 3-4 registros)
  recentHistory: HistoryItem[] = [
    {
      id: 1,
      plateNumber: 'ABC-123',
      parkingName: 'Parqueadero Gran Estación',
      entryDate: new Date('2025-11-11T14:30:00'),
      exitDate: new Date('2025-11-11T17:50:00'),
      duration: '3h 20min',
      cost: 15000
    },
    {
      id: 2,
      plateNumber: 'ABC-123',
      parkingName: 'Parking Unicentro',
      entryDate: new Date('2025-11-10T09:15:00'),
      exitDate: new Date('2025-11-10T11:00:00'),
      duration: '1h 45min',
      cost: 7000
    },
    {
      id: 3,
      plateNumber: 'ABC-123',
      parkingName: 'Estacionamiento Atlantis',
      entryDate: new Date('2025-11-08T16:00:00'),
      exitDate: new Date('2025-11-08T18:30:00'),
      duration: '2h 30min',
      cost: 10000
    }
  ];

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
    },
    {
      id: 3,
      title: 'Membresía próxima a vencer',
      message: 'Tu membresía Oro vence el 12 de diciembre',
      timestamp: new Date('2025-11-10T10:00:00'),
      read: true,
      type: 'alert'
    }
  ];

  // Removed parking duration logic

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
      eyeOutline
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadParkedVehicles();
  }

  ngOnDestroy() {
    // No intervals to clear
  }

  loadUserData() {
    this.username = localStorage.getItem('username') || 'Usuario';
  }

  loadParkedVehicles() {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;

    const clientId = parseInt(userIdStr, 10);
    this.vehicleService.getVehiclesWithStatusByClientId(clientId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.parkedVehicles = response.data.filter(v => v.isInside);
        }
      },
      error: (err: Error) => {
        console.error('Error loading parked vehicles:', err);
      }
    });
  }

  // Removed updateParkingDuration

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

  editProfile() {
    this.router.navigate(['/profile/edit']);
  }

  // Current parking actions
  viewCurrentParkingDetails() {
    // Navegar a la página de vehículos para ver detalles completos
    this.router.navigate(['/vehicles']);
  }

  nextVehicle() {
    if (this.parkedVehicles.length > 1) {
      this.currentVehicleIndex = (this.currentVehicleIndex + 1) % this.parkedVehicles.length;
    }
  }

  prevVehicle() {
    if (this.parkedVehicles.length > 1) {
      this.currentVehicleIndex = this.currentVehicleIndex === 0
        ? this.parkedVehicles.length - 1
        : this.currentVehicleIndex - 1;
    }
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

  viewHistoryDetail(item: HistoryItem) {
    this.router.navigate(['/history-detail', item.id]);
  }

  // Membership actions
  viewMembershipDetails() {
    this.router.navigate(['/membership']);
  }

  acquireMembership() {
    this.router.navigate(['/membership/plans']);
  }

  // Notifications actions
  viewAllNotifications() {
    this.router.navigate(['/notifications']);
  }

  markNotificationAsRead(notification: Notification) {
    notification.read = true;
  }

  // Quick actions
  goToMyVehicle() {
    this.router.navigate(['/vehicles']);
  }

  goToPayments() {
    this.router.navigate(['/payments']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'detection': return 'car-sport-outline';
      case 'payment': return 'checkmark-circle-outline';
      case 'alert': return 'alert-circle-outline';
      default: return 'notifications-outline';
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `Hace ${minutes} min`;
    } else if (hours < 24) {
      return `Hace ${hours}h`;
    } else if (days === 1) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    }
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
