import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { TechniquesPageComponent } from './pages/technique-page/technique-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'tecnicas',
        component: TechniquesPageComponent
      },
      {
        path: 'tecnicas/:id',
        component: TechniquesPageComponent 
      }
    ]
  }
];