import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() techniques: any = {
    torax: [],
    membros: [],
    coluna: [],
    cranio: [],
    bacia: []
  };

  @Input() currentTechnique: number | null = null;
  @Input() currentCategory: string | null = null;

  openSubmenu: keyof any | null = 'torax';

  toggleSubmenu(category: keyof any) {
    this.openSubmenu = this.openSubmenu === category ? null : category;
  }

  selectTechnique(techniqueId: number) {
    this.currentTechnique = techniqueId;
  }
}
