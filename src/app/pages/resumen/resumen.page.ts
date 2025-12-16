import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { Router } from '@angular/router';

import { DbTaskService, Asignatura, Recordatorio } from '../../services/db-task';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, IonicModule, LottieComponent],
  providers: [
    provideLottieOptions({ player: () => player })
  ],
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage {
  usuario: string = 'Invitado';
  password: string = '****';

  recordatorios: any[] = [];
  asignaturas: string[] = [];

  constructor(
    private router: Router,
    private dbTaskService: DbTaskService,
    private authService: AuthService
  ) {}

  animacion = { 
    path: 'assets/lottie/study.json', 
    loop: true, 
    autoplay: true 
  };

  async ngOnInit() {
    await this.cargarUsuarioDesdeAuth();
    await this.cargarDatosDesdeDB();
  }

  async ionViewWillEnter() {
    await this.cargarUsuarioDesdeAuth();
    await this.cargarDatosDesdeDB();
  }

  private async cargarUsuarioDesdeAuth() {
    const username = await this.authService.getUsername();
    const password = await this.authService.getPassword();

    this.usuario = username || 'Invitado';
    // por seguridad visual, puedes mostrar **** si no quieres mostrar la real
    this.password = password || '****';
  }

  private async cargarDatosDesdeDB() {
    const asignaturasDB: Asignatura[] = await this.dbTaskService.getAsignaturas();
    this.asignaturas = asignaturasDB.map(a => a.nombre);

    const recordatoriosDB: Recordatorio[] = await this.dbTaskService.getRecordatorios();
    this.recordatorios = recordatoriosDB;
  }

  volverMenu() {
    this.router.navigate(['/menu']); 
  }
}
