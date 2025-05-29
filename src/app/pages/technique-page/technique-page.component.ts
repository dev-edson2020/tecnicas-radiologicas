import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { TechniqueCardComponent } from "../../components/technique-card/technique-card.component";
import { Technique } from "../../models/technique";
import { TechniqueService } from "../../services/technique.service";

@Component({
  selector: 'app-techniques-page',
  standalone: true,
  imports: [CommonModule, TechniqueCardComponent],
  templateUrl: './technique-page.component.html',
  styleUrls: ['./technique-page.component.scss']
})
export class TechniquesPageComponent implements OnInit {
  techniques: Technique[] = [];
  selectedTechnique: Technique | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private techniqueService: TechniqueService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTechniques();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.selectTechniqueById(+id);
      } else if (this.techniques.length > 0) {
        this.selectedTechnique = this.techniques[0];
      }
    });
  }

  loadTechniques(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.techniqueService.getAll().subscribe({
      next: (techniques) => {
        this.techniques = techniques;
        // Se não tiver técnica selecionada ainda, pega a primeira
        if (!this.selectedTechnique && techniques.length > 0) {
          this.selectedTechnique = techniques[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar técnicas:', err);
        this.errorMessage = 'Não foi possível carregar as técnicas. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  selectTechniqueById(id: number) {
    const tech = this.techniques.find(t => t.id === id);
    if (tech) {
      this.selectedTechnique = tech;
    } else {
      this.selectedTechnique = null;
      // opcional: redirecionar ou mostrar mensagem
    }
  }

  onTechniqueCreated(created: Technique) {
    this.techniques.push(created);             
    this.selectedTechnique = created;          
    this.router.navigate(['/tecnicas', created.id]); 
  }

  onDelete(): void {
    if (this.selectedTechnique) {
      this.techniques = this.techniques.filter(t => t.id !== this.selectedTechnique!.id);
      this.selectedTechnique = this.techniques.length > 0 ? this.techniques[0] : null;
      if (this.selectedTechnique) {
        this.router.navigate(['/tecnicas', this.selectedTechnique.id]);
      } else {
        this.router.navigate(['/tecnicas']);
      }
    }
  }
}
