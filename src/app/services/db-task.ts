import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Asignatura {
  id: number;
  nombre: string;
  profesor?: string;
  color?: string;
}

export interface Recordatorio {
  id: number;
  fecha: string;
  materia: string;
  descripcion: string;
  asignaturaId?: number;
  lugar?: string;
}

const ASIGNATURAS_KEY = 'asignaturas';
const RECORDATORIOS_KEY = 'recordatorios';

@Injectable({
  providedIn: 'root',
})
export class DbTaskService {
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

  // --------- ASIGNATURAS ---------

  async getAsignaturas(): Promise<Asignatura[]> {
    await this.ensureReady();
    return (await this.storage.get(ASIGNATURAS_KEY)) || [];
  }

  async setAsignaturasDesdeApi(list: Asignatura[]): Promise<void> {
    await this.ensureReady();
    await this.storage.set(ASIGNATURAS_KEY, list);
  }

  async addAsignatura(data: Omit<Asignatura, 'id'>): Promise<Asignatura> {
    const list = await this.getAsignaturas();
    const newId = list.length ? Math.max(...list.map(a => a.id)) + 1 : 1;

    const newItem: Asignatura = {
      id: newId,
      ...data,
    };

    list.push(newItem);
    await this.setAsignaturasDesdeApi(list);
    return newItem;
  }

  async deleteAsignatura(id: number): Promise<void> {
    const list = await this.getAsignaturas();
    const filtered = list.filter(a => a.id !== id);
    await this.setAsignaturasDesdeApi(filtered);
  }

  // --------- RECORDATORIOS ---------

  async getRecordatorios(): Promise<Recordatorio[]> {
    await this.ensureReady();
    return (await this.storage.get(RECORDATORIOS_KEY)) || [];
  }

  async setRecordatoriosDesdeApi(list: Recordatorio[]): Promise<void> {
    await this.ensureReady();
    await this.storage.set(RECORDATORIOS_KEY, list);
  }

  async addRecordatorio(data: Omit<Recordatorio, 'id'>): Promise<Recordatorio> {
    const list = await this.getRecordatorios();
    const newId = list.length ? Math.max(...list.map(r => r.id)) + 1 : 1;

    const newItem: Recordatorio = {
      id: newId,
      ...data,
    };

    list.push(newItem);
    await this.setRecordatoriosDesdeApi(list);
    return newItem;
  }

  async deleteRecordatorio(id: number): Promise<void> {
    const list = await this.getRecordatorios();
    const filtered = list.filter(r => r.id !== id);
    await this.setRecordatoriosDesdeApi(filtered);
  }
}
