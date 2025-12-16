import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const SESSION_KEY = 'session_active';
const USERNAME_KEY = 'session_username';
const PASSWORD_KEY = 'session_password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storageReady = false;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this._storageReady = true;
  }

  private async ensureReady() {
    if (!this._storageReady) {
      await this.init();
    }
  }

  // login ahora guarda usuario y password
  async login(username: string, password: string): Promise<void> {
    await this.ensureReady();
    await this.storage.set(SESSION_KEY, true);
    await this.storage.set(USERNAME_KEY, username);
    await this.storage.set(PASSWORD_KEY, password);
  }

  async logout(): Promise<void> {
    await this.ensureReady();
    await this.storage.set(SESSION_KEY, false);
    await this.storage.remove(USERNAME_KEY);
    await this.storage.remove(PASSWORD_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    await this.ensureReady();
    const active = await this.storage.get(SESSION_KEY);
    return !!active;
  }

  async getUsername(): Promise<string | null> {
    await this.ensureReady();
    return this.storage.get(USERNAME_KEY);
  }

  async getPassword(): Promise<string | null> {
    await this.ensureReady();
    return this.storage.get(PASSWORD_KEY);
  }

  // opcional: método que devuelve todo junto
  async getUserData(): Promise<{ username: string | null; password: string | null }> {
    await this.ensureReady();
    const username = await this.storage.get(USERNAME_KEY);
    const password = await this.storage.get(PASSWORD_KEY);
    return { username, password };
  }
}
