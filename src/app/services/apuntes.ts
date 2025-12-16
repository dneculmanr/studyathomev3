import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export type TipoApunte = 'texto' | 'foto';

export interface Apunte {
  id: number;
  tipo: TipoApunte;
  titulo: string;
  contenidoTexto?: string;      // para apuntes de texto
  fotoDataUrl?: string;         // para apuntes de foto (base64/DataURL)
  fecha: string;                // por ejemplo new Date().toISOString()
  asignaturaId?: number;
  asignaturaNombre?: string;
}

const APUNTES_KEY = 'apuntes';

@Injectable({
  providedIn: 'root',
})
export class ApuntesService {
  private _ready = false;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this._ready = true;
  }

  private async ensureReady() {
    if (!this._ready) {
      await this.init();
    }
  }

  async getApuntes(): Promise<Apunte[]> {
    await this.ensureReady();
    return (await this.storage.get(APUNTES_KEY)) || [];
  }

  private async setApuntes(list: Apunte[]): Promise<void> {
    await this.ensureReady();
    await this.storage.set(APUNTES_KEY, list);
  }

  async addApunte(data: Omit<Apunte, 'id'>): Promise<Apunte> {
    const list = await this.getApuntes();
    const newId = list.length ? Math.max(...list.map(a => a.id)) + 1 : 1;

    const nuevo: Apunte = {
      id: newId,
      ...data,
    };

    list.push(nuevo);
    await this.setApuntes(list);
    return nuevo;
  }

  async deleteApunte(id: number): Promise<void> {
    const list = await this.getApuntes();
    const filtrados = list.filter(a => a.id !== id);
    await this.setApuntes(filtrados);
  }
}
