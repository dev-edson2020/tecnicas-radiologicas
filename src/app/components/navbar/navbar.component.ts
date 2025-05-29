import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechniqueService } from '../../services/technique.service';
import { MatIconModule } from '@angular/material/icon';
import { Technique } from '../../models/technique';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() tecnicaSelecionada = new EventEmitter<Technique>();
  subscription = new Subscription();
  categories: string[] = [];
  techniquesByCategory = new Map<string, Technique[]>();
  expandedCategory: string | null = null;
  activeTechniqueId: number | null = null;

  constructor(
    private techniqueService: TechniqueService,
    private categoryService: CategoryService,
    private updateMenuService: UpdateMenuService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const savedId = localStorage.getItem('activeTechniqueId');
    if (savedId) {
      this.activeTechniqueId = +savedId;
    }

    this.loadCategoriesAndTechniques();

    this.subscription.add(
      this.updateMenuService.menuUpdate$.subscribe(() => {
        this.loadCategoriesAndTechniques();
      })
    );

    this.route.firstChild?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activeTechniqueId = +id;
      }
    });
  }

  setActive(id: number): void {
    this.activeTechniqueId = id;
    localStorage.setItem('activeTechniqueId', id.toString());
  }

  selecionarTecnica(tecnica: Technique): void {
    this.tecnicaSelecionada.emit(tecnica);
  }

  toggleCategory(category: string): void {
    this.expandedCategory = this.expandedCategory === category ? null : category;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
