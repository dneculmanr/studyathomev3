import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

// Servicios
import { DbTaskService, Recordatorio } from '../../services/db-task';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-calendario',
  standalone: true,
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    LottieComponent
  ],
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
  ]
})
export class CalendarioPage {

  fechaSeleccionada: any = null;
  materia: string = '';
  descripcion: string = '';

  recordatorios: Recordatorio[] = [];

  cargando = false;
  errorApi: string | null = null;

  constructor(
    private router: Router,
    private dbTaskService: DbTaskService,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    await this.cargarRecordatorios();
  }

  // ---------- CARGAR RECORDATORIOS (API + fallback local) ----------

  private async cargarRecordatorios() {
    this.cargando = true;
    this.errorApi = null;

    this.apiService.getRecordatorios$().subscribe({
      next: async (listaRemota) => {
        // Guardamos también en Storage para modo sin conexión
        await this.dbTaskService.setRecordatoriosDesdeApi(listaRemota);
        this.recordatorios = listaRemota;
        this.cargando = false;
      },
      error: async () => {
        // No hay API → usamos lo que esté guardado localmente
        this.errorApi = 'No se pudo conectar con el servidor. Mostrando datos guardados en el dispositivo.';
        this.recordatorios = await this.dbTaskService.getRecordatorios();
        this.cargando = false;
      },
    });
  }

  // ---------- GUARDAR RECORDATORIO ----------

  async guardarRecordatorio() {
    if (!this.fechaSeleccionada || !this.materia.trim() || !this.descripcion.trim()) {
      alert('⚠️ Completa todos los campos.');
      return;
    }

    const fechaFormateada = new Date(this.fechaSeleccionada).toLocaleDateString();

    const dataSinId = {
      fecha: fechaFormateada,
      materia: this.materia.trim(),
      descripcion: this.descripcion.trim(),
    };

    this.apiService.addRecordatorio$(dataSinId).subscribe({
      next: async (recCreado) => {
        // Guardamos también en la "DB" local
        await this.dbTaskService.addRecordatorio({
          fecha: recCreado.fecha,
          materia: recCreado.materia,
          descripcion: recCreado.descripcion,
        });

        await this.cargarRecordatorios();
        this.limpiarFormulario();
      },
      error: async () => {
        // Si la API falla, al menos lo guardamos localmente (modo offline)
        await this.dbTaskService.addRecordatorio(dataSinId);
        await this.cargarRecorditoriosDesdeLocal();
        this.limpiarFormulario();
      },
    });
  }

  private limpiarFormulario() {
    this.materia = '';
    this.descripcion = '';
    this.fechaSeleccionada = null;
  }

  private async cargarRecorditoriosDesdeLocal() {
    this.recordatorios = await this.dbTaskService.getRecordatorios();
  }

  // ---------- ELIMINAR RECORDATORIO ----------

  async eliminarRecordatorio(i: number) {
    if (i < 0 || i >= this.recordatorios.length) return;

    const rec = this.recordatorios[i];

    this.apiService.deleteRecordatorio$(rec.id).subscribe({
      next: async () => {
        await this.dbTaskService.deleteRecordatorio(rec.id);
        await this.cargarRecordatorios();
      },
      error: async () => {
        // Si la API no responde, al menos borramos local para mantener coherencia visual
        await this.dbTaskService.deleteRecordatorio(rec.id);
        await this.cargarRecorditoriosDesdeLocal();
      },
    });
  }

  // ---------- NAVEGACIÓN ----------

  irAResumen() {
    this.router.navigate(['/resumen']);
  }

  volverMenu() {
    this.router.navigate(['/menu']);
  }

  animacion = {
    path: 'assets/lottie/calendar.json',
    loop: true,
    autoplay: true
  };
}
