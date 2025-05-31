import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Technique } from '../../models/technique';
import {MatCardModule} from '@angular/material/card';
import { TechniqueService } from '../../services/technique.service';

@Component({
  selector: 'app-technique-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './technique-card.component.html',
  styleUrls: ['./technique-card.component.scss']
})
export class TechniqueCardComponent implements OnChanges {

  @ViewChild('kvInput') kvInput!: ElementRef;

  @Input() technique!: Technique;
  @Output() onDelete = new EventEmitter<number>();

  isEditing = false;
  localTechnique!: Technique;

  constructor(private techniqueService: TechniqueService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['technique'] && this.technique) {
      this.localTechnique = { ...this.technique };
      this.isEditing = false; // Garante que volta ao modo de visualização
    }
  }

  toggleEdit() {
    this.isEditing = true;
    setTimeout(() => {
      this.kvInput?.nativeElement?.focus();
    });
  }

saveChanges() {
  const updatedTechnique: Technique = {
    ...this.localTechnique,
    id: this.technique.id,
    category: this.technique.category
  };

  this.techniqueService.updateTechnique(this.technique.id, updatedTechnique).subscribe({
    next: updated => {
      this.technique = updated;
      this.localTechnique = { ...updated };
      this.isEditing = false;
    },
    error: err => {
      console.error('Erro ao atualizar técnica:', err);
      alert('Erro ao salvar alterações. Tente novamente.');
    }
  });
}

cancelEdit() {
  this.localTechnique = { ...this.technique };
  this.isEditing = false;
}
}
