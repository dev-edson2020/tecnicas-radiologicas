import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
     importProvidersFrom(
      CommonModule,
      FormsModule,
      HttpClientModule,
      // Se usar roteamento, descomente:
      // RouterModule.forRoot(routes)
    ),
    provideRouter(routes, ),
    provideAnimations()
  ]
};