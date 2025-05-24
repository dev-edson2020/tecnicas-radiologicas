import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/categories'; // Altere se sua URL for diferente

  constructor(private http: HttpClient) {}

  // Buscar todas as categorias
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Buscar uma categoria por ID
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Criar várias categorias
  createBatch(categories: Category[]): Observable<Category[]> {
    return this.http.post<Category[]>(`${this.apiUrl}/batch`, categories);
  }

  // Atualizar uma categoria por ID
  update(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  // Excluir uma categoria por ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
