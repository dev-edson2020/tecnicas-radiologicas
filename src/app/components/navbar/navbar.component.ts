import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechniqueService } from '../../services/technique.service';
import { MatIconModule } from '@angular/material/icon';
import { Technique } from '../../models/technique.';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { UpdateMenuService } from '../../services/update-menu-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() tecnicaSelecionada = new EventEmitter<Technique>();
  subscription = new Subscription();
  categories: string[] = [];
  activeIndex: number | null = null;

  selecionarTecnica(tecnica: Technique): void {
    this.tecnicaSelecionada.emit(tecnica);
  }
  techniquesByCategory = new Map<string, Technique[]>();
  expandedCategory: string | null = null;
  constructor(private techniqueService: TechniqueService,
    private categoryService: CategoryService,
    private updateMenuService: UpdateMenuService) { }

  ngOnInit(): void {
    const savedIndex = localStorage.getItem('activeMenuIndex');
    if (savedIndex) {
      this.activeIndex = parseInt(savedIndex);
    }

    this.loadCategoriesAndTechniques();

    this.subscription.add(
      this.updateMenuService.menuUpdate$.subscribe(() => {
        this.loadCategoriesAndTechniques();
      })
    );
  }

  setActive(index: number) {
    this.activeIndex = index;
    // Salva no localStorage se necessário persistência
    localStorage.setItem('activeMenuIndex', index.toString());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCategoriesAndTechniques(): void {
    this.techniquesByCategory.clear();

    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats.map(c => c.name).filter(name => typeof name === 'string');

      this.techniqueService.getAll().subscribe(techniques => {
        techniques.forEach(tech => {
          const categoryName = tech.category?.name?.trim();
          if (categoryName) {
            if (!this.techniquesByCategory.has(categoryName)) {
              this.techniquesByCategory.set(categoryName, []);
            }
            this.techniquesByCategory.get(categoryName)!.push(tech);
          }
        });

        this.categories.forEach(name => {
          if (!this.techniquesByCategory.has(name)) {
            this.techniquesByCategory.set(name, []);
          }
        });
      });
    });
  }

  toggleCategory(category: string): void {
    this.expandedCategory = this.expandedCategory === category ? null : category;
  }
}
