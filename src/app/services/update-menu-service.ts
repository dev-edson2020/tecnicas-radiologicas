import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateMenuService {
  private menuUpdateSource = new Subject<void>();

  // Observable que quem quiser escutar pode se inscrever
  menuUpdate$ = this.menuUpdateSource.asObservable();

  // Método para emitir o evento de atualização
  notifyMenuUpdate(): void {
    this.menuUpdateSource.next();
  }
}
