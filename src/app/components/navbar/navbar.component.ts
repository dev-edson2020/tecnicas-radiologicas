import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechniqueService } from '../../services/technique.service';
import { MatIconModule } from '@angular/material/icon';
import { Technique } from '../../models/technique.';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() tecnicaSelecionada = new EventEmitter<Technique>();

selecionarTecnica(tecnica: Technique): void {
  this.tecnicaSelecionada.emit(tecnica);
}
  techniquesByCategory = new Map<string, Technique[]>();
  expandedCategory: string | null = null;

  constructor(private techniqueService: TechniqueService) {}

  ngOnInit(): void {
    this.techniqueService.getAll().subscribe((techniques) => {
      techniques.forEach((tech) => {
        const cat = tech.category?.name;

        // Garantir que seja string válida
        if (typeof cat === 'string' && cat.trim().length > 0) {
          if (!this.techniquesByCategory.has(cat)) {
            this.techniquesByCategory.set(cat, []);
          }
          this.techniquesByCategory.get(cat)!.push(tech);
        }
      });
    });
  }

  toggleCategory(category: string): void {
    this.expandedCategory = this.expandedCategory === category ? null : category;
  }
}
