import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule]
})
export class WelcomePage implements OnInit, OnDestroy {

  // Array con las rutas de tus imágenes en assets
  images: string[] = [
    'assets/imgParking/parking1.jpg',
    'assets/imgParking/parking2.jpg',
    'assets/imgParking/parking3.jpg',
    'assets/imgParking/parking4.jpg'
  ];

  currentImageIndex: number = 0;
  private intervalId: any;

  constructor(private router: Router) { }

  ngOnInit() {
    // Inicia el cambio automático de imágenes cada 3 segundos
    this.startImageRotation();
  }

  ngOnDestroy() {
    // Limpia el intervalo cuando se destruye el componente
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startImageRotation() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 3000); // Cambia cada 3 segundos
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
