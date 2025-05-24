import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Technique } from '../models/technique.';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TechniqueService {

  private apiUrl = 'http://localhost:8080/api/techniques'; 

  constructor(private http: HttpClient) {}
  addTechnique(technique: Technique): Observable<Technique> {
    return this.http.post<Technique>(this.apiUrl, technique);
  }

  getTechniques(): Observable<Technique[]> {
    return this.http.get<Technique[]>(this.apiUrl);
  }

  getTechniqueById(id: number): Observable<Technique> {
    return this.http.get<Technique>(`${this.apiUrl}/${id}`);
  }

  updateTechnique(id: number, technique: Technique): Observable<Technique> {
    return this.http.put<Technique>(`${this.apiUrl}/${id}`, technique);
  }

  deleteTechnique(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
