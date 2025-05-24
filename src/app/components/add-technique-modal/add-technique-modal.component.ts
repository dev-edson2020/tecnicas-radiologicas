import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TechniqueService } from '../../services/technique.service';
import { Category } from '../../models/category';
import { Technique } from '../../models/technique.';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-technique-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './add-technique-modal.component.html',
  styleUrls: ['./add-technique-modal.component.scss']
})
export class AddTechniqueModalComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Technique>();
  @ViewChild('nameInput') nameInputRef!: ElementRef;

  categories: Category[] = [];

  selectedCategoryId: number = 1;

  newTechnique = {
    name: '',
    kv: 0,
    mas: 0,
    ma: 0,
    distance: 0
  };

  constructor(
    private techniqueService: TechniqueService,
    private categoryService: CategoryService
  ) { }

 ngAfterViewInit() {
  setTimeout(() => {
    this.nameInputRef?.nativeElement?.focus();
  });

  this.loadCategories(); // Carregar categorias ao abrir o modal
}

loadCategories(): void {
  this.categoryService.getAll().subscribe({
    next: (data) => {
      this.categories = data;

      if (this.categories.length > 0) {
        this.selectedCategoryId = this.categories[0].id;
      }
    },
    error: (err) => {
      console.error('Erro ao carregar categorias:', err);
    }
  });
}

  onSave() {
    if (!this.isFormValid()) {
      this.showValidationError();
      return;
    }

    const techniqueToSave: Technique = {
      id: null,
      name: this.newTechnique.name.trim(),
      kv: this.newTechnique.kv,
      mas: this.newTechnique.mas,
      ma: this.newTechnique.ma,
      distance: this.newTechnique.distance,
      category: {
        id: this.selectedCategoryId   // ESSENCIAL: enviar objeto com ID numérico
      },
      fullName: ''
    };

    this.techniqueService.addTechnique(techniqueToSave).subscribe({
      next: (savedTechnique) => {
        console.log('Técnica salva com sucesso:', savedTechnique);
        this.save.emit(savedTechnique);
        this.close.emit();
      },
      error: (err) => {
        console.error('Erro ao salvar técnica:', err);
      }
    });
  }


  isFormValid(): boolean {
    return (
      this.newTechnique.name.trim() !== '' &&
      this.newTechnique.kv > 0 &&
      this.newTechnique.mas > 0 &&
      this.newTechnique.ma > 0 &&
      this.newTechnique.distance > 0
    );
  }

  private showValidationError() {
    const errorElement = document.querySelector('.validation-error');
    if (errorElement) {
      errorElement.classList.add('visible');
      setTimeout(() => errorElement.classList.remove('visible'), 3000);
    }
  }
}
