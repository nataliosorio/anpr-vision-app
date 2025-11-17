import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SplashComponent implements OnInit {

  particles: Array<{x: number, y: number, delay: number}> = [];

  constructor(private router: Router) {
    // Generar partículas para el fondo animado
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      });
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/welcome']);
    }, 4000); // 4 segundos para la animación
  }

}
