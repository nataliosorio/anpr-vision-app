import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActionSheetController, AlertController, ModalController, ToastController, PopoverController } from '@ionic/angular';
import { GeneralService } from 'src/app/generic/services/general.service';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberSince: Date;
  membershipLevel: 'basic' | 'gold' | 'premium';
}

interface UserStats {
  totalVisits: number;
  totalHours: number;
  totalSpent: number;
}

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: 'car' | 'motorcycle' | 'truck' | 'suv';
  isActive: boolean;
  image?: string;
}

interface HistoryEntry {
  id: string;
  type: 'entry' | 'exit' | 'payment';
  title: string;
  location: string;
  date: Date;
  duration?: string;
  cost?: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank' | 'cash';
  name: string;
  details: any;
  isDefault: boolean;
}

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoReserve: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProfilePage implements OnInit {

  userProfile: UserProfile = {
    name: 'Usuario Demo',
    email: 'usuario@ejemplo.com',
    avatar: 'assets/images/default-avatar.png',
    memberSince: new Date('2023-01-15'),
    membershipLevel: 'basic'
  };

  userStats: UserStats = {
    totalVisits: 42,
    totalHours: 156,
    totalSpent: 89500
  };

  userVehicles: Vehicle[] = [
    {
      id: '1',
      plate: 'ABC123',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      type: 'car',
      isActive: true,
      image: 'assets/images/vehicles/car-default.png'
    },
    {
      id: '2',
      plate: 'XYZ789',
      brand: 'Honda',
      model: 'CB600F',
      year: 2019,
      type: 'motorcycle',
      isActive: false,
      image: 'assets/images/vehicles/motorcycle-default.png'
    }
  ];

  recentHistory: HistoryEntry[] = [
    {
      id: '1',
      type: 'entry',
      title: 'Entrada al Parqueadero',
      location: 'Centro Comercial Plaza',
      date: new Date('2024-09-20T14:30:00'),
      duration: '2h 30min',
      cost: 8500
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pago realizado',
      location: 'Centro Comercial Plaza',
      date: new Date('2024-09-20T17:00:00'),
      cost: 8500
    },
    {
      id: '3',
      type: 'exit',
      title: 'Salida del Parqueadero',
      location: 'Centro Comercial Plaza',
      date: new Date('2024-09-20T17:05:00')
    }
  ];

  paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Tarjeta Principal',
      details: {
        lastFour: '1234',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2026
      },
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      details: {
        email: 'usuario@ejemplo.com'
      },
      isDefault: false
    }
  ];

  settings: Settings = {
    notifications: true,
    darkMode: true,
    autoReserve: false
  };

  appVersion: string = '1.2.3';

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private router: Router,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  // Métodos de carga de datos
  async loadUserData() {
    try {
      // Aquí cargarías los datos del usuario desde tu servicio
      // this.userProfile = await this.userService.getUserProfile();
      // this.userStats = await this.userService.getUserStats();
      // etc...
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  // Métodos del header
  async refreshProfile() {
    const toast = await this.toastController.create({
      message: 'Actualizando perfil...',
      duration: 2000,
      position: 'top'
    });
    await toast.present();

    await this.loadUserData();
  }

  showSettings() {
    // Navegar a la página de configuración
    console.log('Mostrar configuración');
  }

  // Métodos del perfil de usuario
  async changeAvatar() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cambiar Avatar',
      buttons: [
        {
          text: 'Editar Perfil',
          icon: 'create-outline',
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Cambiar Contraseña',
          icon: 'lock-closed-outline',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  private takePhoto() {
    // Implementar captura de foto con Capacitor Camera
    console.log('Tomar foto');
  }

  private selectFromGallery() {
    // Implementar selección de galería
    console.log('Seleccionar de galería');
  }

  editProfile() {
    // Navegar a editar perfil o mostrar modal
    console.log('Editar perfil');
  }

  // Métodos de membresía
  getMembershipIcon(): string {
    switch (this.userProfile.membershipLevel) {
      case 'basic': return 'person-circle-outline';
      case 'gold': return 'star';
      case 'premium': return 'diamond';
      default: return 'person-circle-outline';
    }
  }

  getMembershipName(): string {
    switch (this.userProfile.membershipLevel) {
      case 'basic': return 'Básico';
      case 'gold': return 'Gold';
      case 'premium': return 'Premium';
      default: return 'Básico';
    }
  }

  getMembershipProgress(): number {
    // Simular progreso basado en estadísticas
    if (this.userProfile.membershipLevel === 'premium') return 100;
    if (this.userProfile.membershipLevel === 'gold') return 75;

    // Para básico, calcular basado en visitas (ejemplo: 50 visitas para gold)
    return Math.min((this.userStats.totalVisits / 50) * 100, 100);
  }

  getMembershipProgressText(): string {
    if (this.userProfile.membershipLevel === 'basic') {
      const remaining = 50 - this.userStats.totalVisits;
      return remaining > 0 ? `${remaining} visitas para Gold` : 'Listo para Gold';
    } else if (this.userProfile.membershipLevel === 'gold') {
      const remaining = 100 - this.userStats.totalVisits;
      return remaining > 0 ? `${remaining} visitas para Premium` : 'Listo para Premium';
    }
    return '';
  }

  // Métodos de vehículos
  addVehicle() {
    // Navegar a agregar vehículo o mostrar modal
    console.log('Agregar vehículo');
  }

  editVehicle(vehicle: Vehicle) {
    console.log('Editar vehículo:', vehicle);
  }

  async toggleVehicleMenu(event: Event, vehicle: Vehicle) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetController.create({
      header: `${vehicle.plate}`,
      buttons: [
        {
          text: vehicle.isActive ? 'Desactivar' : 'Activar',
          icon: vehicle.isActive ? 'pause' : 'play',
          handler: () => {
            this.toggleVehicleStatus(vehicle);
          }
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.editVehicle(vehicle);
          }
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.deleteVehicle(vehicle);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async toggleVehicleStatus(vehicle: Vehicle) {
    vehicle.isActive = !vehicle.isActive;

    const toast = await this.toastController.create({
      message: `Vehículo ${vehicle.isActive ? 'activado' : 'desactivado'}`,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async deleteVehicle(vehicle: Vehicle) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar el vehículo ${vehicle.plate}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            const index = this.userVehicles.findIndex(v => v.id === vehicle.id);
            if (index > -1) {
              this.userVehicles.splice(index, 1);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  getVehicleImage(vehicle: Vehicle): string {
    return vehicle.image || `assets/images/vehicles/${vehicle.type}-default.png`;
  }

  getVehicleTypeIcon(type: string): string {
    switch (type) {
      case 'car': return 'car';
      case 'motorcycle': return 'bicycle';
      case 'truck': return 'bus';
      case 'suv': return 'car-sport';
      default: return 'car';
    }
  }

  getVehicleTypeName(type: string): string {
    switch (type) {
      case 'car': return 'Automóvil';
      case 'motorcycle': return 'Motocicleta';
      case 'truck': return 'Camión';
      case 'suv': return 'SUV';
      default: return 'Vehículo';
    }
  }

  // Métodos de historial
  showFullHistory() {
    // Navegar a historial completo
    console.log('Mostrar historial completo');
  }

  getHistoryIcon(type: string): string {
    switch (type) {
      case 'entry': return 'enter-outline';
      case 'exit': return 'exit-outline';
      case 'payment': return 'card-outline';
      default: return 'time-outline';
    }
  }

  // Métodos de pago
  addPaymentMethod() {
    // Navegar a agregar método de pago
    console.log('Agregar método de pago');
  }

  editPaymentMethod(payment: PaymentMethod) {
    console.log('Editar método de pago:', payment);
  }

  getPaymentIcon(type: string): string {
    switch (type) {
      case 'card': return 'card';
      case 'paypal': return 'logo-paypal';
      case 'bank': return 'business';
      case 'cash': return 'cash';
      default: return 'card';
    }
  }

  getPaymentInfo(payment: PaymentMethod): string {
    switch (payment.type) {
      case 'card':
        return `**** **** **** ${payment.details.lastFour} • ${payment.details.brand}`;
      case 'paypal':
        return payment.details.email;
      case 'bank':
        return `${payment.details.bankName} • ${payment.details.accountType}`;
      case 'cash':
        return 'Efectivo';
      default:
        return 'Método de pago';
    }
  }

  // Métodos de configuración
  async toggleNotifications() {
    this.settings.notifications = !this.settings.notifications;
    // Guardar configuración
    await this.saveSettings();
  }

  async toggleDarkMode() {
    this.settings.darkMode = !this.settings.darkMode;
    // Aplicar tema
    document.body.classList.toggle('dark', this.settings.darkMode);
    await this.saveSettings();
  }

  async toggleAutoReserve() {
    this.settings.autoReserve = !this.settings.autoReserve;
    await this.saveSettings();
  }

  private async saveSettings() {
    try {
      // Guardar configuración en almacenamiento local o servicio
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Métodos de acciones del perfil
  showHelp() {
    console.log('Mostrar ayuda');
    // Navegar a página de ayuda o abrir modal
  }

  showPrivacyPolicy() {
    console.log('Mostrar política de privacidad');
    // Abrir navegador o modal con política
  }

  showTerms() {
    console.log('Mostrar términos y condiciones');
    // Abrir navegador o modal con términos
  }

  async rateApp() {
    const alert = await this.alertController.create({
      header: 'Calificar App',
      message: '¿Te gusta nuestra aplicación?',
      buttons: [
        {
          text: 'Más tarde',
          role: 'cancel'
        },
        {
          text: 'Calificar',
          handler: () => {
            // Abrir store para calificar
            console.log('Abrir store para calificar');
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          handler: async () => {
            try {
              // 🔹 Limpiar datos guardados en Preferences
              await this.generalService.clearAuth();

              // 🔹 Mostrar mensaje de confirmación
              const toast = await this.toastController.create({
                message: 'Sesión cerrada exitosamente',
                duration: 2000,
                position: 'bottom'
              });
              await toast.present();

              // 🔹 Redirigir al login (o splash)
              this.router.navigate(['/splash']);
            } catch (error) {
              console.error('Error durante el logout:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
