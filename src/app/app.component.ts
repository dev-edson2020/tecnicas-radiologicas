import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component'; // ajuste o caminho se necessário

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `  
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
