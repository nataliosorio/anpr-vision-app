import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { GeneralService } from 'src/app/generic/services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.page.html',
  styleUrls: ['./configuration.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ConfigurationPage {
username: string | null = null;
  roles: string[] = [];
 user = {
    fullName: 'Jon Möller',
    location: 'Stockholm, Sweden',
    role: 'Visual Designer',
    avatarUrl: '' // coloca URL si tienes
  };

  darkMode = false;

  constructor(private navCtrl: NavController, private general: GeneralService, private router: Router) {}

   async ngOnInit() {
    await this.loadUserInfo();
    // Escuchar cambios de ruta para actualizar el estado activo

  }

     private async loadUserInfo() {
    this.username = await this.general.getUsername();   // <- obtiene de Preferences
    this.roles = await this.general.getUserRoles();     // <- obtiene de Preferences
  }

 getInitials(): string {
    if (!this.username) return 'A';
    return this.username.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  goBack() {
    this.router.navigate(['/home']);

    // this.navCtrl.back();
  }

  upgrade() {
    this.router.navigate(['/profile']);
    // TODO: navega a pago/upgrade
    console.log('Upgrade clicked');
  }

  open(section: string) {
    // TODO: Navegar a subpáginas: notifications, privacy, etc.
    console.log('Open ->', section);
  }

  onToggleDark(ev: any) {
    const enabled = ev.detail?.checked ?? this.darkMode;
    this.darkMode = enabled;
    document.body.classList.toggle('dark', enabled);
  }

}
