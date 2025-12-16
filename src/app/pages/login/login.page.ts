import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

// 👇 IMPORTAMOS AUTHSERVICE
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, LottieComponent],
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class LoginPage {
  usuario: string = "";
  password: string = "";

  animacion = {
    path: 'assets/lottie/login.json',
    loop: true,
    autoplay: true
  };

  constructor(
    private router: Router,
    private authService: AuthService // 👈 INYECTAMOS AUTHSERVICE
  ) {}

  async ingresar() {

    // ⚠️ Validación
    if (this.usuario.trim() === "" || this.password.trim() === "") {
      alert("⚠️ Debes ingresar un usuario y una contraseña.");
      return;
    }

    // 🔐 Guardamos sesión usando AuthService (Storage)
    await this.authService.login(this.usuario, this.password);

    // 👉 Navegamos al menú
    this.router.navigate(['/menu']);
  }
}
