import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asignatura, Recordatorio } from './db-task';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  // --------- ASIGNATURAS ---------

  getAsignaturas$(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.baseUrl}/asignaturas`);
  }

  addAsignatura$(nombre: string): Observable<Asignatura> {
    return this.http.post<Asignatura>(`${this.baseUrl}/asignaturas`, { nombre });
  }

  deleteAsignatura$(id: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/asignaturas/${id}`);
  }

  // --------- RECORDATORIOS ---------

  getRecordatorios$(): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.baseUrl}/recordatorios`);
  }

  addRecordatorio$(data: Omit<Recordatorio, 'id'>): Observable<Recordatorio> {
    const { fecha, materia, descripcion } = data;
    return this.http.post<Recordatorio>(`${this.baseUrl}/recordatorios`, {
      fecha,
      materia,
      descripcion,
    });
  }

  deleteRecordatorio$(id: number): Observable<{ detail: string }> {
    return this.http.delete<{ detail: string }>(`${this.baseUrl}/recordatorios/${id}`);
  }
}
