import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Technique } from '../../models/technique';

@Component({
  selector: 'app-technique-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technique-card.component.html',
  styleUrls: ['./technique-card.component.scss']
})
export class TechniqueCardComponent {
  @Input() technique!: Technique;
  @Output() onDelete = new EventEmitter<void>();

  isEditing = false;

  toggleEdit() {
    this.isEditing = true;
  }

  saveChanges() {
    // Aqui você poderia emitir evento com a técnica atualizada
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
    // Poderia restaurar os valores antigos se necessário
  }
}
