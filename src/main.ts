import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';

// 👇 Necesario para cargar Storage como provider en standalone
import { importProvidersFrom } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideAnimations(),


    provideLottieOptions({
      player: () => player
    }),

    // 👇 **AGREGADO: Storage configurado correctamente**
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: 'studyathome_db',  // nombre opcional pero recomendado
      })
    ),

    provideHttpClient(withInterceptorsFromDi()),


  ],
});
