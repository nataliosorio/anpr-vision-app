
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, home, homeOutline, settingsOutline, homeSharp, carSportSharp, golfSharp, logInSharp, settingsSharp, personSharp, closeOutline, chevronBack, chevronBackOutline, notifications, notificationsOutline, lockClosedOutline, helpCircleOutline, informationCircleOutline } from 'ionicons/icons';
import { GeneralService } from './generic/services/general.service';
import { CommonModule } from '@angular/common';
import { MenuController } from '@ionic/angular';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonRouterLink,CommonModule,IonicModule],
})
export class AppComponent  implements OnInit {
  public appPages = [
    {title: 'Inicio', url: '/tabs/home', icon: 'home'},
    { title: 'Estacionamiento', url: '/in-parking', icon: 'golf' },
  //  { title: 'Dashboard', url: 'pages/dashboard', icon: 'grid' },
    { title: 'Vehículos', url: '/folder/trash', icon: 'car-sport' },
    { title: 'Cuenta', url: '/profile', icon: 'person' },
    {title: 'configuracion', url: '/configuration', icon: 'settings'},
    { title: 'Cerrar sesion', url: '/folder/archived', icon: 'log-in' },

  ];
  // public labels = ['Family'];
   username: string | null = null;
  roles: string[] = [];
   currentUrl: string = '';
    publicRoutes = ['/splash', '/login'];

   get isPublic() { return this.publicRoutes.some(r => this.currentUrl.startsWith(r)); }
  constructor(private general: GeneralService,private menuController: MenuController,private router: Router) {
    addIcons({ mailOutline,helpCircleOutline,informationCircleOutline,lockClosedOutline,notificationsOutline,chevronBackOutline, mailSharp,closeOutline,carSportSharp,golfSharp,logInSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp,  homeOutline, homeSharp, settingsSharp,personSharp });
    // this.currentUrl = this.router.url;
  }

     async ngOnInit() {
    await this.loadUserInfo();
    // Escuchar cambios de ruta para actualizar el estado activo
    // this.router.events.subscribe(() => {
    //   this.currentUrl = this.router.url;
    // });
       // 1) toma la URL actual inmediatamente
    this.currentUrl = this.router.url;

      // 2) aplica estado de menú según ruta actual
    await this.applyMenuState();

      // 3) escucha navegaciones
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(async e => {
        this.currentUrl = e.urlAfterRedirects;
        await this.applyMenuState();
      });
  }

    private async applyMenuState() {
    if (this.isPublic) {
      await this.menuController.enable(false, 'main-menu');
      await this.menuController.swipeGesture(false, 'main-menu');
      await this.menuController.close('main-menu');
    } else {
      await this.menuController.enable(true, 'main-menu');
      await this.menuController.swipeGesture(true, 'main-menu');
    }
  }
  //  private async loadUserInfo() {
  //   this.username = await this.general.getUsername();   // <- obtiene de Preferences
  //   this.roles = await this.general.getUserRoles();     // <- obtiene de Preferences
  // }

    private async loadUserInfo() {
    this.username = await this.general.getUsername();   // <- obtiene de Preferences
    this.roles = await this.general.getUserRoles();     // <- obtiene de Preferences
  }

// Cerrar el menú
  async closeMenu() {
    await this.menuController.close('main-menu');
  }

  async navigateToPage(url: string) {
    await this.menuController.close('main-menu');
    this.router.navigateByUrl(url);
  }


  // Verificar si la ruta está activa
 isActiveRoute(url: string): boolean {
    return this.currentUrl === url || this.currentUrl.startsWith(url + '/');
  }


  // Obtener iniciales del nombre para el avatar
  getInitials(): string {
    if (!this.username) return 'A';
    return this.username.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Método opcional para manejar acciones especiales (como logout)
  async handleSpecialAction(url: string, title: string) {
    if (title === 'Cerrar sesión') {
      // Aquí puedes añadir lógica de logout
      console.log('Cerrando sesión...');
      // await this.authService.logout();
      // this.router.navigate(['/login']);
    } else {
      this.navigateToPage(url);
    }
  }
}

