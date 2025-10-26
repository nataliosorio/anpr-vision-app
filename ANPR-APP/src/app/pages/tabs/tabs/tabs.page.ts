import { Component, EnvironmentInjector, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { CommonModule } from '@angular/common'; // 👈 IMPORTANTE
import { filter } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon,CommonModule],
})
export class TabsPage {


   selectedTab = 'home';

  constructor(private router: Router) {}

  ngOnInit() {
    this.detectCurrentTab();

    // Detectar cambios al navegar entre tabs (sin necesidad de click)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.detectCurrentTab();
      });
  }

  detectCurrentTab() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('home')) {
      this.selectedTab = 'home';
    } else if (currentUrl.includes('ordenar')) {
      this.selectedTab = 'ordenar';
    } else if (currentUrl.includes('user')) {
      this.selectedTab = 'user';
    }
  }

  goTo(tab: string) {
    this.selectedTab = tab;
    this.router.navigate([`/tabs/${tab}`]);
  }
}
