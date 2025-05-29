import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TechniqueService } from '../../services/technique.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Importa o FooterComponent standalone
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    NavbarComponent  
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private techniqueService: TechniqueService
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/' || this.router.url === '') {
      this.techniqueService.getAll().subscribe(techniques => {
        if (techniques.length > 0) {
          const firstId = techniques[0].id;
          this.router.navigate(['tecnicas', firstId], { relativeTo: this.route });
        }
      });
    }
  }
}
