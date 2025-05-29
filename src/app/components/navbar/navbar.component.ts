import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechniqueService } from '../../services/technique.service';
import { MatIconModule } from '@angular/material/icon';
import { Technique } from '../../models/technique';
import { RouterLink, ActivatedRoute } from '@angular/router';
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

  private subscription = new Subscription();

  categories: string[] = [];
  groupedTechniques: Map<string, Technique[]> = new Map();
  entries: { key: string; value: Technique[] }[] = [];

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

    this.subscription.add(
      this.techniqueService.techniques$.subscribe(techniques => {
        this.categories = [...new Set(techniques.map(t => t.category?.name).filter(Boolean))];
        this.groupedTechniques = this.groupTechniquesByCategory(techniques);
        this.updateEntries();
      })
    );

    // Ajuste para evitar erro null: firstChild pode ser null
    if (this.route.firstChild) {
      this.subscription.add(
        this.route.firstChild.paramMap.subscribe(params => {
          const id = params.get('id');
          if (id) {
            this.activeTechniqueId = +id;
          }
        })
      );
    }
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
    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats.map(c => c.name).filter(name => typeof name === 'string');

      this.techniqueService.getAll().subscribe(techniques => {
        this.groupedTechniques = this.groupTechniquesByCategory(techniques);

        // Garantir que todas as categorias estejam no mapa, mesmo sem técnicas
        this.categories.forEach(name => {
          if (!this.groupedTechniques.has(name)) {
            this.groupedTechniques.set(name, []);
          }
        });

        this.updateEntries();
      });
    });
  }

  private updateEntries(): void {
    this.entries = Array.from(this.groupedTechniques.entries()).map(([key, value]) => ({ key, value }));
  }

  private groupTechniquesByCategory(techniques: Technique[]): Map<string, Technique[]> {
    const map = new Map<string, Technique[]>();
    techniques.forEach(tech => {
      const categoryName = tech.category?.name?.trim();
      if (categoryName) {
        if (!map.has(categoryName)) {
          map.set(categoryName, []);
        }
        map.get(categoryName)!.push(tech);
      }
    });
    return map;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
