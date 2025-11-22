import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonBadge,
  IonButtons,
  IonButton,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  notificationsOutline,
  carSportOutline,
  cashOutline,
  alertCircleOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  checkmarkDoneOutline,
  timeOutline,
  trashOutline
} from 'ionicons/icons';

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'detection' | 'payment' | 'alert' | 'info';
  icon: string;
}

type FilterType = 'all' | 'detection' | 'payment' | 'alert' | 'info';

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonBadge,
    IonButtons,
    IonButton
  ]
})
export class NotificationsModalComponent implements OnInit {

  private allNotifications: Notification[] = [
    {
      id: 1,
      title: 'Vehículo detectado',
      message: 'Tu vehículo ABC-123 fue detectado en Centro Comercial Andino',
      timestamp: new Date(Date.now() - 85 * 60000), // 85 minutos atrás
      read: false,
      type: 'detection',
      icon: 'car-sport-outline'
    },
    {
      id: 2,
      title: 'Pago confirmado',
      message: 'Pago de $15.000 procesado exitosamente para tu estacionamiento',
      timestamp: new Date(Date.now() - 3 * 60 * 60000), // 3 horas atrás
      read: false,
      type: 'payment',
      icon: 'cash-outline'
    },
    {
      id: 3,
      title: 'Espacio disponible',
      message: 'Se liberó un espacio en el nivel 2 del parqueadero Centro Andino',
      timestamp: new Date(Date.now() - 5 * 60 * 60000), // 5 horas atrás
      read: true,
      type: 'info',
      icon: 'information-circle-outline'
    },
    {
      id: 4,
      title: 'Tiempo límite alcanzado',
      message: 'Tu vehículo XYZ-987 lleva más de 4 horas estacionado en nivel 3',
      timestamp: new Date(Date.now() - 7 * 60 * 60000), // 7 horas atrás
      read: false,
      type: 'alert',
      icon: 'alert-circle-outline'
    },
    {
      id: 5,
      title: 'Salida registrada',
      message: 'Tu vehículo ABC-123 salió del parqueadero Gran Estación a las 5:30 PM',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 día atrás
      read: true,
      type: 'detection',
      icon: 'car-sport-outline'
    },
    {
      id: 6,
      title: 'Pago pendiente',
      message: 'Tienes un pago pendiente de $8.500 por tu último estacionamiento',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 días atrás
      read: true,
      type: 'payment',
      icon: 'cash-outline'
    },
    {
      id: 7,
      title: 'Bienvenido al sistema',
      message: 'Gracias por usar ANPR Vision. Tu cuenta ha sido activada exitosamente.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60000), // 5 días atrás
      read: true,
      type: 'info',
      icon: 'checkmark-circle-outline'
    }
  ];

  notifications: Notification[] = [];
  currentFilter: FilterType = 'all';

  private modalController = inject(ModalController);

  constructor() {
    addIcons({
      closeOutline,
      notificationsOutline,
      carSportOutline,
      cashOutline,
      alertCircleOutline,
      informationCircleOutline,
      checkmarkCircleOutline,
      checkmarkDoneOutline,
      timeOutline,
      trashOutline
    });
  }

  ngOnInit() {
    this.notifications = [...this.allNotifications];
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'detection': return 'primary';
      case 'payment': return 'success';
      case 'alert': return 'warning';
      case 'info': return 'secondary';
      default: return 'medium';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'detection': return 'Detección';
      case 'payment': return 'Pago';
      case 'alert': return 'Alerta';
      case 'info': return 'Info';
      default: return 'General';
    }
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short'
    });
  }

  filterByType(type: FilterType) {
    this.currentFilter = type;

    if (type === 'all') {
      this.notifications = [...this.allNotifications];
    } else {
      this.notifications = this.allNotifications.filter(n => n.type === type);
    }

    // Actualizar clases activas de los chips
    this.updateFilterChips();
  }

  private updateFilterChips() {
    // Esto se maneja con CSS usando la propiedad currentFilter
    // Puedes añadir lógica adicional si necesitas
  }

  markAsRead(notification: Notification) {
    notification.read = true;
    // Aquí puedes añadir lógica para sincronizar con el backend
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.allNotifications.forEach(n => n.read = true);
  }

  deleteNotification(index: number) {
    const notification = this.notifications[index];

    // Eliminar de la lista filtrada
    this.notifications.splice(index, 1);

    // Eliminar de la lista completa
    const allIndex = this.allNotifications.findIndex(n => n.id === notification.id);
    if (allIndex !== -1) {
      this.allNotifications.splice(allIndex, 1);
    }
  }

  close() {
    this.modalController.dismiss();
  }
}
