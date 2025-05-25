import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Technique } from '../../models/technique.';

@Component({
  selector: 'app-technique-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technique-card.component.html',
  styleUrls: ['./technique-card.component.scss']
})
export class TechniqueCardComponent {
  @Input() technique: Technique | null = null;
  @Output() delete = new EventEmitter<Technique>();
  @ViewChild('kVInput') kVInput!: ElementRef<HTMLInputElement>;

  isEditing = false;
  originalValues: Partial<Technique> = {};

  toggleEdit() {
    if (!this.technique) return;
    if (!this.isEditing) {
      this.originalValues = { ...this.technique };
    }
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      setTimeout(() => this.kVInput.nativeElement.focus());
    }
  }

  saveChanges() {
    this.isEditing = false;
  }

  cancelEdit() {
    if (this.technique && this.originalValues) {
      Object.assign(this.technique, this.originalValues);
      this.isEditing = false;
    }
  }

  deleteTechnique() {
    if (this.technique) {
      this.delete.emit(this.technique);
    }
  }
}
