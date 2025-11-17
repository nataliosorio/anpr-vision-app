import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

import { LoginDto } from '../../models/loginDto';
import { AuthService } from '../../services/auth.service';
import { ApiResponse } from '../../models/ApiResponse';

@Component({
  selector: 'app-login',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonSpinner,
    IonIcon
  ]
})
export class LoginPage implements OnInit, OnDestroy {

  loginDto: LoginDto = {
    username: '',
    password: ''
  };

  showPassword = false;
  loading = false;
  tempUserId: number | null = null;

  // Imágenes de fondo
  backgroundImages: string[] = [
       'assets/imgParking/parking1.jpg',
    'assets/imgParking/parking2.jpg',
    'assets/imgParking/parking3.jpg',
    'assets/imgParking/parking4.jpg'
  ];

  currentBgIndex = 0;
  private bgIntervalId: any;

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  constructor() {
    // Registrar iconos
    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  ngOnInit() {
    // Iniciar rotación de imágenes de fondo
    this.startBackgroundRotation();
  }

  ngOnDestroy() {
    if (this.bgIntervalId) {
      clearInterval(this.bgIntervalId);
    }
  }

  startBackgroundRotation() {
    this.bgIntervalId = setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
    }, 5000); // Cambia cada 5 segundos
  }

  /**
   * Login - Paso 1: Validar credenciales y enviar código OTP
   */
  async login() {
    // Validación de campos
    if (!this.loginDto.username || !this.loginDto.password) {
      await this.showAlert(
        'Campos incompletos',
        'Por favor, ingresa tu usuario y contraseña.',
        'warning'
      );
      return;
    }

    this.loading = true;

    this.authService.login(this.loginDto).subscribe({
      next: async (resp: ApiResponse<{ userId: number }>) => {
        console.log('✅ Respuesta del login:', resp);

        if (!resp?.success) {
          await this.showAlert(
            'Error',
            resp?.message || 'Error de autenticación.',
            'error'
          );
          return;
        }

        this.tempUserId = resp.data?.userId;
        console.log('🧩 UserId recibido:', this.tempUserId);

        // Mostrar mensaje de éxito
        await this.showToast(
          resp.message || 'Código enviado a tu correo electrónico',
          'success'
        );

        // Navegar a verificación OTP con state
        setTimeout(() => {
          this.router.navigate(['/verify-otp'], {
            state: {
              userId: this.tempUserId,
              username: this.loginDto.username,
              password: this.loginDto.password
            }
          });
        }, 1500);
      },
      error: async (err: Error) => {
        console.error('❌ Error en login:', err);
        await this.showAlert(
          'Error de autenticación',
          err?.message || 'Credenciales incorrectas o servidor no disponible.',
          'error'
        );
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /**
   * Navegar a recuperación de contraseña
   */
  restablecerContrasena() {
    this.router.navigate(['/reset-password']);
  }

  /**
   * Mostrar alerta
   */
  private async showAlert(title: string, message: string, type: 'warning' | 'error' | 'success') {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      cssClass: `alert-${type}`
    });

    await alert.present();
  }

  /**
   * Mostrar toast notification
   */
  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });

    await toast.present();
  }
}
