import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TechniqueService } from '../../services/technique.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { Technique } from '../../models/technique';
import { UpdateMenuService } from '../../services/update-menu-service';

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
  @Output() tecnicaSalva = new EventEmitter<void>();

  @ViewChild('nameInput', { static: true })
  nameInputRef!: ElementRef<HTMLInputElement>;

  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  submitted = false;

  newTechnique: {
    name: string;
    kv: number | null;
    mas: number | null;
    ma: number | null;
    distance: number | null;
  } = {
      name: '',
      kv: null,
      mas: null,
      ma: null,
      distance: null
    };

  constructor(
    private techniqueService: TechniqueService,
    private categoryService: CategoryService,
    private updateMenuService: UpdateMenuService
  ) { }

  ngAfterViewInit() {
    setTimeout(() => this.nameInputRef.nativeElement.focus(), 0);
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: cats => {
        this.categories = cats;
        // if (cats.length) {
        //   this.selectedCategoryId = cats[0].id;
        // }
      },
      error: err => console.error('Erro ao carregar categorias:', err)
    });
  }

onSave(form: NgForm) {
  this.submitted = true;

  if (form.invalid || !this.selectedCategoryId) {
    return;
  }

  const techniqueToSave: Technique = {
    id: null,
    name: this.newTechnique.name!.trim(),
    kv: this.newTechnique.kv!,
    mas: this.newTechnique.mas!,
    ma: this.newTechnique.ma!,
    distance: this.newTechnique.distance!,
    category: { id: this.selectedCategoryId },
    fullName: ''
  };

  this.techniqueService.addTechnique(techniqueToSave).subscribe({
    next: saved => {
      this.save.emit(saved); 
      this.updateMenuService.notifyMenuUpdate();
      this.close.emit();    
    },
    error: err => console.error('Erro ao salvar técnica:', err)
  });
}

  onClose() {
    this.close.emit();
  }
}
