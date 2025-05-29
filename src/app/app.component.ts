import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Removi HttpClientModule daqui
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'Sua Aplicação'; // Adicionei um título como exemplo
}