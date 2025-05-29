import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { TechniqueCardComponent } from "../../components/technique-card/technique-card.component";
import { Technique } from "../../models/technique";
import { TechniqueService } from "../../services/technique.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-techniques-page',
  standalone: true,
  imports: [CommonModule, TechniqueCardComponent],
  templateUrl: './technique-page.component.html',
  styleUrls: ['./technique-page.component.scss']
})
export class TechniquesPageComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  techniques: Technique[] = [];
  selectedTechnique: Technique | null = null;
  errorMessage: string | null = null;
  categories: string[] = [];
  isLoading = true;

  constructor(
    private techniqueService: TechniqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.techniqueService.techniques$.subscribe({
        next: (techniques) => {
          this.techniques = techniques;
          this.updateCategories();
          this.isLoading = false;

          const id = this.route.snapshot.paramMap.get('id');
          if (id) {
            this.selectTechniqueById(+id);
          } else if (!this.selectedTechnique && techniques.length > 0) {
            this.selectedTechnique = techniques[0];
          } else if (techniques.length === 0) {
            this.selectedTechnique = null;
          }
        },
        error: (err) => {
          console.error('Erro ao carregar técnicas:', err);
          this.errorMessage = 'Não foi possível carregar as técnicas. Tente novamente mais tarde.';
          this.isLoading = false;
        }
      })
    );

    // Observa mudança de rota (caso o id mude via navegador)
    this.subscription.add(
      this.route.paramMap.subscribe((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.selectTechniqueById(+id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectTechniqueById(id: number) {
    const tech = this.techniques.find(t => t.id === id);
    this.selectedTechnique = tech ?? null;
  }

  onTechniqueCreated(created: Technique) {
    this.selectedTechnique = created;
    this.router.navigate(['/tecnicas', created.id]);
  }

  onTechniqueSelect(technique: Technique) {
    this.selectedTechnique = technique;
  }

  onDelete(deletedId: number): void {
    this.techniqueService.deleteTechnique(deletedId).subscribe({
      next: () => {
        this.techniqueService.removeTechniqueFromSubject(deletedId);
        const remaining = this.techniques.filter(t => t.id !== deletedId);

        if (remaining.length > 0) {
          const nextTech = remaining[0];
          this.selectedTechnique = nextTech;
          this.router.navigate(['/tecnicas', nextTech.id]);
        } else {
          this.selectedTechnique = null;
          this.router.navigate(['/tecnicas']);
        }
      },
      error: (err) => {
        console.error('Erro ao excluir técnica:', err);
        alert('Não foi possível excluir a técnica. Tente novamente.');
      }
    });
  }

  updateCategories(): void {
    this.categories = [...new Set(this.techniques.map(t => t.category))];
  }
}
