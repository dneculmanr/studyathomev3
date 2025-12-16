import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { Router } from '@angular/router';

import { DbTaskService, Asignatura } from '../../services/db-task';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-asignaturas',
  standalone: true,
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, LottieComponent],
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class AsignaturasPage {

  nuevaAsignatura: string = '';
  asignaturas: string[] = [];
  cargando = false;
  errorApi: string | null = null;

  constructor(
    private router: Router,
    private dbTaskService: DbTaskService,
    private apiService: ApiService
  ) {}

  animacionAsignaturas = {
    path: 'assets/lottie/books.json', 
    loop: true,
    autoplay: true
  };

  async ngOnInit() {
    await this.cargarAsignaturas();
  }

  async cargarAsignaturas() {
    this.cargando = true;
    this.errorApi = null;

    this.apiService.getAsignaturas$().subscribe({
      next: async (listaRemota) => {
        const asignaturasFormateadas: Asignatura[] = listaRemota.map(a => ({
          id: a.id,
          nombre: a.nombre,
        }));

        // guardamos en Storage (DB local)
        await this.dbTaskService.setAsignaturasDesdeApi(asignaturasFormateadas);

        // y actualizamos la vista
        this.asignaturas = asignaturasFormateadas.map(a => a.nombre);
        this.cargando = false;
      },
      error: async () => {
        // modo sin red -> usamos lo que haya en Storage
        this.errorApi = 'No se pudo conectar con el servidor. Mostrando datos guardados en el dispositivo.';
        const listaLocal = await this.dbTaskService.getAsignaturas();
        this.asignaturas = listaLocal.map(a => a.nombre);
        this.cargando = false;
      }
    });
  }

  async agregarAsignatura() {
    const nombre = this.nuevaAsignatura.trim();
    if (!nombre) return;

    this.apiService.addAsignatura$(nombre).subscribe({
      next: async (asigCreada) => {
        await this.dbTaskService.addAsignatura({ nombre: asigCreada.nombre });
        await this.cargarAsignaturas();
        this.nuevaAsignatura = '';
      },
      error: async () => {
        // Si la API falla, al menos guardamos local
        await this.dbTaskService.addAsignatura({ nombre });
        await this.cargarAsignaturas();
        this.nuevaAsignatura = '';
      }
    });
  }

  async eliminarAsignatura(i: number) {
    const listaActual = await this.dbTaskService.getAsignaturas();
    if (i < 0 || i >= listaActual.length) return;

    const asig = listaActual[i];

    this.apiService.deleteAsignatura$(asig.id).subscribe({
      next: async () => {
        await this.dbTaskService.deleteAsignatura(asig.id);
        await this.cargarAsignaturas();
      },
      error: async () => {
        await this.dbTaskService.deleteAsignatura(asig.id);
        await this.cargarAsignaturas();
      }
    });
  }

  volverMenu() {
    this.router.navigate(['/menu']); 
  }

}
