import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Technique } from './models/technique';
import { HeaderComponent } from './components/header/header.component'; // ajuste o caminho se necessário

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header (novaTecnicaSalva)="onNovaTecnicaSalva($event)" />
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Sua Aplicação';
  selectedTechnique?: Technique;

  onNovaTecnicaSalva(t: Technique) {
    this.selectedTechnique = t;
    console.log('Técnica recebida no AppComponent:', t);
  }
}
