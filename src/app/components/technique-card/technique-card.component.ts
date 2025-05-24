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
  @Output() delete = new EventEmitter<Technique>();
  @Input() technique: Technique | null = null;
  @ViewChild('kVInput') kVInput!: ElementRef<HTMLInputElement>;
  
  isEditing = false;
  originalValues: Partial<Technique> = {};

 toggleEdit() {
  if (!this.technique) return;

  if (!this.isEditing) {
    this.originalValues = {
      kv: this.technique.kv,
      mas: this.technique.mas,
      ma: this.technique.ma,
      distance: this.technique.distance
    };
  }
  this.isEditing = !this.isEditing; // Habilita os campos
  if (this.isEditing) {
    setTimeout(() => {
      this.kVInput.nativeElement.focus();
    });
  }
}

  saveChanges() {
    this.isEditing = false;
  }

  cancelEdit() {
    if (this.technique && this.originalValues) {
      this.technique.kv = this.originalValues.kv || 0;
      this.technique.mas = this.originalValues.mas || 0;
      this.technique.ma = this.originalValues.ma || 0;
      this.technique.distance = this.originalValues.distance || 0;
      this.isEditing = false;
    }
  }

  deleteTechnique() {
    if (this.technique) {
      this.delete.emit(this.technique);
    }
  }
}