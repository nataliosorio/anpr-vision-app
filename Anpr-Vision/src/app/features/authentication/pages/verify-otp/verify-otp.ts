import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  shieldCheckmarkOutline,
  arrowBackOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/auth.service';
import { VerificationRequestDto } from '../../models/verificationRequestDto';
import { AuthData } from '../../models/AuthData';
import { ApiResponse } from '../../models/ApiResponse';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonButton,
    IonSpinner,
    IonIcon
  ]
})
export class VerifyOtpPage implements OnInit, OnDestroy {

  userId!: number;
  username!: string;
  password!: string;

  otpForm!: FormGroup;
  otpIdx = [0, 1, 2, 3, 4, 5];
  loading = false;

  // Resend countdown
  resendDisabled = true;
  countdown = 60;
  private countdownInterval: any;

  // Imágenes de fondo (las mismas del login)
  backgroundImages: string[] = [
     'assets/imgParking/parking1.jpg',
    'assets/imgParking/parking2.jpg',
    'assets/imgParking/parking3.jpg',
    'assets/imgParking/parking4.jpg'
  ];

  currentBgIndex = 0;
  private bgIntervalId: any;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  constructor() {
    // Registrar iconos
    addIcons({
      shieldCheckmarkOutline,
      arrowBackOutline
    });
  }

  ngOnInit(): void {
    // Obtener datos del state
    const navState = history.state;

    this.userId = navState.userId;
    this.username = navState.username;
    this.password = navState.password;

    // Validar que existan los datos necesarios
    if (!this.userId || !this.username) {
      this.showAlert(
        'Error',
        'Datos de usuario no válidos. Vuelve a iniciar sesión.',
        'error'
      );
      this.router.navigate(['/login']);
      return;
    }

    // Inicializar formulario OTP
    this.otpForm = this.fb.group({
      '0': ['', [Validators.required, Validators.pattern('[0-9]')]],
      '1': ['', [Validators.required, Validators.pattern('[0-9]')]],
      '2': ['', [Validators.required, Validators.pattern('[0-9]')]],
      '3': ['', [Validators.required, Validators.pattern('[0-9]')]],
      '4': ['', [Validators.required, Validators.pattern('[0-9]')]],
      '5': ['', [Validators.required, Validators.pattern('[0-9]')]],
    });

    // Iniciar rotación de fondo
    this.startBackgroundRotation();

    // Iniciar countdown para reenvío
    this.startResendCountdown();

    // Auto-focus en primer input
    setTimeout(() => {
      const firstInput = document.querySelector('#otp-0') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 300);
  }

  ngOnDestroy() {
    if (this.bgIntervalId) {
      clearInterval(this.bgIntervalId);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startBackgroundRotation() {
    this.bgIntervalId = setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.backgroundImages.length;
    }, 5000);
  }

  startResendCountdown() {
    this.resendDisabled = true;
    this.countdown = 60;

    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        this.resendDisabled = false;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  /**
   * Verificar código OTP
   */
  async verifyOtp() {
    if (this.otpForm.invalid) {
      await this.showAlert(
        'Código inválido',
        'Por favor, ingresa el código de 6 dígitos.',
        'warning'
      );
      return;
    }

    this.loading = true;

    const otpCode = Object.values(this.otpForm.value).join('');
    const dto: VerificationRequestDto = {
      userId: this.userId,
      code: otpCode
    };

    this.authService.verifyOtp(dto).subscribe({
      next: async (resp) => {
        let data: AuthData | null = null;

        try {
          data = this.unwrapData(resp);
        } catch (e: any) {
          throw new Error(e?.message || 'Error de verificación.');
        }

        if (!data?.token) {
          throw new Error('Respuesta inválida del servidor (sin token).');
        }

        // Guardar sesión en localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', this.username);
        localStorage.setItem('userId', JSON.stringify(data.userId));
        localStorage.setItem('personId', JSON.stringify(data.personId));
        localStorage.setItem('rolesByParking', JSON.stringify(data.rolesByParking));

        // Mostrar mensaje de éxito
        await this.showToast('Has iniciado sesión correctamente', 'success');

        // Navegar a la siguiente pantalla
        setTimeout(() => {
          this.router.navigate(['/tabs/tab1']); // o '/select-parking' según tu flujo
        }, 1500);
      },
      error: async (err: Error) => {
        console.error('❌ Error en verificación:', err);
        await this.showAlert(
          'Error de verificación',
          err?.message || 'Código incorrecto o expirado.',
          'error'
        );

        // Limpiar formulario
        this.otpForm.reset();
        const firstInput = document.querySelector('#otp-0') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /**
   * Reenviar código OTP
   */
  async resendCode() {
    if (this.resendDisabled) return;

    this.loading = true;

    // Crear nuevo LoginDto para reenviar
    const loginDto = {
      username: this.username,
      password: this.password
    };

    this.authService.login(loginDto).subscribe({
      next: async (resp) => {
        if (resp?.success) {
          await this.showToast('Código reenviado correctamente', 'success');

          // Limpiar formulario y reiniciar countdown
          this.otpForm.reset();
          this.startResendCountdown();

          const firstInput = document.querySelector('#otp-0') as HTMLInputElement;
          if (firstInput) firstInput.focus();
        }
      },
      error: async (err: Error) => {
        console.error('❌ Error al reenviar código:', err);
        await this.showAlert(
          'Error',
          'No se pudo reenviar el código. Intenta nuevamente.',
          'error'
        );
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /**
   * Maneja el input en las cajas OTP
   */
  onOtpInput(index: number, event: any) {
    const input = event.target;
    const value = input.value;

    // Solo permitir números
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      this.otpForm.get(index.toString())?.setValue('');
      return;
    }

    // Mover al siguiente input si hay valor
    if (value && index < 5) {
      const nextInput = document.querySelector(`#otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Auto-submit si todos los campos están llenos
    if (index === 5 && value) {
      setTimeout(() => {
        if (this.otpForm.valid) {
          this.verifyOtp();
        }
      }, 100);
    }
  }

  /**
   * Maneja el keydown en las cajas OTP
   */
  onOtpKeydown(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // Backspace: borrar y mover al anterior
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const prevInput = document.querySelector(`#otp-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
    }

    // Flechas izquierda/derecha para navegación
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelector(`#otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }

    if (event.key === 'ArrowRight' && index < 5) {
      const nextInput = document.querySelector(`#otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  /**
   * Maneja el paste en las cajas OTP
   */
  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text');

    if (paste && /^\d{6}$/.test(paste)) {
      // Llenar todos los campos
      for (let i = 0; i < 6; i++) {
        this.otpForm.get(i.toString())?.setValue(paste[i]);
      }

      // Hacer focus en el último
      const lastInput = document.querySelector('#otp-5') as HTMLInputElement;
      if (lastInput) lastInput.focus();

      // Auto-submit
      setTimeout(() => {
        if (this.otpForm.valid) {
          this.verifyOtp();
        }
      }, 100);
    }
  }

  /**
   * Volver al login
   */
  backToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Extrae AuthData de la respuesta
   */
  private unwrapData(resp: AuthData | ApiResponse<AuthData>): AuthData | null {
    const isWrapped = (resp as ApiResponse<AuthData>)?.data !== undefined;

    if (isWrapped) {
      const wrapped = resp as ApiResponse<AuthData>;
      if (!wrapped.success) {
        throw new Error(wrapped.message || 'Error en verificación.');
      }
      return wrapped.data ?? null;
    }

    return resp as AuthData;
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
   * Mostrar toast
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
