import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  imports: [CommonModule, IonicModule, LottieComponent],
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
  ]
})
export class MenuPage {

  usuario: string = 'Invitado';

  animacionMenu = {
    path: 'assets/lottie/menu.json',
    loop: true,
    autoplay: true
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Se ejecuta cada vez que la vista va a mostrarse
  async ionViewWillEnter() {
    const username = await this.authService.getUsername();
    this.usuario = username || 'Invitado';
  }

  irCalendario() {
    this.router.navigate(['/calendario']);
  }

  irResumen() {
    this.router.navigate(['/resumen']);
  }

  irAsignaturas() {
    this.router.navigate(['/asignaturas']);
  }

  irApuntes() {
  this.router.navigate(['/apuntes']);
}

  async cerrarSesion() {
    // Limpia la sesión en Storage
    await this.authService.logout();

    // Navega al login y reemplaza la URL para que no pueda volver con "atrás"
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
