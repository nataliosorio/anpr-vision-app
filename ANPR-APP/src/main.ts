import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// 👇 Importar Ionicons y el registro de íconos
import { addIcons } from 'ionicons';
import { home, fastFoodSharp,settingsOutline,person,lockClosedOutline,createOutline, camera,car,enterOutline,exitOutline,carOutline,businessOutline,refreshOutline,informationCircleOutline,navigateOutline,bicycleOutline,trailSignOutline, closeOutline } from 'ionicons/icons';

// Registrar íconos necesarios
addIcons({
  home,
  fastFoodSharp,
  person,
  car,
  enterOutline,
  exitOutline,
  carOutline,
  refreshOutline,
  navigateOutline,
  bicycleOutline,
  trailSignOutline,
  informationCircleOutline,
  businessOutline,
  camera,
  createOutline,
  lockClosedOutline,
  closeOutline,
  settingsOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
