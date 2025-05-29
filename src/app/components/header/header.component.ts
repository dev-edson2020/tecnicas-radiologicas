import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTechniqueModalComponent } from '../add-technique-modal/add-technique-modal.component';
import { Technique } from '../../models/technique';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AddTechniqueModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  showAddTechniqueModal = false;

  @Output() novaTecnicaSalva = new EventEmitter<Technique>();

  // Abre o modal
  onAddTechnique() {
    this.showAddTechniqueModal = true;
  }

  // Fecha o modal
  closeModal() {
    this.showAddTechniqueModal = false;
  }

  // Recebe a técnica salva e emite para o componente pai
  onNovaTecnicaSalva(nova: Technique) {
    this.novaTecnicaSalva.emit(nova); // emite para o AppComponent
    this.showAddTechniqueModal = false;
  }
}
