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
  IonAvatar,
  IonBadge,
  IonToggle,
  IonList,
  IonItem,
  IonLabel,
  AlertController,
  ToastController,
  ActionSheetController,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  personOutline,
  createOutline,
  cardOutline,
  notificationsOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  languageOutline,
  moonOutline,
  helpCircleOutline,
  documentTextOutline,
  informationCircleOutline,
  logOutOutline,
  trashOutline,
  chevronForwardOutline,
  cameraOutline,
  mailOutline,
  callOutline,
  locationOutline,
  ribbonOutline,
  statsChartOutline,
  carSportOutline,
  timeOutline,
  walletOutline,
  settingsOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { AuthUserDto, PersonDto, UserService } from './services/user.service';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { ApiResponse } from '../authentication/models/ApiResponse';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  memberSince: Date;
  membership: {
    type: string;
    active: boolean;
    expiryDate: Date;
  } | null;
}

interface UserStats {
  totalSessions: number;
  totalSpent: number;
  vehiclesRegistered: number;
  favoriteParking: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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
    IonAvatar,
    IonBadge,
    IonToggle,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class ProfilePage implements OnInit {

  userProfile: UserProfile = {
    name: 'Karol Martínez',
    email: 'karol.martinez@example.com',
    phone: '+57 300 123 4567',
    avatar: 'assets/default-avatar.png',
    location: 'Bogotá, Colombia',
    memberSince: new Date('2024-06-15'),
    membership: {
      type: 'Oro',
      active: true,
      expiryDate: new Date('2025-12-15')
    }
  };

  userStats: UserStats = {
    totalSessions: 47,
    totalSpent: 325000,
    vehiclesRegistered: 3,
    favoriteParking: 'Centro Comercial Andino'
  };

  personData: PersonDto | null = null;
  showPersonDetails: boolean = false;
  avatarColor: string = '#007bff';
  userData: AuthUserDto | null = null;

  // Configuraciones
  notificationsEnabled: boolean = true;
  pushNotifications: boolean = true;
  emailNotifications: boolean = false;
  smsNotifications: boolean = false;
  darkModeEnabled: boolean = false;
  biometricEnabled: boolean = true;

  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private actionSheetController = inject(ActionSheetController);
  private modalController = inject(ModalController);
  private userService = inject(UserService);

  constructor() {
    addIcons({
      arrowBackOutline,
      personOutline,
      createOutline,
      cardOutline,
      notificationsOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
      languageOutline,
      moonOutline,
      helpCircleOutline,
      documentTextOutline,
      informationCircleOutline,
      logOutOutline,
      trashOutline,
      chevronForwardOutline,
      cameraOutline,
      mailOutline,
      callOutline,
      locationOutline,
      ribbonOutline,
      statsChartOutline,
      carSportOutline,
      timeOutline,
      walletOutline,
      settingsOutline,
      checkmarkCircleOutline
    });
  }

async ngOnInit() {
  const userId = Number(localStorage.getItem('userId'));

  if (!userId) {
    console.warn("❗ No hay userId en localStorage");
    return;
  }

  this.userService.getUserById(userId).subscribe({
    next: (res: ApiResponse<AuthUserDto>) => {
      const u = res.data;
      this.userData = u;

      this.userProfile = {
        name: u.personName || u.username,
        email: u.email,
        phone: '', // El phone viene de person
        avatar: 'assets/default-avatar.png', // No hay avatar en user
        location: 'No definido',
        memberSince: new Date(),
        membership: null
      };

      this.avatarColor = this.generateAvatarColor(u.username);

      // Cargar datos de person
      if (u.personId) {
        this.userService.getPersonById(u.personId).subscribe({
          next: (personRes: ApiResponse<PersonDto>) => {
            const p = personRes.data;
            this.personData = p;
            this.userProfile.phone = p.phone;
            this.userProfile.name = `${p.firstName} ${p.lastName}`;
          },
          error: err => {
            console.error('❌ Error cargando persona:', err);
          }
        });
      }
    },
    error: err => {
      console.error('❌ Error cargando usuario:', err);
    }
  });

  this.loadSettings();
}


  loadUserProfile() {
    // Cargar datos del usuario desde el servicio
    const savedName = localStorage.getItem('username');
    if (savedName) {
      this.userProfile.name = savedName;
    }
  }

  loadSettings() {
    // Cargar configuraciones guardadas
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.notificationsEnabled = settings.notificationsEnabled ?? true;
      this.pushNotifications = settings.pushNotifications ?? true;
      this.emailNotifications = settings.emailNotifications ?? false;
      this.smsNotifications = settings.smsNotifications ?? false;
      this.darkModeEnabled = settings.darkModeEnabled ?? false;
      this.biometricEnabled = settings.biometricEnabled ?? true;
    }
  }

  saveSettings() {
    const settings = {
      notificationsEnabled: this.notificationsEnabled,
      pushNotifications: this.pushNotifications,
      emailNotifications: this.emailNotifications,
      smsNotifications: this.smsNotifications,
      darkModeEnabled: this.darkModeEnabled,
      biometricEnabled: this.biometricEnabled
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async changeAvatar() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Cambiar foto de perfil',
      buttons: [
        {
          text: 'Tomar foto',
          icon: 'camera-outline',
          handler: () => {
            this.showToast('Función de cámara no implementada');
          }
        },
        {
          text: 'Seleccionar de galería',
          icon: 'images-outline',
          handler: () => {
            this.showToast('Función de galería no implementada');
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

  editProfile() {
    this.router.navigate(['/profile/edit']);
  }

  togglePersonDetails() {
    this.showPersonDetails = !this.showPersonDetails;
  }

  async openEditModal() {
    if (!this.userData || !this.personData) {
      this.showToast('Datos no disponibles');
      return;
    }

    const modal = await this.modalController.create({
      component: EditProfileModalComponent,
      componentProps: {
        user: { ...this.userData },
        person: { ...this.personData }
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.updateProfile(result.data.user, result.data.person);
      }
    });

    return await modal.present();
  }

  private updateProfile(updatedUser: AuthUserDto, updatedPerson: PersonDto) {
    // Actualizar user
    this.userService.updateUserById(updatedUser).subscribe({
      next: () => {
        this.userData = updatedUser;
        this.userProfile.name = updatedUser.personName || updatedUser.username;
        this.userProfile.email = updatedUser.email;
        this.avatarColor = this.generateAvatarColor(updatedUser.username);
        this.showToast('Usuario actualizado');
      },
      error: err => {
        console.error('Error actualizando usuario:', err);
        this.showToast('Error actualizando usuario');
      }
    });

    // Actualizar person
    this.userService.updatePersonById(updatedPerson).subscribe({
      next: () => {
        this.personData = updatedPerson;
        this.userProfile.name = `${updatedPerson.firstName} ${updatedPerson.lastName}`;
        this.userProfile.phone = updatedPerson.phone;
        this.showToast('Persona actualizada');
      },
      error: err => {
        console.error('Error actualizando persona:', err);
        this.showToast('Error actualizando persona');
      }
    });
  }

  getInitial(username: string): string {
    return username ? username.charAt(0).toUpperCase() : 'U';
  }

  generateAvatarColor(username: string): string {
    if (!username) return '#007bff';
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  viewMembership() {
    this.router.navigate(['/membership']);
  }

  viewPaymentMethods() {
    this.router.navigate(['/payment-methods']);
  }

  viewNotificationSettings() {
    this.router.navigate(['/notifications/settings']);
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  viewSecurity() {
    this.router.navigate(['/security']);
  }

  viewPrivacy() {
    this.router.navigate(['/privacy']);
  }

  viewLanguage() {
    this.router.navigate(['/language']);
  }

  onNotificationToggle(event: any) {
    this.notificationsEnabled = event.detail.checked;
    this.saveSettings();
    this.showToast(this.notificationsEnabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas');
  }

  onPushToggle(event: any) {
    this.pushNotifications = event.detail.checked;
    this.saveSettings();
  }

  onEmailToggle(event: any) {
    this.emailNotifications = event.detail.checked;
    this.saveSettings();
  }

  onSmsToggle(event: any) {
    this.smsNotifications = event.detail.checked;
    this.saveSettings();
  }

  onDarkModeToggle(event: any) {
    this.darkModeEnabled = event.detail.checked;
    this.saveSettings();
    this.showToast(this.darkModeEnabled ? 'Modo oscuro activado' : 'Modo claro activado');
    // Aquí aplicarías el tema oscuro/claro
  }

  onBiometricToggle(event: any) {
    this.biometricEnabled = event.detail.checked;
    this.saveSettings();
  }

  viewHelp() {
    this.router.navigate(['/help']);
  }

  viewTerms() {
    this.router.navigate(['/terms']);
  }

  viewAbout() {
    this.router.navigate(['/about']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: () => {
            // Limpiar datos de sesión
            localStorage.removeItem('userToken');
            this.showToast('Sesión cerrada correctamente');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: '⚠️ Eliminar cuenta',
      message: 'Esta acción es permanente y no se puede deshacer. Se eliminarán todos tus datos, vehículos, historial y membresías.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const confirmAlert = await this.alertController.create({
              header: 'Confirmar eliminación',
              message: 'Escribe "ELIMINAR" para confirmar',
              inputs: [
                {
                  name: 'confirmation',
                  type: 'text',
                  placeholder: 'ELIMINAR'
                }
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel'
                },
                {
                  text: 'Confirmar',
                  handler: (data) => {
                    if (data.confirmation === 'ELIMINAR') {
                      this.showToast('Cuenta eliminada correctamente');
                      this.router.navigate(['/login']);
                      return true;
                    } else {
                      this.showToast('Texto de confirmación incorrecto');
                      return false;
                    }
                  }
                }
              ]
            });
            await confirmAlert.present();
          }
        }
      ]
    });
    await alert.present();
  }

  getMembershipBadgeColor(): string {
    if (!this.userProfile.membership) return 'medium';
    switch (this.userProfile.membership.type.toLowerCase()) {
      case 'oro': return 'warning';
      case 'plata': return 'medium';
      case 'bronce': return 'tertiary';
      default: return 'primary';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
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
