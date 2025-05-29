import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Technique } from '../models/technique';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechniqueService {

  private apiUrl = 'http://localhost:8080/api/techniques';
  private techniquesSubject = new BehaviorSubject<Technique[]>([]);
  techniques$ = this.techniquesSubject.asObservable();

  // 🔔 Suporte a atualização do menu lateral
  private menuUpdateSubject = new Subject<void>();
  menuUpdate$ = this.menuUpdateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialTechniques(); // ← carrega as técnicas ao iniciar
  }

  private loadInitialTechniques(): void {
    this.http.get<Technique[]>(this.apiUrl).subscribe({
      next: techniques => this.techniquesSubject.next(techniques),
      error: err => console.error('Erro ao carregar técnicas iniciais:', err)
    });
  }

  addTechnique(technique: Technique): Observable<Technique> {
    return this.http.post<Technique>(this.apiUrl, technique).pipe(
      tap(created => {
        const updated = [...this.techniquesSubject.getValue(), created];
        this.techniquesSubject.next(updated);
        this.emitMenuUpdate(); // 🔔 atualiza o menu
      })
    );
  }

  deleteTechnique(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.removeTechniqueFromSubject(id);
        this.emitMenuUpdate(); // 🔔 atualiza o menu
      })
    );
  }

  removeTechniqueFromSubject(id: number): void {
    const current = this.techniquesSubject.getValue();
    const updated = current.filter(t => t.id !== id);
    this.techniquesSubject.next(updated);
  }

  updateTechnique(id: number, technique: Technique): Observable<Technique> {
    return this.http.put<Technique>(`${this.apiUrl}/${id}`, technique).pipe(
      tap(updatedTech => {
        const current = this.techniquesSubject.getValue();
        const index = current.findIndex(t => t.id === id);
        if (index > -1) {
          current[index] = updatedTech;
          this.techniquesSubject.next([...current]);
          this.emitMenuUpdate(); // 🔔 atualiza o menu
        }
      })
    );
  }

  getTechniqueById(id: number): Observable<Technique> {
    return this.http.get<Technique>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Technique[]> {
    return this.http.get<Technique[]>(this.apiUrl);
  }

  // Só use se quiser setar manualmente uma nova lista
  setTechniques(techniques: Technique[]) {
    this.techniquesSubject.next(techniques);
    this.emitMenuUpdate(); // opcional, pode remover se não quiser atualizar menu ao setar
  }

  // 🔔 Método para emitir evento de atualização do menu
  private emitMenuUpdate(): void {
    this.menuUpdateSubject.next();
  }
}
