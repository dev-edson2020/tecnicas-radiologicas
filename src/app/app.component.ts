import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { TechniqueCardComponent } from './components/technique-card/technique-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { AddTechniqueModalComponent } from './components/add-technique-modal/add-technique-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { TechniqueService } from './services/technique.service';
import { Technique } from './models/technique.';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent,
    HeaderComponent,
    TechniqueCardComponent,
    FooterComponent,
    AddTechniqueModalComponent,
    ConfirmModalComponent,  
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentTechnique: Technique | null = null;
  showAddModal = false;
  showConfirmModal = false;
  confirmMessage = '';
  techniqueToDelete: number | null = null; // id como number

  // técnicas organizadas por categoria (string da categoria)
  techniques: { [categoryName: string]: Technique[] } = {};

  techniqueSelecionada: Technique | null = null;

onTecnicaSelecionada(tecnica: Technique) {
  this.techniqueSelecionada = tecnica;
}

  constructor(private techniqueService: TechniqueService) {}

  ngOnInit(): void {
    this.loadTechniques();
  }

  loadTechniques() {
    this.techniqueService.getTechniques().subscribe((techniques: Technique[]) => {
      this.techniques = {}; // limpa

      techniques.forEach(t => {
        const categoryName = t.category.name?.toLowerCase() || 'outros';

        if (!this.techniques[categoryName]) {
          this.techniques[categoryName] = [];
        }
        this.techniques[categoryName].push(t);
      });

      // Seleciona a técnica inicial (primeira do tórax ou qualquer outra)
      if (this.techniques['torax'] && this.techniques['torax'].length > 0) {
        this.currentTechnique = this.techniques['torax'][0];
      } else {
        // Se não houver tórax, pega qualquer primeira técnica
        const firstCategory = Object.keys(this.techniques)[0];
        this.currentTechnique = firstCategory ? this.techniques[firstCategory][0] : null;
      }
    });
  }

 showTechnique(techniqueId: any) {
  const id = Number(techniqueId);

  for (const category in this.techniques) {
    const found = this.techniques[category].find(t => t.id === id);
    if (found) {
      this.currentTechnique = found;
      break;
    }
  }
}

  openAddTechniqueModal() {
    this.showAddModal = true;
  }

  closeAddTechniqueModal() {
    this.showAddModal = false;
  }

  addNewTechnique(newTechnique: any) {
    const { name, category, kv, mas, ma, distance } = newTechnique;

    // Cria objeto category compatível (exemplo, deve vir do seu select no modal)
    const categoryObj = { id: category.id, name: category.name };

    // Criar técnica - id = null antes de salvar no backend
    const technique: Technique = {
      id: null,
      name,
      kv,
      mas,
      ma,
      distance,
      category: categoryObj,
      fullName: `${this.getCategoryName(category.name?.toLowerCase() || '')} - ${name}`
    };

    // Salva no backend
    this.techniqueService.addTechnique(technique).subscribe(savedTechnique => {
      // Após salvar, o backend retorna a técnica com id preenchido
      const catName = savedTechnique.category.name?.toLowerCase() || 'outros';

      if (!this.techniques[catName]) {
        this.techniques[catName] = [];
      }

      this.techniques[catName].push(savedTechnique);
      this.currentTechnique = savedTechnique;
      this.showAddModal = false;
    });
  }

  onDeleteTechnique(technique: Technique) {
    this.techniqueToDelete = technique.id;
    this.confirmMessage = `Tem certeza que deseja excluir a técnica "${technique.fullName}"? Esta ação não pode ser desfeita.`;
    this.showConfirmModal = true;
  }

  confirmDelete() {
    if (this.techniqueToDelete !== null) {
      this.techniqueService.deleteTechnique(this.techniqueToDelete).subscribe(() => {
        // Remove localmente
        for (const category in this.techniques) {
          this.techniques[category] = this.techniques[category].filter(t => t.id !== this.techniqueToDelete);
        }

        if (this.currentTechnique?.id === this.techniqueToDelete) {
          // Atualiza técnica atual
          this.currentTechnique = this.techniques['torax']?.[0] || null;
        }

        this.techniqueToDelete = null;
        this.showConfirmModal = false;
      });
    }
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.techniqueToDelete = null;
  }

  getCategoryName(categoryKey: string): string {
    const categoryNames: { [key: string]: string } = {
      'torax': 'Tórax',
      'membros superiores': 'Membros Superiores',
      'membros inferiores': 'Membros Inferiores',
      'coluna': 'Coluna',
      'cranio': 'Crânio',
      'abdome': 'Abdome',
      'bacia': 'Bacia',
      'especialidades': 'Especialidades'
    };
    return categoryNames[categoryKey] || categoryKey;
  }
}
