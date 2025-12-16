import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class NotFoundPage {
  constructor(private router: Router) {}

  volverAlInicio() {
    this.router.navigate(['/login']);
  }
}
