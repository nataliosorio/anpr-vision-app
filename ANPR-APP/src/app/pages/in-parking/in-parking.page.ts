import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ToastController, LoadingController, AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-in-parking',
  templateUrl: './in-parking.page.html',
  styleUrls: ['./in-parking.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class InParkingPage  {
user = { name: 'Jon Möller', avatarUrl: '' };

  // Activity + rango
  activity = 3592;
  rangeIndex = 0; // 0=Daily, 1=Weekly, 2=Monthly
  get rangeLabel() { return ['Daily', 'Weekly', 'Monthly'][this.rangeIndex]; }
  cycleRange() {
    this.rangeIndex = (this.rangeIndex + 1) % 3;
    // demo: cambia actividad un poco
    const base = [3592, 21430, 85860][this.rangeIndex];
    this.activity = base + Math.floor(Math.random() * 300);
  }

  // Progreso card
  completed = 2;
  total = 5;
  get progress() { return Math.round((this.completed / this.total) * 100); }

  // circle math
  size = 96;
  radius = 38;
  get center() { return this.size / 2; }
  get circumference() { return 2 * Math.PI * this.radius; }
  get dashArray() { return `${(this.progress / 100) * this.circumference}, ${this.circumference}`; }

  // Water
  water = 2;
  goalWater = 3; // litros

  // Food (semicírculo desde 10..110)
  kcal = 1498;
  get foodPath() {
    const pct = Math.min(1, this.kcal / 2200); // meta demo
    const x = 10 + 100 * pct;
    return `M10,50 A50,50 0 0,1 ${x},50`;
  }

  // Exercise dots
  minutes = 42;
  exDots = Array.from({ length: 7 }, () => ({
    x: Math.random() * 90 + 4,  // 4..94%
    y: Math.random() * 80 + 6   // 6..86%
  }));

  getInitials(name: string) {
    return (name || 'U')
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  openProfile(){ /* TODO navegar al perfil */ }

}
