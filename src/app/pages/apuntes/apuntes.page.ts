import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

import { DbTaskService, Asignatura } from '../../services/db-task';
import { ApuntesService, Apunte, TipoApunte } from '../../services/apuntes';

// Cámara de Capacitor
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-apuntes',
  standalone: true,
  templateUrl: './apuntes.page.html',
  styleUrls: ['./apuntes.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, LottieComponent],
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class ApuntesPage {

  // Para el formulario de texto
  tituloTexto: string = '';
  contenidoTexto: string = '';
  
  // Para asociar a una asignatura
  asignaturas: Asignatura[] = [];
  asignaturaSeleccionadaId: number | null = null;

  // Lista de apuntes guardados
  apuntes: Apunte[] = [];

  cargando = false;
  errorCamara: string | null = null;

  animacionApuntes = {
    path: 'assets/lottie/books.json', 
    loop: true,
    autoplay: true
  };

  constructor(
    private router: Router,
    private dbTaskService: DbTaskService,
    private apuntesService: ApuntesService
  ) {}

  async ngOnInit() {
    await this.cargarAsignaturas();
    await this.cargarApuntes();
  }

  private async cargarAsignaturas() {
    this.asignaturas = await this.dbTaskService.getAsignaturas();
  }

  private async cargarApuntes() {
    this.apuntes = await this.apuntesService.getApuntes();
  }

  // ---------- APUNTE DE TEXTO ----------

  async guardarApunteTexto() {
    if (!this.tituloTexto.trim() || !this.contenidoTexto.trim()) {
      alert('⚠️ Ingresa un título y contenido para el apunte de texto.');
      return;
    }

    const asignatura = this.asignaturas.find(a => a.id === this.asignaturaSeleccionadaId);

    const nuevo: Omit<Apunte, 'id'> = {
      tipo: 'texto',
      titulo: this.tituloTexto.trim(),
      contenidoTexto: this.contenidoTexto.trim(),
      fecha: new Date().toISOString(),
      asignaturaId: asignatura?.id,
      asignaturaNombre: asignatura?.nombre,
      fotoDataUrl: undefined,
    };

    await this.apuntesService.addApunte(nuevo);
    await this.cargarApuntes();
    this.limpiarFormularioTexto();
  }

  private limpiarFormularioTexto() {
    this.tituloTexto = '';
    this.contenidoTexto = '';
    // dejamos la asignatura seleccionada para que el estudiante no tenga que elegirla de nuevo
  }

  // ---------- APUNTE CON FOTO (CÁMARA) ----------

  async tomarFotoApunte() {
    this.errorCamara = null;

    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!photo || !photo.dataUrl) {
        this.errorCamara = 'No se obtuvo la imagen de la cámara.';
        return;
      }

      // Puedes pedir un título rápido, o usar uno por defecto
      const titulo = this.tituloTexto.trim() || 'Apunte fotográfico';

      const asignatura = this.asignaturas.find(a => a.id === this.asignaturaSeleccionadaId);

      const nuevo: Omit<Apunte, 'id'> = {
        tipo: 'foto' as TipoApunte,
        titulo,
        contenidoTexto: undefined,
        fotoDataUrl: photo.dataUrl,
        fecha: new Date().toISOString(),
        asignaturaId: asignatura?.id,
        asignaturaNombre: asignatura?.nombre,
      };

      await this.apuntesService.addApunte(nuevo);
      await this.cargarApuntes();

      // Si quieres limpiar título después de foto:
      this.tituloTexto = '';

    } catch (err) {
      console.error(err);
      this.errorCamara = 'Ocurrió un problema al acceder a la cámara.';
    }
  }

  // ---------- ELIMINAR APUNTE ----------

  async eliminarApunte(apunte: Apunte) {
    await this.apuntesService.deleteApunte(apunte.id);
    await this.cargarApuntes();
  }

  // ---------- NAVEGACIÓN ----------

  volverMenu() {
    this.router.navigate(['/menu']);
  }

}
