import { Routes } from '@angular/router';
import { TechniqueCardComponent } from './components/technique-card/technique-card.component';


export const routes: Routes = [
  {
    path: 'tecnica/:id',
    component: TechniqueCardComponent,
  },
  {
    path: '',
    redirectTo: 'tecnica/1', // ou outra técnica padrão
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'tecnica/1',
  },
];
